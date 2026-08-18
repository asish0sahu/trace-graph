import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Pause, 
  Search, 
  Filter, 
  Building2, 
  User, 
  Landmark, 
  Globe, 
  FileText, 
  Coins, 
  AlertOctagon,
  Layers
} from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  highlightedNodeIds?: string[];
  highlightedLinkIds?: string[];
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  highlightedNodeIds = [],
  highlightedLinkIds = []
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState<string>('ALL');
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // Simulation references
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  // Filter nodes & links based on search & category
  const filteredData = useMemo(() => {
    let filteredNodes = nodes;

    if (filterLabel !== 'ALL') {
      filteredNodes = filteredNodes.filter(n => n.label === filterLabel);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(n => 
        n.name.toLowerCase().includes(q) || 
        (n.country && n.country.toLowerCase().includes(q)) ||
        (n.subType && n.subType.toLowerCase().includes(q))
      );
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });

    return {
      nodes: filteredNodes.map(d => ({ ...d })),
      links: filteredLinks.map(d => ({ ...d }))
    };
  }, [nodes, links, filterLabel, searchTerm]);

  // Render D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Definitions (Arrowheads and Gradients)
    const defs = svg.append('defs');

    // Arrow marker
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b');

    // Highlighted Arrow marker
    defs.append('marker')
      .attr('id', 'arrow-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#f59e0b');

    // Main Graph Container Group (for Zoom & Pan)
    const g = svg.append('g').attr('class', 'graph-root');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomTransform(event.transform);
      });

    svg.call(zoom as any);

    // D3 Force Layout
    const simulation = d3.forceSimulation(filteredData.nodes as any)
      .force('link', d3.forceLink(filteredData.links as any).id((d: any) => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-450))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    simulationRef.current = simulation;

    // Compute connected neighbors of selected node
    const connectedNodeIds = new Set<string>();
    const connectedLinkIds = new Set<string>();
    if (selectedNodeId) {
      connectedNodeIds.add(selectedNodeId);
      filteredData.links.forEach((l: any) => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        if (srcId === selectedNodeId || tgtId === selectedNodeId) {
          connectedLinkIds.add(l.id);
          connectedNodeIds.add(srcId);
          connectedNodeIds.add(tgtId);
        }
      });
    }

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll('g.link')
      .data(filteredData.links)
      .enter()
      .append('g')
      .attr('class', 'link');

    const linkLines = link.append('line')
      .attr('stroke', (d: any) => {
        const isHL = highlightedLinkIds.includes(d.id);
        const isConn = connectedLinkIds.has(d.id);
        if (isHL) return '#f59e0b';
        if (isConn) return '#38bdf8';
        if (d.type === 'TRANSFERRED_FUNDS') return '#10b981';
        if (d.type === 'OWNS') return '#6366f1';
        if (d.type === 'DIRECTOR_OF') return '#8b5cf6';
        if (d.type === 'AWARDED_CONTRACT') return '#ec4899';
        return '#475569';
      })
      .attr('stroke-width', (d: any) => {
        const isHL = highlightedLinkIds.includes(d.id);
        const isConn = connectedLinkIds.has(d.id);
        if (isHL || isConn) return 3.5;
        return 1.8;
      })
      .attr('stroke-dasharray', (d: any) => d.type === 'TRANSFERRED_FUNDS' ? '4,4' : 'none')
      .attr('marker-end', (d: any) => {
        if (highlightedLinkIds.includes(d.id) || connectedLinkIds.has(d.id)) return 'url(#arrow-highlight)';
        return 'url(#arrow)';
      })
      .attr('opacity', (d: any) => {
        if (!selectedNodeId) return 0.85;
        return connectedLinkIds.has(d.id) || highlightedLinkIds.includes(d.id) ? 1 : 0.25;
      });

    // Link Labels (Percentage / Amount / Role)
    const linkLabels = link.append('text')
      .attr('class', 'link-label')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', (d: any) => {
        if (connectedLinkIds.has(d.id) || highlightedLinkIds.includes(d.id)) return '#38bdf8';
        return '#94a3b8';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .attr('opacity', (d: any) => {
        if (!selectedNodeId) return 1;
        return connectedLinkIds.has(d.id) || highlightedLinkIds.includes(d.id) ? 1 : 0.2;
      })
      .text((d: any) => {
        if (d.percentage) return `${d.percentage}%`;
        if (d.amount) return `$${(d.amount / 1000000).toFixed(1)}M`;
        if (d.role) return d.role;
        return d.type.replace('_', ' ');
      });

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll('g.node')
      .data(filteredData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .attr('opacity', (d: any) => {
        if (!selectedNodeId) return 1;
        return connectedNodeIds.has(d.id) || highlightedNodeIds.includes(d.id) ? 1 : 0.35;
      })
      .on('click', (event, d: any) => {
        event.stopPropagation();
        onSelectNode(d);
      })
      .call(
        d3.drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer ring for Risk Score / Selection / Highlight
    node.append('circle')
      .attr('r', (d: any) => (d.isSanctioned ? 26 : 22))
      .attr('fill', 'transparent')
      .attr('stroke', (d: any) => {
        if (d.id === selectedNodeId) return '#38bdf8';
        if (connectedNodeIds.has(d.id) && selectedNodeId) return '#60a5fa';
        if (highlightedNodeIds.includes(d.id)) return '#f59e0b';
        if (d.isSanctioned) return '#ef4444';
        if (d.riskScore >= 75) return '#f97316';
        if (d.riskScore >= 45) return '#eab308';
        return 'transparent';
      })
      .attr('stroke-width', (d: any) => (d.id === selectedNodeId ? 4.5 : (connectedNodeIds.has(d.id) && selectedNodeId) || highlightedNodeIds.includes(d.id) ? 3 : 2))
      .attr('stroke-dasharray', (d: any) => (d.isSanctioned ? '3,3' : 'none'));

    // Main Node Circle
    node.append('circle')
      .attr('r', 18)
      .attr('fill', (d: any) => {
        switch (d.label) {
          case 'Person':
            return d.isSanctioned ? '#dc2626' : d.isPEP ? '#d97706' : '#2563eb';
          case 'ShellCompany':
            return '#7c3aed';
          case 'Company':
            return '#0284c7';
          case 'BankAccount':
            return '#059669';
          case 'Jurisdiction':
            return '#475569';
          case 'Contract':
            return '#db2777';
          default:
            return '#475569';
        }
      })
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .attr('class', 'shadow-md transition-transform hover:scale-110');

    // Risk Score Badge for high-risk nodes
    node.filter((d: any) => d.riskScore >= 70)
      .append('circle')
      .attr('cx', 12)
      .attr('cy', -12)
      .attr('r', 7)
      .attr('fill', '#ef4444')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 1.5);

    node.filter((d: any) => d.riskScore >= 70)
      .append('text')
      .attr('x', 12)
      .attr('y', -9)
      .attr('font-size', '7px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.riskScore);

    // Node Labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 30)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', (d: any) => (d.id === selectedNodeId ? '#38bdf8' : '#e2e8f0'))
      .text((d: any) => {
        const maxLen = 18;
        return d.name.length > maxLen ? `${d.name.substring(0, maxLen)}...` : d.name;
      });

    // Sub-label (Jurisdiction / SubType)
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 42)
      .attr('font-size', '9px')
      .attr('fill', '#94a3b8')
      .text((d: any) => d.subType || d.country || d.label);

    // Simulation Tick handler
    simulation.on('tick', () => {
      linkLines
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Background click to clear selection
    svg.on('click', () => {
      onSelectNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredData, selectedNodeId, highlightedNodeIds, highlightedLinkIds]);

  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call((d3.zoom() as any).scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(400).call((d3.zoom() as any).transform, d3.zoomIdentity);
  };

  const toggleSimulation = () => {
    if (!simulationRef.current) return;
    if (isSimulationRunning) {
      simulationRef.current.stop();
      setIsSimulationRunning(false);
    } else {
      simulationRef.current.alphaTarget(0.3).restart();
      setIsSimulationRunning(true);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0B0F1A] graph-dot-grid overflow-hidden select-none">
      
      {/* Top Filter & Search Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-2xl bg-[#0F172A]/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 shadow-xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search entities, countries, PEPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B0F1A] text-slate-200 text-xs pl-9 pr-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 font-mono"
          />
        </div>

        {/* Label Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All', icon: Layers },
            { id: 'Person', label: 'People', icon: User },
            { id: 'ShellCompany', label: 'Shell Co.', icon: AlertOctagon },
            { id: 'Company', label: 'Companies', icon: Building2 },
            { id: 'BankAccount', label: 'Banks', icon: Coins },
            { id: 'Contract', label: 'Contracts', icon: FileText },
            { id: 'Jurisdiction', label: 'Offshore', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterLabel(tab.id)}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-colors ${
                  filterLabel === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Rendering Stage */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-1 bg-[#0F172A]/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-xl">
        <button
          onClick={() => handleZoom(1.3)}
          title="Zoom In"
          className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.7)}
          title="Zoom Out"
          className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={toggleSimulation}
          title={isSimulationRunning ? 'Pause Physics' : 'Resume Physics'}
          className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isSimulationRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Graph Legend & Status */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:flex items-center gap-3 bg-[#0F172A]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 shadow-lg font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>(:Person)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>(:ShellCompany)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>(:Company)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>(:BankAccount)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>(:Contract)</span>
        </div>
      </div>

    </div>
  );
};
