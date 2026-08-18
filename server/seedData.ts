import { GraphNode, GraphLink } from '../src/types';

export const INITIAL_NODES: GraphNode[] = [
  // --- Ultimate Beneficiary / Oligarch / PEPs ---
  {
    id: 'person_viktor_voronin',
    name: 'Viktor Voronin',
    label: 'Person',
    subType: 'Sanctioned PEP',
    country: 'Russia',
    riskScore: 98,
    isSanctioned: true,
    isPEP: true,
    properties: {
      citizenship: 'Russian Federation, Cyprus (Gold Passport)',
      sanctionReason: 'EU & US Sanctions List - Defense Sector Ties & Asset Concealment',
      netWorthEst: '$1.4B',
      knownAliases: 'V. V. Voronin, Victor Voronine'
    }
  },
  {
    id: 'person_elena_voronina',
    name: 'Elena Voronina',
    label: 'Person',
    subType: 'Family Associate / Proxy',
    country: 'Cyprus',
    riskScore: 84,
    isSanctioned: false,
    isPEP: true,
    properties: {
      relationToPEP: 'Spouse of Viktor Voronin',
      occupation: 'Art Foundation Trustee & Holding Director',
      residence: 'Limassol, Cyprus'
    }
  },
  {
    id: 'person_dmitri_kozlov',
    name: 'Dmitri Kozlov',
    label: 'Person',
    subType: 'Nominee Director',
    country: 'Cyprus',
    riskScore: 89,
    isSanctioned: false,
    isPEP: false,
    properties: {
      registeredDirectorships: 14,
      firm: 'Nicosia Corporate Services Ltd',
      flaggedIntermediary: true
    }
  },
  {
    id: 'person_alexei_morozov',
    name: 'Alexei Morozov',
    label: 'Person',
    subType: 'Shadow Shareholder',
    country: 'Switzerland',
    riskScore: 78,
    isSanctioned: false,
    isPEP: false,
    properties: {
      residence: 'Geneva, Switzerland',
      occupation: 'Wealth Management Consultant'
    }
  },
  {
    id: 'person_marcus_sterling',
    name: 'Marcus Sterling',
    label: 'Person',
    subType: 'Clean Executive',
    country: 'United Kingdom',
    riskScore: 12,
    isSanctioned: false,
    isPEP: false,
    properties: {
      role: 'CEO of Skyline Aerospace Ltd',
      residence: 'London, UK'
    }
  },
  {
    id: 'person_sarah_jenkins',
    name: 'Sarah Jenkins',
    label: 'Person',
    subType: 'Procurement Officer',
    country: 'United States',
    riskScore: 15,
    isSanctioned: false,
    isPEP: false,
    properties: {
      role: 'Government Tender Committee Chair',
      jurisdiction: 'Washington D.C.'
    }
  },
  {
    id: 'person_chen_wei',
    name: 'Chen Wei',
    label: 'Person',
    subType: 'Logistics Facilitator',
    country: 'Hong Kong',
    riskScore: 65,
    isSanctioned: false,
    isPEP: false,
    properties: {
      residence: 'Hong Kong SAR',
      business: 'Maritime Freight Broker'
    }
  },

  // --- Shell Companies & Offshore Vehicles (BVI, Panama, Cyprus, Cayman) ---
  {
    id: 'shell_apex_horizon_trust',
    name: 'Apex Horizon Trust',
    label: 'ShellCompany',
    subType: 'Discretionary Trust',
    country: 'Panama',
    riskScore: 92,
    registrationNumber: 'PA-TRUST-88192',
    incorporationDate: '2018-04-12',
    properties: {
      trustee: 'Mossack Nominees Corp',
      secrecyLevel: 'High',
      bearerShares: true
    }
  },
  {
    id: 'shell_zephyr_overseas',
    name: 'Zephyr Overseas Ltd',
    label: 'ShellCompany',
    subType: 'Offshore IBC',
    country: 'British Virgin Islands',
    riskScore: 90,
    registrationNumber: 'BVI-IBC-449102',
    incorporationDate: '2019-09-24',
    properties: {
      registeredAgent: 'Tortola Trust Management',
      nomineeShareholder: true
    }
  },
  {
    id: 'shell_blackwood_nominees',
    name: 'Blackwood Nominees Ltd',
    label: 'ShellCompany',
    subType: 'Holding SPV',
    country: 'Cyprus',
    riskScore: 85,
    registrationNumber: 'HE-391028',
    incorporationDate: '2020-01-15',
    properties: {
      registeredAddress: 'Arch. Makarios III Ave, Nicosia',
      auditor: 'Kozlov & Partners'
    }
  },
  {
    id: 'shell_silverline_offshore',
    name: 'Silverline Offshore Corp',
    label: 'ShellCompany',
    subType: 'Exempt Company',
    country: 'Cayman Islands',
    riskScore: 88,
    registrationNumber: 'KY-EX-77291',
    incorporationDate: '2021-03-08',
    properties: {
      taxStatus: 'Zero-rated Exempt',
      managingDirector: 'Dmitri Kozlov'
    }
  },
  {
    id: 'shell_titanium_trading',
    name: 'Titanium Trading Ltd',
    label: 'ShellCompany',
    subType: 'Trade Intermediary',
    country: 'Belize',
    riskScore: 79,
    registrationNumber: 'BZ-CORP-3310',
    incorporationDate: '2021-11-20',
    properties: {
      purpose: 'Specialty metals and dual-use component brokering'
    }
  },
  {
    id: 'shell_golden_oak_holdings',
    name: 'Golden Oak Holdings',
    label: 'ShellCompany',
    subType: 'Asset Holding Vehicle',
    country: 'Seychelles',
    riskScore: 76,
    registrationNumber: 'SC-IBC-9021',
    incorporationDate: '2022-02-14',
    properties: {
      beneficialInterest: 'Private Portfolio'
    }
  },

  // --- Operating Commercial Companies ---
  {
    id: 'comp_skyline_aerospace',
    name: 'Skyline Aerospace Ltd',
    label: 'Company',
    subType: 'Aerospace & Defense Contractor',
    country: 'United Kingdom',
    riskScore: 68,
    registrationNumber: 'UK-08492019',
    incorporationDate: '2015-06-18',
    properties: {
      revenue: '$280M/year',
      employees: 640,
      complianceStatus: 'Under Sanction Scrutiny'
    }
  },
  {
    id: 'comp_vanguard_logistics',
    name: 'Vanguard Logistics AG',
    label: 'Company',
    subType: 'Global Freight Forwarder',
    country: 'Germany',
    riskScore: 48,
    registrationNumber: 'DE-HRB-77291',
    incorporationDate: '2012-09-01',
    properties: {
      fleetSize: '45 Vessels, 120 Trucks',
      headquarters: 'Hamburg, Germany'
    }
  },
  {
    id: 'comp_global_energy',
    name: 'Global Energy Holdings SE',
    label: 'Company',
    subType: 'Energy Conglomerate',
    country: 'Germany',
    riskScore: 54,
    registrationNumber: 'DE-HRB-99120',
    incorporationDate: '2010-04-10',
    properties: {
      marketCap: '$4.2B',
      exchange: 'Frankfurt Stock Exchange'
    }
  },
  {
    id: 'comp_nordic_maritime',
    name: 'Nordic Maritime Inc',
    label: 'Company',
    subType: 'Bulk Shipping Operator',
    country: 'Liberia',
    riskScore: 62,
    registrationNumber: 'LR-MAR-5510',
    incorporationDate: '2017-08-22',
    properties: {
      flagOfConvenience: 'Liberia',
      operatingOffice: 'Athens, Greece'
    }
  },
  {
    id: 'comp_helios_clean_energy',
    name: 'Helios Clean Energy LLC',
    label: 'Company',
    subType: 'Renewable Power Developer',
    country: 'United States',
    riskScore: 18,
    registrationNumber: 'US-DEL-449102',
    incorporationDate: '2020-05-19',
    properties: {
      gridCapacity: '450 MW',
      headquarters: 'Austin, Texas'
    }
  },

  // --- High-Value Contracts & Government Tenders ---
  {
    id: 'contract_nato_logistics',
    name: 'NATO Logistics Subcontract ($120M)',
    label: 'Contract',
    subType: 'Defense & Strategic Infrastructure',
    country: 'United Kingdom',
    riskScore: 82,
    contractValue: 120000000,
    properties: {
      awardingAgency: 'Ministry of Defence & Alliance Logistics Agency',
      tenderId: 'TND-2024-MOD-8819',
      signedDate: '2024-02-10',
      criticality: 'High - National Defense Critical'
    }
  },
  {
    id: 'contract_eu_grid',
    name: 'EU Grid Modernization Tender ($85M)',
    label: 'Contract',
    subType: 'Critical Energy Infrastructure',
    country: 'Germany',
    riskScore: 64,
    contractValue: 85000000,
    properties: {
      awardingAgency: 'European Infrastructure Bank & Federal Grid',
      tenderId: 'EU-TEN-2023-902',
      signedDate: '2023-10-15'
    }
  },
  {
    id: 'contract_port_terminal',
    name: 'Offshore Port Terminal Lease ($45M)',
    label: 'Contract',
    subType: 'Maritime Terminal Concession',
    country: 'Greece',
    riskScore: 58,
    contractValue: 45000000,
    properties: {
      concessionTerm: '25 Years',
      tenderId: 'PIR-2022-MAR-11'
    }
  },

  // --- Bank Accounts & Crypto Wallets (Smurfing & Layering) ---
  {
    id: 'bank_geneva_8821',
    name: 'Geneva Private Bank #8821',
    label: 'BankAccount',
    subType: 'Numbered Private Account',
    country: 'Switzerland',
    riskScore: 88,
    balance: 42500000,
    properties: {
      iban: 'CH93 0078 8000 0088 2190 2',
      beneficialOwner: 'Viktor Voronin'
    }
  },
  {
    id: 'bank_nicosia_4902',
    name: 'Nicosia Private Bank #4902',
    label: 'BankAccount',
    subType: 'Corporate Escrow Account',
    country: 'Cyprus',
    riskScore: 82,
    balance: 18200000,
    properties: {
      iban: 'CY21 0020 0192 0000 4902 1182',
      signatory: 'Dmitri Kozlov'
    }
  },
  {
    id: 'bank_bvi_1102',
    name: 'Tortola Escrow Account #1102',
    label: 'BankAccount',
    subType: 'Trust Multi-Currency Account',
    country: 'British Virgin Islands',
    riskScore: 78,
    balance: 14500000,
    properties: {
      bank: 'Caribbean First National Trust',
      signatory: 'Zephyr Overseas Ltd'
    }
  },
  {
    id: 'bank_mixer_crypto',
    name: 'Tornado / Railgun Mixer Proxy (0x4f3a...)',
    label: 'BankAccount',
    subType: 'Smart Contract Escrow / Mixer',
    country: 'Decentralized',
    riskScore: 99,
    balance: 9800000,
    properties: {
      walletAddress: '0x4f3a9928b12ce78a83d91b4028fae929b01938a1',
      anonymizedVolume: '$38M USD equivalent in USDT/ETH',
      complianceFlag: 'OFAC Sanctioned Smart Contract'
    }
  },
  {
    id: 'bank_deutsche_9031',
    name: 'Deutsche Handelsbank Account #9031',
    label: 'BankAccount',
    subType: 'Commercial Operating Account',
    country: 'Germany',
    riskScore: 25,
    balance: 34000000,
    properties: {
      iban: 'DE89 5007 0010 0903 1882 00',
      accountHolder: 'Global Energy Holdings SE'
    }
  },
  {
    id: 'bank_london_3310',
    name: 'Barclays Defense Escrow #3310',
    label: 'BankAccount',
    subType: 'Project Account',
    country: 'United Kingdom',
    riskScore: 30,
    balance: 62000000,
    properties: {
      iban: 'GB29 BUKB 2020 1533 1092 11',
      accountHolder: 'Skyline Aerospace Ltd'
    }
  },

  // --- Jurisdictions ---
  {
    id: 'jurisdiction_bvi',
    name: 'British Virgin Islands',
    label: 'Jurisdiction',
    subType: 'Offshore Secrecy Haven',
    country: 'British Virgin Islands',
    riskScore: 85,
    secrecyIndex: 82,
    properties: {
      fatfStatus: 'Enhanced Monitoring',
      corporateTaxRate: '0%',
      publicBeneficialOwnershipRegister: false
    }
  },
  {
    id: 'jurisdiction_cyprus',
    name: 'Cyprus',
    label: 'Jurisdiction',
    subType: 'EU Low-Tax Hub',
    country: 'Cyprus',
    riskScore: 68,
    secrecyIndex: 65,
    properties: {
      corporateTaxRate: '12.5%',
      goldenVisaHistoricalCount: 6779
    }
  },
  {
    id: 'jurisdiction_panama',
    name: 'Panama',
    label: 'Jurisdiction',
    subType: 'Secrecy Jurisdiction',
    country: 'Panama',
    riskScore: 88,
    secrecyIndex: 86,
    properties: {
      fatfStatus: 'Grey List Listed',
      corporateTaxRate: '0% on Foreign Income'
    }
  },
  {
    id: 'jurisdiction_cayman',
    name: 'Cayman Islands',
    label: 'Jurisdiction',
    subType: 'Offshore Financial Center',
    country: 'Cayman Islands',
    riskScore: 72,
    secrecyIndex: 78,
    properties: {
      corporateTaxRate: '0%'
    }
  },
  {
    id: 'jurisdiction_uk',
    name: 'United Kingdom',
    label: 'Jurisdiction',
    subType: 'Major Financial Center',
    country: 'United Kingdom',
    riskScore: 22,
    secrecyIndex: 35,
    properties: {
      pscRegister: true,
      corporateTaxRate: '25%'
    }
  },
  {
    id: 'jurisdiction_germany',
    name: 'Germany',
    label: 'Jurisdiction',
    subType: 'Regulated Onshore Market',
    country: 'Germany',
    riskScore: 18,
    secrecyIndex: 28,
    properties: {
      transparenzregister: true,
      euMember: true
    }
  }
];

