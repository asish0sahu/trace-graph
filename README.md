# TraceGraph — Beneficial Ownership & Sanctions Blast Radius Graph Intelligence

> Built for the Wexa AI Candidate Assignment. Backed by **CognoDB** (openCypher over Bolt protocol 5.0–5.4 using the official `neo4j-driver`).

---

## 1. Why a Graph Database? (Relational vs. Graph Comparison)

In financial crime investigation, beneficial ownership tracing, and sanctions evasion intelligence, **the critical answers lie in the topology of the connections, not isolated rows in a table**.

### Relational Bottleneck: The Cartesian CTE Explosion
In a relational database (PostgreSQL/MySQL), discovering who controls an operating defense contractor (e.g. `Skyline Aerospace Ltd`) through a web of offshore shell corporations (Panama $\rightarrow$ BVI $\rightarrow$ Cyprus) requires executing recursive Common Table Expressions (`WITH RECURSIVE`).
- Each traversal hop requires joining an intermediary adjacency table and performing indexed B-tree lookups ($O(\log N)$).
- As hop depth increases (3–6 hops deep), SQL queries encounter exponential Cartesian product explosions, high memory overhead, and severe query degradation.
- Detecting **circular money laundering loops** (e.g. Geneva $\rightarrow$ Nicosia $\rightarrow$ Crypto Mixer $\rightarrow$ BVI $\rightarrow$ Geneva) in SQL requires complex nested self-joins and stateful cycle tracking.

### Graph Database Solution: Index-Free Adjacency
In CognoDB (speaking openCypher):
- **Index-Free Adjacency ($O(1)$)**: Each node maintains direct physical memory pointers to its adjacent relationships. Traversal speed is proportional to the size of the subgraph being traversed, independent of overall database size.
- **Variable-Length Path Queries**: openCypher's `[:OWNS*1..6]` or `[:TRANSFERRED_FUNDS*3..5]` syntax natively traverses arbitrary depths without hardcoding join chains.
- **Mathematical Path Reductions**: Easily calculate cumulative equity percentages across multi-tier holding structures using `reduce()`.
- **Native Shortest-Path Algorithms**: Instantaneous bidirectional breadth-first search (`shortestPath((a)-[*]-(b))`) to identify concealment chains between sanctioned individuals and government tenders.

---

## 2. Graph Data Model & Schema Diagram

```
 [Person] (Sanctioned PEP / Proxies)
    │
    ├── [:FAMILY_OF] ──► [Person] (Elena Voronina / Proxy)
    │                       │
    ├── [:BENEFICIARY_OF] ──┴──► [ShellCompany] (Apex Horizon Trust - Panama)
    │                               │
    │                        [:OWNS 100%]
    │                               ▼
    │                           [ShellCompany] (Zephyr Overseas Ltd - BVI)
    │                               │
    │                        [:OWNS 85%]
    │                               ▼
    │                           [ShellCompany] (Blackwood Nominees Ltd - Cyprus)
    │                               │
    │                        [:OWNS 42.5%]
    │                               ▼
    │                           [Company] (Skyline Aerospace Ltd - UK)
    │                               │
    │                    [:AWARDED_CONTRACT]
    │                               ▼
    │                           [Contract] (NATO Logistics Subcontract - $120M)
    │
    └── [:DIRECTOR_OF] (Dmitri Kozlov nominee network across 4 offshore entities)

 [BankAccount] ──[:TRANSFERRED_FUNDS]──► [BankAccount] (Circular Layering Ring)
```

### Labeled Nodes
- `:Person` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `isSanctioned`, `isPEP`, `citizenship`.
- `:ShellCompany` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `registrationNumber`, `incorporationDate`.
- `:Company` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `registrationNumber`, `revenue`.
- `:BankAccount` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `balance`, `iban`.
- `:Contract` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `contractValue`, `tenderId`.
- `:Jurisdiction` — Attributes: `id`, `name`, `subType`, `country`, `riskScore`, `secrecyIndex`.

### Typed Directed Relationships
- `[:OWNS { percentage: float, shares: int }]`
- `[:DIRECTOR_OF { role: string }]`
- `[:BENEFICIARY_OF { percentage: float, role: string }]`
- `[:TRANSFERRED_FUNDS { amount: float, currency: string, date: string, refCode: string }]`
- `[:AWARDED_CONTRACT { amount: float, date: string }]`
- `[:LOCATED_IN]`
- `[:FAMILY_OF { role: string }]`

---

## 3. Key openCypher Queries

### Query 1: Multi-Hop Ultimate Beneficial Ownership (UBO) Calculation
*Traverses variable-length ownership paths (4-6 hops) across offshore entities and calculates cumulative control ($>20\%$ threshold).*
```cypher
MATCH path = (p:Person)-[:BENEFICIARY_OF|OWNS*1..6]->(target:Company {id: $companyId})
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
ORDER BY effectiveOwnershipPercent DESC;
```

### Query 2: Sanctions Blast Radius & Contagion Vector
*Calculates dynamic risk shockwaves radiating up to 3 hops from sanctioned individuals.*
```cypher
MATCH (sanctioned:Person {isSanctioned: true})
MATCH path = (sanctioned)-[r:FAMILY_OF|BENEFICIARY_OF|OWNS|DIRECTOR_OF|AWARDED_CONTRACT*1..3]-(affected)
WHERE affected <> sanctioned
WITH affected, min(length(path)) AS shortestDistance, collect(DISTINCT path)[0] AS samplePath
RETURN labels(affected)[0] AS entityType,
       affected.name AS entityName,
       affected.riskScore AS riskScore,
       shortestDistance AS hopsFromSanctionedSource,
       [n IN nodes(samplePath) | n.name] AS transmissionVector
ORDER BY shortestDistance ASC, affected.riskScore DESC;
```

### Query 3: Circular Laundering & Smurfing Loop Detection
*Identifies cyclic fund transfer circuits where capital returns to origin through privacy gateways.*
```cypher
MATCH path = (origin:BankAccount)-[t1:TRANSFERRED_FUNDS]->(b1:BankAccount)-[t2:TRANSFERRED_FUNDS]->(b2:BankAccount)-[t3:TRANSFERRED_FUNDS]->(b3:BankAccount)-[t4:TRANSFERRED_FUNDS]->(origin)
WHERE origin <> b1 AND b1 <> b2 AND b2 <> b3
RETURN origin.name AS circuitOrigin,
       [n IN nodes(path) | n.name] AS launderingLoop,
       t1.amount AS leg1Amount,
       t2.amount AS leg2Amount,
       t3.amount AS leg3Amount,
       t4.amount AS leg4Amount,
       (t1.amount + t2.amount + t3.amount + t4.amount) AS totalLaunderedVolume;
```

### Query 4: Shortest Concealment Path
```cypher
MATCH (start:Person {id: $sourceId}), (target:Contract {id: $targetId})
MATCH path = shortestPath((start)-[*..8]-(target))
RETURN [n IN nodes(path) | {name: n.name, label: labels(n)[0]}] AS pathNodes,
       length(path) AS totalHops;
```

---

## 4. Connecting to CognoDB Cloud

1. Create a free instance at **https://console.cognodb.com/signup**.
2. Set your environment variables in `.env`:
```env
COGNODB_URI="bolt+s://<instance-id>.databases.cognodb.cloud"
COGNODB_USER="cognodb"
COGNODB_PASSWORD="<your-generated-password>"
```
3. Run the seed script via the UI button **"Seed Data"** or through the API:
```bash
POST /api/seed
```
4. Start the application:
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.
