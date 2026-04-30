type Language = 'EN' | 'PIDGIN' | 'HA' | 'YO' | 'IG';

interface ChatResponse {
  text: string;
  suggestions: string[];
}

export function getAiResponse(text: string, lang: Language): ChatResponse {
  const t = text.toLowerCase();
  
  if (lang === 'PIDGIN') {
    if (t.includes('data') || t.includes('finish')) {
      return {
        text: "You spend 62% of your data on TikTok and Instagram. Pulse Plus fit save you better money o! You want make I compare am for you?",
        suggestions: ['Show cheaper bundles', 'Compare Plans']
      };
    }
    if (t.includes('cheaper') || t.includes('saving')) {
      return {
        text: "Pulse Plus for ₦3,500 go give you 15GB plus extra for Instagram. Compared to your old plan, you go save ₦800 every month.",
        suggestions: ['Compare Plans', 'Send me activation code']
      };
    }
    if (t.includes('compare')) {
      return {
        text: "Comparing Pulse Plus and BizPlus Starter: Pulse Plus better for data, BizPlus good for shared business lines. Pulse is 84% better fit for you.",
        suggestions: ['Show Savings', 'How to switch?']
      };
    }
    if (t.includes('switch') || t.includes('activation')) {
      return {
        text: "To switch, just dial *131*5# on your phone. You want make I show you how rollover dey work?",
        suggestions: ['Yes, show me', 'No, thanks']
      };
    }
    return {
      text: "I hear you. ClarityAI dey here to help you rearrange your MTN lifestyle and save better money.",
      suggestions: ['Why my data finish?', 'Show cheaper bundles']
    };
  }

  // Standard English logic (fallback for all others in this mock)
  if (t.includes('data') || t.includes('usage')) {
    return {
      text: "Analysis shows you spend 62% of your data on social apps (TikTok & Instagram). A targeted bundle like Pulse Plus would reduce your primary data drain. Should we compare it?",
      suggestions: ['Compare Plans', 'Show Savings']
    };
  }
  if (t.includes('cheaper') || t.includes('saving')) {
    return {
      text: "Switching to Pulse Plus at ₦3,500 offers 15GB + Social bonuses. This would save you approximately ₦800 monthly while increasing your usable data.",
      suggestions: ['Compare Plans', 'Activation Code']
    };
  }
  if (t.includes('compare')) {
    return {
      text: "Comparing Pulse Plus vs BizPlus Starter: Pulse Plus offers social-specific data which matches your high social usage (84% score). BizPlus is tailored for SMEs with shared pools.",
      suggestions: ['Show Savings', 'Switch Bundle']
    };
  }
  if (t.includes('switch') || t.includes('activation')) {
    return {
      text: "The activation code for Pulse Plus is *131*5#. Once activated, your existing data will rollover if you renew before expiry.",
      suggestions: ['View all plans', 'Analyze overspend']
    };
  }
  
  return {
    text: "I'm ClarityAI, your MTN plan assistant. I can analyze your usage, recommend cheaper bundles, or help you compare different MTN tariffs. What can I help you with today?",
    suggestions: ['Compare Pulse Plus vs BizPlus', 'Show cheaper bundles', 'Why my data finish fast?']
  };
}
