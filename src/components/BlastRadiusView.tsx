import React, { useState, useMemo } from 'react';
import { GraphNode, GraphLink } from '../types';
import { 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  ArrowRight, 
  Coins, 
  Building2, 
  FileText,
  CheckCircle2
} from 'lucide-react';

interface BlastRadiusViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  initialNodeId?: string;
  onSelectNode: (node: GraphNode | null) => void;
}

export const BlastRadiusView: React.FC<BlastRadiusViewProps> = ({
  nodes,
  links,
  initialNodeId = 'person_viktor_voronin',
  onSelectNode
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(initialNodeId);
  const [maxHops, setMaxHops] = useState<number>(3);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Compute blast radius breadth-first traversal
  const blastData = useMemo(() => {
    if (!selectedSourceId || !nodeMap.has(selectedSourceId)) {
      return { affectedNodes: [], compromisedTenders: 0, compromisedBalance: 0, highRiskCount: 0 };
    }

    const visited = new Map<string, { node: GraphNode; hop: number; path: string[] }>();
    const queue: { id: string; hop: number; path: string[] }[] = [
      { id: selectedSourceId, hop: 0, path: [nodeMap.get(selectedSourceId)!.name] }
    ];
    visited.set(selectedSourceId, { node: nodeMap.get(selectedSourceId)!, hop: 0, path: [nodeMap.get(selectedSourceId)!.name] });

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.hop >= maxHops) continue;

      // Find all neighbors connected via any relationship
      links.forEach(l => {
        const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;

        let neighborId: string | null = null;
        if (srcId === current.id) neighborId = tgtId;
        else if (tgtId === current.id) neighborId = srcId;

        if (neighborId && !visited.has(neighborId) && nodeMap.has(neighborId)) {
          const neighborNode = nodeMap.get(neighborId)!;
          const nextHop = current.hop + 1;
          const nextPath = [...current.path, neighborNode.name];

          visited.set(neighborId, { node: neighborNode, hop: nextHop, path: nextPath });
          queue.push({ id: neighborId, hop: nextHop, path: nextPath });
        }
      });
    }

    const affectedList = Array.from(visited.values()).filter(item => item.hop > 0);
    
    // Aggregated Risk Impact
    let compromisedTenders = 0;
    let compromisedBalance = 0;
    let highRiskCount = 0;

    affectedList.forEach(item => {
      if (item.node.contractValue) compromisedTenders += item.node.contractValue;
      if (item.node.balance) compromisedBalance += item.node.balance;
      if (item.node.riskScore >= 70) highRiskCount++;
    });

    return {
      affectedNodes: affectedList.sort((a, b) => a.hop - b.hop || b.node.riskScore - a.node.riskScore),
      compromisedTenders,
      compromisedBalance,
      highRiskCount
    };
  }, [selectedSourceId, maxHops, nodeMap, links]);

  const sourceNode = nodeMap.get(selectedSourceId);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-[#0B0F1A] text-slate-300 p-4 md:p-6 space-y-5 select-none">
      
      {/* Header & Controls */}
      <div className="bg-[#0F172A] rounded-lg border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Sanctions Shockwave Engine
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                O(V + E) BFS Traversal
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Sanction Blast Radius & Contagion Simulator</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Dynamically evaluates multi-hop ownership chains, proxy relationships, and directorship vectors to identify all commercial contracts and capital within reach of designated entities.
            </p>
          </div>

          {/* Epicenter selector & Hop slider */}
          <div className="flex flex-wrap items-center gap-3 bg-[#0B0F1A] p-2.5 rounded-lg border border-slate-800">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Blast Origin (Epicenter)
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="bg-[#0F172A] text-slate-200 text-xs font-mono px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                {nodes.filter(n => n.riskScore >= 60 || n.isSanctioned).map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.label} - Risk: {n.riskScore})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Hop Depth: <span className="text-amber-400 font-bold font-mono">{maxHops} Hops</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={maxHops}
                onChange={(e) => setMaxHops(Number(e.target.value))}
                className="w-28 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Aggregated Blast Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Impacted Entities</span>
              <p className="text-xl font-bold font-mono text-white">{blastData.affectedNodes.length}</p>
            </div>
            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">High-Risk Proxies</span>
              <p className="text-xl font-bold font-mono text-rose-400">{blastData.highRiskCount}</p>
            </div>
            <div className="w-8 h-8 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Contaminated Tenders</span>
              <p className="text-xl font-bold font-mono text-amber-400">
                ${(blastData.compromisedTenders / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Layered Bank Volume</span>
              <p className="text-xl font-bold font-mono text-emerald-400">
                ${(blastData.compromisedBalance / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Impacted Node List grouped by Hop Distance */}
      <div className="bg-[#0F172A] rounded-lg border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Contagion Perimeter Cascade ({blastData.affectedNodes.length} Nodes within {maxHops} Hops)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Click any node to view entity profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {blastData.affectedNodes.map(({ node, hop, path }) => (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className="p-3.5 rounded-lg bg-[#0B0F1A] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
            >
              <div className="flex items-center justify-between font-mono">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  hop === 1 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  hop === 2 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  Hop #{hop} Distance
                </span>

                <span className={`text-xs font-bold ${
                  node.riskScore >= 75 ? 'text-rose-400' :
                  node.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  Risk: {node.riskScore}/100
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{node.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">{node.subType || node.country || node.label}</p>
              </div>

              {/* Transmission Path Breadcrumbs */}
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center flex-wrap gap-1">
                <span className="text-slate-500 font-semibold font-mono">Vector:</span>
                {path.map((pName, i) => (
                  <React.Fragment key={i}>
                    <span className={`font-mono ${i === path.length - 1 ? 'text-blue-300 font-semibold' : 'text-slate-400'}`}>
                      {pName}
                    </span>
                    {i < path.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-slate-600 inline" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
