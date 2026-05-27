export const PRODUCTS = [
  { id: 'ev',       label: 'Electric Vehicles' },
  { id: 'coffee',   label: 'Specialty Coffee' },
  { id: 'saas',     label: 'SaaS Analytics Platform' },
  { id: 'fitness',  label: 'Connected Fitness Equipment' },
  { id: 'banking',  label: 'Digital Banking App' },
]

export const OBJECTIVES = [
  { id: 'awareness',     label: 'Increase Awareness' },
  { id: 'consideration', label: 'Increase Consideration' },
  { id: 'conversion',    label: 'Increase Conversion' },
  { id: 'retention',     label: 'Improve Retention' },
  { id: 'expansion',     label: 'Expand Market Share' },
]

export const SEGMENTS = [
  {
    id: 'gen-z-creators',
    label: 'Gen Z Creators',
    description: 'Ages 18-26, social-first, authenticity-driven',
    color: 'seg1',
    archetype: 'Identity and culture buyers',
  },
  {
    id: 'urban-climate',
    label: 'Urban Climate Advocates',
    description: 'Ages 28-40, values-led, eco-literate',
    color: 'seg2',
    archetype: 'Purpose and values buyers',
  },
  {
    id: 'cost-sensitive-smb',
    label: 'Cost-Sensitive SMB Owners',
    description: 'Ages 35-55, time-poor, ROI-obsessed',
    color: 'seg3',
    archetype: 'Practicality buyers',
  },
  {
    id: 'enterprise-it',
    label: 'Enterprise IT Leaders',
    description: 'Ages 40-58, risk-averse, procurement-driven',
    color: 'seg4',
    archetype: 'Security and scale buyers',
  },
]

export const CATEGORIES = [
  { id: 'strengths',     label: 'Strengths',                 icon: 'Zap',           color: 'strengths' },
  { id: 'weaknesses',    label: 'Weaknesses',                icon: 'AlertTriangle', color: 'weaknesses' },
  { id: 'opportunities', label: 'Opportunities',             icon: 'TrendingUp',    color: 'opportunities' },
  { id: 'threats',       label: 'Threats',                   icon: 'ShieldOff',     color: 'threats' },
  { id: 'okrs',          label: 'Marketing OKRs',            icon: 'Target',        color: 'okrs' },
  { id: 'positioning',   label: 'Market Positioning',        icon: 'Compass',       color: 'positioning' },
  { id: 'persona',       label: 'Buyer Persona',             icon: 'User',          color: 'persona' },
  { id: 'investment',    label: 'Investment Case',           icon: 'TrendingUp',    color: 'investment' },
  { id: 'channels',      label: 'Channels and Distribution', icon: 'Radio',         color: 'channels' },
]

export const DEFAULT_STATE = {
  product: 'ev',
  objective: 'consideration',
  activeSegments: ['gen-z-creators', 'urban-climate', 'cost-sensitive-smb', 'enterprise-it'],
  selectedSegment: 'gen-z-creators',
}

export const RADAR_DATA = {
  'gen-z-creators':     { affinity: 92, reach: 78, loyalty: 45, priceSens: 82, trendInfl: 95, convVel: 68 },
  'urban-climate':      { affinity: 85, reach: 62, loyalty: 78, priceSens: 55, trendInfl: 72, convVel: 58 },
  'cost-sensitive-smb': { affinity: 64, reach: 70, loyalty: 82, priceSens: 95, trendInfl: 35, convVel: 75 },
  'enterprise-it':      { affinity: 58, reach: 45, loyalty: 92, priceSens: 38, trendInfl: 22, convVel: 42 },
}
