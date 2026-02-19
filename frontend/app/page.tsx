'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { UploadCloud, ShieldAlert, Activity, FileJson, AlertOctagon, Search, Cpu, Network, Terminal, Info, X, Link as LinkIcon, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Bypass SSR for the physics engine
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function UltimateCyberDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [whitelist, setWhitelist] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('graph');
  const [scanText, setScanText] = useState("SYSTEM IDLE");
  
  // Interactive States
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const getNeighbors = (nodeId: string) => {
    const neighbors = new Set<string>();
    if (!results?.topology?.links) return neighbors;
    results.topology.links.forEach((link: any) => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      if (sourceId === nodeId) neighbors.add(targetId);
      if (targetId === nodeId) neighbors.add(sourceId);
    });
    return neighbors;
  };

  const getNodeLinks = (nodeId: string) => {
    if (!results?.topology?.links) return [];
    return results.topology.links.filter((link: any) => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      return sourceId === nodeId || targetId === nodeId;
    }).map((link: any) => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      return { 
        connectedTo: sourceId === nodeId ? targetId : sourceId, 
        direction: sourceId === nodeId ? 'OUT' : 'IN' 
      };
    });
  };

  const runAnalysis = async () => {
    if (!file) return alert("Upload CSV first!");
    setLoading(true);
    setScanText("INITIALIZING NEURAL GRAPH...");
    setSelectedNode(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("whitelist", whitelist);

    try {
      setTimeout(() => setScanText("DETECTING CYCLICAL TYPOLOGIES..."), 800);
      setTimeout(() => setScanText("ANALYZING TEMPORAL SMURFING..."), 1600);
      setTimeout(() => setScanText("TRACING MULTI-HOP SHELLS..."), 2400);

      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST", body: formData,
      });
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      
      setTimeout(() => {
        setResults(data);
        setLoading(false);
        setScanText("THREAT NEUTRALIZED.");
      }, 3000);
    } catch (error) {
      alert("Backend Error! Is it running?");
      setLoading(false);
      setScanText("SYSTEM ERROR");
    }
  };

  // 🔥 YAHAN HAI NAYA DOWNLOAD FUNCTION JO EXACT FORMAT MATCH KAREGA
  const downloadJSON = () => {
    if (!results || !results.analysis) return;
    
    // Create a deep copy so we don't mess up the UI data
    const exportPayload = JSON.parse(JSON.stringify(results.analysis));
    
    // Strip out 'metadata' so it exactly matches the Hackathon JSON requirement image
    exportPayload.suspicious_accounts = exportPayload.suspicious_accounts.map((acc: any) => {
      const { metadata, ...exactRubricFormat } = acc;
      return exactRubricFormat;
    });

    // Create a Blob and force download (bypasses browser URL limits)
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mule_detection_output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShieldAlert className="w-8 h-8 text-cyan-400 relative z-10" />
              <div className="absolute inset-0 bg-cyan-400 blur-[10px] opacity-50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                T.R.A.C.E.
              </h1>
              <p className="text-[10px] text-cyan-500/70 font-mono tracking-[0.2em] uppercase">Topology Resolution & Anomaly Computation Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-500/50 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/20">
            <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CONTROLS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0f0f13] border border-cyan-500/20 rounded-2xl p-6 relative group overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> 01. Ingest Ledger
            </h2>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-500/30 rounded-xl bg-cyan-950/10 hover:bg-cyan-900/20 hover:border-cyan-400/50 cursor-pointer transition-all">
              <UploadCloud className="w-8 h-8 text-cyan-600 mb-2" />
              <span className="text-sm font-mono text-cyan-300 text-center px-2">{file ? file.name : "DROP CSV FILE HERE"}</span>
              <input type="file" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" />
            </label>
          </div>

          <div className="bg-[#0f0f13] border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> 02. Parameters
            </h2>
            <input 
               type="text" placeholder="Whitelist (e.g. CORP_PAYROLL)" value={whitelist} onChange={(e) => setWhitelist(e.target.value)}
               className="w-full bg-[#050505] border border-cyan-900 focus:border-cyan-400 rounded-lg px-4 py-3 text-sm text-cyan-100 font-mono outline-none placeholder-cyan-900/50"
             />
          </div>

          <button onClick={runAnalysis} disabled={loading || !file} className="w-full relative group overflow-hidden rounded-2xl disabled:opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-900 to-blue-900 m-[2px] rounded-2xl px-6 py-4 flex items-center justify-center gap-3 group-hover:bg-opacity-0 transition-all">
              {loading ? <Cpu className="w-5 h-5 animate-spin text-cyan-300" /> : <Terminal className="w-5 h-5 text-cyan-300" />}
              <span className="font-mono font-bold text-cyan-50 tracking-widest">{loading ? 'EXECUTING SCAN...' : 'INITIATE ENGINE'}</span>
            </div>
          </button>

          <div className="bg-[#050505] border border-cyan-900/50 rounded-xl p-4 font-mono text-[10px] text-cyan-500 h-24 flex flex-col justify-end relative">
            <span className="animate-pulse">{'>'} {scanText}</span>
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div className="lg:col-span-9 space-y-6">
          {!results && !loading && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center border border-dashed border-cyan-900/30 rounded-3xl bg-cyan-950/5">
              <Network className="w-20 h-20 text-cyan-900/50 mb-4" />
              <p className="font-mono text-cyan-700 uppercase tracking-widest">Awaiting Ledger Ingestion</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center border border-cyan-500/20 rounded-3xl bg-[#0f0f13] relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <div className="w-32 h-32 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin relative z-10"></div>
              <p className="mt-8 font-mono text-cyan-400 uppercase tracking-[0.3em] animate-pulse relative z-10">Processing Topology Mapping</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "ACCOUNTS ANALYZED", value: results.analysis.summary.total_accounts_analyzed, color: "from-blue-600 to-blue-900" },
                  { label: "CRITICAL THREATS", value: results.analysis.summary.suspicious_accounts_flagged, color: "from-red-600 to-red-900", glowing: true },
                  { label: "MULE RINGS", value: results.analysis.summary.fraud_rings_detected, color: "from-cyan-600 to-cyan-900" },
                  { label: "COMPUTE TIME", value: `${results.analysis.summary.processing_time_seconds.toFixed(2)}s`, color: "from-emerald-600 to-emerald-900" },
                ].map((kpi, i) => (
                  <div key={i} className={`relative p-[1px] rounded-2xl overflow-hidden ${kpi.glowing ? 'shadow-[0_0_20px_rgba(220,38,38,0.3)]' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-50`}></div>
                    <div className="relative bg-[#0a0a0c] h-full p-5 rounded-2xl flex flex-col justify-between">
                      <p className="text-[10px] font-mono text-cyan-500/70 mb-2">{kpi.label}</p>
                      <p className={`text-3xl font-black font-mono ${kpi.glowing ? 'text-red-400' : 'text-white'}`}>{kpi.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0f0f13] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                <div className="flex border-b border-cyan-900/50 bg-[#0a0a0c]">
                  {[
                    { id: 'graph', label: 'NETWORK TOPOLOGY', icon: Network },
                    { id: 'table', label: 'THREAT REGISTER', icon: AlertOctagon },
                    { id: 'json', label: 'PAYLOAD ARTIFACT', icon: FileJson },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest transition-all ${activeTab === tab.id ? 'bg-cyan-950/30 text-cyan-300 border-b-2 border-cyan-400' : 'text-cyan-800 hover:text-cyan-500'}`}>
                      <tab.icon className="w-4 h-4" />{tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-0 relative">
                  {/* GRAPH TAB */}
                  {activeTab === 'graph' && (
                    <div className="w-full h-[600px] relative bg-[#050505] overflow-hidden">
                       <ForceGraph2D
                          graphData={results.topology} nodeRelSize={6}
                          nodeColor={(node: any) => {
                            const isSuspicious = results.analysis.suspicious_accounts.some((acc: any) => acc.account_id === node.id);
                            if (hoverNode) {
                              const neighbors = getNeighbors(hoverNode.id);
                              if (!neighbors.has(node.id) && node.id !== hoverNode.id) return 'rgba(255,255,255,0.05)';
                            }
                            return isSuspicious ? '#ef4444' : '#06b6d4'; 
                          }}
                          linkColor={(link: any) => {
                            if (hoverNode) {
                              const s = link.source.id || link.source; const t = link.target.id || link.target;
                              if (s === hoverNode.id || t === hoverNode.id) return '#22d3ee';
                            }
                            return 'rgba(6, 182, 212, 0.15)';
                          }}
                          linkDirectionalParticles={(link: any) => {
                            if (hoverNode) {
                              const s = link.source.id || link.source; const t = link.target.id || link.target;
                              return (s === hoverNode.id || t === hoverNode.id) ? 4 : 0;
                            } return 2;
                          }}
                          linkDirectionalParticleWidth={1.5}
                          linkDirectionalParticleColor={() => '#22d3ee'}
                          onNodeHover={(node) => setHoverNode(node)}
                          onNodeClick={(node) => {
                            const details = results.analysis.suspicious_accounts.find((a: any) => a.account_id === node.id);
                            setSelectedNode(details || { account_id: node.id, suspicion_score: 0, status: 'CLEAN', metadata: { total_sent: 0, total_received: 0, tx_count: 0 } });
                          }}
                          nodeCanvasObjectMode={() => 'after'}
                          nodeCanvasObject={(node: any, ctx, globalScale) => {
                            if (globalScale >= 2.5) {
                              ctx.font = `${12 / globalScale}px monospace`;
                              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                              ctx.fillText(node.id, node.x, node.y + 8);
                            }
                          }}
                          backgroundColor="transparent" width={1000} height={600}
                       />
                       
                       {/* TARGET DOSSIER (WITH CHARTS & LEDGER) */}
                       <div className={`absolute top-0 right-0 h-full w-[380px] bg-[#0a0a0c]/95 border-l border-cyan-500/30 backdrop-blur-xl transform transition-transform duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-full'} z-20 shadow-[-20px_0_30px_rgba(0,0,0,0.5)] flex flex-col`}>
                         {selectedNode && (
                           <div className="p-6 overflow-y-auto space-y-6 pb-20">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                 <h2 className="font-bold text-cyan-400 flex items-center gap-2 text-xs uppercase tracking-widest"><Info className="w-4 h-4"/> Target Dossier</h2>
                                 <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                              </div>

                              <div>
                                 <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Entity ID</label>
                                 <div className="text-lg font-mono font-bold text-white break-all">{selectedNode.account_id}</div>
                              </div>

                              <div className="p-4 bg-[#050505] rounded-lg border border-slate-800 relative overflow-hidden group">
                                 <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${selectedNode.suspicion_score > 0 ? 'from-red-500 to-orange-500' : 'from-emerald-500 to-cyan-500'}`}></div>
                                 <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest relative z-10">Threat Score</label>
                                 <div className="flex items-center gap-4 relative z-10">
                                    <div className={`text-3xl font-black ${selectedNode.suspicion_score > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedNode.suspicion_score.toFixed(1)}</div>
                                    <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                       <div className={`h-full ${selectedNode.suspicion_score > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'}`} style={{ width: `${selectedNode.suspicion_score || 0}%` }}></div>
                                    </div>
                                 </div>
                              </div>

                              {/* RECHARTS BAR CHART */}
                              {selectedNode.metadata && (
                                <div className="p-4 bg-[#050505] rounded border border-slate-800">
                                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-4 block tracking-widest">Volume Telemetry (USD)</label>
                                  <div className="h-32 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={[
                                        { name: 'INFLOW', amount: selectedNode.metadata.total_received, fill: '#10b981' },
                                        { name: 'OUTFLOW', amount: selectedNode.metadata.total_sent, fill: '#f97316' }
                                      ]} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} />
                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px', fontFamily: 'monospace' }} />
                                        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                                          {
                                            [0, 1].map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f97316'} />
                                            ))
                                          }
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              )}

                              {/* DIRECT CONNECTION LEDGER */}
                              <div>
                                 <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Network Topology Links</label>
                                 <div className="bg-[#050505] border border-slate-800 rounded max-h-40 overflow-y-auto">
                                    {getNodeLinks(selectedNode.account_id).map((link: any, i: number) => (
                                      <div key={i} className="flex items-center justify-between p-2 border-b border-slate-800/50 hover:bg-slate-900 transition-colors">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <LinkIcon className="w-3 h-3 text-cyan-700 flex-shrink-0" />
                                          <span className="text-xs font-mono text-slate-300 truncate">{link.connectedTo}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${link.direction === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                          {link.direction}
                                        </span>
                                      </div>
                                    ))}
                                    {getNodeLinks(selectedNode.account_id).length === 0 && (
                                      <div className="p-3 text-xs text-slate-600 font-mono text-center">No direct edges mapped.</div>
                                    )}
                                 </div>
                              </div>

                              <div>
                                 <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Active Flags</label>
                                 <div className="flex flex-wrap gap-2">
                                    {selectedNode.detected_patterns?.map((p: string) => (
                                       <span key={p} className="px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] font-mono rounded uppercase">
                                          {p.replace('_', ' ')}
                                       </span>
                                    )) || <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono rounded uppercase">CLEAN ACCOUNT</span>}
                                 </div>
                              </div>
                           </div>
                         )}
                       </div>
                    </div>
                  )}

                  {/* TABLE TAB */}
                  {activeTab === 'table' && (
                    <div className="h-[600px] overflow-auto p-6 bg-[#0a0a0c]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-cyan-900/50 text-[10px] font-mono text-cyan-600 tracking-widest uppercase">
                            <th className="px-4 py-3">Ring Designation</th>
                            <th className="px-4 py-3">Vector Typology</th>
                            <th className="px-4 py-3 text-center">Member Count</th> 
                            <th className="px-4 py-3">Threat Level</th>
                            <th className="px-4 py-3">Compromised Nodes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-900/20">
                          {results.analysis.fraud_rings.map((ring: any, idx: number) => (
                            <tr key={idx} className="hover:bg-cyan-950/20 transition-colors group">
                              <td className="px-4 py-4 font-mono text-sm text-cyan-300">{ring.ring_id}</td>
                              <td className="px-4 py-4"><span className="px-2 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded text-[10px] font-mono tracking-wider">{ring.pattern_type.replace('_', ' ').toUpperCase()}</span></td>
                              <td className="px-4 py-4 text-center font-mono text-cyan-100 font-bold text-lg">{ring.member_accounts.length}</td>
                              <td className="px-4 py-4"><div className="flex items-center gap-3"><span className="text-red-400 font-mono font-bold">{ring.risk_score.toFixed(1)}</span><div className="w-24 bg-gray-900 rounded-full h-1 overflow-hidden"><div className="bg-gradient-to-r from-orange-500 to-red-600 h-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ width: `${ring.risk_score}%` }}></div></div></div></td>
                              <td className="px-4 py-4 text-cyan-600/70 text-xs font-mono truncate max-w-[200px] group-hover:text-cyan-400 transition-colors">{ring.member_accounts.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* JSON TAB (FIXED DOWNLOAD BUTTON) */}
                  {activeTab === 'json' && (
                    <div className="p-6 bg-[#050505] h-[600px] overflow-auto relative">
                      <button 
                        onClick={downloadJSON}
                        className="absolute top-6 right-6 text-[10px] font-mono tracking-widest bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 px-4 py-2 rounded transition-all border border-cyan-800 flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" />
                        [ DOWNLOAD ARTIFACT ]
                      </button>
                      <pre className="text-emerald-400 font-mono text-xs leading-relaxed opacity-90 mt-8">
                        {/* We display the sanitized output so what they see is exactly what downloads */}
                        {JSON.stringify({
                          ...results.analysis,
                          suspicious_accounts: results.analysis.suspicious_accounts.map((acc: any) => {
                            const { metadata, ...rest } = acc;
                            return rest;
                          })
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}