import networkx as nx
import pandas as pd
from typing import List, Dict, Tuple, Set

def detect_cycles(G: nx.DiGraph, whitelist: Set[str] = None) -> List[List[str]]:
    """Detects cycles strictly of length 3 to 5, ignoring whitelisted nodes."""
    if whitelist is None: whitelist = set()
    cycles = list(nx.simple_cycles(G))
    # A cycle is invalid if ANY node in it is a known, whitelisted entity
    return [c for c in cycles if 3 <= len(c) <= 5 and not any(node in whitelist for node in c)]

def detect_smurfing(df: pd.DataFrame, whitelist: Set[str] = None) -> Tuple[List[Dict], List[Dict]]:
    """Detects Fan-in and Fan-out smurfing strictly within a 72-hour window."""
    if whitelist is None: whitelist = set()
    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    fan_in_rings = []
    fan_out_rings = []
    
    # Fan-in
    for receiver, group in df.groupby('receiver_id'):
        if receiver in whitelist: continue # 🛡️ Ignore known aggregator
        group = group.sort_values('timestamp').set_index('timestamp')
        
        is_smurf = False
        for end_time in group.index:
            start_time = end_time - pd.Timedelta(hours=72)
            window = group.loc[start_time:end_time]
            if window['sender_id'].nunique() >= 10:
                is_smurf = True
                break
        
        if is_smurf:
            members = list(set(group['sender_id'].unique())) + [receiver]
            fan_in_rings.append({'center': receiver, 'members': members, 'type': 'smurfing_fan_in'})
            
    # Fan-out
    for sender, group in df.groupby('sender_id'):
        if sender in whitelist: continue # 🛡️ Ignore known distributor
        group = group.sort_values('timestamp').set_index('timestamp')
        
        is_smurf = False
        for end_time in group.index:
            start_time = end_time - pd.Timedelta(hours=72)
            window = group.loc[start_time:end_time]
            if window['receiver_id'].nunique() >= 10:
                is_smurf = True
                break
                
        if is_smurf:
            members = [sender] + list(set(group['receiver_id'].unique()))
            fan_out_rings.append({'center': sender, 'members': members, 'type': 'smurfing_fan_out'})
            
    return fan_in_rings, fan_out_rings

def detect_shell_networks(G: nx.DiGraph, whitelist: Set[str] = None) -> List[List[str]]:
    """Detects layered shell networks, ensuring intermediaries aren't whitelisted."""
    if whitelist is None: whitelist = set()
    shells = []
    low_tx_nodes = {n for n in G.nodes() if 2 <= G.degree(n) <= 3}
    
    for source in G.nodes():
        if source in low_tx_nodes or source in whitelist: continue 
        
        for target in G.nodes():
            if source == target or target in whitelist: continue
            
            try:
                paths = nx.all_simple_paths(G, source=source, target=target, cutoff=5)
                for path in paths:
                    if len(path) >= 4:
                        intermediates = path[1:-1]
                        # Intermediaries must be low-tx AND not whitelisted
                        if all(node in low_tx_nodes and node not in whitelist for node in intermediates):
                            shells.append(path)
            except nx.NetworkXNoPath:
                continue
                
    return shells