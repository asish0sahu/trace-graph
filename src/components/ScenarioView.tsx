import React, { useState } from 'react';
import { PredefinedScenario, CypherQueryResult } from '../types';
import { 
  Play, 
  Layers, 
  Lightbulb, 
  Code, 
  CheckCircle2, 
  Table, 
  Network, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ScenarioViewProps {
  scenarios: PredefinedScenario[];
  onExecuteCypher: (cypher: string, params: Record<string, any>) => Promise<CypherQueryResult | null>;
  onViewOnCanvas?: () => void;
  onInspectInCypher?: (cypher: string) => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  scenarios,
  onExecuteCypher,
  onViewOnCanvas,
  onInspectInCypher
}) => {
  const [selectedScenario, setSelectedScenario] = useState<PredefinedScenario>(scenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CypherQueryResult | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const handleRun = async (scenario: PredefinedScenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    try {
      const res = await onExecuteCypher(scenario.cypher, scenario.params);
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#0B0F1A] text-slate-300 select-none">
      
      {/* Left Sidebar: Scenario List */}
      <nav className="w-full md:w-80 border-r border-slate-800 bg-[#0F172A] flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-800 bg-[#0F172A] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investigation Scenarios</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-world graph intelligence queries showcasing multi-hop traversals in openCypher.
          </p>
        </div>

        <div className="p-3 space-y-2 flex-1">
          {scenarios.map(s => {
            const isSelected = selectedScenario?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedScenario(s)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5 font-mono">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {s.category}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold leading-snug">{s.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{s.description}</p>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Right Content: Details, openCypher, & Live Results */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-[#0B0F1A]">
        
        {/* Scenario Header */}
        <div className="bg-[#0F172A] rounded-lg border border-slate-800 p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedScenario.category}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {selectedScenario.badge}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">{selectedScenario.title}</h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {selectedScenario.description}
              </p>
            </div>

            <button
              onClick={() => handleRun(selectedScenario)}
              disabled={isRunning}
              className="self-start md:self-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isRunning ? 'Executing Cypher...' : 'Run Query on CognoDB'}</span>
            </button>
          </div>

          {/* Why Graph Database is Essential Here */}
          <div className="mt-4 p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Why a Graph Database Outclasses SQL Here</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {selectedScenario.whyGraphMatters}
              </p>
            </div>
          </div>
        </div>

        {/* Parameterised openCypher Statement Box */}
        <div className="bg-[#0F172A] rounded-lg border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-4 py-2.5 bg-[#121929] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300">Parameterised openCypher Query</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Bolt 5.x / openCypher standard</span>
          </div>
          <pre className="p-4 text-xs font-mono text-blue-200 bg-[#0B0F1A] overflow-x-auto leading-relaxed border-t border-slate-800/40">
            {selectedScenario.cypher}
          </pre>
          {Object.keys(selectedScenario.params).length > 0 && (
            <div className="px-4 py-2 bg-[#121929] border-t border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-slate-500">Query Parameters:</span> {JSON.stringify(selectedScenario.params)}
            </div>
          )}
        </div>

        {/* Live Execution Results Table */}
        {result && (
          <div className="bg-[#0F172A] rounded-lg border border-slate-800 overflow-hidden shadow-xl space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Executed on {result.summary.sourceEngine}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{result.executionTimeMs} ms</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  <span>{result.rows.length} rows returned</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onViewOnCanvas && (
                  <button
                    onClick={onViewOnCanvas}
                    className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>View on Graph Canvas</span>
                  </button>
                )}

                {onInspectInCypher && (
                  <button
                    onClick={() => onInspectInCypher(selectedScenario.cypher)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Workbench</span>
                  </button>
                )}

                <div className="flex items-center gap-1 bg-[#0B0F1A] p-1 rounded-md border border-slate-800 text-xs">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('json')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${viewMode === 'json' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'table' ? (
              <div className="overflow-x-auto rounded-md border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0B0F1A] text-slate-500 border-b border-slate-800">
                      {result.columns.map(col => (
                        <th key={col} className="p-3 font-semibold uppercase tracking-wider text-xs">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0F172A] font-mono text-sm">
                    {result.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        {result.columns.map(col => {
                          const val = row[col];
                          return (
                            <td key={col} className="p-3 text-blue-300">
                              {Array.isArray(val) ? (
                                <div className="flex flex-wrap gap-1">
                                  {val.map((item, i) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-blue-300 font-mono border border-slate-700">
                                      {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                                    </span>
                                  ))}
                                </div>
                              ) : typeof val === 'boolean' ? (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                  {val ? 'TRUE' : 'FALSE'}
                                </span>
                              ) : typeof val === 'number' ? (
                                <span className="font-mono text-amber-300">{val}</span>
                              ) : (
                                String(val ?? '')
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <pre className="p-4 text-xs font-mono text-green-400 bg-[#0B0F1A] rounded-md overflow-x-auto border border-slate-800">
                {JSON.stringify(result.rows, null, 2)}
              </pre>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
