import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Network, 
  Zap, 
  Layers, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  Code, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface WhyGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyGraphModal: React.FC<WhyGraphModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<'architecture' | 'schema' | 'comparisons'>('architecture');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Why a Graph Database? Architecture & Model</h2>
              <p className="text-xs text-slate-400 font-mono">Technical Whitepaper & openCypher Benchmark Analysis (CognoDB)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-[#0F172A] border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSection === 'architecture'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Core Architectural Advantage (Index-Free Adjacency)
          </button>
          <button
            onClick={() => setActiveSection('schema')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSection === 'schema'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Graph Data Model & Taxonomy
          </button>
          <button
            onClick={() => setActiveSection('comparisons')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSection === 'comparisons'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. SQL vs openCypher Complexity Comparison
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-300 text-xs leading-relaxed">
          
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <Zap className="w-4 h-4 text-amber-400" />
                  The Fundamental Graph Value Proposition
                </h3>
                <p className="text-slate-300 text-xs">
                  In financial crime, beneficial ownership, and sanctions intelligence, <strong>the value lies in the connections between entities</strong> rather than isolated row attributes. Traditional relational databases store data in tables and must look up foreign keys using index seeks at every join. As traversal depth increases (e.g., tracing a 5-hop shell company ownership chain), SQL joins trigger severe exponential performance degradation ($O(N^k)$).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider block">Relational (SQL) Bottleneck</span>
                  <h4 className="text-xs font-semibold text-white">Index Table Lookups ($O(\log N)$ per hop)</h4>
                  <p className="text-slate-400 text-xs font-mono">
                    To traverse $k$ hops across Persons, Entities, and Accounts, relational engines repeatedly scan B-tree indexes or hash-join massive adjacency tables. Intermediate result sets explode, consuming gigabytes of RAM for recursive CTEs.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-green-400 uppercase tracking-wider block">CognoDB (openCypher) Advantage</span>
                  <h4 className="text-xs font-semibold text-white">Index-Free Adjacency ($O(1)$ Pointer Dereferencing)</h4>
                  <p className="text-slate-400 text-xs font-mono">
                    Nodes maintain direct physical memory pointers to their adjacent relationships. Traversing millions of relationships is constant-time per hop ($O(1)$), allowing sub-millisecond multi-hop pathfinding regardless of total graph scale.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Key Graph Capabilities Applied in this App</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800">
                    <strong className="text-blue-400 block mb-1">Variable-Length Paths</strong>
                    <code className="text-[11px] text-cyan-300">[:OWNS*1..6]</code> traverses arbitrary holding hierarchies without hardcoding table join depths.
                  </div>
                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800">
                    <strong className="text-blue-400 block mb-1">Cycle Detection</strong>
                    Native detection of circular money laundering loops ($A \rightarrow B \rightarrow C \rightarrow A$) in single-pass traversals.
                  </div>
                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800">
                    <strong className="text-blue-400 block mb-1">Shortest Path Algorithms</strong>
                    Instant BFS / Dijkstra execution to find concealment vectors between sanctioned PEPs and government contracts.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white font-mono">Labeled Property Graph Schema</h3>
                <p className="text-slate-400 text-xs font-mono">
                  The dataset models complex financial relationships using strictly typed labeled nodes and directional relationships with first-class properties.
                </p>

                {/* Schema Diagram Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      :Person
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, subType, country, riskScore, isSanctioned, isPEP, citizenship
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      :ShellCompany
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, country, registrationNumber, incorporationDate, riskScore
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      :Company
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, subType, revenue, employees, country, riskScore
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                      :BankAccount
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, iban, balance, beneficialOwner, country, riskScore
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      :Contract
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, contractValue, awardingAgency, tenderId, riskScore
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      :Jurisdiction
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Properties:</span> id, name, secrecyIndex, corporateTaxRate, fatfStatus
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-blue-400 mb-1 font-mono">Relationship Typology:</h4>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:OWNS &#123;percentage, shares&#125;]</span>
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:DIRECTOR_OF &#123;role&#125;]</span>
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:BENEFICIARY_OF]</span>
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:TRANSFERRED_FUNDS &#123;amount, currency&#125;]</span>
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:AWARDED_CONTRACT]</span>
                    <span className="px-2 py-0.5 bg-[#0F172A] border border-slate-800 rounded text-blue-300">[:LOCATED_IN]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'comparisons' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B0F1A] border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Query Complexity Benchmark: UBO Traversal Across 5 Hops
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-[#0F172A] border border-rose-900/40 space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase">Relational SQL (Recursive CTE)</span>
                    <pre className="p-2 rounded bg-[#0B0F1A] text-[10px] font-mono text-rose-300 overflow-x-auto border border-rose-950">
{`WITH RECURSIVE ownership_tree AS (
  SELECT owner_id, target_id, pct, 1 AS depth
  FROM ownership WHERE target_id = $id
  UNION ALL
  SELECT o.owner_id, ot.target_id, (o.pct * ot.pct)/100.0, depth + 1
  FROM ownership o
  JOIN ownership_tree ot ON o.target_id = ot.owner_id
  WHERE depth < 6
)
SELECT * FROM ownership_tree;`}
                    </pre>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Slow recursive table scans; complex cycle prevention; requires custom procedural logic for multi-entity types.
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-[#0F172A] border border-green-900/40 space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold text-green-400 uppercase">CognoDB openCypher</span>
                    <pre className="p-2 rounded bg-[#0B0F1A] text-[10px] font-mono text-green-300 overflow-x-auto border border-green-950">
{`MATCH path = (p:Person)-[:OWNS*1..6]->(c:Company {id: $id})
RETURN p.name, 
       reduce(acc = 1.0, r IN relationships(path) | 
         acc * (r.percentage/100.0)
       ) * 100 AS effectivePercent,
       length(path) AS hops;`}
                    </pre>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Declarative pattern matching; index-free pointer traversal; native mathematical path reduction in &lt;5ms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
