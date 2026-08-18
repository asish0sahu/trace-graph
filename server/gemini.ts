import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client', e);
    }
  }
  return aiClient;
}

const GRAPH_SCHEMA_PROMPT = `
You are an expert Graph Database Architect and openCypher specialist working with CognoDB / Neo4j.
Our graph database schema contains the following entity labels and properties:
- (:Person {id, name, subType, country, riskScore, isSanctioned, isPEP, citizenship})
- (:Company {id, name, subType, country, riskScore, registrationNumber, revenue})
- (:ShellCompany {id, name, subType, country, riskScore, registrationNumber, incorporationDate})
- (:Jurisdiction {id, name, subType, country, riskScore, secrecyIndex})
- (:BankAccount {id, name, subType, country, riskScore, balance, iban})
- (:Contract {id, name, subType, country, riskScore, contractValue})

Relationships:
- [:OWNS {percentage, shares}]
- [:DIRECTOR_OF {role}]
- [:BENEFICIARY_OF {percentage, role}]
- [:TRANSFERRED_FUNDS {amount, currency, date, refCode, flagged}]
- [:LOCATED_IN]
- [:AWARDED_CONTRACT {amount, date}]
- [:INTERMEDIARY_FOR {role}]
- [:FAMILY_OF {role}]

When the user asks a question in natural language:
1. Translate it into an optimized openCypher query compatible with CognoDB / Neo4j Bolt.
2. Return a JSON object with:
   - "cypher": the valid parameterised openCypher query string
   - "explanation": why this query works and how graph traversal handles it
   - "riskFocus": brief description of AML / Sanctions / Fraud risk
`;

export async function naturalLanguageToCypher(userPrompt: string): Promise<{ cypher: string; explanation: string; riskFocus: string }> {
  const client = getAIClient();

  if (!client) {
    // Fallback heuristic translation when GEMINI_API_KEY is not supplied
    const lower = userPrompt.toLowerCase();
    if (lower.includes('sanction') || lower.includes('pep') || lower.includes('viktor')) {
      return {
        cypher: `MATCH path = (p:Person {isSanctioned: true})-[*1..3]-(target)
RETURN p.name AS sanctionedEntity, labels(target)[0] AS targetType, target.name AS targetName, target.riskScore AS riskScore, length(path) AS hops
ORDER BY riskScore DESC LIMIT 20;`,
        explanation: 'Finds all entities within a 3-hop radius of sanctioned individuals to reveal hidden exposure and blast radius.',
        riskFocus: 'Sanctions Evasion & Asset Concealment'
      };
    } else if (lower.includes('ubo') || lower.includes('own') || lower.includes('beneficiary')) {
      return {
        cypher: `MATCH path = (p:Person)-[:BENEFICIARY_OF|OWNS*1..5]->(c:Company)
WITH p, c, path, reduce(acc = 1.0, r IN relationships(path) | acc * (coalesce(r.percentage, 100.0) / 100.0)) AS effectiveShare
WHERE effectiveShare >= 0.25
RETURN p.name AS ultimateOwner, c.name AS company, effectiveShare * 100 AS ownershipPercent, length(path) AS hops
ORDER BY ownershipPercent DESC;`,
        explanation: 'Traverses multi-hop corporate holding chains to calculate effective Ultimate Beneficial Ownership (>25%).',
        riskFocus: 'Ultimate Beneficial Ownership (UBO) Compliance'
      };
    } else if (lower.includes('transfer') || lower.includes('money') || lower.includes('bank') || lower.includes('smurf')) {
      return {
        cypher: `MATCH (from:BankAccount)-[t:TRANSFERRED_FUNDS]->(to:BankAccount)
RETURN from.name AS sourceAccount, to.name AS destinationAccount, t.amount AS amount, t.currency AS currency, t.date AS transferDate
ORDER BY t.amount DESC LIMIT 15;`,
        explanation: 'Queries fund transfers between bank accounts, flagging high-volume flow vectors and cross-border layering.',
        riskFocus: 'AML Wire Monitoring & Layering Analysis'
      };
    }

    return {
      cypher: `MATCH (n) OPTIONAL MATCH (n)-[r]->(m)
RETURN labels(n)[0] AS nodeType, n.name AS name, n.riskScore AS riskScore, type(r) AS relType, m.name AS connectedTo
LIMIT 25;`,
      explanation: 'General graph exploration matching entity nodes, relationship links, and associated risk scores.',
      riskFocus: 'Graph Overview & Anomaly Discovery'
    };
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${GRAPH_SCHEMA_PROMPT}\n\nUser Question: "${userPrompt}"\n\nGenerate the JSON output.` }]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return {
      cypher: parsed.cypher || `MATCH (n) RETURN n LIMIT 25;`,
      explanation: parsed.explanation || 'openCypher generated query',
      riskFocus: parsed.riskFocus || 'Risk Assessment'
    };
  } catch (error: any) {
    console.error('Gemini query translation error:', error);
    return {
      cypher: `MATCH (n)-[r]->(m) RETURN n.name AS source, type(r) AS relationship, m.name AS target LIMIT 20;`,
      explanation: 'Fallback query generated due to AI service timeout.',
      riskFocus: 'Graph Intelligence'
    };
  }
}
