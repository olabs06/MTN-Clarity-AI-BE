import User from '../models/user.model';
import Plan from '../models/plan.model';

export const MOCK_PLANS = [
  {
    id: "pulse-flexi",
    name: "MTN Pulse Flexi",
    category: "youth",
    monthlyCost: 2000,
    dataGB: 7,
    callMinutes: 200,
    smsCount: 100,
    validityDays: 30,
    activationCode: "*406#",
    summary: "Youth-focused plan with social media bonuses and flexi rollover data",
    features: [
      "7GB data (5GB standard + 2GB night data 12AM-6AM)",
      "200 minutes MTN-to-MTN calls",
      "100 SMS",
      "Free access to Boomplay music streaming",
      "Data rollover if you recharge before expiry",
      "Birthday bonus: double data on your birthday"
    ],
    bestFor: "Students and young professionals who use social media heavily and want night browsing bonuses",
    limitations: "Night data (2GB) only valid between 12AM and 6AM. Off-net calls cost extra.",
    competitors: ["Airtel SmartConnect", "Glo Beambooster"],
    upsellTo: "mtn-pulse-plus",
    matchScore: 92,
  },
  {
    id: "mtn-pulse-plus",
    name: "MTN Pulse Plus",
    category: "youth",
    monthlyCost: 3500,
    dataGB: 15,
    callMinutes: 400,
    smsCount: 200,
    validityDays: 30,
    activationCode: "*406*2#",
    summary: "Upgraded youth plan with more data and cross-network calls",
    features: [
      "15GB data (12GB standard + 3GB night data)",
      "400 minutes all-network calls",
      "200 SMS",
      "Free WhatsApp and Instagram data (1GB/day)",
      "Data rollover",
      "Free caller tunes"
    ],
    bestFor: "Active social media users and content creators who need more data and cross-network calls",
    limitations: "Social media data (WhatsApp/Instagram) cannot be used for other apps",
    competitors: ["Airtel SmartValue", "Glo Mega Deal"],
    upsellTo: "mtn-xtravalue",
    matchScore: 84,
  },
  {
    id: "mtn-xtravalue",
    name: "MTN XtraValue",
    category: "individual",
    monthlyCost: 5000,
    dataGB: 25,
    callMinutes: 600,
    smsCount: 300,
    validityDays: 30,
    activationCode: "*131*5#",
    summary: "Premium individual plan with large data bundle and unlimited weekend calls",
    features: [
      "25GB data",
      "600 minutes all-network calls",
      "Unlimited weekend calls (Sat-Sun, MTN-to-MTN)",
      "300 SMS",
      "Data rollover",
      "Priority customer support"
    ],
    bestFor: "Working professionals and freelancers with moderate-to-heavy data and calling needs",
    limitations: "Unlimited calls are MTN-to-MTN only on weekends",
    competitors: ["Airtel Unlimited", "9mobile TalkZone Plus"],
    upsellTo: "bizplus-starter",
    matchScore: 76,
  },
  {
    id: "bizplus-starter",
    name: "MTN BizPlus Starter",
    category: "business",
    monthlyCost: 8000,
    dataGB: 50,
    callMinutes: 1000,
    smsCount: 500,
    validityDays: 30,
    activationCode: "*131*8#",
    summary: "Entry-level SME plan with shared data pool for up to 3 lines",
    features: [
      "50GB shared data pool (up to 3 lines)",
      "1000 minutes all-network calls",
      "500 SMS",
      "Business dashboard for usage monitoring",
      "Dedicated SME helpline",
      "Monthly invoice/billing"
    ],
    bestFor: "Small businesses and entrepreneurs with 2-3 employees who need a shared data plan",
    limitations: "Maximum 3 lines. Lines must all be on MTN network.",
    competitors: ["Airtel BizConnect", "Glo Business Starter"],
    upsellTo: "bizplus-pro",
    matchScore: 88,
  },
  {
    id: "bizplus-pro",
    name: "MTN BizPlus Pro",
    category: "business",
    monthlyCost: 20000,
    dataGB: 200,
    callMinutes: 3000,
    smsCount: 2000,
    validityDays: 30,
    activationCode: "*131*9#",
    summary: "Mid-tier SME plan with large shared pool for up to 10 lines and analytics dashboard",
    features: [
      "200GB shared data pool (up to 10 lines)",
      "3000 minutes all-network calls",
      "2000 SMS",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Monthly invoice/billing",
      "Priority network access",
      "International roaming (optional add-on)"
    ],
    bestFor: "Growing businesses with 5-10 employees needing heavy data and reliable connectivity",
    limitations: "Maximum 10 lines. International roaming is a separate add-on cost.",
    competitors: ["Airtel SmartBiz", "Glo Business Pro"],
    upsellTo: "bizplus-enterprise",
    matchScore: 92,
  },
  {
    id: "bizplus-enterprise",
    name: "MTN BizPlus Enterprise",
    category: "business",
    monthlyCost: 50000,
    dataGB: 1000,
    callMinutes: 10000,
    smsCount: 5000,
    validityDays: 30,
    activationCode: "Contact MTN Business",
    summary: "Full enterprise plan with unlimited lines, SLA guarantee, and dedicated support",
    features: [
      "1TB shared data pool (unlimited lines)",
      "10,000 minutes all-network calls",
      "5,000 SMS",
      "SLA: 99.9% uptime guarantee",
      "Dedicated account team",
      "API access for usage management",
      "Custom billing cycles",
      "International roaming included",
      "Priority network infrastructure"
    ],
    bestFor: "Large businesses and enterprises with 10+ employees, high data demands, and SLA requirements",
    limitations: "Requires 6-month minimum contract. Setup fee may apply.",
    competitors: ["Airtel Enterprise", "MTN direct corporate contracts"],
    upsellTo: null,
    matchScore: 95,
  },
  {
    id: "mtn-daily-5x5",
    name: "MTN Daily 5x5",
    category: "individual",
    monthlyCost: 150,
    dataGB: 0.15,
    callMinutes: 5,
    smsCount: 10,
    validityDays: 1,
    activationCode: "*131*1#",
    summary: "Daily micro-bundle for casual users who don't use their phone heavily",
    features: [
      "150MB data",
      "5 minutes MTN-to-MTN calls",
      "10 SMS",
      "Valid for 24 hours",
      "No commitment — recharge as needed"
    ],
    bestFor: "Occasional users, backup SIM holders, or users who prefer daily control over spending",
    limitations: "Very limited data. Significantly more expensive per GB than monthly plans.",
    competitors: ["Glo Daily Flexi", "Airtel Daily Plan"],
    upsellTo: "pulse-flexi",
    matchScore: 65,
  }
];

