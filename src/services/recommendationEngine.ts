import Plan from '../models/plan.model';

export interface RecommendationResult {
  planId: string;
  matchScore: number;
  estimatedMonthlyCost: number;
  estimatedSavings: number;
  reason: string;
  activationCode: string;
  switchProcess: {
    steps: string[];
    estimatedTime: string;
  };
}

export async function getRecommendations(user: any): Promise<RecommendationResult[]> {
  const allPlans = await Plan.find();
  const currentPlan = allPlans.find(p => p.id === user.currentPlanId);
  
  // This is a simplified mock scoring engine.
  // In a real scenario, this would call the Semantic Kernel RecommendationPlugin.
  
  const recommendations: RecommendationResult[] = [];

  for (const plan of allPlans) {
    if (plan.id === user.currentPlanId) continue;

    let score = 50; // Base score
    let reason = '';

    // Data fit (40% weight)
    if (user.dataBurnRate === 'High' && plan.dataGB > 15) {
      score += 20;
      reason = 'Offers sufficient data for your high consumption.';
    } else if (user.dataBurnRate === 'Medium' && plan.dataGB >= 5 && plan.dataGB <= 25) {
      score += 20;
      reason = 'Perfectly matches your medium data needs without overpaying.';
    }

    // Cost efficiency (30% weight)
    const costDiff = user.monthlySpend - plan.monthlyCost;
    let estimatedSavings = 0;
    if (costDiff > 0) {
      score += 15;
      estimatedSavings = costDiff;
      reason += ` Save ₦${costDiff} monthly.`;
    } else if (costDiff > -1000) {
      score += 5; // Slight upgrade is okay
      estimatedSavings = 0;
    }

    // Feature fit (30% weight)
    if (user.heavySocialUsage && plan.features.some(f => f.toLowerCase().includes('social') || f.toLowerCase().includes('whatsapp'))) {
      score += 15;
      reason += ' Includes social media bonuses.';
    }

    if (score > 60) {
      recommendations.push({
        planId: plan.id,
        matchScore: Math.min(score, 99),
        estimatedMonthlyCost: plan.monthlyCost,
        estimatedSavings,
        reason: reason.trim(),
        activationCode: plan.activationCode,
        switchProcess: {
          steps: [
            `Dial ${plan.activationCode} from your MTN line`,
            'Reply with 1 to confirm',
            'Wait for activation SMS'
          ],
          estimatedTime: "2 minutes"
        }
      });
    }
  }

  // Sort by highest match score
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

export async function calculateSavings(currentPlanId: string, targetPlanId: string): Promise<any> {
  const current = await Plan.findOne({ id: currentPlanId });
  const target = await Plan.findOne({ id: targetPlanId });

  if (!current || !target) {
    return null;
  }

  const monthlySavings = current.monthlyCost - target.monthlyCost;
  const dataChange = target.dataGB - current.dataGB;
  
  // Break even date (mock: just return next month)
  const breakEvenDate = new Date();
  breakEvenDate.setMonth(breakEvenDate.getMonth() + 1);

  return {
    monthlySavings,
    annualSavings: monthlySavings * 12,
    dataChange,
    callChange: target.callMinutes - current.callMinutes,
    smsChange: target.smsCount - current.smsCount,
    breakEvenDate: breakEvenDate.toISOString()
  };
}
