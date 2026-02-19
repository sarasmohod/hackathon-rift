from typing import Dict, List, Any

class RiskScorer:
    def __init__(self):
        self.weights = {
            'cycle': 40,
            'fan_in': 25,
            'fan_out': 25,
            'high_velocity': 15,
            'amount_anomaly': 20,
            'shell_chain': 20
        }

    def calculate_scores(self, 
                         nodes: list, 
                         cycles: List[List[str]], 
                         smurfs: Dict[str, str], 
                         velocity_flags: set,
                         amount_flags: set,
                         chains: List[List[str]]) -> Dict[str, Dict[str, Any]]:
        
        scores = {}
        
        # Initialize
        for node in nodes:
            scores[node] = {'score': 0, 'reasons': [], 'risk_level': 'Low'}

        # 1. Cycle Scoring
        for cycle in cycles:
            for node in cycle:
                scores[node]['score'] += self.weights['cycle']
                if "Part of a transaction cycle" not in scores[node]['reasons']:
                    scores[node]['reasons'].append(f"Part of {len(cycle)}-hop cycle")

        # 2. Smurfing Scoring
        for node, s_type in smurfs.items():
            weight = self.weights['fan_in'] if 'Collector' in s_type else self.weights['fan_out']
            scores[node]['score'] += weight
            scores[node]['reasons'].append(s_type)

        # 3. Velocity Scoring
        for node in velocity_flags:
            scores[node]['score'] += self.weights['high_velocity']
            scores[node]['reasons'].append("High Transaction Velocity (>72h)")

        # 4. Anomaly Scoring
        for node in amount_flags:
            scores[node]['score'] += self.weights['amount_anomaly']
            scores[node]['reasons'].append("Statistical Outlier (High Amount)")
            
        # 5. Shell/Chain Scoring
        for chain in chains:
            for node in chain:
                # Don't double count if already flagged in cycle
                if "Part of shell chain" not in scores[node]['reasons']:
                     scores[node]['score'] += self.weights['shell_chain']
                     scores[node]['reasons'].append("Intermediary in Shell Chain")

        # Normalize and Assign Level
        for node in scores:
            # Cap at 100
            scores[node]['score'] = min(100, scores[node]['score'])
            
            s = scores[node]['score']
            if s >= 75:
                scores[node]['risk_level'] = 'Critical'
            elif s >= 50:
                scores[node]['risk_level'] = 'High'
            elif s >= 25:
                scores[node]['risk_level'] = 'Medium'
                
        return scores