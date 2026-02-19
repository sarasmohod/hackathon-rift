import time


def generate_json_report(G, fraud_rings, scores, patterns):
    start = time.time()

    suspicious_accounts = []
    fraud_ring_output = []

    for ring in fraud_rings:
        ring_members = ring["members"]
        ring_scores = [scores[m] for m in ring_members if m in scores]

        risk_score = sum(ring_scores) / len(ring_scores) if ring_scores else 0

        fraud_ring_output.append({
            "ring_id": ring["ring_id"],
            "pattern_type": ring["pattern_type"],
            "risk_score": round(risk_score, 2),
            "member_accounts": ring_members
        })

        for acc in ring_members:
            suspicious_accounts.append({
                "account_id": acc,
                "suspicion_score": scores.get(acc, 0),
                "detected_patterns": patterns.get(acc, []),
                "ring_id": ring["ring_id"]
            })

    suspicious_accounts = sorted(
        suspicious_accounts,
        key=lambda x: x["suspicion_score"],
        reverse=True
    )

    end = time.time()

    summary = {
        "total_accounts_analyzed": len(G.nodes()),
        "suspicious_accounts_flagged": len(suspicious_accounts),
        "fraud_rings_detected": len(fraud_ring_output),
        "processing_time_seconds": round(end - start, 2)
    }

    return {
        "suspicious_accounts": suspicious_accounts,
        "fraud_rings": fraud_ring_output,
        "summary": summary
    }
