import React, { useState } from 'react';
import { DatabaseStatus } from '../types';
import { 
  X, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Key, 
  Server, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface CognoDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DatabaseStatus | null;
  onConnect: (uri: string, user: string, pass: string) => Promise<{ success: boolean; message: string }>;
  onSeed: () => Promise<void>;
  isSeeding: boolean;
}

export const CognoDBModal: React.FC<CognoDBModalProps> = ({
  isOpen,
  onClose,
  status,
  onConnect,
  onSeed,
  isSeeding
}) => {
  if (!isOpen) return null;

  const [uri, setUri] = useState(status?.uri || 'bolt+s://eu-west-1.databases.cognodb.cloud');
  const [user, setUser] = useState(status?.user || 'admin');
  const [password, setPassword] = useState('cognodb-live-token');
  const [isConnecting, setIsConnecting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setFeedback(null);
    try {
      const res = await onConnect(uri, user, password);
      setFeedback(res);
    } catch (err: any) {
      setFeedback({ success: false, message: err.message || 'Connection failed' });
    } finally {
      setIsConnecting(false);
    }
  };

  const isConnected = Boolean(status?.connected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">CognoDB Cloud Connection</h2>
              <p className="text-xs text-slate-400 font-mono">Managed Graph Database (openCypher over Bolt Protocol 5.x)</p>
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Current Status Pill */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isConnected
              ? 'bg-green-500/10 border-green-500/20 text-green-300'
              : 'bg-[#0B0F1A] border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider block">
                  Active Engine: {status?.engine || 'Local Graph Engine'}
                </span>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {isConnected 
                    ? `Live Bolt connection established (${status?.latencyMs}ms ping) • ${status?.nodeCount} nodes • ${status?.relationshipCount} relationships`
                    : 'Operating on High-Fidelity Local openCypher Engine. Ready to connect live instance.'}
                </p>
              </div>
            </div>
            {isConnected && <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />}
          </div>

          {/* Quick Guide / Cloud signup info */}
          <div className="p-3.5 rounded-lg bg-[#0B0F1A] border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                CognoDB Cloud Setup
              </span>
              <a
                href="https://console.cognodb.com/signup"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 underline"
              >
                console.cognodb.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              1. Sign up at <strong>console.cognodb.com</strong> (no credit card needed).<br />
              2. Create a free <strong>(c0)</strong> instance & copy your <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">bolt+s://</code> URI & password.<br />
              3. Paste below to connect and run your openCypher queries directly on your live database!
            </p>
          </div>

          {/* Connection Form */}
          <form onSubmit={handleTestConnect} className="space-y-4 bg-[#0B0F1A] p-4 rounded-lg border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                CognoDB Instance URI (Bolt)
              </label>
              <div className="relative">
                <Server className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  placeholder="bolt+s://<instance-id>.databases.cognodb.cloud"
                  className="w-full bg-[#0F172A] text-slate-200 text-xs font-mono pl-9 pr-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                  Username
                </label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full bg-[#0F172A] text-slate-200 text-xs font-mono px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Generated instance password"
                    className="w-full bg-[#0F172A] text-slate-200 text-xs font-mono pl-9 pr-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onSeed}
                disabled={isSeeding}
                className="px-3.5 py-1.5 rounded-md bg-[#0F172A] hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Seeding...' : 'Seed Seed Data on DB'}</span>
              </button>

              <button
                type="submit"
                disabled={isConnecting}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{isConnecting ? 'Testing Bolt Connection...' : 'Connect to CognoDB'}</span>
              </button>
            </div>
          </form>

          {/* Feedback message */}
          {feedback && (
            <div className={`p-3 rounded-md border text-xs flex items-center gap-2 font-mono ${
              feedback.success
                ? 'bg-green-500/10 border-green-500/20 text-green-300'
                : 'bg-rose-950/60 border-rose-800 text-rose-300'
            }`}>
              {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
