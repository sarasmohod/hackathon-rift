import pandas as pd

class RingBuilder:
    def __init__(self):
        self.ring_counter = 1
        self.fraud_rings = []
        self.account_flags = {} # {account_id: {'score': float, 'patterns': set(), 'ring_id': str}}

    def _get_next_ring_id(self):
        r_id = f"RING_{self.ring_counter:03d}"
        self.ring_counter += 1
        return r_id

    def _init_account(self, account_id):
        if account_id not in self.account_flags:
            self.account_flags[account_id] = {
                'score': 0.0, 
                'patterns': set(), 
                'ring_id': "NONE",
                'total_sent': 0.0,
                'total_received': 0.0,
                'tx_count': 0
            }

    def process_patterns(self, cycles, fan_ins, fan_outs, shells, df):
        # Calculate global stats for scaling scores
        avg_tx_amount = df['amount'].mean()

        # Helper to update account stats
        for _, row in df.iterrows():
            s, r, amt = str(row['sender_id']), str(row['receiver_id']), float(row['amount'])
            self._init_account(s)
            self._init_account(r)
            self.account_flags[s]['total_sent'] += amt
            self.account_flags[r]['total_received'] += amt
            self.account_flags[s]['tx_count'] += 1

        # 1. Process Cycles (Base 85 + Volume Multiplier)
        for cycle in cycles:
            ring_id = self._get_next_ring_id()
            # Dynamic Score based on transaction size
            total_cycle_val = df[df['sender_id'].isin(cycle)]['amount'].sum()
            dynamic_score = min(99.9, 85.0 + (total_cycle_val / (avg_tx_amount * 10)))
            
            self.fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": cycle,
                "pattern_type": "cycle",
                "risk_score": round(dynamic_score, 1)
            })
            for node in cycle:
                self.account_flags[node]['patterns'].add(f"cycle_len_{len(cycle)}")
                self.account_flags[node]['ring_id'] = ring_id
                self.account_flags[node]['score'] = max(self.account_flags[node]['score'], dynamic_score)

        # 2. Process Smurfing (Base 75 + Velocity Multiplier)
        for ring in (fan_ins + fan_outs):
            ring_id = self._get_next_ring_id()
            dynamic_score = 80.0 if len(ring['members']) > 12 else 75.0
            
            self.fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": ring['members'],
                "pattern_type": ring['type'],
                "risk_score": round(dynamic_score, 1)
            })
            for node in ring['members']:
                self.account_flags[node]['patterns'].add(ring['type'])
                self.account_flags[node]['ring_id'] = ring_id
                self.account_flags[node]['score'] = max(self.account_flags[node]['score'], dynamic_score)

        # 3. Process Shell Networks
        for shell in shells:
            ring_id = self._get_next_ring_id()
            dynamic_score = 82.0
            self.fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": shell,
                "pattern_type": "layered_shell",
                "risk_score": dynamic_score
            })
            for node in shell:
                self.account_flags[node]['patterns'].add("layered_shell")
                self.account_flags[node]['ring_id'] = ring_id
                self.account_flags[node]['score'] = max(self.account_flags[node]['score'], dynamic_score)

    def generate_json_payload(self, total_accounts: int, processing_time: float):
        suspicious_accounts = []
        for acc_id, data in self.account_flags.items():
            if data['score'] > 0:
                suspicious_accounts.append({
                    "account_id": acc_id,
                    "suspicion_score": round(data['score'], 1),
                    "detected_patterns": list(data['patterns']),
                    "ring_id": data['ring_id'],
                    "metadata": { # Extra data for the Frontend Side Panel
                        "total_sent": round(data['total_sent'], 2),
                        "total_received": round(data['total_received'], 2),
                        "tx_count": data['tx_count']
                    }
                })
        
        suspicious_accounts = sorted(suspicious_accounts, key=lambda x: x['suspicion_score'], reverse=True)

        return {
            "suspicious_accounts": suspicious_accounts,
            "fraud_rings": self.fraud_rings,
            "summary": {
                "total_accounts_analyzed": total_accounts,
                "suspicious_accounts_flagged": len(suspicious_accounts),
                "fraud_rings_detected": len(self.fraud_rings),
                "processing_time_seconds": round(processing_time, 2)
            }
        }