export const MOCK_USAGE_CURRENT = {
  totalDataUsed: 4.2, // GB
  totalCallMinutes: 120,
  totalSmsSent: 45,
  usageByCategory: [
    { category: 'Social Media', percentage: 60, color: '#FFCC00' },
    { category: 'YouTube', percentage: 20, color: '#003366' },
    { category: 'Browsing', percentage: 10, color: '#4ADE80' },
    { category: 'Updates', percentage: 10, color: '#94A3B8' },
  ],
  dataBurnRate: 'Medium',
  projectedOverage: {
    data: 1.5, // GB
    cost: 500 // Naira
  }
};

export const MOCK_USAGE_HISTORY = [
  { period: '2026-03', dataUsed: 6.8, callMinutes: 180, smsSent: 90, totalCost: 2000, planId: 'pulse-flexi' },
  { period: '2026-02', dataUsed: 7.5, callMinutes: 210, smsSent: 110, totalCost: 2500, planId: 'pulse-flexi' },
  { period: '2026-01', dataUsed: 6.2, callMinutes: 150, smsSent: 85, totalCost: 2000, planId: 'pulse-flexi' },
  { period: '2025-12', dataUsed: 9.1, callMinutes: 280, smsSent: 150, totalCost: 3000, planId: 'pulse-flexi' },
  { period: '2025-11', dataUsed: 6.5, callMinutes: 190, smsSent: 95, totalCost: 2000, planId: 'pulse-flexi' },
  { period: '2025-10', dataUsed: 5.8, callMinutes: 140, smsSent: 70, totalCost: 2000, planId: 'pulse-flexi' },
];

export async function seedDatabase() {
  try {
    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      console.log('Seeding plans collection...');
      await Plan.insertMany(MOCK_PLANS);
    }

    const testUserEmail = 'aisha@example.com';
    let user = await User.findOne({ email: testUserEmail });
    
    if (!user) {
      console.log('Seeding demo user...');
      user = new User({
        name: 'Aisha',
        email: testUserEmail,
        phoneNumber: '08031234567',
        password: 'clarity2026', // Will be hashed by pre-save hook
        currentPlanId: 'pulse-flexi',
        monthlySpend: 2000,
        dataBurnRate: 'Medium',
        heavySocialUsage: true,
        preferredLanguage: 'EN'
      });
      await user.save();
    }
    
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
