/**
 * CivicSky Policy Data
 * Sample dataset of real 2026 US regulations with severity scores.
 */

(function (exports) {
  'use strict';

  const CATEGORIES = {
    TAX: 'tax',
    LABOR: 'labor',
    HEALTHCARE: 'healthcare',
    HOUSING: 'housing',
    TECH: 'tech',
    TRANSPORT: 'transport'
  };

  const CATEGORY_LABELS = {
    tax: 'Tax',
    labor: 'Labor',
    healthcare: 'Healthcare',
    housing: 'Housing',
    tech: 'Tech & AI',
    transport: 'Transport'
  };

  const CATEGORY_ICONS = {
    tax: '\uD83D\uDCB0',
    labor: '\uD83D\uDCBC',
    healthcare: '\uD83C\uDFE5',
    housing: '\uD83C\uDFE0',
    tech: '\uD83E\uDD16',
    transport: '\uD83D\uDE8C'
  };

  const SEVERITY = {
    MILD: 'mild',
    MODERATE: 'moderate',
    SIGNIFICANT: 'significant',
    SEVERE: 'severe'
  };

  const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
    'DC'
  ];

  const STATE_NAMES = {
    AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
    CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
    HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
    KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
    MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
    MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
    NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
    OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
    SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
    VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
    DC:'Washington DC'
  };

  // Sample policies based on real 2026 regulations
  const POLICIES = [
    {
      id: 'ny-min-wage-2026',
      title: 'New York Minimum Wage Increase',
      summary: 'Minimum wage rises to $17/hr downstate (NYC, Long Island, Westchester) and $16/hr upstate, effective Jan 1, 2026.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 70,
      effectiveDate: '2026-01-01',
      states: ['NY'],
      source: 'https://www.ny.gov'
    },
    {
      id: 'ca-emergency-contact',
      title: 'California Emergency Contact Notification',
      summary: 'Employers must let employees name an emergency contact to be notified if the employee is arrested or detained. Effective March 30, 2026.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.MODERATE,
      severityScore: 45,
      effectiveDate: '2026-03-30',
      states: ['CA'],
      source: 'https://www.dir.ca.gov'
    },
    {
      id: 'ca-rideshare-union',
      title: 'California Rideshare Drivers Unionization',
      summary: '800,000 rideshare drivers gain the right to unionize under new legislation brokered with Uber and Lyft.',
      category: CATEGORIES.TRANSPORT,
      severity: SEVERITY.SEVERE,
      severityScore: 90,
      effectiveDate: '2026-01-01',
      states: ['CA'],
      source: 'https://www.ca.gov'
    },
    {
      id: 'fed-obbba-payroll',
      title: 'OBBBA Payroll Reporting Requirements',
      summary: 'New federal payroll reporting rules under the One Big Beautiful Bill Act expand wage reporting detail and introduce new data classifications.',
      category: CATEGORIES.TAX,
      severity: SEVERITY.SEVERE,
      severityScore: 85,
      effectiveDate: '2026-04-01',
      states: US_STATES,
      source: 'https://www.irs.gov'
    },
    {
      id: 'fed-tips-overtime-exemption',
      title: 'Tips & Overtime Tax Exemptions',
      summary: 'Temporary tax exemptions for tip income and overtime pay under the OBBBA, reducing taxable income for service and hourly workers.',
      category: CATEGORIES.TAX,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 75,
      effectiveDate: '2026-01-01',
      states: US_STATES,
      source: 'https://www.irs.gov'
    },
    {
      id: 'multi-state-min-wage',
      title: '19-State Minimum Wage Hikes',
      summary: 'At least 19 states raised minimum wages on Jan 1. AZ, CO, HI, ME, MO, NE hit or exceed $15/hr for the first time.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 70,
      effectiveDate: '2026-01-01',
      states: ['AZ','CO','HI','ME','MO','NE','CA','CT','DE','IL','MD','MA','MI','MN','NJ','NY','OR','VT','WA'],
      source: 'https://www.dol.gov'
    },
    {
      id: 'ct-sick-leave-expansion',
      title: 'Connecticut Paid Sick Leave Expansion',
      summary: 'Employer threshold lowered from 25 to 11 employees for mandatory paid sick leave coverage.',
      category: CATEGORIES.HEALTHCARE,
      severity: SEVERITY.MODERATE,
      severityScore: 50,
      effectiveDate: '2026-01-01',
      states: ['CT'],
      source: 'https://www.ct.gov'
    },
    {
      id: 'ca-ai-hiring-ban',
      title: 'California AI in Hiring Restrictions',
      summary: 'Employers prohibited from using automated decision systems for recruitment, hiring, or promotion that may illegally impact applicants based on protected categories.',
      category: CATEGORIES.TECH,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 72,
      effectiveDate: '2025-10-01',
      states: ['CA'],
      source: 'https://www.dir.ca.gov'
    },
    {
      id: 'co-ai-regulation',
      title: 'Colorado AI Transparency Act',
      summary: 'Companies using AI for consequential decisions must disclose AI involvement and provide opt-out mechanisms.',
      category: CATEGORIES.TECH,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 68,
      effectiveDate: '2026-02-01',
      states: ['CO'],
      source: 'https://www.sos.state.co.us'
    },
    {
      id: 'mn-retirement-mandate',
      title: 'Minnesota Workplace Retirement Mandate',
      summary: 'Minnesota joins 13 states with mandatory workplace retirement programs. Employers must enroll eligible employees.',
      category: CATEGORIES.TAX,
      severity: SEVERITY.MODERATE,
      severityScore: 55,
      effectiveDate: '2026-01-01',
      states: ['MN'],
      source: 'https://www.mn.gov'
    },
    {
      id: 'ny-retirement-deadline',
      title: 'New York Retirement Program Registration',
      summary: 'First registration deadline for New York\'s mandated workplace retirement program is March 18, 2026.',
      category: CATEGORIES.TAX,
      severity: SEVERITY.MODERATE,
      severityScore: 52,
      effectiveDate: '2026-03-18',
      states: ['NY'],
      source: 'https://www.ny.gov'
    },
    {
      id: 'nyc-delivery-pay',
      title: 'NYC Delivery Worker Pay Protections',
      summary: 'Delivery companies must pay contracted workers within 7 days and provide detailed written pay statements.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.MODERATE,
      severityScore: 48,
      effectiveDate: '2026-01-26',
      states: ['NY'],
      source: 'https://www.nyc.gov'
    },
    {
      id: 'nyc-tipping-requirement',
      title: 'NYC App Tipping Minimum',
      summary: 'Delivery apps like Uber Eats and Instacart must include a gratuity option of at least 10% of purchase price.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.MILD,
      severityScore: 30,
      effectiveDate: '2026-01-26',
      states: ['NY'],
      source: 'https://www.nyc.gov'
    },
    {
      id: 'ny-driver-points',
      title: 'New York Driver Points System Overhaul',
      summary: 'Stricter penalties and lower suspension threshold. New points for previously unpenalized violations.',
      category: CATEGORIES.TRANSPORT,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 65,
      effectiveDate: '2026-02-01',
      states: ['NY'],
      source: 'https://dmv.ny.gov'
    },
    {
      id: 'ca-crime-victim-leave',
      title: 'California Crime Victim Sick Leave',
      summary: 'Paid sick leave coverage expanded to include victims of serious crimes, not just domestic violence.',
      category: CATEGORIES.HEALTHCARE,
      severity: SEVERITY.MILD,
      severityScore: 35,
      effectiveDate: '2026-01-01',
      states: ['CA'],
      source: 'https://www.dir.ca.gov'
    },
    {
      id: 'nj-ai-law',
      title: 'New Jersey AI Accountability Act',
      summary: 'Businesses must conduct impact assessments before deploying AI systems that affect consumers or employees.',
      category: CATEGORIES.TECH,
      severity: SEVERITY.SIGNIFICANT,
      severityScore: 70,
      effectiveDate: '2026-06-01',
      states: ['NJ'],
      source: 'https://www.nj.gov'
    },
    {
      id: 'commuter-benefits-mandate',
      title: 'Expanded Commuter Benefits Mandates',
      summary: 'Several states now require employers to offer pre-tax commuter benefits for transit and parking expenses.',
      category: CATEGORIES.TRANSPORT,
      severity: SEVERITY.MODERATE,
      severityScore: 45,
      effectiveDate: '2026-01-01',
      states: ['NY','NJ','CT','CA','WA','OR','IL','DC'],
      source: 'https://www.dol.gov'
    },
    {
      id: 'il-ai-video-interview',
      title: 'Illinois AI Video Interview Act Update',
      summary: 'Strengthened requirements for employers using AI to analyze video interviews. Must notify and obtain consent.',
      category: CATEGORIES.TECH,
      severity: SEVERITY.MODERATE,
      severityScore: 55,
      effectiveDate: '2026-01-01',
      states: ['IL'],
      source: 'https://www.illinois.gov'
    },
    {
      id: 'ca-housing-disclosure',
      title: 'California Rental Algorithmic Pricing Disclosure',
      summary: 'Landlords using algorithmic pricing tools must disclose this to prospective tenants and provide pricing methodology.',
      category: CATEGORIES.HOUSING,
      severity: SEVERITY.MODERATE,
      severityScore: 50,
      effectiveDate: '2026-07-01',
      states: ['CA'],
      source: 'https://www.hcd.ca.gov'
    },
    {
      id: 'fed-realtime-payroll',
      title: 'Federal Real-Time Payroll Reporting Pilot',
      summary: 'IRS pilot program for real-time payroll reporting begins. Large employers (500+ employees) must report within 48 hours.',
      category: CATEGORIES.TAX,
      severity: SEVERITY.SEVERE,
      severityScore: 82,
      effectiveDate: '2026-07-01',
      states: US_STATES,
      source: 'https://www.irs.gov'
    },
    {
      id: 'nyc-vendor-decriminalization',
      title: 'NYC Street Vendor Decriminalization',
      summary: 'Misdemeanor criminal penalties for street vendors and food carts replaced with civil fines. Effective March 9, 2026.',
      category: CATEGORIES.LABOR,
      severity: SEVERITY.MILD,
      severityScore: 25,
      effectiveDate: '2026-03-09',
      states: ['NY'],
      source: 'https://www.nyc.gov'
    },
    {
      id: 'tx-ai-regulation',
      title: 'Texas AI Governance Framework',
      summary: 'New state framework for AI use in employment and public services. Requires transparency reports from deployers.',
      category: CATEGORIES.TECH,
      severity: SEVERITY.MODERATE,
      severityScore: 58,
      effectiveDate: '2026-09-01',
      states: ['TX'],
      source: 'https://www.texas.gov'
    }
  ];

  function getPoliciesForState(state) {
    if (!state) return POLICIES;
    return POLICIES.filter(p => p.states.includes(state) || p.states.length === US_STATES.length);
  }

  function getPoliciesByCategory(policies, category) {
    if (!category) return policies;
    return policies.filter(p => p.category === category);
  }

  function getUpcomingPolicies(policies, fromDate) {
    const from = new Date(fromDate || Date.now());
    return policies
      .filter(p => new Date(p.effectiveDate) >= from)
      .sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate));
  }

  function getRecentPolicies(policies, fromDate, daysBack) {
    const from = new Date(fromDate || Date.now());
    const cutoff = new Date(from);
    cutoff.setDate(cutoff.getDate() - (daysBack || 90));
    return policies
      .filter(p => {
        const d = new Date(p.effectiveDate);
        return d >= cutoff && d <= from;
      })
      .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
  }

  exports.CATEGORIES = CATEGORIES;
  exports.CATEGORY_LABELS = CATEGORY_LABELS;
  exports.CATEGORY_ICONS = CATEGORY_ICONS;
  exports.SEVERITY = SEVERITY;
  exports.US_STATES = US_STATES;
  exports.STATE_NAMES = STATE_NAMES;
  exports.POLICIES = POLICIES;
  exports.getPoliciesForState = getPoliciesForState;
  exports.getPoliciesByCategory = getPoliciesByCategory;
  exports.getUpcomingPolicies = getUpcomingPolicies;
  exports.getRecentPolicies = getRecentPolicies;

})(typeof window !== 'undefined' ? window : module.exports);
