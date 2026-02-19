from pyvis.network import Network
import networkx as nx

def get_color(score):
    if score >= 75: return "#FF0000" # Red
    if score >= 50: return "#FFA500" # Orange
    if score >= 25: return "#FFFF00" # Yellow
    return "#97C2FC" # Blue (Safe)

def create_pyvis_graph(G: nx.DiGraph, scores: dict, communities: dict, physics: bool = True):
    # Changed bgcolor to #0E1117 to seamlessly blend with Streamlit
    nt = Network(height="650px", width="100%", bgcolor="#0E1117", font_color="white", directed=True)
    
    # Add nodes with visual attributes based on risk
    for node in G.nodes():
        node_id = str(node)
        score_data = scores.get(node_id, {'score': 0, 'reasons': [], 'risk_level': 'Low'})
        
        # XAI Hover Text
        title_html = (
            f"Account: {node_id}\n"
            f"Risk Score: {score_data['score']}\n"
            f"Community: {communities.get(node_id, 'Unknown')}\n"
            f"Flags: {', '.join(score_data['reasons'])}"
        )
        
        nt.add_node(
            node_id, 
            label=node_id, 
            title=title_html,
            color=get_color(score_data['score']),
            value=score_data['score'] + 10, # Size node by risk
            group=communities.get(node_id, 0)
        )

    # Add edges
    for u, v, data in G.edges(data=True):
        nt.add_edge(str(u), str(v), title=f"Amount: ${data.get('amount', 0)}")

    # Physics Options for stability
    nt.set_options("""
    var options = {
      "physics": {
        "forceAtlas2Based": {
          "gravitationalConstant": -50,
          "centralGravity": 0.01,
          "springLength": 100,
          "springConstant": 0.08
        },
        "maxVelocity": 50,
        "solver": "forceAtlas2Based",
        "timestep": 0.35,
        "stabilization": {"iterations": 150}
      }
    }
    """)
    
    return nt