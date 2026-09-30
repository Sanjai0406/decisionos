import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useDecisionStore } from '../store/decisionStore';
import { Card, Button, Badge } from '../components/ui';
import { DecisionDNACard, OptionCard, RiskRadar, TradeOffMap, ChatPanel, ConfidenceIndicator, ScenarioSelector, DecisionSnapshot } from '../components';
import { demoDecisions } from '../data/demoDecisions';
import { Decision, Message } from '../types';
import {
  Plus,
  Search,
  Moon,
  Sun,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  FileText,
  Brain,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Shield,
  Lightbulb,
  Clock,
  User,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function Dashboard() {
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    decisions,
    currentDecisionId,
    messages,
    setCurrentDecision,
    createDecision,
    addMessage,
    clearMessages,
  } = useDecisionStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workspace' | 'history' | 'settings'>('dashboard');
  const [decisionInput, setDecisionInput] = useState('');
  const [showNewDecision, setShowNewDecision] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const currentDecision = decisions.find((d) => d.id === currentDecisionId);
  
  const handleCreateDecision = () => {
    if (decisionInput.trim()) {
      const category = detectCategory(decisionInput);
      const id = createDecision(decisionInput, decisionInput, category);
      setDecisionInput('');
      setShowNewDecision(false);
      setActiveTab('workspace');
      
      // Add initial AI message
      addMessage({
        role: 'assistant',
        content: `I understand you're trying to decide: "${decisionInput}". Let me help you analyze this decision. First, let me identify the key factors...`,
      });
    }
  };
  
  const handleSendMessage = (content: string) => {
    addMessage({ role: 'user', content });
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: generateAIResponse(content, currentDecision),
      });
    }, 500);
  };
  
  const suggestions = [
    "What matters most in this decision?",
    "What are the main risks?",
    "Compare the top options",
    "What information is missing?",
    "Challenge my current thinking",
  ];
  
  const renderDashboard = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Think clearly.
        </Text>
        <Text style={[styles.heroTitle, { color: theme.colors.primary }]}>
          Decide confidently.
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
          DecisionOS is your AI Decision Copilot for everyday life.
        </Text>
      </Animated.View>
      
      {/* Decision Input */}
      <Card variant="elevated" style={styles.inputCard}>
        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
          What are you trying to decide?
        </Text>
        <TextInput
          style={[
            styles.decisionInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="e.g., Which phone should I buy under ₹30,000?"
          placeholderTextColor={theme.colors.textTertiary}
          value={decisionInput}
          onChangeText={setDecisionInput}
          multiline
          numberOfLines={3}
        />
        <View style={styles.inputActions}>
          <TouchableOpacity style={[styles.attachButton, { backgroundColor: theme.colors.surfaceAlt }]}>
            <FileText size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Button
            title="Start Analysis"
            onPress={handleCreateDecision}
            icon={<Sparkles size={18} color={theme.colors.textInverse} style={{ marginRight: 8 }} />}
            disabled={!decisionInput.trim()}
          />
        </View>
      </Card>
      
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Target size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {decisions.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Decisions
          </Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <TrendingUp size={24} color={theme.colors.success} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {decisions.filter((d) => d.status === 'decided').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Completed
          </Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
            <Clock size={24} color={theme.colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {decisions.filter((d) => d.status === 'analyzing').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            In Progress
          </Text>
        </Card>
      </View>
      
      {/* Recent Decisions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Decisions
          </Text>
          <TouchableOpacity onPress={() => setActiveTab('history')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        {(decisions.length > 0 ? decisions : demoDecisions).slice(0, 3).map((decision) => (
          <TouchableOpacity
            key={decision.id}
            onPress={() => {
              setCurrentDecision(decision.id);
              setActiveTab('workspace');
            }}
          >
            <Card variant="outlined" style={styles.decisionCard}>
              <View style={styles.decisionCardContent}>
                <View style={styles.decisionCardIcon}>
                  <Target size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.decisionCardInfo}>
                  <Text style={[styles.decisionCardTitle, { color: theme.colors.text }]} numberOfLines={1}>
                    {decision.title}
                  </Text>
                  <Text style={[styles.decisionCardMeta, { color: theme.colors.textSecondary }]}>
                    {decision.options.length} options • {decision.dna.priorities.length} priorities
                  </Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textTertiary} />
              </View>
              <View style={styles.decisionCardFooter}>
                <Badge label={decision.status} type={decision.status === 'decided' ? 'success' : 'warning'} size="sm" />
                <Text style={[styles.decisionCardDate, { color: theme.colors.textTertiary }]}>
                  {new Date(decision.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Decision Templates */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Start Templates
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.templatesRow}>
            {[
              { icon: '📱', label: 'Buy a Phone', category: 'purchase' },
              { icon: '💼', label: 'Job Offer', category: 'job' },
              { icon: '💻', label: 'Laptop', category: 'purchase' },
              { icon: '✈️', label: 'Travel Plan', category: 'travel' },
              { icon: '📚', label: 'Course', category: 'education' },
              { icon: '🔧', label: 'Software', category: 'software' },
            ].map((template, index) => (
              <TouchableOpacity key={index} onPress={() => setDecisionInput(`Help me decide ${template.label.toLowerCase()}`)}>
                <Card style={styles.templateCard}>
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <Text style={[styles.templateLabel, { color: theme.colors.text }]}>
                    {template.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Philosophy */}
      <Card style={styles.philosophyCard}>
        <Brain size={32} color={theme.colors.primary} />
        <Text style={[styles.philosophyTitle, { color: theme.colors.text }]}>
          DecisionOS Philosophy
        </Text>
        <Text style={[styles.philosophyText, { color: theme.colors.textSecondary }]}>
          "DecisionOS doesn't decide for you. It helps you understand your decision."
        </Text>
      </Card>
    </ScrollView>
  );
  
  const renderWorkspace = () => {
    const decision = currentDecision || demoDecisions[0];
    
    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.workspaceHeader}>
          <View style={styles.workspaceTitleRow}>
            <Text style={[styles.workspaceTitle, { color: theme.colors.text }]}>
              {decision.title}
            </Text>
            <Badge label={decision.status} type={decision.status === 'decided' ? 'success' : 'warning'} />
          </View>
          <Text style={[styles.workspaceGoal, { color: theme.colors.textSecondary }]}>
            {decision.dna.goal}
          </Text>
          
          {/* Confidence Indicator */}
          <View style={styles.confidenceContainer}>
            <ConfidenceIndicator
              level={decision.confidence}
              reasons={decision.confidenceReasons}
              showReasons={false}
            />
          </View>
        </View>
        
        {/* Decision DNA */}
        <DecisionDNACard dna={decision.dna} />
        
        {/* Options */}
        <Card title="Options" subtitle={`${decision.options.length} alternatives considered`}>
          {decision.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              priorities={decision.dna.priorities}
              isSelected={decision.selectedOptionId === option.id}
            />
          ))}
          <Button
            title="Add Option"
            onPress={() => {}}
            variant="outline"
            icon={<Plus size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />}
            fullWidth
          />
        </Card>
        
        {/* Trade-Offs */}
        {decision.tradeOffs.length > 0 && (
          <TradeOffMap tradeOffs={decision.tradeOffs} options={decision.options} />
        )}
        
        {/* Risks */}
        {decision.risks.length > 0 && (
          <RiskRadar risks={decision.risks} />
        )}
        
        {/* Scenarios */}
        <ScenarioSelector
          scenarios={decision.scenarios}
          selectedScenario={decision.scenarios[0]}
          onSelectScenario={() => {}}
        />
        
        {/* Evidence */}
        {decision.evidence.length > 0 && (
          <EvidenceBoard evidence={decision.evidence} />
        )}
        
        {/* Decision Snapshot */}
        <DecisionSnapshot decision={decision} />
        
        {/* Chat Panel */}
        <View style={styles.chatContainer}>
          <ChatPanel
            messages={messages.length > 0 ? messages : [
              {
                id: '1',
                role: 'assistant',
                content: `I'm here to help you analyze your decision about "${decision.title}". What would you like to explore?`,
                timestamp: new Date().toISOString(),
              },
            ]}
            onSendMessage={handleSendMessage}
            suggestions={suggestions}
          />
        </View>
      </ScrollView>
    );
  };
  
  const renderHistory = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
        Decision History
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.colors.textSecondary }]}>
        Track your decisions and learn from past choices
      </Text>
      
      {(decisions.length > 0 ? decisions : demoDecisions).map((decision) => (
        <TouchableOpacity
          key={decision.id}
          onPress={() => {
            setCurrentDecision(decision.id);
            setActiveTab('workspace');
          }}
        >
          <Card variant="outlined" style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Badge label={decision.category} variant="primary" size="sm" />
              <Text style={[styles.historyDate, { color: theme.colors.textTertiary }]}>
                {new Date(decision.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[styles.historyTitle, { color: theme.colors.text }]}>
              {decision.title}
            </Text>
            <Text style={[styles.historyGoal, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {decision.dna.goal}
            </Text>
            <View style={styles.historyFooter}>
              <View style={styles.historyMeta}>
                <Text style={[styles.historyMetaText, { color: theme.colors.textTertiary }]}>
                  {decision.options.length} options
                </Text>
                <Text style={[styles.historyMetaDot, { color: theme.colors.textTertiary }]}>•</Text>
                <Text style={[styles.historyMetaText, { color: theme.colors.textTertiary }]}>
                  {decision.dna.priorities.length} priorities
                </Text>
              </View>
              <Badge label={decision.status} type={decision.status === 'decided' ? 'success' : 'warning'} size="sm" />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  const renderSettings = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
        Settings
      </Text>
      
      {/* Theme */}
      <Card title="Appearance">
        <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
          <View style={styles.settingInfo}>
            {isDark ? <Moon size={24} color={theme.colors.primary} /> : <Sun size={24} color={theme.colors.warning} />}
            <View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Theme
              </Text>
              <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      </Card>
      
      {/* AI Configuration */}
      <Card title="AI Configuration">
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Brain size={24} color={theme.colors.primary} />
            <View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                AI Provider
              </Text>
              <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                OpenAI (GPT-4)
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Settings size={24} color={theme.colors.textSecondary} />
            <View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Model
              </Text>
              <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                gpt-4-turbo
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Shield size={24} color={theme.colors.success} />
            <View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                API Key Status
              </Text>
              <Text style={[styles.settingValue, { color: theme.colors.success }]}>
                Configure in .env file
              </Text>
            </View>
          </View>
        </View>
      </Card>
      
      {/* About */}
      <Card title="About">
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Target size={24} color={theme.colors.primary} />
            <View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                DecisionOS
              </Text>
              <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerLeft}>
            <Target size={28} color={theme.colors.primary} />
            <Text style={[styles.brandName, { color: theme.colors.text }]}>
              DecisionOS
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
              {isDark ? <Sun size={22} color={theme.colors.text} /> : <Moon size={22} color={theme.colors.text} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('settings')} style={styles.headerButton}>
              <Settings size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.mainContent}>
          {isTablet && (
            <View style={[styles.sideNav, { backgroundColor: theme.colors.surface, borderRightColor: theme.colors.border }]}>
              <TouchableOpacity
                style={[styles.navItem, activeTab === 'dashboard' && { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={20} color={activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.navLabel, { color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary }]}>
                  Dashboard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeTab === 'workspace' && { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setActiveTab('workspace')}
              >
                <Target size={20} color={activeTab === 'workspace' ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.navLabel, { color: activeTab === 'workspace' ? theme.colors.primary : theme.colors.textSecondary }]}>
                  Workspace
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeTab === 'history' && { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setActiveTab('history')}
              >
                <Clock size={20} color={activeTab === 'history' ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.navLabel, { color: activeTab === 'history' ? theme.colors.primary : theme.colors.textSecondary }]}>
                  History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeTab === 'settings' && { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setActiveTab('settings')}
              >
                <Settings size={20} color={activeTab === 'settings' ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.navLabel, { color: activeTab === 'settings' ? theme.colors.primary : theme.colors.textSecondary }]}>
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.contentArea}>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'workspace' && renderWorkspace()}
            {activeTab === 'history' && renderHistory()}
            {activeTab === 'settings' && renderSettings()}
          </View>
        </View>
        
        {/* Bottom Navigation (Mobile) */}
        {!isTablet && (
          <View style={[styles.bottomNav, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
            <TouchableOpacity
              style={styles.bottomNavItem}
              onPress={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={22} color={activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.bottomNavLabel, { color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary }]}>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavItem}
              onPress={() => setActiveTab('workspace')}
            >
              <Target size={22} color={activeTab === 'workspace' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.bottomNavLabel, { color: activeTab === 'workspace' ? theme.colors.primary : theme.colors.textSecondary }]}>
                Workspace
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavItem}
              onPress={() => setActiveTab('history')}
            >
              <Clock size={22} color={activeTab === 'history' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.bottomNavLabel, { color: activeTab === 'history' ? theme.colors.primary : theme.colors.textSecondary }]}>
                History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavItem}
              onPress={() => setActiveTab('settings')}
            >
              <Settings size={22} color={activeTab === 'settings' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.bottomNavLabel, { color: activeTab === 'settings' ? theme.colors.primary : theme.colors.textSecondary }]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function detectCategory(input: string): Decision['category'] {
  const lower = input.toLowerCase();
  if (lower.includes('phone') || lower.includes('laptop') || lower.includes('buy') || lower.includes('purchase')) {
    return 'purchase';
  }
  if (lower.includes('job') || lower.includes('offer') || lower.includes('career') || lower.includes('salary')) {
    return 'job';
  }
  if (lower.includes('course') || lower.includes('learn') || lower.includes('study') || lower.includes('education')) {
    return 'education';
  }
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('vacation')) {
    return 'travel';
  }
  if (lower.includes('software') || lower.includes('tool') || lower.includes('app')) {
    return 'software';
  }
  return 'other';
}

function generateAIResponse(userMessage: string, decision?: Decision): string {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('risk') || lower.includes('danger') || lower.includes('problem')) {
    return "Based on my analysis, here are the key risks to consider:\n\n1. **Financial Risk**: Prices may fluctuate, and there could be hidden costs.\n2. **Reliability Risk**: Long-term durability is uncertain for some options.\n3. **Opportunity Cost**: Choosing one option means giving up benefits from others.\n\nWould you like me to dive deeper into any specific risk category?";
  }
  
  if (lower.includes('compare') || lower.includes('difference') || lower.includes('versus')) {
    return "Here's a comparison of your top options:\n\n**Option A** excels in camera quality and battery life, making it ideal for heavy users who prioritize photography.\n\n**Option B** offers better performance at a lower price point, but sacrifices some premium features.\n\n**Option C** provides the best value for money with balanced specifications.\n\nWhich aspect would you like me to analyze further?";
  }
  
  if (lower.includes('missing') || lower.includes('unknown') || lower.includes('information')) {
    return "I've identified some critical information gaps:\n\n**Critical:**\n- Current market prices and availability\n- User reviews from verified purchasers\n\n**Useful:**\n- Warranty terms comparison\n- After-sales service quality\n\n**Optional:**\n- Color variants available\n- Bundled offers\n\nWould you like me to help you gather this information?";
  }
  
  if (lower.includes('challenge') || lower.includes('devil') || lower.includes('wrong')) {
    return "Let me challenge your current thinking:\n\n🤔 **What assumption might be wrong?**\nYou're prioritizing camera quality, but how often do you actually use advanced camera features?\n\n🤔 **What are you overlooking?**\nHave you considered the software ecosystem and long-term update support?\n\n🤔 **What would a skeptic say?**\n\"You're overpaying for features you won't use. A mid-range option might serve you just as well.\"\n\nHow does this change your perspective?";
  }
  
  if (lower.includes('priority') || lower.includes('important') || lower.includes('matter')) {
    return "Based on your decision context, here's what seems to matter most:\n\n1. **Camera Quality** (35%) - You mentioned photography is important\n2. **Battery Life** (25%) - Heavy daily usage requires endurance\n3. **Performance** (20%) - Smooth operation for apps and games\n4. **Display** (15%) - Media consumption experience\n5. **Design** (5%) - Aesthetic preferences\n\nWould you like to adjust these weights? I can recalculate the analysis instantly.";
  }
  
  return "I'm analyzing your decision. Let me help you understand the trade-offs, identify risks, and discover what information might change your choice. What specific aspect would you like to explore?";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sideNav: {
    width: 200,
    paddingVertical: 16,
    borderRightWidth: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  hero: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  inputCard: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  decisionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  decisionCard: {
    marginBottom: 12,
  },
  decisionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decisionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decisionCardInfo: {
    flex: 1,
  },
  decisionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  decisionCardMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  decisionCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  decisionCardDate: {
    fontSize: 12,
  },
  templatesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  templateCard: {
    alignItems: 'center',
    padding: 16,
    minWidth: 100,
  },
  templateIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  templateLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  philosophyCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  philosophyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  philosophyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  workspaceHeader: {
    marginBottom: 24,
  },
  workspaceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  workspaceTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  workspaceGoal: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  confidenceContainer: {
    marginTop: 16,
  },
  chatContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyGoal: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyMetaText: {
    fontSize: 12,
  },
  historyMetaDot: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
