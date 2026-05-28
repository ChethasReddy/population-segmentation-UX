export const PRODUCTS = [
  { id: "ev", label: "Electric Cars" },
  { id: "coffee", label: "Specialty Coffee" },
  { id: "saas", label: "SaaS Analytics Platform" },
  { id: "fitness", label: "Connected Fitness Equipment" },
  { id: "banking", label: "Digital Banking App" },
];

export const OBJECTIVES = [
  { id: "awareness", label: "Increase Awareness" },
  { id: "consideration", label: "Increase Consideration" },
  { id: "conversion", label: "Increase Conversion" },
  { id: "retention", label: "Improve Retention" },
  { id: "expansion", label: "Expand Market Share" },
];

export const SEGMENTS = [
  {
    id: "gen-z-creators",
    label: "Gen Z Creators",
    description:
      "Digital-native content creators who value sustainability, innovation and experiences.",
    color: "seg1",
    archetype: "Identity and culture buyers",
  },
  {
    id: "urban-climate",
    label: "Urban Climate Advocates",
    description:
      "Values-led urban professionals who expect brands to prove environmental impact.",
    color: "seg2",
    archetype: "Purpose and values buyers",
  },
  {
    id: "cost-sensitive-smb",
    label: "Cost-Sensitive SMB Owners",
    description:
      "Time-poor operators who need clear ROI before they commit budget.",
    color: "seg3",
    archetype: "Practicality buyers",
  },
  {
    id: "enterprise-it",
    label: "Enterprise IT Leaders",
    description:
      "Risk-averse buyers who prioritize security, compliance, and scale.",
    color: "seg4",
    archetype: "Security and scale buyers",
  },
];

export const CATEGORIES = [
  { id: "strengths", label: "Strengths", icon: "Zap", color: "strengths" },
  {
    id: "weaknesses",
    label: "Weaknesses",
    icon: "AlertTriangle",
    color: "weaknesses",
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: "TrendingUp",
    color: "opportunities",
  },
  { id: "threats", label: "Threats", icon: "ShieldOff", color: "threats" },
  { id: "okrs", label: "Marketing OKRs", icon: "Target", color: "okrs" },
  {
    id: "positioning",
    label: "Market Positioning",
    icon: "Compass",
    color: "positioning",
  },
  { id: "persona", label: "Buyer Persona", icon: "User", color: "persona" },
  {
    id: "investment",
    label: "Investment Case",
    icon: "TrendingUpDown",
    color: "investment",
  },
  {
    id: "channels",
    label: "Channels and Distribution",
    icon: "Radio",
    color: "channels",
  },
];

export const CATEGORY_PROMPTS = {
  strengths: "What product strengths matter most.",
  weaknesses: "What this segment is likely to reject.",
  opportunities: "Where growth is most realistic.",
  threats: "What could slow adoption.",
  okrs: "What success should look like in 90 days.",
  positioning: "How this segment should perceive the brand.",
  persona: "Who this segment looks like in practice.",
  investment: "Why this segment is worth prioritizing.",
  channels: "Where to reach this segment effectively.",
};

export const VIEW_TABS = [
  { id: "overview", label: "Overview", icon: "LayoutGrid", categories: null },
  {
    id: "swot",
    label: "SWOT",
    icon: "Layers",
    categories: ["strengths", "weaknesses", "opportunities", "threats"],
  },
  {
    id: "strategy",
    label: "Strategy",
    icon: "LineChart",
    categories: ["okrs", "positioning", "investment"],
  },
  {
    id: "distribution",
    label: "Distribution",
    icon: "Share2",
    categories: ["persona", "channels"],
  },
];

export const DEFAULT_STATE = {
  product: "ev",
  objective: "consideration",
  activeSegments: [
    "gen-z-creators",
    "urban-climate",
    "cost-sensitive-smb",
    "enterprise-it",
  ],
  selectedSegment: "gen-z-creators",
};

export const RADAR_DATA = {
  "gen-z-creators": {
    affinity: 92,
    reach: 78,
    loyalty: 45,
    priceSens: 82,
    trendInfl: 95,
    convVel: 68,
  },
  "urban-climate": {
    affinity: 85,
    reach: 62,
    loyalty: 78,
    priceSens: 55,
    trendInfl: 72,
    convVel: 58,
  },
  "cost-sensitive-smb": {
    affinity: 64,
    reach: 70,
    loyalty: 82,
    priceSens: 95,
    trendInfl: 35,
    convVel: 75,
  },
  "enterprise-it": {
    affinity: 58,
    reach: 45,
    loyalty: 92,
    priceSens: 38,
    trendInfl: 22,
    convVel: 42,
  },
};
