import React from 'react';
import { DatabaseStatus } from '../types';
import { 
  Network, 
  Database, 
  Sparkles, 
  BookOpen, 
  PlusCircle, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  status: DatabaseStatus | null;
  onOpenCognoDBModal: () => void;
  onOpenWhyGraphModal: () => void;
  onOpenCreateModal: () => void;
  onOpenAIModal: () => void;
  onSeedDatabase: () => void;
  isSeeding: boolean;
  activeTab: 'explorer' | 'cypher' | 'blast' | 'scenarios';
  setActiveTab: (tab: 'explorer' | 'cypher' | 'blast' | 'scenarios') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  onOpenCognoDBModal,
  onOpenWhyGraphModal,
  onOpenCreateModal,
  onOpenAIModal,
  onSeedDatabase,
  isSeeding,
  activeTab,
  setActiveTab
}) => {
  const isConnectedToLive = Boolean(status?.connected);

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                TraceGraph <span className="text-blue-400 font-normal text-sm opacity-85 hidden sm:inline">Graph Intelligence</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  CognoDB
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Beneficial Ownership & Sanction Blast Radius Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0B0F1A] p-1 rounded-lg border border-slate-800">
            <button
              id="nav-tab-explorer"
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Graph Explorer
            </button>
            <button
              id="nav-tab-scenarios"
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Investigation Scenarios
            </button>
            <button
              id="nav-tab-blast"
              onClick={() => setActiveTab('blast')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'blast'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              Blast Radius
            </button>
            <button
              id="nav-tab-cypher"
              onClick={() => setActiveTab('cypher')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'cypher'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              openCypher Console
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* CognoDB Connection Status Pill */}
            <button
              id="btn-connection-status"
              onClick={onOpenCognoDBModal}
              title="Configure CognoDB Bolt Credentials"
              className={`flex items-center px-3 py-1 rounded-full border text-xs font-mono transition-colors ${
                isConnectedToLive
                  ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnectedToLive ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">
                {isConnectedToLive ? (status?.uri ? status.uri.replace('bolt+s://', '') : 'bolt+s://cognodb.cloud') : 'Local Engine'}
              </span>
              <Database className="w-3 h-3 ml-1.5 opacity-60" />
            </button>

            {/* AI Assistant */}
            <button
              id="btn-ai-prompt"
              onClick={onOpenAIModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Assistant
            </button>

            {/* Add Node */}
            <button
              id="btn-add-node"
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Add Node</span>
            </button>

            {/* Seed Button */}
            <button
              id="btn-seed-db"
              onClick={onSeedDatabase}
              disabled={isSeeding}
              title="Reset & Seed Realistic Graph Dataset"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>

            {/* Architecture Whitepaper */}
            <button
              id="btn-why-graph"
              onClick={onOpenWhyGraphModal}
              title="Why a Graph Database? Architecture & Data Model"
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
