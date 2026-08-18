export interface GraphNode {
  id: string;
  name: string;
  label: 'Company' | 'ShellCompany' | 'Person' | 'Jurisdiction' | 'BankAccount' | 'Contract';
  subType?: string;
  country?: string;
  riskScore: number; // 0 - 100
  isSanctioned?: boolean;
  isPEP?: boolean;
  registrationNumber?: string;
  incorporationDate?: string;
  secrecyIndex?: number;
  balance?: number;
  contractValue?: number;
  properties?: Record<string, any>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'OWNS' | 'DIRECTOR_OF' | 'BENEFICIARY_OF' | 'TRANSFERRED_FUNDS' | 'LOCATED_IN' | 'AWARDED_CONTRACT' | 'INTERMEDIARY_FOR' | 'FAMILY_OF';
  percentage?: number;
  amount?: number;
  currency?: string;
  role?: string;
  date?: string;
  properties?: Record<string, any>;
}

export interface CypherQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  nodes: GraphNode[];
  links: GraphLink[];
  executionTimeMs: number;
  summary: {
    nodesReturned: number;
    relationshipsReturned: number;
    query: string;
    params?: Record<string, any>;
    sourceEngine: 'CognoDB Bolt Cloud' | 'Local Graph Engine';
  };
}

export interface DatabaseStatus {
  connected: boolean;
  engine: 'CognoDB Bolt Cloud' | 'Local Graph Engine';
  uri: string;
  user: string;
  nodeCount: number;
  relationshipCount: number;
  latencyMs: number;
  labels: { label: string; count: number }[];
  relationshipTypes: { type: string; count: number }[];
  error?: string | null;
}

export interface PredefinedScenario {
  id: string;
  title: string;
  category: 'UBO Analysis' | 'Sanction Blast Radius' | 'Fraud & Smurfing' | 'Corporate Governance' | 'Pathfinding';
  description: string;
  cypher: string;
  params: Record<string, any>;
  whyGraphMatters: string;
  badge: string;
}
