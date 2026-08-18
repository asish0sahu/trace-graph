import { PredefinedScenario } from '../src/types';

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  {
    id: 'ubo-multihop',
    title: 'Ultimate Beneficial Ownership (UBO) Multi-Hop Traversal',
    category: 'UBO Analysis',
    badge: 'Multi-Hop (4-6 Hops)',
    description: 'Traverses variable-length ownership paths across offshore jurisdictions (Panama -> BVI -> Cyprus -> UK) and mathematically computes cumulative effective equity ownership to uncover hidden controlling owners (>25%).',
    cypher: `MATCH path = (p:Person)-[:BENEFICIARY_OF|OWNS*1..6]->(target:Company {id: $companyId})
WITH p, target, path,
     reduce(accum = 1.0, r IN relationships(path) | 
       accum * (coalesce(r.percentage, 100.0) / 100.0)
     ) AS effectiveEquity
WHERE effectiveEquity >= $minThreshold
RETURN p.name AS ultimateBeneficiary,
       p.isSanctioned AS sanctioned,
       p.isPEP AS politicallyExposed,
       target.name AS targetCompany,
       round(effectiveEquity * 1000) / 10.0 AS effectiveOwnershipPercent,
       [n IN nodes(path) | n.name] AS ownershipChain,
       length(path) AS concealmentHops
ORDER BY effectiveOwnershipPercent DESC;`,
    params: {
      companyId: 'comp_skyline_aerospace',
      minThreshold: 0.20
    },
    whyGraphMatters: 'Relational databases require recursive Common Table Expressions (WITH RECURSIVE) with expensive self-joins on intermediate adjacency tables. As path depth grows, SQL joins trigger combinatorial explosion. In openCypher graph databases, pointer-chasing index-free adjacency traverses each hop in O(1) time.'
  },
  {
    id: 'sanction-blast-radius',
    title: 'Sanctions Blast Radius & Proximity Cascade',
    category: 'Sanction Blast Radius',
    badge: 'Blast Radius (1-3 Hops)',
    description: 'Calculates the cascading risk radius originating from sanctioned individuals (e.g. Viktor Voronin) across corporate ownership, directorships, and multi-million dollar public tenders.',
    cypher: `MATCH (sanctioned:Person {isSanctioned: true})
MATCH path = (sanctioned)-[r:FAMILY_OF|BENEFICIARY_OF|OWNS|DIRECTOR_OF|AWARDED_CONTRACT*1..3]-(affected)
WHERE affected <> sanctioned
WITH affected, min(length(path)) AS shortestDistance, collect(DISTINCT path)[0] AS samplePath
RETURN labels(affected)[0] AS entityType,
       affected.name AS entityName,
       affected.riskScore AS riskScore,
       shortestDistance AS hopsFromSanctionedSource,
       [n IN nodes(samplePath) | n.name] AS transmissionVector
ORDER BY shortestDistance ASC, affected.riskScore DESC;`,
    params: {},
    whyGraphMatters: 'Evaluating supply chain blast radius in SQL requires multi-table Cartesian products across Persons, Roles, Holdings, and Contracts. openCypher pattern matching allows dynamic variable-depth graph expansion without specifying schemas upfront.'
  },
  {
    id: 'circular-laundering',
    title: 'Circular Layering & Smurfing Loop Detection',
    category: 'Fraud & Smurfing',
    badge: 'Cycle Detection (Hamiltonian Loop)',
    description: 'Detects circular transaction topologies where high-risk funds originate from Geneva, pass through Cyprus, an OFAC-flagged crypto mixer, and the BVI, returning to the origin to obfuscate provenance.',
    cypher: `MATCH path = (origin:BankAccount)-[t1:TRANSFERRED_FUNDS]->(b1:BankAccount)-[t2:TRANSFERRED_FUNDS]->(b2:BankAccount)-[t3:TRANSFERRED_FUNDS]->(b3:BankAccount)-[t4:TRANSFERRED_FUNDS]->(origin)
WHERE origin <> b1 AND b1 <> b2 AND b2 <> b3
RETURN origin.name AS circuitOrigin,
       [n IN nodes(path) | n.name] AS launderingLoop,
       t1.amount AS leg1Amount,
       t2.amount AS leg2Amount,
       t3.amount AS leg3Amount,
       t4.amount AS leg4Amount,
       (t1.amount + t2.amount + t3.amount + t4.amount) AS totalLaunderedVolume
LIMIT 5;`,
    params: {},
    whyGraphMatters: 'Finding closed cycles in relational tables requires N-way self joins and recursive loop detection logic that easily stalls database engines. In graph databases, cycle detection is a native path-traversal operation.'
  },
  {
    id: 'nominee-clusters',
    title: 'Nominee Director & Corporate Shadow Networks',
    category: 'Corporate Governance',
    badge: 'Degree Centrality & Hubs',
    description: 'Identifies high-density nominee director nodes (e.g. Dmitri Kozlov) serving as puppet directors across offshore secrecy jurisdictions to mask genuine beneficial controllers.',
    cypher: `MATCH (dir:Person)-[:DIRECTOR_OF]->(target)
WITH dir, count(target) AS directorshipCount, collect(target.name) AS controlledEntities
WHERE directorshipCount >= $minEntities
MATCH (dir)-[:DIRECTOR_OF]->(t)-[:LOCATED_IN]->(j:Jurisdiction)
RETURN dir.name AS nomineeDirector,
       dir.country AS residentCountry,
       directorshipCount,
       controlledEntities,
       collect(DISTINCT j.name) AS jurisdictionFootprint
ORDER BY directorshipCount DESC;`,
    params: {
      minEntities: 2
    },
    whyGraphMatters: 'Finding star-topology hubs and high degree-centrality actors across dynamic relationships is instantaneous in graph databases using direct edge pointer counting.'
  },
  {
    id: 'shortest-concealment-path',
    title: 'Shortest Concealment Path to Defense Tenders',
    category: 'Pathfinding',
    badge: 'Dijkstra / Shortest Path',
    description: 'Calculates the exact shortest concealment route connecting a sanctioned oligarch to a $120M NATO defense supply contract.',
    cypher: `MATCH (start:Person {id: $sourceId}), (target:Contract {id: $targetId})
MATCH path = shortestPath((start)-[*..8]-(target))
RETURN [n IN nodes(path) | {id: n.id, name: n.name, label: labels(n)[0], riskScore: n.riskScore}] AS pathNodes,
       [r IN relationships(path) | {type: type(r), percentage: r.percentage, amount: r.amount}] AS pathRelationships,
       length(path) AS totalHops;`,
    params: {
      sourceId: 'person_viktor_voronin',
      targetId: 'contract_nato_logistics'
    },
    whyGraphMatters: 'Calculating shortest path across arbitrary heterogenous tables in SQL is notoriously difficult and computationally prohibitive. Graph engines execute shortestPath natively via bidirectional breadth-first search.'
  }
];
