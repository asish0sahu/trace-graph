import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Code, 
  Play, 
  CheckCircle2, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CypherQueryResult } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCypher: (cypher: string, params: Record<string, any>) => Promise<CypherQueryResult | null>;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onExecuteCypher
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ cypher: string; explanation: string; riskFocus: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<CypherQueryResult | null>(null);

  const EXAMPLE_QUESTIONS = [
    'Find all companies indirectly owned (>25%) by sanctioned individuals through offshore shell holding companies.',
    'Trace circular fund transfers between bank accounts that return money back to the origin account.',
    'Show all nominee directors who hold management seats across 3 or more secrecy jurisdictions.',
    'Find the shortest ownership connection between Viktor Voronin and NATO defense contracts.'
  ];

  const handleAsk = async (userPrompt: string) => {
    setPrompt(userPrompt);
    setIsLoading(true);
    setResponse(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!response?.cypher) return;
    setIsExecuting(true);
    try {
      const res = await onExecuteCypher(response.cypher, {});
      setResult(res);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Natural Language Graph Query Assistant</h2>
              <p className="text-xs text-slate-400 font-mono">Translate plain English questions to validated openCypher for CognoDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Natural language question form */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block font-mono">
              Ask any question about corporate ownership, sanctions, or money flow:
            </label>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && prompt.trim() && handleAsk(prompt)}
                placeholder="e.g. Find all companies owned >25% by sanctioned people in Cyprus..."
                className="w-full bg-[#0B0F1A] text-slate-200 text-xs pl-3 pr-24 py-2.5 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={() => prompt.trim() && handleAsk(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isLoading ? 'Thinking...' : 'Translate'}</span>
              </button>
            </div>
          </div>

          {/* Example prompt pills */}
          <div className="space-y-1.5 font-mono">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Example Prompts:</span>
            <div className="space-y-1.5">
              {EXAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="w-full text-left p-2.5 rounded-md bg-[#0B0F1A] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between group text-xs"
                >
                  <span className="truncate pr-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Box */}
          {response && (
            <div className="bg-[#0B0F1A] rounded-md border border-slate-800 p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300 font-mono font-semibold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Risk Focus: {response.riskFocus}</span>
                </div>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : 'fill-white'}`} />
                  <span>{isExecuting ? 'Executing...' : 'Run on CognoDB'}</span>
                </button>
              </div>

              <p className="text-slate-300 bg-[#0F172A] p-3 rounded-md border border-slate-800 leading-relaxed text-xs">
                {response.explanation}
              </p>

              <div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase block mb-1">Generated openCypher:</span>
                <pre className="p-3 bg-[#080C14] rounded-md text-blue-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {response.cypher}
                </pre>
              </div>

              {/* Execution Result */}
              {result && (
                <div className="pt-2 border-t border-slate-800 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Executed in {result.executionTimeMs} ms ({result.rows.length} rows)
                    </span>
                    <span className="text-slate-500">{result.summary.sourceEngine}</span>
                  </div>

                  <div className="overflow-x-auto rounded-md border border-slate-800 max-h-48">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-[#0F172A] text-slate-400">
                          {result.columns.map(c => <th key={c} className="p-2 uppercase font-semibold">{c}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-[#0B0F1A]">
                        {result.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/40">
                            {result.columns.map(c => (
                              <td key={c} className="p-2 text-slate-200">
                                {String(row[c] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
