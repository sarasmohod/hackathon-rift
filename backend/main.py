from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import time
from io import StringIO

# Import your existing flawless logic
from src.graph_builder import build_graph
from src.patterns import detect_cycles, detect_smurfing, detect_shell_networks
from src.rings import RingBuilder

app = FastAPI(title="RIFT Forensics API")

# Allow Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze_transactions(
    file: UploadFile = File(...),
    whitelist: str = Form("")  
):
    start_time = time.time()
    
    # Parse the whitelist string into a Python Set
    if whitelist.strip():
        whitelist_set = {x.strip() for x in whitelist.split(',')}
    else:
        whitelist_set = set()
    
    # 1. Read the uploaded CSV into Pandas
    contents = await file.read()
    csv_string = contents.decode("utf-8")
    df = pd.read_csv(StringIO(csv_string))
    
    # 2. Build Graph
    G, _ = build_graph(df)
    
    # 3. Run Algorithms (PASSING THE WHITELIST SET HERE)
    cycles = detect_cycles(G, whitelist=whitelist_set)
    fan_ins, fan_outs = detect_smurfing(df, whitelist=whitelist_set)
    shells = detect_shell_networks(G, whitelist=whitelist_set)
    
    # 4. Build Rings and JSON
    builder = RingBuilder()
    
    # 🔥 YAHAN THI GALTI! Maine aakhri mein 'df' pass kar diya hai ab.
    builder.process_patterns(cycles, fan_ins, fan_outs, shells, df)
    
    processing_time = time.time() - start_time
    json_payload = builder.generate_json_payload(len(G.nodes()), processing_time)
    
    # 5. Send raw graph data to React for visualization
    graph_data = {
        "nodes": [{"id": str(n)} for n in G.nodes()],
        "links": [{"source": str(u), "target": str(v)} for u, v in G.edges()]
    }
    
    return {
        "analysis": json_payload,
        "topology": graph_data
    }