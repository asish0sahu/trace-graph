import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GraphNode, GraphLink, DatabaseStatus, PredefinedScenario, CypherQueryResult } from './types';
import { Navbar } from './components/Navbar';
import { GraphCanvas } from './components/GraphCanvas';
import { EntityDetailDrawer } from './components/EntityDetailDrawer';
import { ScenarioView } from './components/ScenarioView';
import { BlastRadiusView } from './components/BlastRadiusView';
import { CypherConsole } from './components/CypherConsole';
import { CognoDBModal } from './components/CognoDBModal';
import { WhyGraphModal } from './components/WhyGraphModal';
import { CreateNodeModal } from './components/CreateNodeModal';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [scenarios, setScenarios] = useState<PredefinedScenario[]>([]);
  const [activeTab, setActiveTab] = useState<'explorer' | 'cypher' | 'blast' | 'scenarios'>('explorer');
  const [activeCypherQuery, setActiveCypherQuery] = useState<string>('');

  // Interactive Selection
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [highlightedLinkIds, setHighlightedLinkIds] = useState<string[]>([]);

  // Modals
  const [isCognoDBModalOpen, setIsCognoDBModalOpen] = useState(false);
  const [isWhyGraphModalOpen, setIsWhyGraphModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [isSeeding, setIsSeeding] = useState(false);
  const [initialBlastNodeId, setInitialBlastNodeId] = useState<string>('person_viktor_voronin');

  // Load initial graph data, status, and scenarios
  const fetchGraphData = async () => {
    try {
      const [statusRes, graphRes, scenariosRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()),
        fetch('/api/graph/overview').then(r => r.json()),
        fetch('/api/scenarios').then(r => r.json())
      ]);
      setStatus(statusRes);
      setNodes(graphRes.nodes || []);
      setLinks(graphRes.links || []);
      setScenarios(scenariosRes || []);
    } catch (err) {
      console.error('Failed to load initial graph intelligence state:', err);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  // Seed graph on CognoDB
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      await fetchGraphData();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Seeding failed:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Connect CognoDB credentials dynamically
  const handleConnectCognoDB = async (uri: string, user: string, pass: string) => {
    const res = await fetch('/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri, user, password: pass })
    });
    const data = await res.json();
    await fetchGraphData();
    return data;
  };

  // Run arbitrary or preset openCypher
  const handleExecuteCypher = async (cypher: string, params: Record<string, any>): Promise<CypherQueryResult | null> => {
    const res = await fetch('/api/cypher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: cypher, params })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to execute openCypher query');
    }
    const data: CypherQueryResult = await res.json();
    
    // Highlight returned subgraph elements if available
    if (data.nodes && data.nodes.length > 0) {
      setHighlightedNodeIds(data.nodes.map(n => n.id));
    }
    if (data.links && data.links.length > 0) {
      setHighlightedLinkIds(data.links.map(l => l.id));
    }

    return data;
  };

  // Create Node
  const handleCreateNode = async (nodeData: Partial<GraphNode>) => {
    const res = await fetch('/api/graph/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeData)
    });
    const newNode = await res.json();
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    return newNode;
  };

  // Create Link
  const handleCreateLink = async (linkData: { sourceId: string; targetId: string; type: string; percentage?: number; amount?: number; role?: string }) => {
    const res = await fetch('/api/graph/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData)
    });
    const newLink = await res.json();
    setLinks(prev => [...prev, newLink]);
    return newLink;
  };

  // Switch to blast radius tab from inspector
  const handleTriggerBlastRadius = (nodeId: string) => {
    setInitialBlastNodeId(nodeId);
    setActiveTab('blast');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <Navbar
        status={status}
        onOpenCognoDBModal={() => setIsCognoDBModalOpen(true)}
        onOpenWhyGraphModal={() => setIsWhyGraphModalOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onSeedDatabase={handleSeedDatabase}
        isSeeding={isSeeding}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex overflow-hidden">
        
        {/* Tab 1: Interactive Graph Canvas Explorer */}
        {activeTab === 'explorer' && (
          <div className="w-full h-full relative flex">
            <div className="flex-1 h-full relative">
              <GraphCanvas
                nodes={nodes}
                links={links}
                selectedNodeId={selectedNode?.id || null}
                onSelectNode={setSelectedNode}
                highlightedNodeIds={highlightedNodeIds}
                highlightedLinkIds={highlightedLinkIds}
              />
            </div>

            {/* Selected Node Details Drawer */}
            {selectedNode && (
              <EntityDetailDrawer
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                allNodes={nodes}
                allLinks={links}
                onSelectNode={setSelectedNode}
                onTriggerBlastRadius={handleTriggerBlastRadius}
                onInspectCypher={(cypher) => {
                  setActiveCypherQuery(cypher);
                  setActiveTab('cypher');
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Investigation Case Scenarios */}
        {activeTab === 'scenarios' && (
          <div className="w-full h-full">
            <ScenarioView
              scenarios={scenarios}
              onExecuteCypher={handleExecuteCypher}
              onViewOnCanvas={() => setActiveTab('explorer')}
              onInspectInCypher={(cypher) => {
                setActiveCypherQuery(cypher);
                setActiveTab('cypher');
              }}
            />
          </div>
        )}

        {/* Tab 3: Sanctions & Contagion Blast Radius Simulator */}
        {activeTab === 'blast' && (
          <div className="w-full h-full">
            <BlastRadiusView
              nodes={nodes}
              links={links}
              initialNodeId={initialBlastNodeId}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setActiveTab('explorer');
              }}
            />
          </div>
        )}

        {/* Tab 4: openCypher Console Workbench */}
        {activeTab === 'cypher' && (
          <div className="w-full h-full">
            <CypherConsole
              onExecuteCypher={handleExecuteCypher}
              initialQuery={activeCypherQuery}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <CognoDBModal
        isOpen={isCognoDBModalOpen}
        onClose={() => setIsCognoDBModalOpen(false)}
        status={status}
        onConnect={handleConnectCognoDB}
        onSeed={handleSeedDatabase}
        isSeeding={isSeeding}
      />

      <WhyGraphModal
        isOpen={isWhyGraphModalOpen}
        onClose={() => setIsWhyGraphModalOpen(false)}
      />

      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        allNodes={nodes}
        onCreateNode={handleCreateNode}
        onCreateLink={handleCreateLink}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onExecuteCypher={handleExecuteCypher}
      />

    </div>
  );
}
