import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Decision, Message, Priority, Option, Risk, Evidence, DecisionDNA } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DecisionState {
  decisions: Decision[];
  currentDecisionId: string | null;
  messages: Message[];
  aiConfig: {
    provider: 'openai' | 'gemini' | 'custom';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  theme: 'light' | 'dark';
  
  // Actions
  createDecision: (title: string, description: string, category: Decision['category']) => string;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  setCurrentDecision: (id: string | null) => void;
  
  // Decision DNA
  updateDNA: (decisionId: string, dna: Partial<DecisionDNA>) => void;
  
  // Priorities
  addPriority: (decisionId: string, priority: Omit<Priority, 'id'>) => void;
  updatePriority: (decisionId: string, priorityId: string, updates: Partial<Priority>) => void;
  removePriority: (decisionId: string, priorityId: string) => void;
  rebalancePriorities: (decisionId: string) => void;
  
  // Options
  addOption: (decisionId: string, option: Omit<Option, 'id'>) => void;
  updateOption: (decisionId: string, optionId: string, updates: Partial<Option>) => void;
  removeOption: (decisionId: string, optionId: string) => void;
  
  // Risks
  addRisk: (decisionId: string, risk: Omit<Risk, 'id'>) => void;
  updateRisk: (decisionId: string, riskId: string, updates: Partial<Risk>) => void;
  
  // Evidence
  addEvidence: (decisionId: string, evidence: Omit<Evidence, 'id' | 'timestamp'>) => void;
  
  // Messages / Chat
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  
  // AI Config
  updateAIConfig: (config: Partial<DecisionState['aiConfig']>) => void;
  
  // Theme
  toggleTheme: () => void;
  
  // Getters
  getCurrentDecision: () => Decision | undefined;
}

const defaultDNA: DecisionDNA = {
  goal: '',
  budget: { currency: 'USD' },
  riskTolerance: 'medium',
  priorities: [],
  mustHaves: [],
  niceToHaves: [],
  dealBreakers: [],
  preferences: {},
  knownInformation: [],
  unknownInformation: [],
};

export const useDecisionStore = create<DecisionState>()(
  persist(
    (set, get) => ({
      decisions: [],
      currentDecisionId: null,
      messages: [],
      aiConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
      },
      theme: 'light',
      
      createDecision: (title, description, category) => {
        const id = uuidv4();
        const newDecision: Decision = {
          id,
          title,
          description,
          category,
          status: 'draft',
          dna: { ...defaultDNA, goal: description },
          options: [],
          risks: [],
          tradeOffs: [],
          evidence: [],
          scenarios: [],
          confidence: 'medium',
          confidenceReasons: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
        };
        set((state) => ({
          decisions: [...state.decisions, newDecision],
          currentDecisionId: id,
        }));
        return id;
      },
      
      updateDecision: (id, updates) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        }));
      },
      
      deleteDecision: (id) => {
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
          currentDecisionId: state.currentDecisionId === id ? null : state.currentDecisionId,
        }));
      },
      
      setCurrentDecision: (id) => {
        set({ currentDecisionId: id });
      },
      
      updateDNA: (decisionId, dna) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? { ...d, dna: { ...d.dna, ...dna }, updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },
      
      addPriority: (decisionId, priority) => {
        const id = uuidv4();
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  dna: {
                    ...d.dna,
                    priorities: [...d.dna.priorities, { ...priority, id }],
                  },
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      updatePriority: (decisionId, priorityId, updates) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  dna: {
                    ...d.dna,
                    priorities: d.dna.priorities.map((p) =>
                      p.id === priorityId ? { ...p, ...updates } : p
                    ),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      removePriority: (decisionId, priorityId) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  dna: {
                    ...d.dna,
                    priorities: d.dna.priorities.filter((p) => p.id !== priorityId),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      rebalancePriorities: (decisionId) => {
        set((state) => {
          const decision = state.decisions.find((d) => d.id === decisionId);
          if (!decision) return state;
          
          const total = decision.dna.priorities.reduce((sum, p) => sum + p.weight, 0);
          if (total === 0) return state;
          
          const normalizedPriorities = decision.dna.priorities.map((p) => ({
            ...p,
            weight: Math.round((p.weight / total) * 100),
          }));
          
          return {
            decisions: state.decisions.map((d) =>
              d.id === decisionId
                ? {
                    ...d,
                    dna: { ...d.dna, priorities: normalizedPriorities },
                    updatedAt: new Date().toISOString(),
                  }
                : d
            ),
          };
        });
      },
      
      addOption: (decisionId, option) => {
        const id = uuidv4();
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  options: [...d.options, { ...option, id }],
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      updateOption: (decisionId, optionId, updates) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  options: d.options.map((o) =>
                    o.id === optionId ? { ...o, ...updates } : o
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      removeOption: (decisionId, optionId) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  options: d.options.filter((o) => o.id !== optionId),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      addRisk: (decisionId, risk) => {
        const id = uuidv4();
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  risks: [...d.risks, { ...risk, id }],
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      updateRisk: (decisionId, riskId, updates) => {
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  risks: d.risks.map((r) =>
                    r.id === riskId ? { ...r, ...updates } : r
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      addEvidence: (decisionId, evidence) => {
        const id = uuidv4();
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  evidence: [
                    ...d.evidence,
                    { ...evidence, id, timestamp: new Date().toISOString() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },
      
      addMessage: (message) => {
        const id = uuidv4();
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id, timestamp: new Date().toISOString() },
          ],
        }));
      },
      
      clearMessages: () => {
        set({ messages: [] });
      },
      
      updateAIConfig: (config) => {
        set((state) => ({
          aiConfig: { ...state.aiConfig, ...config },
        }));
      },
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      
      getCurrentDecision: () => {
        const state = get();
        return state.decisions.find((d) => d.id === state.currentDecisionId);
      },
    }),
    {
      name: 'decision-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
