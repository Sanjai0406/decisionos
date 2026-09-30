export type DecisionCategory = 
  | 'purchase'
  | 'job'
  | 'education'
  | 'travel'
  | 'subscription'
  | 'software'
  | 'finance'
  | 'career'
  | 'other';

export type InformationType = 
  | 'fact'
  | 'assumption'
  | 'user_preference'
  | 'estimate'
  | 'uncertainty'
  | 'ai_analysis'
  | 'user_input';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type RiskCategory = 
  | 'financial'
  | 'compatibility'
  | 'reliability'
  | 'time'
  | 'privacy'
  | 'lock_in'
  | 'availability'
  | 'opportunity_cost';

export type DecisionStatus = 
  | 'draft'
  | 'analyzing'
  | 'reviewing'
  | 'decided'
  | 'archived';

export interface Priority {
  id: string;
  name: string;
  weight: number;
  category?: string;
}

export interface Option {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  features: Record<string, any>;
  scores: Record<string, number>;
  source?: string;
  sourceType?: 'url' | 'screenshot' | 'document' | 'manual';
}

export interface Risk {
  id: string;
  category: RiskCategory;
  title: string;
  reason: string;
  evidence?: string;
  evidenceType: InformationType;
  impact: 'low' | 'medium' | 'high';
  uncertainty: ConfidenceLevel;
  affectedOptions?: string[];
}

export interface TradeOff {
  optionId: string;
  gains: string[];
  losses: string[];
}

export interface Evidence {
  id: string;
  type: InformationType;
  content: string;
  source?: string;
  confidence?: ConfidenceLevel;
  timestamp: string;
}

export interface DecisionDNA {
  goal: string;
  budget?: {
    min?: number;
    max?: number;
    currency: string;
  };
  timeConstraint?: string;
  riskTolerance: 'low' | 'medium' | 'high';
  priorities: Priority[];
  mustHaves: string[];
  niceToHaves: string[];
  dealBreakers: string[];
  preferences: Record<string, any>;
  knownInformation: string[];
  unknownInformation: string[];
}

export interface Scenario {
  id: string;
  name: string;
  type: 'best_case' | 'expected' | 'worst' | 'budget' | 'performance' | 'long_term' | 'short_term' | 'custom';
  adjustments: Record<string, number>;
  description: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  status: DecisionStatus;
  dna: DecisionDNA;
  options: Option[];
  risks: Risk[];
  tradeOffs: TradeOff[];
  evidence: Evidence[];
  scenarios: Scenario[];
  selectedOptionId?: string;
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  createdAt: string;
  updatedAt: string;
  decisionDate?: string;
  reviewDate?: string;
  journal?: string;
  actualOutcome?: string;
  tags: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    type?: 'question' | 'analysis' | 'suggestion' | 'challenge';
    priorityUpdates?: Priority[];
    optionUpdates?: Option[];
  };
}

export interface AIConfig {
  provider: 'openai' | 'gemini' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
}
