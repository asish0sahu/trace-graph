import React, { useState } from 'react';
import { GraphNode, GraphLink } from '../types';
import { 
  X, 
  PlusCircle, 
  Network, 
  Building2, 
  User, 
  Landmark, 
  Coins, 
  FileText, 
  Code, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  allNodes: GraphNode[];
  onCreateNode: (node: Partial<GraphNode>) => Promise<GraphNode>;
  onCreateLink: (link: { sourceId: string; targetId: string; type: string; percentage?: number; amount?: number; role?: string }) => Promise<GraphLink>;
}

export const CreateNodeModal: React.FC<CreateNodeModalProps> = ({
  isOpen,
  onClose,
  allNodes,
  onCreateNode,
  onCreateLink
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'node' | 'link'>('node');

  // Node Form state
  const [name, setName] = useState('');
  const [label, setLabel] = useState<GraphNode['label']>('Company');
  const [subType, setSubType] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [riskScore, setRiskScore] = useState(35);
  const [isSanctioned, setIsSanctioned] = useState(false);
  const [isPEP, setIsPEP] = useState(false);

  // Link Form state
  const [sourceId, setSourceId] = useState(allNodes[0]?.id || '');
  const [targetId, setTargetId] = useState(allNodes[1]?.id || '');
  const [linkType, setLinkType] = useState('OWNS');
  const [percentage, setPercentage] = useState<number | ''>(50);
  const [amount, setAmount] = useState<number | ''>('');
  const [role, setRole] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateNodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateNode({
        name,
        label,
        subType,
        country,
        riskScore,
        isSanctioned,
        isPEP
      });
      setFeedback(`Entity "${name}" created successfully!`);
      setName('');
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) {
      alert('Source and target must be distinct valid entities.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreateLink({
        sourceId,
        targetId,
        type: linkType,
        percentage: percentage !== '' ? Number(percentage) : undefined,
        amount: amount !== '' ? Number(amount) : undefined,
        role: role.trim() || undefined
      });
      setFeedback(`Relationship [:${linkType}] connected successfully!`);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Graph Entity & Relationship Creator</h2>
              <p className="text-xs text-slate-400 font-mono">Parameterized openCypher Insertions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#0B0F1A] p-1.5 border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('node')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'node' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Node (Entity)
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'link' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connect Relationship (Edge)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 font-mono">
          
          {feedback && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}

          {activeTab === 'node' ? (
            <form onSubmit={handleCreateNodeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Entity Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Orion Capital Partners Ltd"
                  className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Entity Label</label>
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value as any)}
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Company">Company (Operating)</option>
                    <option value="ShellCompany">ShellCompany (Offshore SPV)</option>
                    <option value="Person">Person (Individual)</option>
                    <option value="BankAccount">BankAccount</option>
                    <option value="Contract">Contract (Tender / Asset)</option>
                    <option value="Jurisdiction">Jurisdiction</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Sub-Type / Role</label>
                  <input
                    type="text"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    placeholder="e.g. Discretionary Trust, Holding Co"
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Country / Jurisdiction</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. British Virgin Islands, Cyprus"
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Risk Score: <span className="text-amber-400 font-mono font-bold">{riskScore}/100</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskScore}
                    onChange={(e) => setRiskScore(Number(e.target.value))}
                    className="w-full accent-blue-500 mt-1 cursor-pointer"
                  />
                </div>
              </div>

              {label === 'Person' && (
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSanctioned}
                      onChange={(e) => setIsSanctioned(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Sanctioned Entity (OFAC / EU)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPEP}
                      onChange={(e) => setIsPEP(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Politically Exposed Person (PEP)</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating in Graph...' : 'Create Node in CognoDB Graph'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateLinkSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Source Node</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    {allNodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.label})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Node</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    {allNodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.label})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Relationship Type</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value)}
                  className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="OWNS">[:OWNS] - Shareholding / Control</option>
                  <option value="DIRECTOR_OF">[:DIRECTOR_OF] - Directorship</option>
                  <option value="BENEFICIARY_OF">[:BENEFICIARY_OF] - Trust Beneficiary</option>
                  <option value="TRANSFERRED_FUNDS">[:TRANSFERRED_FUNDS] - Wire Transfer</option>
                  <option value="AWARDED_CONTRACT">[:AWARDED_CONTRACT] - Commercial Tender</option>
                  <option value="LOCATED_IN">[:LOCATED_IN] - Jurisdiction Link</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkType === 'OWNS' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Ownership Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {linkType === 'TRANSFERRED_FUNDS' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Transfer Amount (USD/EUR)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 15000000"
                      className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Description Note</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Nominee Shareholder, Managing Director"
                    className="w-full bg-[#0B0F1A] text-slate-200 text-xs px-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Connecting in Graph...' : 'Connect Relationship Edge'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
