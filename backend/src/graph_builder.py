import networkx as nx
import pandas as pd
from typing import Tuple

def build_graph(df: pd.DataFrame) -> Tuple[nx.DiGraph, nx.Graph]:
    """
    Constructs a directed graph for flow analysis and an undirected graph for community detection.
    
    Args:
        df: DataFrame containing transaction data.
        
    Returns:
        G: Directed MultiDiGraph (captures multiple transactions between same pair).
        G_undirected: Undirected Graph (aggregated weights).
    """
    G = nx.MultiDiGraph()
    
    # Batch add edges for performance
    for _, row in df.iterrows():
        G.add_edge(
            str(row['sender_id']), 
            str(row['receiver_id']), 
            amount=float(row['amount']),
            timestamp=pd.to_datetime(row['timestamp'])
        )
        
    # Create undirected version for Louvain algorithm
    # We aggregate amounts as weight
    G_undirected = nx.Graph()
    for u, v, data in G.edges(data=True):
        if G_undirected.has_edge(u, v):
            G_undirected[u][v]['weight'] += data['amount']
        else:
            G_undirected.add_edge(u, v, weight=data['amount'])
            
    return G, G_undirected