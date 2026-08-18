import React, { useState } from 'react';
import { GraphNode, GraphLink } from '../types';
import { 
  X, 
  ShieldAlert, 
  Building2, 
  User, 
  Landmark, 
  Globe, 
  FileText, 
  Coins, 
  AlertTriangle,
  Radio,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Code,
  Copy,
  Check
} from 'lucide-react';

interface EntityDetailDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
  allNodes: GraphNode[];
  allLinks: GraphLink[];
  onSelectNode: (node: GraphNode | null) => void;
  onTriggerBlastRadius: (nodeId: string) => void;
  onInspectCypher?: (cypher: string) => void;
}

export const EntityDetailDrawer: React.FC<EntityDetailDrawerProps> = ({
  node,
  onClose,
  allNodes,
  allLinks,
  onSelectNode,
  onTriggerBlastRadius,
  onInspectCypher
}) => {
  if (!node) return null;

  const [copiedCypher, setCopiedCypher] = useState(false);
  const nodeMap = new Map(allNodes.map(n => [n.id, n]));

  const generatedCypher = `MATCH (n:${node.label} {id: '${node.id}'})-[r]-(neighbor)
RETURN n, r, neighbor;`;

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(generatedCypher);
    setCopiedCypher(true);
    setTimeout(() => setCopiedCypher(false), 2000);
  };

  // Inbound & Outbound links
  const incomingLinks = allLinks.filter(l => {
    const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
    return tgtId === node.id;
  });

  const outgoingLinks = allLinks.filter(l => {
    const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
    return srcId === node.id;
  });

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 bg-rose-950/70 border-rose-800';
    if (score >= 50) return 'text-amber-400 bg-amber-950/70 border-amber-800';
    return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
  };

  return (
    <div className="w-96 bg-[#0F172A]/95 border-l border-slate-800 flex flex-col h-full overflow-y-auto select-none z-20 shadow-2xl backdrop-blur-md">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-[#0F172A] sticky top-0">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              :{node.label}
            </span>
            {node.isSanctioned && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                Sanctioned
              </span>
            )}
            {node.isPEP && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                PEP
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white break-words">{node.name}</h2>
          <p className="text-xs text-slate-400 font-mono">{node.subType || node.country || 'Entity Profile'}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 flex-1">
        
        {/* Risk Score Pill */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${getRiskColor(node.riskScore)}`}>
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider opacity-80">Risk Assessment Index</span>
            <p className="text-xl font-bold font-mono">{node.riskScore}<span className="text-xs font-normal opacity-70"> / 100</span></p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center">
            {node.riskScore >= 75 ? (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Action Buttons: Blast Radius & Cypher Inspect */}
        <div className="space-y-2">
          <button
            onClick={() => onTriggerBlastRadius(node.id)}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-medium shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>Simulate Sanction Blast Radius</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {onInspectCypher && (
              <button
                onClick={() => onInspectCypher(generatedCypher)}
                className="py-1.5 px-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Inspect in openCypher Workbench"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cypher Console</span>
              </button>
            )}

            <button
              onClick={handleCopyCypher}
              className="py-1.5 px-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Copy openCypher query to clipboard"
            >
              {copiedCypher ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCypher ? 'Copied' : 'Copy MATCH'}</span>
            </button>
          </div>
        </div>

        {/* Properties Key-Value (Sleek card style) */}
        <div className="p-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase mb-2 tracking-wider flex items-center justify-between">
            <span>Node Properties</span>
            <span className="text-[10px] font-mono text-blue-400">#{node.id.slice(0, 8)}</span>
          </h4>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-[11px] text-slate-500">ID</span>
              <span className="text-[11px] text-blue-400 truncate max-w-[180px]">{node.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-[11px] text-slate-500">Labels</span>
              <span className="text-[11px] text-purple-400">:{node.label}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-[11px] text-slate-500">Name</span>
              <span className="text-[11px] text-white truncate max-w-[180px]">{node.name}</span>
            </div>
            {node.country && (
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-[11px] text-slate-500">Jurisdiction</span>
                <span className="text-[11px] text-slate-200">{node.country}</span>
              </div>
            )}
            {node.registrationNumber && (
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-[11px] text-slate-500">Reg Number</span>
                <span className="text-[11px] text-cyan-300">{node.registrationNumber}</span>
              </div>
            )}
            {node.balance !== undefined && (
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-[11px] text-slate-500">Account Balance</span>
                <span className="text-[11px] text-emerald-400 font-bold">${node.balance.toLocaleString()}</span>
              </div>
            )}
            {node.contractValue !== undefined && (
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-[11px] text-slate-500">Tender Value</span>
                <span className="text-[11px] text-amber-400 font-bold">${node.contractValue.toLocaleString()}</span>
              </div>
            )}
            {node.properties && Object.entries(node.properties).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-[11px] text-slate-500">{k}</span>
                <span className="text-[11px] text-slate-300 truncate max-w-[180px]">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Outgoing Relationships */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
              Outgoing Links ({outgoingLinks.length})
            </h3>
          </div>
          {outgoingLinks.length === 0 ? (
            <p className="text-xs text-slate-500 italic font-mono">No outgoing connections.</p>
          ) : (
            <div className="space-y-1.5">
              {outgoingLinks.map(link => {
                const tgtId = typeof link.target === 'object' ? (link.target as any).id : link.target;
                const tgtNode = nodeMap.get(tgtId);
                return (
                  <div
                    key={link.id}
                    onClick={() => tgtNode && onSelectNode(tgtNode)}
                    className="p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-blue-400 text-[11px]">[:{link.type}]</span>
                      {link.percentage && <span className="text-amber-400 font-bold">{link.percentage}%</span>}
                      {link.amount && <span className="text-emerald-400 font-bold">${(link.amount / 1000000).toFixed(1)}M</span>}
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5 truncate font-medium">{tgtNode ? (tgtNode as GraphNode).name : String(tgtId)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Connected Incoming Relationships */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-green-400" />
              Incoming Links ({incomingLinks.length})
            </h3>
          </div>
          {incomingLinks.length === 0 ? (
            <p className="text-xs text-slate-500 italic font-mono">No incoming connections.</p>
          ) : (
            <div className="space-y-1.5">
              {incomingLinks.map(link => {
                const srcId = typeof link.source === 'object' ? (link.source as any).id : link.source;
                const srcNode = nodeMap.get(srcId);
                return (
                  <div
                    key={link.id}
                    onClick={() => srcNode && onSelectNode(srcNode)}
                    className="p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-green-400 text-[11px]">[:{link.type}]</span>
                      {link.percentage && <span className="text-amber-400 font-bold">{link.percentage}%</span>}
                      {link.amount && <span className="text-emerald-400 font-bold">${(link.amount / 1000000).toFixed(1)}M</span>}
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5 truncate font-medium">{srcNode ? (srcNode as GraphNode).name : String(srcId)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