export const INITIAL_LINKS: GraphLink[] = [
  // --- Ultimate Beneficial Ownership Chain (Multi-hop: Viktor -> Elena -> Apex Trust -> Zephyr -> Blackwood -> Skyline Aerospace) ---
  {
    id: 'rel_fam_viktor_elena',
    source: 'person_viktor_voronin',
    target: 'person_elena_voronina',
    type: 'FAMILY_OF',
    role: 'Spouse & Asset Proxy',
    properties: { legalStatus: 'Married', powerOfAttorney: true }
  },
  {
    id: 'rel_elena_apex_trust',
    source: 'person_elena_voronina',
    target: 'shell_apex_horizon_trust',
    type: 'BENEFICIARY_OF',
    percentage: 100,
    role: 'Primary Settlor & Sole Beneficiary',
    date: '2018-04-15'
  },
  {
    id: 'rel_viktor_apex_trust',
    source: 'person_viktor_voronin',
    target: 'shell_apex_horizon_trust',
    type: 'BENEFICIARY_OF',
    percentage: 100,
    role: 'Discretionary Protector (Shadow)',
    date: '2018-04-15'
  },
  {
    id: 'rel_apex_zephyr',
    source: 'shell_apex_horizon_trust',
    target: 'shell_zephyr_overseas',
    type: 'OWNS',
    percentage: 100,
    properties: { shares: 50000, shareClass: 'Voting Bearer' }
  },
  {
    id: 'rel_zephyr_blackwood',
    source: 'shell_zephyr_overseas',
    target: 'shell_blackwood_nominees',
    type: 'OWNS',
    percentage: 85,
    properties: { shares: 85000, votingPower: '85%' }
  },
  {
    id: 'rel_morozov_blackwood',
    source: 'person_alexei_morozov',
    target: 'shell_blackwood_nominees',
    type: 'OWNS',
    percentage: 15,
    properties: { shares: 15000 }
  },
  {
    id: 'rel_blackwood_skyline',
    source: 'shell_blackwood_nominees',
    target: 'comp_skyline_aerospace',
    type: 'OWNS',
    percentage: 42.5,
    properties: { shares: 425000, controlThreshold: 'Major Controlling Stake (>25% UBO)' }
  },
  {
    id: 'rel_sterling_skyline',
    source: 'person_marcus_sterling',
    target: 'comp_skyline_aerospace',
    type: 'OWNS',
    percentage: 28.0,
    properties: { shares: 280000 }
  },

  // --- Second Ownership Arm: Zephyr -> Silverline -> Vanguard Logistics & Global Energy ---
  {
    id: 'rel_zephyr_silverline',
    source: 'shell_zephyr_overseas',
    target: 'shell_silverline_offshore',
    type: 'OWNS',
    percentage: 100,
    properties: { shares: 10000 }
  },
  {
    id: 'rel_silverline_vanguard',
    source: 'shell_silverline_offshore',
    target: 'comp_vanguard_logistics',
    type: 'OWNS',
    percentage: 36.0,
    properties: { votingBlock: true }
  },
  {
    id: 'rel_silverline_global_energy',
    source: 'shell_silverline_offshore',
    target: 'comp_global_energy',
    type: 'OWNS',
    percentage: 19.5,
    properties: { institutionalShares: 1950000 }
  },

  // --- Trade Intermediary: Titanium Trading (Belize) & Nordic Maritime ---
  {
    id: 'rel_apex_titanium',
    source: 'shell_apex_horizon_trust',
    target: 'shell_titanium_trading',
    type: 'OWNS',
    percentage: 100
  },
  {
    id: 'rel_titanium_nordic',
    source: 'shell_titanium_trading',
    target: 'comp_nordic_maritime',
    type: 'OWNS',
    percentage: 60.0
  },
  {
    id: 'rel_chen_nordic',
    source: 'person_chen_wei',
    target: 'comp_nordic_maritime',
    type: 'DIRECTOR_OF',
    role: 'Managing Director'
  },

  // --- Directorships / Nominee Networks (Dmitri Kozlov as nominee director in 4 entities) ---
  {
    id: 'rel_kozlov_blackwood',
    source: 'person_dmitri_kozlov',
    target: 'shell_blackwood_nominees',
    type: 'DIRECTOR_OF',
    role: 'Sole Corporate Director'
  },
  {
    id: 'rel_kozlov_silverline',
    source: 'person_dmitri_kozlov',
    target: 'shell_silverline_offshore',
    type: 'DIRECTOR_OF',
    role: 'Nominee Director'
  },
  {
    id: 'rel_kozlov_titanium',
    source: 'person_dmitri_kozlov',
    target: 'shell_titanium_trading',
    type: 'DIRECTOR_OF',
    role: 'Resident Agent & Director'
  },
  {
    id: 'rel_kozlov_golden_oak',
    source: 'person_dmitri_kozlov',
    target: 'shell_golden_oak_holdings',
    type: 'DIRECTOR_OF',
    role: 'Corporate Representative'
  },

  // --- Government Tender & Contracts Awarded ---
  {
    id: 'rel_skyline_nato_contract',
    source: 'comp_skyline_aerospace',
    target: 'contract_nato_logistics',
    type: 'AWARDED_CONTRACT',
    amount: 120000000,
    date: '2024-02-10',
    properties: { primeContractor: true }
  },
  {
    id: 'rel_jenkins_nato_contract',
    source: 'person_sarah_jenkins',
    target: 'contract_nato_logistics',
    type: 'INTERMEDIARY_FOR',
    role: 'Procurement Overseer'
  },
  {
    id: 'rel_global_energy_grid_contract',
    source: 'comp_global_energy',
    target: 'contract_eu_grid',
    type: 'AWARDED_CONTRACT',
    amount: 85000000,
    date: '2023-10-15'
  },
  {
    id: 'rel_nordic_port_contract',
    source: 'comp_nordic_maritime',
    target: 'contract_port_terminal',
    type: 'AWARDED_CONTRACT',
    amount: 45000000,
    date: '2022-11-04'
  },

  // --- Circular Money Laundering / Layering Circuit (Geneva -> Nicosia -> Crypto Mixer -> BVI -> Geneva) ---
  {
    id: 'rel_tx_geneva_nicosia',
    source: 'bank_geneva_8821',
    target: 'bank_nicosia_4902',
    type: 'TRANSFERRED_FUNDS',
    amount: 14500000,
    currency: 'EUR',
    date: '2024-01-14',
    properties: { refCode: 'CONSULTING-INV-9901', swift: 'NICOCY2N' }
  },
  {
    id: 'rel_tx_nicosia_mixer',
    source: 'bank_nicosia_4902',
    target: 'bank_mixer_crypto',
    type: 'TRANSFERRED_FUNDS',
    amount: 12800000,
    currency: 'USDT',
    date: '2024-01-16',
    properties: { txHash: '0x88f4e19...b92', flagged: true, alert: 'High Risk Crypto Gateway' }
  },
  {
    id: 'rel_tx_mixer_bvi',
    source: 'bank_mixer_crypto',
    target: 'bank_bvi_1102',
    type: 'TRANSFERRED_FUNDS',
    amount: 12400000,
    currency: 'USD',
    date: '2024-01-18',
    properties: { refCode: 'LOAN-REPAYMENT-881', hopsThroughMixer: 3 }
  },
  {
    id: 'rel_tx_bvi_geneva',
    source: 'bank_bvi_1102',
    target: 'bank_geneva_8821',
    type: 'TRANSFERRED_FUNDS',
    amount: 11900000,
    currency: 'CHF',
    date: '2024-01-22',
    properties: { refCode: 'DIVIDEND-DISTRIBUTION', note: 'Completed circular layering circuit' }
  },

  // --- Operational Commercial Transfers ---
  {
    id: 'rel_tx_skyline_london_escrow',
    source: 'comp_skyline_aerospace',
    target: 'bank_london_3310',
    type: 'TRANSFERRED_FUNDS',
    amount: 28000000,
    currency: 'GBP',
    date: '2024-02-28',
    properties: { purpose: 'NATO Project Drawdown' }
  },
  {
    id: 'rel_tx_skyline_blackwood_dividend',
    source: 'comp_skyline_aerospace',
    target: 'shell_blackwood_nominees',
    type: 'TRANSFERRED_FUNDS',
    amount: 8500000,
    currency: 'EUR',
    date: '2024-03-05',
    properties: { purpose: 'Q4 Shareholder Dividend Pay-out' }
  },
  {
    id: 'rel_tx_global_energy_deutsche',
    source: 'comp_global_energy',
    target: 'bank_deutsche_9031',
    type: 'TRANSFERRED_FUNDS',
    amount: 19000000,
    currency: 'EUR',
    date: '2024-02-14'
  },

  // --- Geographic Jurisdiction Links ---
  { id: 'rel_zephyr_loc_bvi', source: 'shell_zephyr_overseas', target: 'jurisdiction_bvi', type: 'LOCATED_IN' },
  { id: 'rel_blackwood_loc_cyprus', source: 'shell_blackwood_nominees', target: 'jurisdiction_cyprus', type: 'LOCATED_IN' },
  { id: 'rel_apex_loc_panama', source: 'shell_apex_horizon_trust', target: 'jurisdiction_panama', type: 'LOCATED_IN' },
  { id: 'rel_silverline_loc_cayman', source: 'shell_silverline_offshore', target: 'jurisdiction_cayman', type: 'LOCATED_IN' },
  { id: 'rel_skyline_loc_uk', source: 'comp_skyline_aerospace', target: 'jurisdiction_uk', type: 'LOCATED_IN' },
  { id: 'rel_global_loc_germany', source: 'comp_global_energy', target: 'jurisdiction_germany', type: 'LOCATED_IN' },
  { id: 'rel_vanguard_loc_germany', source: 'comp_vanguard_logistics', target: 'jurisdiction_germany', type: 'LOCATED_IN' }
];

