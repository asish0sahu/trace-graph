import React, { useState } from 'react';
import { CypherQueryResult } from '../types';
import { 
  Play, 
  Code, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Trash2,
  Sparkles,
  Sliders
} from 'lucide-react';

interface CypherConsoleProps {
  onExecuteCypher: (cypher: string, params: Record<string, any>) => Promise<CypherQueryResult | null>;
  initialQuery?: string;
}

const TEMPLATE_QUERIES = [
  {
    name: '1. Match All Nodes & Types',
    query: `MATCH (n) RETURN labels(n)[0] AS entityType, n.name AS name, n.riskScore AS riskScore, n.country AS jurisdiction LIMIT 20;`,
    params: `{}`
  },
  {
    name: '2. Multi-Hop UBO Traversal (>20% Control)',
    query: `MATCH path = (p:Person)-[:BENEFICIARY_OF|OWNS*1..5]->(c:Company {id: 'comp_skyline_aerospace'})
WITH p, c, path, reduce(acc = 1.0, r IN relationships(path) | acc * (coalesce(r.percentage, 100.0) / 100.0)) AS effectiveShare
WHERE effectiveShare >= 0.20
RETURN p.name AS ultimateOwner, p.isSanctioned AS sanctioned, round(effectiveShare * 1000) / 10.0 AS effectivePercent, length(path) AS concealmentHops
ORDER BY effectivePercent DESC;`,
    params: `{}`
  },
  {
    name: '3. Sanctions Contagion (3 Hops)',
    query: `MATCH (sanctioned:Person {isSanctioned: true})-[*1..3]-(affected)
WHERE affected <> sanctioned
RETURN DISTINCT labels(affected)[0] AS type, affected.name AS name, affected.riskScore AS riskScore
ORDER BY riskScore DESC LIMIT 20;`,
    params: `{}`
  },
  {
    name: '4. Circular Wire Flow Laundering',
    query: `MATCH path = (b:BankAccount)-[:TRANSFERRED_FUNDS*3..5]->(b)
RETURN [n IN nodes(path) | n.name] AS circuitAccounts, length(path) AS hopCount LIMIT 5;`,
    params: `{}`
  },
  {
    name: '5. Nominee Director Star Hubs',
    query: `MATCH (dir:Person)-[:DIRECTOR_OF]->(c)
WITH dir, count(c) AS roles, collect(c.name) AS companies
WHERE roles >= 2
RETURN dir.name AS director, dir.country AS residentOf, roles, companies
ORDER BY roles DESC;`,
    params: `{}`
  }
];

export const CypherConsole: React.FC<CypherConsoleProps> = ({ onExecuteCypher, initialQuery }) => {
  const [cypherQuery, setCypherQuery] = useState(initialQuery || TEMPLATE_QUERIES[0].query);
  const [queryParams, setQueryParams] = useState('{}');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CypherQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setCypherQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(queryParams || '{}');
      } catch (e: any) {
        throw new Error(`Invalid JSON in Query Parameters: ${e.message}`);
      }

      const res = await onExecuteCypher(cypherQuery, parsedParams);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Execution error');
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cypherQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-[#0B0F1A] text-slate-300 p-4 md:p-6 space-y-5 select-none">
      
      {/* Header & Quick Templates */}
      <div className="bg-[#0F172A] rounded-lg border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                openCypher Interactive Workbench
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                CognoDB Bolt Driver v5.x
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">openCypher Query Console</h1>
            <p className="text-xs text-slate-400 mt-1">
              Execute parameterized openCypher traversals with real-time Bolt protocol streaming and query diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-md bg-[#0B0F1A] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Copy Cypher Query"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setCypherQuery(''); setQueryParams('{}'); }}
              className="p-2 rounded-md bg-[#0B0F1A] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Clear Editor"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning || !cypherQuery.trim()}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isRunning ? 'Executing...' : 'Run openCypher'}</span>
            </button>
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Templates:</span>
          {TEMPLATE_QUERIES.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCypherQuery(t.query);
                setQueryParams(t.params);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-[#0B0F1A] hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono transition-colors"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Parameter Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Cypher Editor */}
        <div className="lg:col-span-2 bg-[#0F172A] rounded-lg border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-2 bg-[#121929] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-semibold text-slate-300">openCypher Statement</span>
            <span>UTF-8 / ISO GQL Standard</span>
          </div>
          <textarea
            value={cypherQuery}
            onChange={(e) => setCypherQuery(e.target.value)}
            rows={8}
            placeholder="Enter MATCH, MERGE, or CREATE Cypher statement..."
            className="w-full bg-[#0B0F1A] text-blue-200 font-mono text-xs p-4 focus:outline-none resize-y leading-relaxed border-none"
          />
        </div>

        {/* Parameters (JSON) */}
        <div className="bg-[#0F172A] rounded-lg border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-2 bg-[#121929] border-b border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300">Parameters (JSON)</span>
          </div>
          <textarea
            value={queryParams}
            onChange={(e) => setQueryParams(e.target.value)}
            rows={8}
            placeholder='{ "companyId": "comp_skyline_aerospace", "threshold": 0.2 }'
            className="w-full bg-[#0B0F1A] text-amber-200 font-mono text-xs p-4 focus:outline-none resize-y leading-relaxed border-none flex-1"
          />
        </div>

      </div>

      {/* Execution Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider">Cypher Error</span>
            <p className="font-mono mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-[#0F172A] rounded-lg border border-slate-800 overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Success: {result.summary.sourceEngine}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{result.executionTimeMs} ms</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                <span>{result.rows.length} rows</span>
              </div>
            </div>
          </div>

          {result.rows.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs italic font-mono">
              Query returned 0 records.
            </div>
          ) : (
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
          )}
        </div>
      )}

    </div>
  );
};
