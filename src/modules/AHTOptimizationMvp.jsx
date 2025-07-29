const renderCallCenter = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Center Operations</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsCallActive(!isCallActive)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isCallActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {isCallActive ? 'End Call' : 'Start Call'}
          </button>
        </div>
      </div>

      {/* Live Call Interface with IT Solutions */}
      {isCallActive && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Call - Customer: John Smith</h3>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Duration: 02:34</div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Context & History (IT Solution 2) */}
            <div className="lg:col-span-2">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
                  Pre-fetched Customer Context
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {conversationHistory.customerId}</p>
                  <p><span className="font-medium">Issue Context:</span> {conversationHistory.currentIssue}</p>
                  <p><span className="font-medium">Risk Level:</span> <span className="text-red-600 font-medium">High Value Customer</span></p>
                  <p><span className="font-medium">Summary:</span> {conversationHistory.contextSummary}</p>
                </div>
              </div>

              {/* Conversation History Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Previous Interactions (Auto-loaded)</h4>
                <div className="space-y-2">
                  {conversationHistory.previousInteractions.map((interaction, index) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                      <div>
                        <span className="font-medium">{interaction.date}</span> - {interaction.channel}
                      </div>
                      <div className="text-gray-600">{interaction.issue}</div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        interaction.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {interaction.resolved ? 'Resolved' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Q&A Assistant (IT Solution 3) */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-600" />
                  AI Q&A Assistant
                </h4>
                <div className="space-y-2">
                  {aiSuggestions.qAndA.map((qa, index) => (
                    <details key={index} className="bg-white p-2 rounded">
                      <summary className="font-medium text-sm cursor-pointer text-purple-700">
                        {qa.q}
                      </summary>
                      <p className="text-sm text-gray-700 mt-1 pl-4">{qa.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Automation & Next Best Actions (IT Solution 4) */}
            <div>
              <div className="bg-white border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-600" />
                  Next Best Actions (AI)
                </h4>
                <div className="space-y-2">
                  {aiSuggestions.nextBestActions.map((action, index) => (
                    <button key={index} className="w-full text-left px-3 py-2 bg-green-50 rounded hover:bg-green-100 text-sm">
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Auto Call Summary</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {aiSuggestions.automatedSummary}
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Generate Final Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Calls with Enhanced Data */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Calls with IT Enhancement Impact</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IT Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getRecentCalls().map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{call.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.agent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{call.duration}s</div>
                    <div className={`text-xs ${call.duration > 240 ? 'text-red-500' : 'text-green-500'}`}>
                      {call.duration > 240 ? 'Above target' : 'Below target'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">-{call.timeSavings}s</span>
                    <div className="text-xs text-gray-500">Prefetch + Auto-fill</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      call.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.resolved ? 'Resolved' : 'Follow-up needed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Transcript
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  
import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  User, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  Users, 
  HeadphonesIcon,
  Target,
  Brain,
  MessageSquare,
  FileText,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Download,
  Star,
  Award,
  Activity,
  Database,
  Calendar,
  PieChart,
  Headphones,
  Play,
  Eye,
  DollarSign,
  ArrowUp,
  Zap,
  AlertTriangle,
  GitBranch
} from 'lucide-react';
import SessionDataReports from '../components/SessionDataReports';

// Import JSON data files
import agentDataJson from '../utils/AGENT_DATA.json';
import transcriptDataJson from '../utils/TRANSCRIPT_DATA.json';
import contactDriverJson from '../utils/CONTACT_DRIVER.json';

const AHTOptimizationMVP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  
  // Data states for JSON files
  const [agentData, setAgentData] = useState([]);
  const [transcriptData, setTranscriptData] = useState([]);
  const [contactDriverData, setContactDriverData] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  
  // Session data state
  const [sessionData, setSessionData] = useState([]);
  const [sessionMetrics, setSessionMetrics] = useState(null);
  const [loadingSessionData, setLoadingSessionData] = useState(false);

  // Load session data from localStorage
  useEffect(() => {
    loadAllSessionData();
    loadDataFromJsonFiles();
    loadDashboardMetricsFromStorage();
  }, []);

  // Recalculate dashboard metrics when agent data changes
  useEffect(() => {
    if (agentData.length > 0) {
      calculateDashboardMetrics();
    }
  }, [agentData, sessionMetrics]);

  // Load data from JSON files
  const loadDataFromJsonFiles = () => {
    try {
      // Load agent data and transform to match expected format
      const transformedAgentData = agentDataJson.agents.map(agent => ({
        id: agent.agentId,
        name: agent.agentName,
        aht: agent.performance.today.averageHandleTimeSeconds,
        calls: agent.performance.today.callsHandled,
        resolution: agent.performance.today.firstCallResolutionPercentage,
        status: agent.status.toLowerCase().replace('idle', 'available'),
        performance: agent.performance.today.averageHandleTimeSeconds <= 240 ? 'excellent' :
                    agent.performance.today.averageHandleTimeSeconds <= 300 ? 'good' : 'needs-improvement',
        category: agent.agentCategory,
        skillSet: agent.skillSet,
        satisfaction: agent.performance.today.customerSatisfactionScore,
        adherence: agent.performance.today.adherencePercentage,
        weeklyStats: agent.performance.thisWeek,
        monthlyStats: agent.performance.lastMonth,
        otherMetrics: agent.otherMetrics
      }));

      setAgentData(transformedAgentData);
      setTranscriptData(transcriptDataJson);
      setContactDriverData(contactDriverJson);

    } catch (error) {
      console.error('Error loading data from JSON files:', error);
    }
  };

  // Load dashboard metrics from localStorage or calculate from session data
  const loadDashboardMetricsFromStorage = () => {
    try {
      // Try to get cached metrics first
      const cachedMetrics = localStorage.getItem('dashboard-metrics');
      if (cachedMetrics) {
        const metrics = JSON.parse(cachedMetrics);
        // Check if metrics are not too old (less than 1 hour)
        const metricsAge = Date.now() - new Date(metrics.lastUpdated).getTime();
        if (metricsAge < 3600000) { // 1 hour in milliseconds
          setDashboardMetrics(metrics);
          return;
        }
      }

      // Calculate metrics from session data and agent data
      calculateDashboardMetrics();
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    }
  };

  // Calculate dashboard metrics from available data
  const calculateDashboardMetrics = () => {
    try {
      const sessionMetricsData = sessionMetrics || {};
      const agentMetrics = agentData.length > 0 ? agentData : [];

      // Calculate queue waiting from session data (sessions in progress)
      const sessionsInProgress = sessionData.filter(session => 
        !session.resolutionDetails?.status || session.resolutionDetails?.status === 'in-progress'
      ).length;

      const metrics = {
        avgHandlingTime: agentMetrics.length > 0 ? 
          Math.round(agentMetrics.reduce((sum, agent) => sum + agent.aht, 0) / agentMetrics.length) : 0,
        targetAHT: 240,
        totalCalls: agentMetrics.reduce((sum, agent) => sum + agent.calls, 0) || sessionMetricsData.totalSessions || 0,
        activeAgents: agentMetrics.filter(agent => agent.status === 'available' || agent.status === 'on-call').length,
        queueWaiting: sessionsInProgress || 0,
        resolutionRate: agentMetrics.length > 0 ? 
          Math.round(agentMetrics.reduce((sum, agent) => sum + agent.resolution, 0) / agentMetrics.length * 10) / 10 : 0,
        lastUpdated: new Date().toISOString()
      };

      setDashboardMetrics(metrics);

      // Cache metrics for 1 hour
      localStorage.setItem('dashboard-metrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
    }
  };

  // Generate contact driver analysis from JSON data
  const getContactDriverAnalysis = () => {
    if (!contactDriverData.IVR_Categories) return [];
    
    return contactDriverData.IVR_Categories.slice(0, 4).map((category, index) => {
      // Calculate metrics based on session data if available
      const sessionCategoryData = sessionData.filter(session => 
        session.customerInfo?.selectedOption?.includes(category.category_name) ||
        session.resolutionDetails?.category?.includes(category.category_name)
      );

      const avgTime = sessionCategoryData.length > 0 ? 
        Math.round(sessionCategoryData.reduce((sum, session) => sum + (session.callInfo?.duration || 0), 0) / sessionCategoryData.length) :
        240 + (index * 40); // Fallback calculation

      const volume = sessionCategoryData.length || (400 - index * 50);
      
      return {
        driver: category.category_name,
        avgTime,
        volume,
        change: index % 2 === 0 ? `+${5 + index * 5}%` : `-${3 + index * 2}%`,
        reason: category.sub_issues[0] || 'Various inquiries'
      };
    });
  };

  // Get recent calls from transcript data
  const getRecentCalls = () => {
    if (!transcriptData || transcriptData.length === 0) return [];
    
    return transcriptData.slice(0, 4).map((conversation, index) => {
      // Get corresponding agent from session data if available
      const relatedSession = sessionData.find(session => 
        session.customerInfo?.issue?.toLowerCase().includes(conversation.issue_category.toLowerCase()) ||
        session.resolutionDetails?.category?.toLowerCase().includes(conversation.issue_category.toLowerCase())
      );

      // Calculate duration from conversation interactions if available
      let duration = 180 + (index * 60); // fallback
      if (conversation.interactions && conversation.interactions.length > 1) {
        const startTime = conversation.interactions[0].timestamp;
        const endTime = conversation.interactions[conversation.interactions.length - 1].timestamp;
        // Simple duration calculation (in seconds)
        const [startHour, startMin, startSec] = startTime.split(':').map(Number);
        const [endHour, endMin, endSec] = endTime.split(':').map(Number);
        duration = (endHour * 3600 + endMin * 60 + endSec) - (startHour * 3600 + startMin * 60 + startSec);
      }

      // Determine if resolved based on conversation content or session data
      const resolved = relatedSession?.resolutionDetails?.status === 'resolved' || 
                      conversation.interactions?.some(interaction => 
                        interaction.text.toLowerCase().includes('resolved') ||
                        interaction.text.toLowerCase().includes('fixed') ||
                        interaction.text.toLowerCase().includes('working now')
                      ) || true; // Default to true for existing conversations

      // Calculate actual time savings from session data or estimated based on duration
      const timeSavings = relatedSession?.performanceMetrics?.timingSavings?.totalSaved || 
                         (duration > 240 ? Math.max(15, Math.min(45, Math.floor((duration - 240) * 0.3))) : 
                          Math.max(10, Math.min(30, Math.floor(duration * 0.15))));

      return {
        id: index + 1,
        customer: `Customer ${conversation.conversation_id}`,
        issue: conversation.issue_category,
        duration,
        resolved,
        timeSavings,
        agent: relatedSession?.agentInfo?.routedAgent?.name || 
               agentData[index % agentData.length]?.name || 'Unknown Agent'
      };
    });
  };

  // Generate issue volume data from session data
  const getIssueVolumeData = () => {
    const categories = ['Billing', 'Technical', 'Account', 'Product'];
    
    return categories.map((category, index) => {
      // Get session data for this category
      const categoryData = sessionData.filter(session => 
        session.customerInfo?.selectedOption?.toLowerCase().includes(category.toLowerCase()) ||
        session.resolutionDetails?.category?.toLowerCase().includes(category.toLowerCase())
      );

      // Get historical data from localStorage or calculate based on current data
      const storageKey = `historical-${category.toLowerCase()}-data`;
      const historicalData = JSON.parse(localStorage.getItem(storageKey) || 'null');
      
      let jan, feb, mar;
      
      if (historicalData) {
        jan = historicalData.jan;
        feb = historicalData.feb;
        mar = historicalData.mar;
      } else {
        // Calculate based on current session data patterns
        const baseVolume = categoryData.length || (150 + index * 25);
        // Simulate realistic monthly trends based on category type
        const monthlyVariation = category === 'Billing' ? 1.2 : category === 'Technical' ? 1.1 : 0.9;
        jan = Math.round(baseVolume * 0.8);
        feb = Math.round(jan * monthlyVariation);
        mar = Math.round(feb * (categoryData.length > 0 ? 1.15 : 1.05));
        
        // Store calculated data
        localStorage.setItem(storageKey, JSON.stringify({ jan, feb, mar, lastUpdated: new Date().toISOString() }));
      }
      
      const trend = mar > feb && feb > jan ? 'increasing' :
                   mar < feb && feb < jan ? 'decreasing' : 'stable';

      return {
        category,
        jan,
        feb,
        mar,
        trend
      };
    });
  };

  // Generate skill gaps analysis from agent performance data
  const getSkillGaps = () => {
    if (agentData.length === 0) return [];

    const performanceIssues = agentData.filter(agent => agent.performance === 'needs-improvement');
    const skills = [
      { 
        skill: 'Product Knowledge', 
        gap: performanceIssues.length > 3 ? 'High' : performanceIssues.length > 1 ? 'Medium' : 'Low',
        agents: Math.max(1, performanceIssues.length),
        training: 'CRM Basics Course'
      },
      { 
        skill: 'Technical Troubleshooting', 
        gap: agentData.filter(a => a.aht > 300).length > 2 ? 'High' : 'Medium',
        agents: agentData.filter(a => a.aht > 300).length || 1,
        training: 'Advanced Tech Support'
      },
      { 
        skill: 'Communication Skills', 
        gap: agentData.filter(a => a.satisfaction < 4.0).length > 1 ? 'Medium' : 'Low',
        agents: agentData.filter(a => a.satisfaction < 4.0).length || 1,
        training: 'Communication Excellence'
      }
    ];

    return skills;
  };

  // Generate agent behavior insights for analytics
  const getAgentBehaviorInsights = () => {
    if (agentData.length === 0) return [];

    // Focus on agents that need improvement
    const problematicAgents = agentData.filter(agent => 
      agent.performance === 'needs-improvement' || 
      agent.aht > 300 || 
      agent.satisfaction < 4.0
    );

    return problematicAgents.slice(0, 3).map((agent, index) => {
      // Calculate real metrics from session data for this agent
      const agentSessions = sessionData.filter(session => 
        session.agentInfo?.routedAgent?.name === agent.name ||
        session.agentInfo?.routedAgent?.id === agent.id
      );

      // Calculate actual patterns from session data
      const avgScreenSwitches = agentSessions.length > 0 ? 
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.screenSwitches || 4), 0) / agentSessions.length) : 4;
      
      const avgResponseDelay = agentSessions.length > 0 ?
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.avgResponseTime || 7), 0) / agentSessions.length) : 7;

      const avgHoldUsage = agentSessions.length > 0 ?
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.holdUsage || 2), 0) / agentSessions.length) : 2;

      // Get actual time wasters from performance metrics
      const manualEntryTime = agentSessions.length > 0 ?
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.manualEntryTime || 25), 0) / agentSessions.length) : 25;

      const navigationTime = agentSessions.length > 0 ?
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.navigationTime || 20), 0) / agentSessions.length) : 20;

      const documentationTime = agent.aht > 300 ? 
        (agentSessions.length > 0 ?
          Math.ceil(agentSessions.reduce((sum, session) => 
            sum + (session.performanceMetrics?.documentationTime || 35), 0) / agentSessions.length) : 35) : 0;

      const searchTime = agentSessions.length > 0 ?
        Math.ceil(agentSessions.reduce((sum, session) => 
          sum + (session.performanceMetrics?.knowledgeSearchTime || 12), 0) / agentSessions.length) : 12;

      return {
        agentId: agent.id,
        patterns: [
          `Excessive screen switching during calls (${avgScreenSwitches} times per call)`,
          `Delayed response to customer queries (avg ${avgResponseDelay}s pause)`,
          `Frequent use of hold function (${avgHoldUsage} times per call)`,
          agent.aht > 300 ? 'Extended call wrap-up time beyond standard' : 'Inconsistent call pacing',
          agent.satisfaction < 4.0 ? 'Limited use of empathy phrases' : 'Rushed interaction style'
        ].slice(0, 4), // Take first 4 patterns
        timeWasters: [
          `Manual data entry: ${manualEntryTime}s per call`,
          `System navigation issues: ${navigationTime}s per call`,
          agent.aht > 300 ? `Excessive documentation time: ${documentationTime}s per call` : 'Repeated customer information requests',
          `Inefficient knowledge base searches: ${searchTime}s per call`,
          'Waiting for system responses during peak hours'
        ].slice(0, 4), // Take first 4 time wasters
        suggestions: [
          'Implement hotkeys for common system functions',
          'Use auto-populate features for customer data',
          'Practice active listening techniques to reduce clarification needs',
          agent.aht > 300 ? 'Streamline call wrap-up process with templates' : 'Improve multi-tasking during customer holds',
          'Utilize AI-powered response suggestions for faster replies',
          'Complete refresher training on product knowledge'
        ].slice(0, 5) // Take first 5 suggestions
      };
    });
  };

  // Get real-time system alerts from session data and performance metrics
  const getSystemAlerts = () => {
    const alerts = [];
    
    // Check for high AHT agents
    const highAHTAgents = agentData.filter(agent => agent.aht > 360).length;
    if (highAHTAgents > 0) {
      alerts.push({
        type: 'warning',
        title: 'High AHT Detected',
        message: `${highAHTAgents} agent(s) exceed 6-minute AHT threshold`,
        timestamp: new Date().toISOString(),
        action: 'Review agent performance'
      });
    }

    // Check for queue buildup
    const queueSize = dashboardMetrics?.queueWaiting || 0;
    if (queueSize > 5) {
      alerts.push({
        type: 'critical',
        title: 'Queue Backup',
        message: `${queueSize} customers waiting in queue`,
        timestamp: new Date().toISOString(),
        action: 'Deploy additional agents'
      });
    }

    // Check for low satisfaction scores
    const lowSatisfactionSessions = sessionData.filter(session => 
      session.resolutionDetails?.customerSatisfaction < 3
    ).length;
    if (lowSatisfactionSessions > 2) {
      alerts.push({
        type: 'warning',
        title: 'Customer Satisfaction Alert',
        message: `${lowSatisfactionSessions} recent sessions with low satisfaction scores`,
        timestamp: new Date().toISOString(),
        action: 'Investigate service quality'
      });
    }

    // Check for system performance issues
    const systemIssues = sessionData.filter(session => 
      session.performanceMetrics?.systemResponseTime > 5000
    ).length;
    if (systemIssues > 0) {
      alerts.push({
        type: 'critical',
        title: 'System Performance Issue',
        message: `${systemIssues} sessions affected by slow system response`,
        timestamp: new Date().toISOString(),
        action: 'Check system health'
      });
    }

    return alerts.slice(0, 5); // Return top 5 alerts
  };

  // Get performance trends from session data
  const getPerformanceTrends = () => {
    if (!sessionMetrics) return null;

    const trends = {
      ahtTrend: {
        current: dashboardMetrics?.avgHandlingTime || 0,
        previous: JSON.parse(localStorage.getItem('previous-aht') || '0'),
        change: 0,
        direction: 'stable'
      },
      resolutionTrend: {
        current: dashboardMetrics?.resolutionRate || 0,
        previous: JSON.parse(localStorage.getItem('previous-resolution') || '0'),
        change: 0,
        direction: 'stable'
      },
      satisfactionTrend: {
        current: sessionMetrics.avgSatisfaction || 0,
        previous: JSON.parse(localStorage.getItem('previous-satisfaction') || '0'),
        change: 0,
        direction: 'stable'
      }
    };

    // Calculate trends
    Object.keys(trends).forEach(key => {
      const trend = trends[key];
      if (trend.previous > 0) {
        trend.change = Math.round(((trend.current - trend.previous) / trend.previous) * 100);
        trend.direction = trend.change > 2 ? 'improving' : trend.change < -2 ? 'declining' : 'stable';
      }
    });

    // Store current values as previous for next calculation
    localStorage.setItem('previous-aht', JSON.stringify(trends.ahtTrend.current));
    localStorage.setItem('previous-resolution', JSON.stringify(trends.resolutionTrend.current));
    localStorage.setItem('previous-satisfaction', JSON.stringify(trends.satisfactionTrend.current));

    return trends;
  };

  const loadAllSessionData = () => {
    try {
      setLoadingSessionData(true);
      
      // Get all session data keys from localStorage
      const allKeys = Object.keys(localStorage);
      const sessionKeys = allKeys.filter(key => 
        key.startsWith('session-data-') || key.startsWith('completed-sessions')
      );
      
      // Load completed sessions metadata
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      
      // Load full session data for each completed session
      const fullSessionData = completedSessions.map(sessionMeta => {
        try {
          const sessionData = JSON.parse(localStorage.getItem(sessionMeta.dataKey) || '{}');
          return {
            metadata: sessionMeta,
            ...sessionData,
            sessionId: sessionMeta.sessionId,
            completedAt: sessionMeta.timestamp,
            validation: sessionMeta.validation
          };
        } catch (error) {
          console.error('Error loading session:', sessionMeta.sessionId, error);
          return null;
        }
      }).filter(session => session !== null);

      // Also check for any standalone session data
      const standaloneSessionData = [];
      sessionKeys.forEach(key => {
        if (key.startsWith('session-data-') && !completedSessions.find(s => s.dataKey === key)) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data && Object.keys(data).length > 0) {
              standaloneSessionData.push({
                sessionId: key,
                dataKey: key,
                timestamp: data.additionalContext?.completedAt || new Date().toISOString(),
                ...data
              });
            }
          } catch (error) {
            console.error('Error loading standalone session data:', key, error);
          }
        }
      });

      const allSessionData = [...fullSessionData, ...standaloneSessionData];
      setSessionData(allSessionData);
      
      // Calculate session metrics
      calculateSessionMetrics(allSessionData);
      
      setLoadingSessionData(false);
    } catch (error) {
      console.error('Error loading session data:', error);
      setLoadingSessionData(false);
    }
  };

  const calculateSessionMetrics = (data) => {
    if (!data || data.length === 0) {
      setSessionMetrics(null);
      return;
    }

    const metrics = {
      totalSessions: data.length,
      avgDuration: 0,
      totalDuration: 0,
      avgSatisfaction: 0,
      resolutionStats: {},
      agentPerformance: {},
      timeSavings: 0,
      aiImpact: {
        totalSuggestions: 0,
        totalKnowledgeBase: 0
      },
      sentimentDistribution: {},
      categoryBreakdown: {},
      lastUpdated: new Date().toISOString()
    };

    // Calculate averages and totals
    let totalDuration = 0;
    let satisfactionScores = [];
    let totalTimeSavings = 0;

    data.forEach(session => {
      // Duration metrics
      const duration = session.callInfo?.duration || 0;
      totalDuration += duration;

      // Satisfaction metrics  
      const satisfaction = session.resolutionDetails?.customerSatisfaction;
      if (satisfaction && satisfaction !== null) {
        satisfactionScores.push(satisfaction);
      }

      // Resolution status
      const status = session.resolutionDetails?.status || 'unknown';
      metrics.resolutionStats[status] = (metrics.resolutionStats[status] || 0) + 1;

      // Agent performance
      const agentName = session.agentInfo?.routedAgent?.name || 'Unknown';
      if (!metrics.agentPerformance[agentName]) {
        metrics.agentPerformance[agentName] = {
          sessions: 0,
          totalDuration: 0,
          avgDuration: 0,
          satisfactionScores: []
        };
      }
      metrics.agentPerformance[agentName].sessions++;
      metrics.agentPerformance[agentName].totalDuration += duration;
      if (satisfaction) {
        metrics.agentPerformance[agentName].satisfactionScores.push(satisfaction);
      }

      // Time savings
      const savings = session.performanceMetrics?.timingSavings?.totalSaved || 0;
      totalTimeSavings += savings;

      // AI Impact
      const suggestions = session.aiAnalytics?.suggestions?.length || 0;
      const knowledgeBase = session.aiAnalytics?.knowledgeBase?.length || 0;
      metrics.aiImpact.totalSuggestions += suggestions;
      metrics.aiImpact.totalKnowledgeBase += knowledgeBase;

      // Sentiment
      const sentiment = session.sentimentAnalysis?.currentSentiment?.overallSentiment || 'unknown';
      metrics.sentimentDistribution[sentiment] = (metrics.sentimentDistribution[sentiment] || 0) + 1;

      // Category
      const category = session.customerInfo?.selectedOption || session.resolutionDetails?.category || 'unknown';
      metrics.categoryBreakdown[category] = (metrics.categoryBreakdown[category] || 0) + 1;
    });

    // Calculate averages
    metrics.avgDuration = Math.round(totalDuration / data.length);
    metrics.totalDuration = totalDuration;
    metrics.timeSavings = totalTimeSavings;

    if (satisfactionScores.length > 0) {
      metrics.avgSatisfaction = Math.round(
        (satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length) * 10
      ) / 10;
    }

    // Calculate agent averages
    Object.keys(metrics.agentPerformance).forEach(agentName => {
      const agent = metrics.agentPerformance[agentName];
      agent.avgDuration = Math.round(agent.totalDuration / agent.sessions);
      if (agent.satisfactionScores.length > 0) {
        agent.avgSatisfaction = Math.round(
          (agent.satisfactionScores.reduce((sum, score) => sum + score, 0) / agent.satisfactionScores.length) * 10
        ) / 10;
      }
    });

    setSessionMetrics(metrics);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section with Real-time Metrics */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">AHT Optimization Dashboard</h1>
            <p className="text-blue-100">Real-time insights for contact center performance optimization</p>
            <p className="text-sm text-blue-200 mt-1">Last updated: {new Date().toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200">Current Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-300 font-medium">System Active</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-white mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{dashboardMetrics?.activeAgents || 0}</div>
                <div className="text-sm text-blue-200">Active Agents</div>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-white mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{dashboardMetrics?.totalCalls || 0}</div>
                <div className="text-sm text-blue-200">Total Calls Today</div>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-white mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{dashboardMetrics?.queueWaiting || 0}</div>
                <div className="text-sm text-blue-200">Queue Waiting</div>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-white mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{dashboardMetrics?.resolutionRate || 0}%</div>
                <div className="text-sm text-blue-200">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time System Alerts */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="w-7 h-7 mr-3 text-red-600" />
              Real-time System Alerts
            </h3>
            <p className="text-gray-600 mt-1">Live monitoring of system performance and issues</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Feed</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {getSystemAlerts().length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-900 mb-2">All Systems Operating Normally</h4>
              <p className="text-green-700">No critical alerts at this time</p>
            </div>
          ) : (
            getSystemAlerts().map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 
                'bg-blue-50 border-blue-500'
              } hover:shadow-md transition-shadow duration-300`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${
                      alert.type === 'critical' ? 'bg-red-100' :
                      alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {alert.type === 'critical' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                      {alert.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className={`font-bold mr-3 ${
                          alert.type === 'critical' ? 'text-red-900' :
                          alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                        }`}>
                          {alert.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        alert.type === 'critical' ? 'text-red-700' :
                        alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                      }`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className={`px-3 py-1 text-sm font-medium rounded hover:shadow-md transition-all duration-200 ${
                    alert.type === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                    alert.type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 
                    'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    {alert.action}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Trends Analysis */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-7 h-7 mr-3 text-blue-600" />
              Performance Trends Analysis
            </h3>
            <p className="text-gray-600 mt-1">Comparing current performance with previous periods</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <Calendar className="w-4 h-4 mr-2 inline" />
              Last 7 Days
            </button>
          </div>
        </div>
        
        {(() => {
          const trends = getPerformanceTrends();
          if (!trends) return (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Collecting trend data...</p>
            </div>
          );

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-900">Average Handle Time</h4>
                  <div className={`flex items-center ${
                    trends.ahtTrend.direction === 'improving' ? 'text-green-600' :
                    trends.ahtTrend.direction === 'declining' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {trends.ahtTrend.direction === 'improving' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {trends.ahtTrend.direction === 'declining' && <TrendingUp className="w-4 h-4 mr-1" />}
                    {trends.ahtTrend.direction === 'stable' && <Activity className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">
                      {trends.ahtTrend.change !== 0 ? `${trends.ahtTrend.change > 0 ? '+' : ''}${trends.ahtTrend.change}%` : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{trends.ahtTrend.current}s</div>
                <div className="text-sm text-blue-700">
                  Previous: {trends.ahtTrend.previous}s
                </div>
                <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                  trends.ahtTrend.direction === 'improving' ? 'bg-green-100 text-green-800' :
                  trends.ahtTrend.direction === 'declining' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {trends.ahtTrend.direction === 'improving' ? 'IMPROVING' :
                   trends.ahtTrend.direction === 'declining' ? 'NEEDS ATTENTION' : 'STABLE'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-green-900">Resolution Rate</h4>
                  <div className={`flex items-center ${
                    trends.resolutionTrend.direction === 'improving' ? 'text-green-600' :
                    trends.resolutionTrend.direction === 'declining' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {trends.resolutionTrend.direction === 'improving' && <TrendingUp className="w-4 h-4 mr-1" />}
                    {trends.resolutionTrend.direction === 'declining' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {trends.resolutionTrend.direction === 'stable' && <Activity className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">
                      {trends.resolutionTrend.change !== 0 ? `${trends.resolutionTrend.change > 0 ? '+' : ''}${trends.resolutionTrend.change}%` : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-2">{trends.resolutionTrend.current}%</div>
                <div className="text-sm text-green-700">
                  Previous: {trends.resolutionTrend.previous}%
                </div>
                <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                  trends.resolutionTrend.direction === 'improving' ? 'bg-green-100 text-green-800' :
                  trends.resolutionTrend.direction === 'declining' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {trends.resolutionTrend.direction === 'improving' ? 'IMPROVING' :
                   trends.resolutionTrend.direction === 'declining' ? 'NEEDS ATTENTION' : 'STABLE'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-purple-900">Customer Satisfaction</h4>
                  <div className={`flex items-center ${
                    trends.satisfactionTrend.direction === 'improving' ? 'text-green-600' :
                    trends.satisfactionTrend.direction === 'declining' ? 'text-red-600' : 'text-purple-600'
                  }`}>
                    {trends.satisfactionTrend.direction === 'improving' && <TrendingUp className="w-4 h-4 mr-1" />}
                    {trends.satisfactionTrend.direction === 'declining' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {trends.satisfactionTrend.direction === 'stable' && <Activity className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">
                      {trends.satisfactionTrend.change !== 0 ? `${trends.satisfactionTrend.change > 0 ? '+' : ''}${trends.satisfactionTrend.change}%` : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-2">{trends.satisfactionTrend.current}</div>
                <div className="text-sm text-purple-700">
                  Previous: {trends.satisfactionTrend.previous}
                </div>
                <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                  trends.satisfactionTrend.direction === 'improving' ? 'bg-green-100 text-green-800' :
                  trends.satisfactionTrend.direction === 'declining' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {trends.satisfactionTrend.direction === 'improving' ? 'IMPROVING' :
                   trends.satisfactionTrend.direction === 'declining' ? 'NEEDS ATTENTION' : 'STABLE'}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Session Data Analytics */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Database className="w-7 h-7 mr-3 text-indigo-600" />
              Session Data Analytics
            </h3>
            <p className="text-gray-600 mt-1">Live session data from localStorage and JSON sources</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Sessions</div>
              <div className="text-2xl font-bold text-indigo-600">{sessionData.length}</div>
            </div>
            <button 
              onClick={loadAllSessionData}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Refresh
            </button>
          </div>
        </div>
        
        {loadingSessionData ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-indigo-500 mx-auto mb-3 animate-spin" />
            <p className="text-gray-500">Loading session data...</p>
          </div>
        ) : sessionData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No session data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-indigo-900">Average Duration</h4>
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-indigo-900 mb-1">
                {sessionMetrics?.avgDuration || 0}s
              </div>
              <div className="text-sm text-indigo-700">
                Total: {Math.floor((sessionMetrics?.totalDuration || 0) / 60)}m
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-green-900">Avg Satisfaction</h4>
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {sessionMetrics?.avgSatisfaction || 0}
              </div>
              <div className="text-sm text-green-700">
                Out of 5.0
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-purple-900">Time Savings</h4>
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {sessionMetrics?.timeSavings || 0}s
              </div>
              <div className="text-sm text-purple-700">
                Total saved
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-orange-900">AI Impact</h4>
                <Brain className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {(sessionMetrics?.aiImpact?.totalSuggestions || 0) + (sessionMetrics?.aiImpact?.totalKnowledgeBase || 0)}
              </div>
              <div className="text-sm text-orange-700">
                Total interactions
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {sessionMetrics?.categoryBreakdown && Object.keys(sessionMetrics.categoryBreakdown).length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(sessionMetrics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${(count / sessionData.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agent Performance Comparison */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-7 h-7 mr-3 text-green-600" />
              Top vs Bottom Performers
            </h3>
            <p className="text-gray-600 mt-1">Comparing highest and lowest performing agents</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export Analysis
            </button>
          </div>
        </div>
        
        {agentData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Top Performers
              </h4>
              <div className="space-y-4">
                {agentData
                  .filter(agent => agent.performance === 'excellent' || agent.aht <= 240)
                  .slice(0, 3)
                  .map((agent, index) => (
                    <div key={agent.id} className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-bold text-green-900">{agent.name}</h5>
                          <p className="text-sm text-green-700">{agent.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{agent.aht}s</div>
                          <div className="text-xs text-green-500">AHT</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-900">{agent.calls}</div>
                          <div className="text-green-600">Calls</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-900">{agent.resolution}%</div>
                          <div className="text-green-600">Resolution</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-900">{agent.satisfaction}</div>
                          <div className="text-green-600">CSAT</div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                          EXCELLENT
                        </span>
                        <div className="text-xs text-green-600">
                          {Math.round(((240 - agent.aht) / 240) * 100)}% better than target
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom Performers */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
              <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Needs Improvement
              </h4>
              <div className="space-y-4">
                {agentData
                  .filter(agent => agent.performance === 'needs-improvement' || agent.aht > 300)
                  .slice(0, 3)
                  .map((agent, index) => (
                    <div key={agent.id} className="bg-white rounded-lg p-4 border border-red-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-bold text-red-900">{agent.name}</h5>
                          <p className="text-sm text-red-700">{agent.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">{agent.aht}s</div>
                          <div className="text-xs text-red-500">AHT</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-red-900">{agent.calls}</div>
                          <div className="text-red-600">Calls</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-900">{agent.resolution}%</div>
                          <div className="text-red-600">Resolution</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-900">{agent.satisfaction}</div>
                          <div className="text-red-600">CSAT</div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                          NEEDS IMPROVEMENT
                        </span>
                        <div className="text-xs text-red-600">
                          {Math.round(((agent.aht - 240) / 240) * 100)}% above target
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No agent data available</p>
          </div>
        )}
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm font-semibold text-red-800">Average Handling Time</p>
              </div>
              <p className="text-4xl font-bold text-red-900 mb-1">{dashboardMetrics?.avgHandlingTime || 0}s</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {dashboardMetrics?.avgHandlingTime > dashboardMetrics?.targetAHT ? '+' : '-'}
                  {Math.abs(Math.round(((dashboardMetrics?.avgHandlingTime || 0) - (dashboardMetrics?.targetAHT || 240)) / (dashboardMetrics?.targetAHT || 240) * 100))}% from target ({dashboardMetrics?.targetAHT || 240}s)
                </p>
              </div>
              <div className="mt-3 bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((dashboardMetrics?.avgHandlingTime || 0) / 400) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-red-200 rounded-full">
              <Clock className="w-8 h-8 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm font-semibold text-green-800">IT Optimization Impact</p>
              </div>
              <p className="text-4xl font-bold text-green-900 mb-1">-35s</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-700 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  12% improvement from optimizations
                </p>
              </div>
              <div className="mt-3 flex space-x-1">
                <div className="flex-1 bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-200 rounded-full">
              <RefreshCw className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm font-semibold text-blue-800">Resolution Rate</p>
              </div>
              <p className="text-4xl font-bold text-blue-900 mb-1">{dashboardMetrics?.resolutionRate || 0}%</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Above target (90%)
                </p>
              </div>
              <div className="mt-3 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-11/12"></div>
              </div>
            </div>
            <div className="p-4 bg-blue-200 rounded-full">
              <Target className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-purple-600 mr-2" />
                <p className="text-sm font-semibold text-purple-800">AI Efficiency Boost</p>
              </div>
              <p className="text-4xl font-bold text-purple-900 mb-1">+22%</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  From AI suggestions & automation
                </p>
              </div>
              <div className="mt-3 bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
            <div className="p-4 bg-purple-200 rounded-full">
              <Brain className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Driver Analysis */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-7 h-7 mr-3 text-blue-600" />
              Contact Driver Time Analysis
            </h3>
            <p className="text-gray-600 mt-1">Detailed breakdown of call handling time by category</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filter
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Driver
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Avg Time
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Volume
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    MoM Change
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Root Cause</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getContactDriverAnalysis().map((driver, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        driver.avgTime > 300 ? 'bg-red-500' :
                        driver.avgTime > 240 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-semibold text-gray-900">{driver.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold mr-2 ${
                        driver.avgTime > 240 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {driver.avgTime}s
                      </span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        driver.avgTime > 300 ? 'bg-red-100 text-red-800' :
                        driver.avgTime > 240 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {driver.avgTime > 300 ? 'Critical' :
                         driver.avgTime > 240 ? 'Warning' : 'Good'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900 mr-2">{driver.volume}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(driver.volume / 600) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${
                        driver.change.includes('+') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {driver.change}
                      </span>
                      {driver.change.includes('+') ? 
                        <TrendingUp className="w-4 h-4 ml-1 text-red-500" /> :
                        <TrendingDown className="w-4 h-4 ml-1 text-green-500" />
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-700 leading-relaxed">{driver.reason}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      <Target className="w-4 h-4 mr-1 inline" />
                      Optimize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Issue Volume Trends */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <PieChart className="w-7 h-7 mr-3 text-purple-600" />
              Issue Category Volume Trends
            </h3>
            <p className="text-gray-600 mt-1">Last 3 months performance analysis with trend indicators</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Jan - Mar 2025
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getIssueVolumeData().map((category, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{category.category}</h4>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  category.trend === 'increasing' ? 'bg-red-100 text-red-700 border border-red-200' :
                  category.trend === 'decreasing' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {category.trend === 'increasing' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                  {category.trend === 'decreasing' && <TrendingDown className="w-3 h-3 inline mr-1" />}
                  {category.trend === 'stable' && <Activity className="w-3 h-3 inline mr-1" />}
                  {category.trend.toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Jan:</span>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800 mr-2">{category.jan}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(category.jan / 600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Feb:</span>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800 mr-2">{category.feb}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${(category.feb / 600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Mar:</span>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-900 mr-2">{category.mar}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category.trend === 'increasing' ? 'bg-red-500' :
                          category.trend === 'decreasing' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(category.mar / 600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Change:</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-bold ${
                      category.trend === 'increasing' ? 'text-red-600' :
                      category.trend === 'decreasing' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {Math.round(((category.mar - category.jan) / category.jan) * 100)}%
                    </span>
                    {category.trend === 'increasing' && <TrendingUp className="w-4 h-4 ml-1 text-red-500" />}
                    {category.trend === 'decreasing' && <TrendingDown className="w-4 h-4 ml-1 text-green-500" />}
                    {category.trend === 'stable' && <Activity className="w-4 h-4 ml-1 text-blue-500" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced IT Solutions Impact & Business Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-xl shadow-lg border-2 border-green-100 p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900">IT Optimization Results</h3>
              <p className="text-green-700 mt-1">Automated solutions driving efficiency gains</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-900">Prefetch Implementation</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">-25s avg</span>
                  </div>
                  <p className="text-green-700 text-sm mb-3">Reduced data lookup time by proactively fetching customer information</p>
                  <div className="bg-green-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">80% of agents benefiting</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-900">Auto-populate Customer Data</h4>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">-15s avg</span>
                  </div>
                  <p className="text-blue-700 text-sm mb-3">Eliminated manual entry time with intelligent form filling</p>
                  <div className="bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">75% reduction in entry errors</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-purple-900">IVR Context Transfer</h4>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">-20s avg</span>
                  </div>
                  <p className="text-purple-700 text-sm mb-3">Seamless handoff reducing repeat information requests</p>
                  <div className="bg-purple-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-5/6"></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">85% customer satisfaction improvement</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-green-900">Total Impact</h5>
                <p className="text-sm text-green-700">Combined optimization savings</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">-60s</div>
                <div className="text-sm text-green-600">per call average</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-xl shadow-lg border-2 border-orange-100 p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-900">Business Impact Alerts</h3>
              <p className="text-orange-700 mt-1">Critical insights requiring immediate attention</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-5 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-red-100 rounded-full mr-4 animate-pulse">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-red-900">Billing Issues Spike</h4>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">CRITICAL</span>
                  </div>
                  <p className="text-red-700 text-sm mb-2">+25% volume increase needs immediate investigation</p>
                  <div className="flex items-center text-xs text-red-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Detected 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  Investigate
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                  Assign Team
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-yellow-100 rounded-full mr-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-yellow-900">Agent Behavior Pattern</h4>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">WARNING</span>
                  </div>
                  <p className="text-yellow-700 text-sm mb-2">5 agents showing inefficient navigation patterns</p>
                  <div className="flex items-center text-xs text-yellow-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Increasing over last week</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                  Schedule Training
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200">
                  View Details
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-900">Training Impact Success</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">SUCCESS</span>
                  </div>
                  <p className="text-green-700 text-sm mb-2">Product knowledge training reduced AHT by 18%</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    <span>Consistent improvement trend</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Expand Program
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                  View Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgentManagement = () => (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Agent Management Dashboard
            </h2>
            <p className="text-blue-100">Monitor, analyze, and optimize agent performance in real-time</p>
            <div className="flex items-center mt-3 space-x-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-200">{agentData.filter(a => a.status === 'available').length} Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-200">{agentData.filter(a => a.status === 'on-call').length} On Call</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm text-blue-200">{agentData.filter(a => a.status === 'break').length} On Break</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-semibold">Top Performers</p>
              <p className="text-3xl font-bold text-green-900">{agentData.filter(a => a.performance === 'excellent').length}</p>
              <p className="text-sm text-green-600 mt-1">AHT &lt; 240s</p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <Award className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-semibold">Good Performance</p>
              <p className="text-3xl font-bold text-blue-900">{agentData.filter(a => a.performance === 'good').length}</p>
              <p className="text-sm text-blue-600 mt-1">Meeting targets</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <Target className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 font-semibold">Need Support</p>
              <p className="text-3xl font-bold text-orange-900">{agentData.filter(a => a.performance === 'needs-improvement').length}</p>
              <p className="text-sm text-orange-600 mt-1">Requires training</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-semibold">Avg Team AHT</p>
              <p className="text-3xl font-bold text-purple-900">{Math.round(agentData.reduce((sum, a) => sum + a.aht, 0) / agentData.length)}s</p>
              <p className="text-sm text-purple-600 mt-1">Target: 240s</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-full">
              <Clock className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Agent Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 relative max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name, ID, or performance..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm">
                <option>All Status</option>
                <option>Available</option>
                <option>On Call</option>
                <option>On Break</option>
              </select>
              <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm">
                <option>All Performance</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Needs Improvement</option>
              </select>
              <button className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Agent
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Status
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    AHT
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Calls Today
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Resolution Rate
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Performance
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-md ${
                        agent.performance === 'excellent' ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300' :
                        agent.performance === 'good' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300' :
                        'bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300'
                      }`}>
                        <User className={`w-6 h-6 ${
                          agent.performance === 'excellent' ? 'text-green-700' :
                          agent.performance === 'good' ? 'text-blue-700' : 'text-orange-700'
                        }`} />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <span className="mr-2">ID: {agent.id}</span>
                          {agent.performance === 'excellent' && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        agent.status === 'available' ? 'bg-green-500 animate-pulse' :
                        agent.status === 'on-call' ? 'bg-blue-500 animate-pulse' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-full border-2 ${
                        agent.status === 'available' ? 'bg-green-50 text-green-800 border-green-200' :
                        agent.status === 'on-call' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-yellow-50 text-yellow-800 border-yellow-200'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900 mr-2">{agent.aht}s</div>
                      <div className="flex flex-col">
                        <div className={`text-xs font-semibold ${agent.aht > 240 ? 'text-red-600' : 'text-green-600'}`}>
                          {agent.aht > 240 ? 'Above target' : 'Below target'}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 rounded-full ${agent.aht > 240 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((agent.aht / 400) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">{agent.calls}</div>
                    <div className="text-sm text-gray-500">calls</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900 mr-2">{agent.resolution}%</div>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${agent.resolution}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border-2 ${
                      agent.performance === 'excellent' ? 'bg-green-50 text-green-800 border-green-200' :
                      agent.performance === 'good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {agent.performance === 'excellent' ? '🌟 Excellent' :
                       agent.performance === 'good' ? '✅ Good' : '⚠️ Needs Improvement'}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedAgent(agent)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                      >
                        <User className="w-4 h-4 mr-1 inline" />
                        View Details
                      </button>
                      <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                        <Brain className="w-4 h-4 mr-1 inline" />
                        Assign Training
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCallCenter = () => (
    <div className="space-y-8">
      {/* Enhanced Header with Real-time Monitoring */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Phone className="w-8 h-8 mr-3" />
              Contact Center Operations
            </h2>
            <p className="text-emerald-100">Real-time call management and customer interaction platform</p>
            <div className="flex items-center mt-4 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-emerald-200">System Online</span>
              </div>
              <div className="flex items-center">
                <Headphones className="w-4 h-4 mr-2 text-emerald-300" />
                <span className="text-sm text-emerald-200">{agentData.filter(a => a.status === 'on-call').length} Active Calls</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-emerald-300" />
                <span className="text-sm text-emerald-200">{agentData.filter(a => a.status === 'available').length} Available Agents</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsCallActive(!isCallActive)}
              className={`flex items-center px-6 py-3 rounded-lg backdrop-blur-sm border border-white border-opacity-20 transition-all duration-200 ${
                isCallActive ? 'bg-red-500 bg-opacity-80 text-white hover:bg-red-600' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <Phone className="w-5 h-5 mr-2" />
              {isCallActive ? 'End Call' : 'Start Call'}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Call Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-semibold flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Calls in Queue
              </p>
              <p className="text-3xl font-bold text-blue-900">12</p>
              <p className="text-sm text-blue-600 mt-1">Avg wait: 45s</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-blue-200 rounded-full">
                <div className="w-8 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs text-blue-600 mt-1">50% capacity</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Calls Completed
              </p>
              <p className="text-3xl font-bold text-green-900">284</p>
              <p className="text-sm text-green-600 mt-1">Today</p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Average AHT
              </p>
              <p className="text-3xl font-bold text-purple-900">245s</p>
              <p className="text-sm text-purple-600 mt-1">5s above target</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-purple-200 rounded-full">
                <div className="w-10 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-xs text-purple-600 mt-1">Target: 240s</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 font-semibold flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Satisfaction
              </p>
              <p className="text-3xl font-bold text-orange-900">4.7</p>
              <p className="text-sm text-orange-600 mt-1">Out of 5.0</p>
            </div>
            <div className="flex space-x-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Call Interface */}
      {isCallActive && (
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Active Call - Customer: John Smith
            </h3>
            <div className="flex items-center space-x-6">
              <div className="text-lg font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                Duration: 02:34
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-red-600 font-semibold">LIVE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <p><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">John Smith</span></p>
                    <p><span className="font-semibold text-gray-700">Account:</span> <span className="text-blue-600 font-mono">#ACT-789456</span></p>
                  </div>
                  <div className="space-y-3">
                    <p><span className="font-semibold text-gray-700">Issue:</span> <span className="text-gray-900">Billing Inquiry</span></p>
                    <p><span className="font-semibold text-gray-700">Priority:</span> <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Medium</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  AI-Powered Suggestions
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-blue-900">Suggest checking last 3 billing cycles for discrepancies</span>
                  </div>
                  <div className="flex items-start bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-blue-900">Customer has premium support - escalate if needed</span>
                  </div>
                  <div className="flex items-start bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-blue-900">Similar issue resolved in 180s average</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200 text-blue-900 font-medium">
                    <Eye className="w-4 h-4 inline mr-2" />
                    View Account History
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200 text-green-900 font-medium">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Process Refund
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200 text-purple-900 font-medium">
                    <ArrowUp className="w-4 h-4 inline mr-2" />
                    Escalate to Supervisor
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200 text-orange-900 font-medium">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Schedule Callback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Recent Calls Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-green-600" />
                Recent Call Activity
              </h3>
              <p className="text-gray-600 mt-1">Monitor and analyze recent customer interactions</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Time Saved</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getRecentCalls().map((call) => (
                <tr key={call.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 shadow-md border-2 border-blue-300">
                        <User className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{call.customer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{call.issue}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{call.agent}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900 mr-2">{call.duration}s</div>
                      <div className="flex flex-col">
                        <div className={`text-xs font-semibold ${call.duration > 240 ? 'text-red-600' : 'text-green-600'}`}>
                          {call.duration > 240 ? 'Above target' : 'Below target'}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 rounded-full ${call.duration > 240 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, (call.duration / 600) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-600">-{call.timeSavings}s</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">AI + Automation</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      call.resolved ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {call.resolved ? 'Resolved' : 'Follow-up needed'}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                        <FileText className="w-4 h-4 mr-1 inline" />
                        View Transcript
                      </button>
                      <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                        <BarChart3 className="w-4 h-4 mr-1 inline" />
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              Analytics & Intelligence Dashboard
            </h2>
            <p className="text-purple-100">Advanced insights and predictive analytics for AHT optimization</p>
            <div className="flex items-center mt-4 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-purple-200">Real-time Analysis</span>
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-300" />
                <span className="text-sm text-purple-200">AI-Powered Insights</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-300" />
                <span className="text-sm text-purple-200">Predictive Modeling</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Analytics
            </button>
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-semibold flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Avg AHT Today
              </p>
              <p className="text-3xl font-bold text-blue-900">285s</p>
              <p className="text-sm text-blue-600 mt-1">vs. 320s yesterday</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <TrendingDown className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-semibold flex items-center">
                <TrendingDown className="w-4 h-4 mr-2" />
                IT Optimization
              </p>
              <p className="text-3xl font-bold text-green-900">-35s</p>
              <p className="text-sm text-green-600 mt-1">Saved this month</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-green-200 rounded-full">
                <div className="w-12 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-green-600 mt-1">12% improvement</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 font-semibold flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Best Performer
              </p>
              <p className="text-2xl font-bold text-orange-900">Lisa R.</p>
              <p className="text-sm text-orange-600 mt-1">165s avg AHT</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-full">
              <Star className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 font-semibold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Critical Issues
              </p>
              <p className="text-3xl font-bold text-red-900">5</p>
              <p className="text-sm text-red-600 mt-1">Require attention</p>
            </div>
            <div className="text-right">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              <p className="text-xs text-red-600 mt-1">Urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Agent Behavior Analysis */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-purple-600" />
                AI-Powered Agent Behavior Analysis
              </h3>
              <p className="text-gray-600 mt-1">Deep insights into agent performance patterns and optimization opportunities</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md">
                <Brain className="w-4 h-4 mr-2" />
                Run AI Analysis
              </button>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          {getAgentBehaviorInsights().map((insight, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mr-4 shadow-md border-2 border-red-300">
                    <User className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Agent #{insight.agentId} - {agentData.find(a => a.id === insight.agentId)?.name}</h4>
                    <p className="text-sm text-gray-600">Performance analysis & optimization recommendations</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-bold rounded-full border-2 border-red-200">
                  🚨 Needs Attention
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                    Behavioral Patterns
                  </h5>
                  <ul className="space-y-2">
                    {insight.patterns.map((pattern, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-red-600" />
                    Time Wasters Identified
                  </h5>
                  <ul className="space-y-2">
                    {insight.timeWasters.map((waster, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-red-700 font-medium">{waster}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    AI Recommendations
                  </h5>
                  <ul className="space-y-2">
                    {insight.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-green-700 font-medium">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t flex space-x-3">
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Suggestions
                </button>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Coaching
                </button>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Training Suggestions */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Auto-Generated Training Suggestions
              </h3>
              <p className="text-gray-600 mt-1">AI-recommended training programs based on performance analysis</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md">
                <Brain className="w-4 h-4 mr-2" />
                Generate New Suggestions
              </button>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          {getSkillGaps().map((gap, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{gap.skill}</h4>
                  <p className="text-gray-600 mb-3">{gap.agents} agents affected • Potential AHT reduction: <span className="font-bold text-green-600">-45s</span></p>
                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">{gap.agents} agents need training</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="text-sm text-gray-700">Estimated completion: 2-3 weeks</span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${
                  gap.gap === 'High' ? 'bg-red-50 text-red-800 border-red-200' :
                  gap.gap === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                  'bg-green-50 text-green-800 border-green-200'
                }`}>
                  {gap.gap === 'High' ? '🔥 High Priority' :
                   gap.gap === 'Medium' ? '⚠️ Medium Priority' :
                   '✅ Low Priority'}
                </span>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>AI Recommended Training:</strong> {gap.training}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Assign Training
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md font-medium">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Program
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">ROI Estimate</p>
                  <p className="text-lg font-bold text-green-600">$2,400/month saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-700 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3" />
              Training & Development Center
            </h2>
            <p className="text-green-100">AI-powered personalized training recommendations and progress tracking</p>
            <div className="flex items-center mt-4 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-200">Active Programs</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-300" />
                <span className="text-sm text-green-200">16 Agents Enrolled</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-green-300" />
                <span className="text-sm text-green-200">$2,400/month ROI</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Training Recommendations */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                AI-Powered Training Recommendations
              </h3>
              <p className="text-gray-600 mt-1">Personalized training programs based on individual agent performance analysis</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md">
                <Brain className="w-4 h-4 mr-2" />
                Generate New
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-2 border-red-200 rounded-xl p-6 bg-gradient-to-r from-red-50 to-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mr-4 shadow-md border-2 border-red-300">
                    <Database className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">CRM Basics & Product Knowledge</h4>
                    <p className="text-sm text-red-700 font-medium">URGENT - High Impact Training</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">For agents with AHT &gt; 300s due to information lookup delays</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">High Priority</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">8 agents affected</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">Potential -60s AHT reduction</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md font-medium">
                <Zap className="w-4 h-4 mr-2 inline" />
                Assign Now
              </button>
            </div>
          </div>

          <div className="border-2 border-yellow-200 rounded-xl p-6 bg-gradient-to-r from-yellow-50 to-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mr-4 shadow-md border-2 border-yellow-300">
                    <MessageSquare className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Advanced Communication Skills</h4>
                    <p className="text-sm text-yellow-700 font-medium">MEDIUM - De-escalation Focus</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">Focus on de-escalation and efficient problem resolution techniques</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">Medium Priority</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">5 agents affected</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">Potential -30s AHT reduction</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md font-medium">
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Assign
              </button>
            </div>
          </div>

          <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-r from-green-50 to-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-4 shadow-md border-2 border-green-300">
                    <Settings className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Technical Troubleshooting Excellence</h4>
                    <p className="text-sm text-green-700 font-medium">LOW - Advanced Skills</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">Advanced technical support techniques and system optimization</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">Low Priority</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">3 agents affected</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-800">Potential -20s AHT reduction</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md font-medium">
                <Award className="w-4 h-4 mr-2 inline" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Training Progress */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
                Active Training Programs
              </h3>
              <p className="text-gray-600 mt-1">Real-time progress tracking and completion status</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Progress
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-6 shadow-md border-2 border-blue-300">
                  <Brain className="w-8 h-8 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900">Product Knowledge Bootcamp</h4>
                  <p className="text-blue-700 font-medium">8 agents enrolled • Started 2 weeks ago</p>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">Estimated completion: 1 week</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900 mb-2">60%</div>
                <div className="w-32 bg-blue-200 rounded-full h-4 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full shadow-sm" style={{width: '60%'}}></div>
                </div>
                <p className="text-sm text-blue-700 font-medium">Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-6 shadow-md border-2 border-green-300">
                  <MessageSquare className="w-8 h-8 text-green-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-900">Communication Excellence</h4>
                  <p className="text-green-700 font-medium">5 agents enrolled • Started 3 weeks ago</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">Nearly complete - excellent progress</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-900 mb-2">85%</div>
                <div className="w-32 bg-green-200 rounded-full h-4 mb-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-sm" style={{width: '85%'}}></div>
                </div>
                <p className="text-sm text-green-700 font-medium">Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessionReports = () => {
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleString();
    };

    const exportSessionData = () => {
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          totalSessions: sessionData.length,
          exportedBy: 'AHTOptimizationMVP',
          version: '1.0'
        },
        metrics: sessionMetrics,
        sessions: sessionData
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `aht-session-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    if (loadingSessionData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading session data...</p>
          </div>
        </div>
      );
    }

    if (!sessionData || sessionData.length === 0) {
      return (
        <div className="text-center py-12">
          <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Data Found</h3>
          <p className="text-gray-600 mb-4">Complete some sessions in the Contact Center UI to see reports.</p>
          <button
            onClick={loadAllSessionData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Session Data Analysis</h2>
            <p className="text-gray-600 mt-1">Real-time insights from localStorage session data for AHT optimization</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadAllSessionData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
            <button
              onClick={exportSessionData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        {sessionMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold">{sessionMetrics.totalSessions}</p>
                  <p className="text-blue-200 text-sm mt-1">
                    <Database className="w-4 h-4 inline mr-1" />
                    From localStorage
                  </p>
                </div>
                <div className="p-3 bg-blue-400 bg-opacity-50 rounded-full">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Avg Duration</p>
                  <p className="text-3xl font-bold">{formatDuration(sessionMetrics.avgDuration)}</p>
                  <p className="text-green-200 text-sm mt-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {sessionMetrics.avgDuration < 240 ? 'Below target' : 'Above target'}
                  </p>
                </div>
                <div className="p-3 bg-green-400 bg-opacity-50 rounded-full">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg Satisfaction</p>
                  <p className="text-3xl font-bold">{sessionMetrics.avgSatisfaction || 'N/A'}</p>
                  <p className="text-purple-200 text-sm mt-1">
                    <Star className="w-4 h-4 inline mr-1" />
                    Out of 5.0
                  </p>
                </div>
                <div className="p-3 bg-purple-400 bg-opacity-50 rounded-full">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Time Savings</p>
                  <p className="text-3xl font-bold">+{Math.round(sessionMetrics.timeSavings)}s</p>
                  <p className="text-orange-200 text-sm mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    From optimizations
                  </p>
                </div>
                <div className="p-3 bg-orange-400 bg-opacity-50 rounded-full">
                  <Target className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Performance Analysis */}
        {sessionMetrics?.agentPerformance && Object.keys(sessionMetrics.agentPerformance).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Agent Performance Analysis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Satisfaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(sessionMetrics.agentPerformance).map(([agentName, data]) => (
                    <tr key={agentName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{agentName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.sessions}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDuration(data.avgDuration)}</div>
                        <div className={`text-xs ${data.avgDuration > 240 ? 'text-red-500' : 'text-green-500'}`}>
                          {data.avgDuration > 240 ? 'Above target' : 'Below target'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.avgSatisfaction ? `${data.avgSatisfaction}/5.0` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          data.avgDuration <= 240 && data.avgSatisfaction >= 4 ? 'bg-green-100 text-green-800' :
                          data.avgDuration <= 300 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.avgDuration <= 240 && data.avgSatisfaction >= 4 ? 'Excellent' :
                           data.avgDuration <= 300 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resolution and Category Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resolution Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Resolution Status Distribution
            </h4>
            <div className="space-y-3">
              {sessionMetrics?.resolutionStats && Object.entries(sessionMetrics.resolutionStats).map(([status, count]) => {
                const percentage = Math.round((count / sessionMetrics.totalSessions) * 100);
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {status === 'resolved' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                      {status === 'escalated' && <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
                      {status === 'follow-up' && <Clock className="w-4 h-4 text-yellow-500 mr-2" />}
                      {status === 'unknown' && <AlertCircle className="w-4 h-4 text-gray-500 mr-2" />}
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{count} ({percentage}%)</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status === 'resolved' ? 'bg-green-500' :
                            status === 'escalated' ? 'bg-red-500' :
                            status === 'follow-up' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Issue Category Breakdown
            </h4>
            <div className="space-y-3">
              {sessionMetrics?.categoryBreakdown && Object.entries(sessionMetrics.categoryBreakdown).map(([category, count]) => {
                const percentage = Math.round((count / sessionMetrics.totalSessions) * 100);
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                      <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{count} ({percentage}%)</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Impact Analysis */}
        {sessionMetrics?.aiImpact && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Assistance Impact Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-2">AI Suggestions</h5>
                <p className="text-2xl font-bold text-purple-600">
                  {sessionMetrics.aiImpact.totalSuggestions}
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  Avg {Math.round((sessionMetrics.aiImpact.totalSuggestions / sessionMetrics.totalSessions) * 10) / 10} per session
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h5 className="font-medium text-indigo-900 mb-2">Knowledge Base Articles</h5>
                <p className="text-2xl font-bold text-indigo-600">
                  {sessionMetrics.aiImpact.totalKnowledgeBase}
                </p>
                <p className="text-sm text-indigo-700 mt-1">
                  Avg {Math.round((sessionMetrics.aiImpact.totalKnowledgeBase / sessionMetrics.totalSessions) * 10) / 10} per session
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2">Efficiency Gain</h5>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(((sessionMetrics.aiImpact.totalSuggestions + sessionMetrics.aiImpact.totalKnowledgeBase) / sessionMetrics.totalSessions) * 100) / 100}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  AI interactions per session
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Recent Session Details
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessionData.slice(0, 10).map((session) => (
                  <tr key={session.sessionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.sessionId?.slice(-8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.customerInfo?.data?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.agentInfo?.routedAgent?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDuration(session.callInfo?.duration || 0)}</div>
                      <div className={`text-xs ${(session.callInfo?.duration || 0) > 240 ? 'text-red-500' : 'text-green-500'}`}>
                        {(session.callInfo?.duration || 0) > 240 ? 'Above target' : 'Below target'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        session.resolutionDetails?.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        session.resolutionDetails?.status === 'escalated' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.resolutionDetails?.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.resolutionDetails?.customerSatisfaction ? 
                        `${session.resolutionDetails.customerSatisfaction}/5` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        +{Math.round((session.performanceMetrics?.timingSavings?.totalSaved || 0) * 10) / 10}s
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Quality Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-gray-600" />
            Data Quality & Storage Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Total Storage Keys</h5>
              <p className="text-2xl font-bold text-gray-600">
                {Object.keys(localStorage).filter(key => key.includes('session')).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Session-related localStorage keys
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Data Completeness</h5>
              <p className="text-2xl font-bold text-blue-600">
                {sessionData.length > 0 ? 
                  Math.round((sessionData.filter(s => s.validation?.completeness > 80).length / sessionData.length) * 100) : 0}%
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Sessions with complete data
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">Last Updated</h5>
              <p className="text-lg font-bold text-green-600">
                {formatTimestamp(sessionMetrics?.lastUpdated || new Date().toISOString())}
              </p>
              <p className="text-sm text-green-700 mt-1">
                Data refresh timestamp
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Reports & Performance Analytics</h2>
          <p className="text-blue-100 text-lg">Comprehensive reporting and performance insights</p>
        </div>
        <button className="mt-6 flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 font-semibold shadow-lg mx-auto transition-all duration-200 transform hover:scale-105">
          <Download className="w-5 h-5 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Daily Performance</h3>
              <FileText className="w-6 h-6 text-blue-100" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Avg AHT:</span>
                <span className="font-bold text-gray-900">285s</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Calls:</span>
                <span className="font-bold text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Resolution Rate:</span>
                <span className="font-bold text-green-600">94.2%</span>
              </div>
            </div>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Agent Performance</h3>
              <Users className="w-6 h-6 text-purple-100" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Top Performer:</span>
                <span className="font-bold text-gray-900">Lisa Rodriguez</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Avg AHT:</span>
                <span className="font-bold text-green-600">198s</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Need Training:</span>
                <span className="font-bold text-red-600">5 agents</span>
              </div>
            </div>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Training Impact</h3>
              <Brain className="w-6 h-6 text-green-100" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Completed:</span>
                <span className="font-bold text-gray-900">12 agents</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">AHT Improvement:</span>
                <span className="font-bold text-green-600">-45s avg</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">ROI:</span>
                <span className="font-bold text-green-600">$2,340/month</span>
              </div>
            </div>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Database className="w-6 h-6 mr-3" />
            Generated Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Weekly AHT Analysis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Performance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2 hours ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 shadow-sm">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 mr-4 font-semibold">Download</button>
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold">Share</button>
                </td>
              </tr>
              <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Agent Skill Assessment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Training</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1 day ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 shadow-sm">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 mr-4 font-semibold">Download</button>
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold">Share</button>
                </td>
              </tr>
              <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Customer Satisfaction Impact</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3 days ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 shadow-sm">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-400 cursor-not-allowed mr-4 font-semibold">Download</button>
                  <button className="text-gray-400 cursor-not-allowed font-semibold">Share</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Agent Detail Modal
  const AgentDetailModal = ({ agent, onClose }) => {
    if (!agent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Agent Details - {agent.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Agent Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Current AHT</h3>
                <p className="text-2xl font-bold text-blue-700">{agent.aht}s</p>
                <p className="text-sm text-blue-600">Target: 240s</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Resolution Rate</h3>
                <p className="text-2xl font-bold text-green-700">{agent.resolution}%</p>
                <p className="text-sm text-green-600">Above average</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">Calls Today</h3>
                <p className="text-2xl font-bold text-purple-700">{agent.calls}</p>
                <p className="text-sm text-purple-600">Peak performance</p>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium mb-4">AHT Trend (Last 7 Days)</h3>
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive AHT trend chart for {agent.name}</p>
                </div>
              </div>
            </div>

            {/* Training Recommendations */}
            <div>
              <h3 className="font-medium mb-4">Personalized Training Recommendations</h3>
              <div className="space-y-3">
                {agent.aht > 240 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900">Priority: Product Knowledge Training</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Analysis shows longer lookup times. Recommend CRM efficiency training.
                    </p>
                    <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      Assign Training
                    </button>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900">Advanced Communication Skills</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Enhance customer interaction efficiency and de-escalation techniques.
                  </p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Assign Training
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Call History */}
            <div>
              <h3 className="font-medium mb-4">Recent Call Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Technical Support - 245s</span>
                  <span className="text-xs text-green-600">Resolved</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Billing Inquiry - 289s</span>
                  <span className="text-xs text-green-600">Resolved</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Account Access - 156s</span>
                  <span className="text-xs text-green-600">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="  bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <HeadphonesIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">AHT Optimizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Target AHT: <span className="font-medium">240s</span>
              </div>
              <div className="text-sm text-gray-600">
                Current: <span className="font-medium text-red-600">285s</span>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'agents', label: 'Agent Management', icon: Users },
              { id: 'contact-center', label: 'Contact Center', icon: Phone },
              { id: 'analytics', label: 'Analytics', icon: Activity },
              { id: 'training', label: 'Training', icon: Brain },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'session-reports', label: 'Session Data Reports', icon: Database }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'agents' && renderAgentManagement()}
        {activeTab === 'contact-center' && renderCallCenter()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'training' && renderTraining()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'session-reports' && renderSessionReports()}
      </main>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  );
};

export default AHTOptimizationMVP;