export const OPENCYPHER_SEED_STATEMENTS: string[] = [
  // 1. Constraints & Indexes
  `CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;`,
  `CREATE CONSTRAINT IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE;`,
  `CREATE CONSTRAINT IF NOT EXISTS FOR (s:ShellCompany) REQUIRE s.id IS UNIQUE;`,
  `CREATE CONSTRAINT IF NOT EXISTS FOR (j:Jurisdiction) REQUIRE j.id IS UNIQUE;`,
  `CREATE CONSTRAINT IF NOT EXISTS FOR (b:BankAccount) REQUIRE b.id IS UNIQUE;`,
  `CREATE CONSTRAINT IF NOT EXISTS FOR (k:Contract) REQUIRE k.id IS UNIQUE;`,

  // 2. People & Entities
  `MERGE (p:Person {id: 'person_viktor_voronin'})
   SET p.name = 'Viktor Voronin', p.subType = 'Sanctioned PEP', p.country = 'Russia',
       p.riskScore = 98, p.isSanctioned = true, p.isPEP = true,
       p.citizenship = 'Russian Federation, Cyprus (Gold Passport)',
       p.sanctionReason = 'EU & US Sanctions List - Defense Sector Ties & Asset Concealment';`,

  `MERGE (p:Person {id: 'person_elena_voronina'})
   SET p.name = 'Elena Voronina', p.subType = 'Family Associate / Proxy', p.country = 'Cyprus',
       p.riskScore = 84, p.isSanctioned = false, p.isPEP = true,
       p.relationToPEP = 'Spouse of Viktor Voronin';`,

  `MERGE (p:Person {id: 'person_dmitri_kozlov'})
   SET p.name = 'Dmitri Kozlov', p.subType = 'Nominee Director', p.country = 'Cyprus',
       p.riskScore = 89, p.isSanctioned = false, p.isPEP = false,
       p.registeredDirectorships = 14, p.firm = 'Nicosia Corporate Services Ltd';`,

  `MERGE (p:Person {id: 'person_alexei_morozov'})
   SET p.name = 'Alexei Morozov', p.subType = 'Shadow Shareholder', p.country = 'Switzerland',
       p.riskScore = 78, p.isSanctioned = false, p.isPEP = false;`,

  `MERGE (p:Person {id: 'person_marcus_sterling'})
   SET p.name = 'Marcus Sterling', p.subType = 'Clean Executive', p.country = 'United Kingdom',
       p.riskScore = 12, p.isSanctioned = false, p.isPEP = false;`,

  `MERGE (p:Person {id: 'person_sarah_jenkins'})
   SET p.name = 'Sarah Jenkins', p.subType = 'Procurement Officer', p.country = 'United States',
       p.riskScore = 15, p.isSanctioned = false, p.isPEP = false;`,

  `MERGE (p:Person {id: 'person_chen_wei'})
   SET p.name = 'Chen Wei', p.subType = 'Logistics Facilitator', p.country = 'Hong Kong',
       p.riskScore = 65, p.isSanctioned = false, p.isPEP = false;`,

  // 3. Shell Companies
  `MERGE (s:ShellCompany {id: 'shell_apex_horizon_trust'})
   SET s.name = 'Apex Horizon Trust', s.subType = 'Discretionary Trust', s.country = 'Panama',
       s.riskScore = 92, s.registrationNumber = 'PA-TRUST-88192', s.incorporationDate = '2018-04-12';`,

  `MERGE (s:ShellCompany {id: 'shell_zephyr_overseas'})
   SET s.name = 'Zephyr Overseas Ltd', s.subType = 'Offshore IBC', s.country = 'British Virgin Islands',
       s.riskScore = 90, s.registrationNumber = 'BVI-IBC-449102', s.incorporationDate = '2019-09-24';`,

  `MERGE (s:ShellCompany {id: 'shell_blackwood_nominees'})
   SET s.name = 'Blackwood Nominees Ltd', s.subType = 'Holding SPV', s.country = 'Cyprus',
       s.riskScore = 85, s.registrationNumber = 'HE-391028', s.incorporationDate = '2020-01-15';`,

  `MERGE (s:ShellCompany {id: 'shell_silverline_offshore'})
   SET s.name = 'Silverline Offshore Corp', s.subType = 'Exempt Company', s.country = 'Cayman Islands',
       s.riskScore = 88, s.registrationNumber = 'KY-EX-77291', s.incorporationDate = '2021-03-08';`,

  `MERGE (s:ShellCompany {id: 'shell_titanium_trading'})
   SET s.name = 'Titanium Trading Ltd', s.subType = 'Trade Intermediary', s.country = 'Belize',
       s.riskScore = 79, s.registrationNumber = 'BZ-CORP-3310', s.incorporationDate = '2021-11-20';`,

  `MERGE (s:ShellCompany {id: 'shell_golden_oak_holdings'})
   SET s.name = 'Golden Oak Holdings', s.subType = 'Asset Holding Vehicle', s.country = 'Seychelles',
       s.riskScore = 76, s.registrationNumber = 'SC-IBC-9021';`,

  // 4. Commercial Operating Companies
  `MERGE (c:Company {id: 'comp_skyline_aerospace'})
   SET c.name = 'Skyline Aerospace Ltd', c.subType = 'Aerospace & Defense Contractor', c.country = 'United Kingdom',
       c.riskScore = 68, c.registrationNumber = 'UK-08492019', c.revenue = '$280M/year';`,

  `MERGE (c:Company {id: 'comp_vanguard_logistics'})
   SET c.name = 'Vanguard Logistics AG', c.subType = 'Global Freight Forwarder', c.country = 'Germany',
       c.riskScore = 48, c.registrationNumber = 'DE-HRB-77291';`,

  `MERGE (c:Company {id: 'comp_global_energy'})
   SET c.name = 'Global Energy Holdings SE', c.subType = 'Energy Conglomerate', c.country = 'Germany',
       c.riskScore = 54, c.registrationNumber = 'DE-HRB-99120', c.marketCap = '$4.2B';`,

  `MERGE (c:Company {id: 'comp_nordic_maritime'})
   SET c.name = 'Nordic Maritime Inc', c.subType = 'Bulk Shipping Operator', c.country = 'Liberia',
       c.riskScore = 62, c.registrationNumber = 'LR-MAR-5510';`,

  `MERGE (c:Company {id: 'comp_helios_clean_energy'})
   SET c.name = 'Helios Clean Energy LLC', c.subType = 'Renewable Power Developer', c.country = 'United States',
       c.riskScore = 18, c.registrationNumber = 'US-DEL-449102';`,

  // 5. Contracts & Tenders
  `MERGE (k:Contract {id: 'contract_nato_logistics'})
   SET k.name = 'NATO Logistics Subcontract ($120M)', k.subType = 'Defense & Strategic Infrastructure',
       k.country = 'United Kingdom', k.riskScore = 82, k.contractValue = 120000000;`,

  `MERGE (k:Contract {id: 'contract_eu_grid'})
   SET k.name = 'EU Grid Modernization Tender ($85M)', k.subType = 'Critical Energy Infrastructure',
       k.country = 'Germany', k.riskScore = 64, k.contractValue = 85000000;`,

  `MERGE (k:Contract {id: 'contract_port_terminal'})
   SET k.name = 'Offshore Port Terminal Lease ($45M)', k.subType = 'Maritime Terminal Concession',
       k.country = 'Greece', k.riskScore = 58, k.contractValue = 45000000;`,

  // 6. Bank Accounts & Wallets
  `MERGE (b:BankAccount {id: 'bank_geneva_8821'})
   SET b.name = 'Geneva Private Bank #8821', b.subType = 'Numbered Private Account',
       b.country = 'Switzerland', b.riskScore = 88, b.balance = 42500000;`,

  `MERGE (b:BankAccount {id: 'bank_nicosia_4902'})
   SET b.name = 'Nicosia Private Bank #4902', b.subType = 'Corporate Escrow Account',
       b.country = 'Cyprus', b.riskScore = 82, b.balance = 18200000;`,

  `MERGE (b:BankAccount {id: 'bank_bvi_1102'})
   SET b.name = 'Tortola Escrow Account #1102', b.subType = 'Trust Multi-Currency Account',
       b.country = 'British Virgin Islands', b.riskScore = 78, b.balance = 14500000;`,

  `MERGE (b:BankAccount {id: 'bank_mixer_crypto'})
   SET b.name = 'Tornado / Railgun Mixer Proxy (0x4f3a...)', b.subType = 'Smart Contract Escrow / Mixer',
       b.country = 'Decentralized', b.riskScore = 99, b.balance = 9800000;`,

  `MERGE (b:BankAccount {id: 'bank_deutsche_9031'})
   SET b.name = 'Deutsche Handelsbank Account #9031', b.subType = 'Commercial Operating Account',
       b.country = 'Germany', b.riskScore = 25, b.balance = 34000000;`,

  `MERGE (b:BankAccount {id: 'bank_london_3310'})
   SET b.name = 'Barclays Defense Escrow #3310', b.subType = 'Project Account',
       b.country = 'United Kingdom', b.riskScore = 30, b.balance = 62000000;`,

  // 7. Jurisdictions
  `MERGE (j:Jurisdiction {id: 'jurisdiction_bvi'})
   SET j.name = 'British Virgin Islands', j.subType = 'Offshore Secrecy Haven',
       j.country = 'British Virgin Islands', j.riskScore = 85, j.secrecyIndex = 82;`,

  `MERGE (j:Jurisdiction {id: 'jurisdiction_cyprus'})
   SET j.name = 'Cyprus', j.subType = 'EU Low-Tax Hub',
       j.country = 'Cyprus', j.riskScore = 68, j.secrecyIndex = 65;`,

  `MERGE (j:Jurisdiction {id: 'jurisdiction_panama'})
   SET j.name = 'Panama', j.subType = 'Secrecy Jurisdiction',
       j.country = 'Panama', j.riskScore = 88, j.secrecyIndex = 86;`,

  `MERGE (j:Jurisdiction {id: 'jurisdiction_cayman'})
   SET j.name = 'Cayman Islands', j.subType = 'Offshore Financial Center',
       j.country = 'Cayman Islands', j.riskScore = 72, j.secrecyIndex = 78;`,

  `MERGE (j:Jurisdiction {id: 'jurisdiction_uk'})
   SET j.name = 'United Kingdom', j.subType = 'Major Financial Center',
       j.country = 'United Kingdom', j.riskScore = 22, j.secrecyIndex = 35;`,

  `MERGE (j:Jurisdiction {id: 'jurisdiction_germany'})
   SET j.name = 'Germany', j.subType = 'Regulated Onshore Market',
       j.country = 'Germany', j.riskScore = 18, j.secrecyIndex = 28;`,

  // 8. Relationships
  `MATCH (a {id: 'person_viktor_voronin'}), (b {id: 'person_elena_voronina'})
   MERGE (a)-[r:FAMILY_OF {role: 'Spouse & Asset Proxy'}]->(b);`,

  `MATCH (a {id: 'person_elena_voronina'}), (b {id: 'shell_apex_horizon_trust'})
   MERGE (a)-[r:BENEFICIARY_OF {percentage: 100, role: 'Primary Settlor & Sole Beneficiary', date: '2018-04-15'}]->(b);`,

  `MATCH (a {id: 'person_viktor_voronin'}), (b {id: 'shell_apex_horizon_trust'})
   MERGE (a)-[r:BENEFICIARY_OF {percentage: 100, role: 'Discretionary Protector (Shadow)', date: '2018-04-15'}]->(b);`,

  `MATCH (a {id: 'shell_apex_horizon_trust'}), (b {id: 'shell_zephyr_overseas'})
   MERGE (a)-[r:OWNS {percentage: 100, shares: 50000}]->(b);`,

  `MATCH (a {id: 'shell_zephyr_overseas'}), (b {id: 'shell_blackwood_nominees'})
   MERGE (a)-[r:OWNS {percentage: 85, shares: 85000}]->(b);`,

  `MATCH (a {id: 'person_alexei_morozov'}), (b {id: 'shell_blackwood_nominees'})
   MERGE (a)-[r:OWNS {percentage: 15, shares: 15000}]->(b);`,

  `MATCH (a {id: 'shell_blackwood_nominees'}), (b {id: 'comp_skyline_aerospace'})
   MERGE (a)-[r:OWNS {percentage: 42.5, shares: 425000}]->(b);`,

  `MATCH (a {id: 'person_marcus_sterling'}), (b {id: 'comp_skyline_aerospace'})
   MERGE (a)-[r:OWNS {percentage: 28.0, shares: 280000}]->(b);`,

  `MATCH (a {id: 'shell_zephyr_overseas'}), (b {id: 'shell_silverline_offshore'})
   MERGE (a)-[r:OWNS {percentage: 100, shares: 10000}]->(b);`,

  `MATCH (a {id: 'shell_silverline_offshore'}), (b {id: 'comp_vanguard_logistics'})
   MERGE (a)-[r:OWNS {percentage: 36.0}]->(b);`,

  `MATCH (a {id: 'shell_silverline_offshore'}), (b {id: 'comp_global_energy'})
   MERGE (a)-[r:OWNS {percentage: 19.5, shares: 1950000}]->(b);`,

  `MATCH (a {id: 'shell_apex_horizon_trust'}), (b {id: 'shell_titanium_trading'})
   MERGE (a)-[r:OWNS {percentage: 100}]->(b);`,

  `MATCH (a {id: 'shell_titanium_trading'}), (b {id: 'comp_nordic_maritime'})
   MERGE (a)-[r:OWNS {percentage: 60.0}]->(b);`,

  `MATCH (a {id: 'person_chen_wei'}), (b {id: 'comp_nordic_maritime'})
   MERGE (a)-[r:DIRECTOR_OF {role: 'Managing Director'}]->(b);`,

  // Directorships
  `MATCH (a {id: 'person_dmitri_kozlov'}), (b {id: 'shell_blackwood_nominees'})
   MERGE (a)-[r:DIRECTOR_OF {role: 'Sole Corporate Director'}]->(b);`,

  `MATCH (a {id: 'person_dmitri_kozlov'}), (b {id: 'shell_silverline_offshore'})
   MERGE (a)-[r:DIRECTOR_OF {role: 'Nominee Director'}]->(b);`,

  `MATCH (a {id: 'person_dmitri_kozlov'}), (b {id: 'shell_titanium_trading'})
   MERGE (a)-[r:DIRECTOR_OF {role: 'Resident Agent & Director'}]->(b);`,

  `MATCH (a {id: 'person_dmitri_kozlov'}), (b {id: 'shell_golden_oak_holdings'})
   MERGE (a)-[r:DIRECTOR_OF {role: 'Corporate Representative'}]->(b);`,

  // Contracts
  `MATCH (a {id: 'comp_skyline_aerospace'}), (b {id: 'contract_nato_logistics'})
   MERGE (a)-[r:AWARDED_CONTRACT {amount: 120000000, date: '2024-02-10'}]->(b);`,

  `MATCH (a {id: 'person_sarah_jenkins'}), (b {id: 'contract_nato_logistics'})
   MERGE (a)-[r:INTERMEDIARY_FOR {role: 'Procurement Overseer'}]->(b);`,

  `MATCH (a {id: 'comp_global_energy'}), (b {id: 'contract_eu_grid'})
   MERGE (a)-[r:AWARDED_CONTRACT {amount: 85000000, date: '2023-10-15'}]->(b);`,

  `MATCH (a {id: 'comp_nordic_maritime'}), (b {id: 'contract_port_terminal'})
   MERGE (a)-[r:AWARDED_CONTRACT {amount: 45000000, date: '2022-11-04'}]->(b);`,

  // Fund Transfers (Laundering Circuit)
  `MATCH (a {id: 'bank_geneva_8821'}), (b {id: 'bank_nicosia_4902'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 14500000, currency: 'EUR', date: '2024-01-14', refCode: 'CONSULTING-INV-9901'}]->(b);`,

  `MATCH (a {id: 'bank_nicosia_4902'}), (b {id: 'bank_mixer_crypto'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 12800000, currency: 'USDT', date: '2024-01-16', flagged: true}]->(b);`,

  `MATCH (a {id: 'bank_mixer_crypto'}), (b {id: 'bank_bvi_1102'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 12400000, currency: 'USD', date: '2024-01-18', refCode: 'LOAN-REPAYMENT-881'}]->(b);`,

  `MATCH (a {id: 'bank_bvi_1102'}), (b {id: 'bank_geneva_8821'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 11900000, currency: 'CHF', date: '2024-01-22', refCode: 'DIVIDEND-DISTRIBUTION'}]->(b);`,

  `MATCH (a {id: 'comp_skyline_aerospace'}), (b {id: 'bank_london_3310'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 28000000, currency: 'GBP', date: '2024-02-28'}]->(b);`,

  `MATCH (a {id: 'comp_skyline_aerospace'}), (b {id: 'shell_blackwood_nominees'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 8500000, currency: 'EUR', date: '2024-03-05'}]->(b);`,

  `MATCH (a {id: 'comp_global_energy'}), (b {id: 'bank_deutsche_9031'})
   MERGE (a)-[r:TRANSFERRED_FUNDS {amount: 19000000, currency: 'EUR', date: '2024-02-14'}]->(b);`,

  // Jurisdictions
  `MATCH (a {id: 'shell_zephyr_overseas'}), (b {id: 'jurisdiction_bvi'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'shell_blackwood_nominees'}), (b {id: 'jurisdiction_cyprus'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'shell_apex_horizon_trust'}), (b {id: 'jurisdiction_panama'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'shell_silverline_offshore'}), (b {id: 'jurisdiction_cayman'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'comp_skyline_aerospace'}), (b {id: 'jurisdiction_uk'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'comp_global_energy'}), (b {id: 'jurisdiction_germany'})
   MERGE (a)-[r:LOCATED_IN]->(b);`,

  `MATCH (a {id: 'comp_vanguard_logistics'}), (b {id: 'jurisdiction_germany'})
   MERGE (a)-[r:LOCATED_IN]->(b);`
];
