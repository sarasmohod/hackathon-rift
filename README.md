# 👁️‍🗨️ T.R.A.C.E. : Topology Resolution & Anomaly Computation Engine
Live Web Application: https://hackathonrift-1.onrender.com/ 
LinkedIn Architecture Demo: https://www.linkedin.com/posts/saras-mohod-a81699242_rift26-rifthackathon-moneymulingdetection-activity-7430407698476736512-dnKw?utm_source=share&utm_medium=member_desktop&rcm=ACoAADxCA8EBEkAD_Q86An71kZ9TTPh7KCru1MA

## 📖 Mission Overview
Money muling networks employ complex, multi-layered structuring to obscure the flow of illicit funds. Traditional relational databases (SQL queries) fundamentally fail to map these deep relationships. **T.R.A.C.E.** solves this by transforming standard tabular transaction ledgers into highly optimized **Directed Multi-Graphs**, utilizing advanced physics-based rendering and mathematical topology to hunt down financial crime in real-time.

## ⚙️ Core Architecture
T.R.A.C.E. operates on a decoupled microservice architecture:
* **Backend (FastAPI + Python):** The heavy-lifting engine. Utilizes `NetworkX` for graph mapping and `Pandas` for massive temporal window aggregations.
* **Frontend (Next.js + Tailwind CSS):** An SSR-bypassed, hardware-accelerated dashboard powered by `react-force-graph-2d` (HTML5 Canvas physics engine) and `recharts` for visual data telemetry.

---

## 🧠 Threat Vector Typologies & Big-O Complexity

### 1. Circular Fund Routing (Cycles)
Detects funds looping through nodes (A $\rightarrow$ B $\rightarrow$ C $\rightarrow$ A) with zero true economic value.
* **Algorithm:** Constrained Depth-First Search (DFS) utilizing Johnson’s Algorithm.
* **Constraints:** Strictly bounded to cycle lengths of 3 to 5.
* **Complexity:** Space $O(V+E)$, Time $O((V+E)(C+1))$. The depth limit completely mitigates exponential blowup on dense graphs.

### 2. Smurfing / Structuring (Fan-In & Fan-Out)
Detects micro-structuring designed to evade \$10,000 reporting thresholds.
* **Algorithm:** Temporal Rolling Window Degree Centrality.
* **Constraints:** Flagged only if $N \ge 10$ unique counterparties transact with a single node strictly within a 72-hour sliding window.
* **Complexity:** Time $O(T \log T)$ per account to sort timestamps, Space $O(W)$ tracking transactions dynamically inside the window.

### 3. Layered Shell Networks
Detects multi-hop chains where funds jump through "ghost" accounts.
* **Algorithm:** Constrained Depth-Limited Pathfinding.
* **Constraints:** Identifies 3+ hop chains where all intermediate routing nodes actively maintain a suspiciously low transaction profile (strictly 2–3 lifetime transactions).

## 💡 Engine Innovations (Why T.R.A.C.E. is Different)

1.  **Dynamic Suspicion Scoring (DRS):** Unlike traditional tools with static scores, T.R.A.C.E. computes risk based on **Volume** and **Velocity**. A $\$100,000$ cycle yields a higher threat score than a $\$500$ cycle, capping mathematically at 99.9.
2.  **False Positive Handling (Dynamic Whitelisting):** Massive aggregators like corporate payrolls or payment gateways (e.g., Stripe) mimic Smurfing topologies. Our engine allows analysts to inject known safe entities into the Whitelist. The graph algorithms dynamically blind themselves to these paths, completely eliminating false alarms.
3.  **Target Dossier with Telemetry:** Interacting with a compromised node spawns an interactive dossier containing a **Volume Telemetry Bar Chart** (`recharts`) comparing Total Inflow vs. Outflow, and a **Direct Connection Ledger** parsing exactly who the node interacts with in the active graph.

## 🚀 Local Deployment Instructions
**Start the Backend Engine:**
1. Navigate to `/backend`.
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload` (Runs on port 8000)

**Start the Frontend Interface:**
1. Navigate to `/frontend`.
2. `npm install`
3. `npm run dev` (Runs on port 3000)

Team Membes
Saras Mohod
Vedant Kakde
Yash Pise
