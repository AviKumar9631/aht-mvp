import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Calendar, Clock, User, Phone, TrendingUp, TrendingDown, 
  Activity, BarChart3, PieChart, AlertCircle, CheckCircle, Brain, Target, 
  Star, Award, Filter, Search, RefreshCw, MessageSquare, Database
} from 'lucide-react';

const SessionDataReports = () => {
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [reportMetrics, setReportMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load session data from localStorage on component mount
  useEffect(() => {
    loadSessionData();
  }, []);

  // Recalculate metrics when data or filters change
  useEffect(() => {
    if (sessionData.length > 0) {
      calculateReportMetrics();
    }
  }, [sessionData, selectedTimeRange, selectedAgent, selectedStatus]);

  const loadSessionData = () => {
    try {
      setLoading(true);
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

      setSessionData(fullSessionData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading session data:', error);
      setLoading(false);
    }
  };

  const calculateReportMetrics = () => {
    if (sessionData.length === 0) return;

    const filteredData = getFilteredSessions();
    
    // Basic metrics
    const totalSessions = filteredData.length;
    const totalDuration = filteredData.reduce((sum, session) => 
      sum + (session.callInfo?.duration || 0), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
    
    // Resolution metrics
    const resolutionStats = filteredData.reduce((stats, session) => {
      const status = session.resolutionDetails?.status || 'unknown';
      stats[status] = (stats[status] || 0) + 1;
      return stats;
    }, {});

    // Satisfaction metrics
    const satisfactionScores = filteredData
      .map(s => s.resolutionDetails?.customerSatisfaction)
      .filter(score => score !== null && score !== undefined);
    
    const avgSatisfaction = satisfactionScores.length > 0
      ? Math.round((satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length) * 10) / 10
      : null;

    // Agent performance
    const agentStats = filteredData.reduce((stats, session) => {
      const agentName = session.agentInfo?.routedAgent?.name || 'Unknown';
      if (!stats[agentName]) {
        stats[agentName] = {
          name: agentName,
          totalCalls: 0,
          totalDuration: 0,
          satisfactionScores: [],
          resolutionTypes: {}
        };
      }
      stats[agentName].totalCalls++;
      stats[agentName].totalDuration += session.callInfo?.duration || 0;
      
      if (session.resolutionDetails?.customerSatisfaction) {
        stats[agentName].satisfactionScores.push(session.resolutionDetails.customerSatisfaction);
      }
      
      const resType = session.resolutionDetails?.status || 'unknown';
      stats[agentName].resolutionTypes[resType] = (stats[agentName].resolutionTypes[resType] || 0) + 1;
      
      return stats;
    }, {});

    // Calculate agent averages
    Object.keys(agentStats).forEach(agentName => {
      const agent = agentStats[agentName];
      agent.avgDuration = Math.round(agent.totalDuration / agent.totalCalls);
      agent.avgSatisfaction = agent.satisfactionScores.length > 0
        ? Math.round((agent.satisfactionScores.reduce((sum, score) => sum + score, 0) / agent.satisfactionScores.length) * 10) / 10
        : null;
    });

    // Sentiment analysis
    const sentimentStats = filteredData.reduce((stats, session) => {
      const sentiment = session.sentimentAnalysis?.currentSentiment?.overallSentiment || 'unknown';
      stats[sentiment] = (stats[sentiment] || 0) + 1;
      return stats;
    }, {});

    // Backend performance
    const backendStats = filteredData.reduce((stats, session) => {
      if (session.backendData?.details) {
        stats.totalServices += session.backendData.totalServices || 0;
        stats.successfulServices += session.backendData.successfulServices || 0;
        stats.totalBackendTime += session.backendData.totalBackendTime || 0;
        stats.sessions++;
      }
      return stats;
    }, { totalServices: 0, successfulServices: 0, totalBackendTime: 0, sessions: 0 });

    // Timing savings analysis
    const timingSavings = filteredData.reduce((totals, session) => {
      if (session.performanceMetrics?.timingSavings) {
        totals.totalSaved += session.performanceMetrics.timingSavings.totalSaved || 0;
        totals.sessions++;
      }
      return totals;
    }, { totalSaved: 0, sessions: 0 });

    // Issue category analysis
    const issueCategories = filteredData.reduce((stats, session) => {
      const category = session.customerInfo?.selectedOption || 
                     session.resolutionDetails?.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
      return stats;
    }, {});

    // AI suggestions impact
    const aiImpact = filteredData.reduce((stats, session) => {
      const suggestions = session.aiAnalytics?.suggestions?.length || 0;
      const knowledgeBase = session.aiAnalytics?.knowledgeBase?.length || 0;
      stats.totalSuggestions += suggestions;
      stats.totalKnowledgeBase += knowledgeBase;
      stats.sessions++;
      return stats;
    }, { totalSuggestions: 0, totalKnowledgeBase: 0, sessions: 0 });

    setReportMetrics({
      totalSessions,
      avgDuration,
      totalDuration,
      resolutionStats,
      avgSatisfaction,
      satisfactionScores,
      agentStats,
      sentimentStats,
      backendStats,
      timingSavings,
      issueCategories,
      aiImpact,
      dataCompleteness: filteredData.reduce((sum, s) => sum + (s.validation?.completeness || 0), 0) / totalSessions
    });
  };

  const getFilteredSessions = () => {
    let filtered = sessionData;

    // Time range filter
    if (selectedTimeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (selectedTimeRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(session => 
        new Date(session.completedAt) >= cutoffDate
      );
    }

    // Agent filter
    if (selectedAgent !== 'all') {
      filtered = filtered.filter(session => 
        session.agentInfo?.routedAgent?.name === selectedAgent
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(session => 
        session.resolutionDetails?.status === selectedStatus
      );
    }

    return filtered;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportReport = () => {
    const reportData = {
      reportInfo: {
        generatedAt: new Date().toISOString(),
        timeRange: selectedTimeRange,
        agentFilter: selectedAgent,
        statusFilter: selectedStatus,
        version: '1.0'
      },
      metrics: reportMetrics,
      sessionData: getFilteredSessions().map(session => ({
        sessionId: session.sessionId,
        completedAt: session.completedAt,
        customer: session.customerInfo?.data?.name || 'Unknown',
        agent: session.agentInfo?.routedAgent?.name || 'Unknown',
        duration: session.callInfo?.duration || 0,
        status: session.resolutionDetails?.status || 'unknown',
        satisfaction: session.resolutionDetails?.customerSatisfaction || null,
        sentiment: session.sentimentAnalysis?.currentSentiment?.overallSentiment || 'unknown',
        backendServices: `${session.backendData?.successfulServices || 0}/${session.backendData?.totalServices || 0}`,
        aiSuggestions: session.aiAnalytics?.suggestions?.length || 0,
        timingSaved: session.performanceMetrics?.timingSavings?.totalSaved || 0
      }))
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `session-report-${selectedTimeRange}-${timestamp}.json`;
    
    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{reportMetrics?.totalSessions || 0}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" />
                {selectedTimeRange} period
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Duration</p>
              <p className="text-3xl font-bold text-gray-900">{formatDuration(reportMetrics?.avgDuration || 0)}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {reportMetrics?.avgDuration > 240 ? 'Above target' : 'Below target'}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportMetrics?.avgSatisfaction ? `${reportMetrics.avgSatisfaction}/5` : 'N/A'}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <Star className="w-4 h-4 mr-1" />
                {reportMetrics?.satisfactionScores?.length || 0} ratings
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportMetrics?.resolutionStats?.resolved ? 
                  Math.round((reportMetrics.resolutionStats.resolved / reportMetrics.totalSessions) * 100) : 0}%
              </p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                {reportMetrics?.resolutionStats?.resolved || 0} resolved
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Status Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Resolution Status Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportMetrics && Object.entries(reportMetrics.resolutionStats || {}).map(([status, count]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{status.replace('-', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  status === 'resolved' ? 'bg-green-100' :
                  status === 'escalated' ? 'bg-red-100' :
                  status === 'follow-up' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {status === 'resolved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {status === 'escalated' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {status === 'follow-up' && <Clock className="w-5 h-5 text-yellow-600" />}
                  {!['resolved', 'escalated', 'follow-up'].includes(status) && <Activity className="w-5 h-5 text-gray-600" />}
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      status === 'resolved' ? 'bg-green-500' :
                      status === 'escalated' ? 'bg-red-500' :
                      status === 'follow-up' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${(count / reportMetrics.totalSessions) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((count / reportMetrics.totalSessions) * 100)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Sentiment Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Customer Sentiment Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportMetrics && Object.entries(reportMetrics.sentimentStats || {}).map(([sentiment, count]) => (
            <div key={sentiment} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{sentiment}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {count} sessions
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    sentiment === 'positive' ? 'bg-green-500' :
                    sentiment === 'negative' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}
                  style={{ width: `${(count / reportMetrics.totalSessions) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round((count / reportMetrics.totalSessions) * 100)}% of sessions
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Category Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Issue Category Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportMetrics && Object.entries(reportMetrics.issueCategories || {})
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => {
                  const categoryData = getFilteredSessions().filter(s => 
                    (s.customerInfo?.selectedOption || s.resolutionDetails?.category || 'unknown') === category
                  );
                  const avgDuration = categoryData.length > 0 
                    ? Math.round(categoryData.reduce((sum, s) => sum + (s.callInfo?.duration || 0), 0) / categoryData.length)
                    : 0;
                  const resolvedCount = categoryData.filter(s => s.resolutionDetails?.status === 'resolved').length;
                  const resolutionRate = categoryData.length > 0 ? Math.round((resolvedCount / categoryData.length) * 100) : 0;
                  
                  return (
                    <tr key={category} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium capitalize">{category.replace('_', ' ')}</td>
                      <td className="px-4 py-3">{count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{Math.round((count / reportMetrics.totalSessions) * 100)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / reportMetrics.totalSessions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${avgDuration > 240 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatDuration(avgDuration)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${resolutionRate >= 90 ? 'text-green-600' : resolutionRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {resolutionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAgentPerformance = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Agent Performance Analysis</h3>
      
      {/* Agent Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportMetrics && Object.entries(reportMetrics.agentStats || {}).map(([agentName, stats]) => (
          <div key={agentName} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{stats.name}</h4>
                  <p className="text-sm text-gray-500">{stats.totalCalls} calls</p>
                </div>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                stats.avgDuration <= 240 ? 'bg-green-100 text-green-800' :
                stats.avgDuration <= 300 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {stats.avgDuration <= 240 ? 'Excellent' : stats.avgDuration <= 300 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Duration:</span>
                <span className={`font-medium ${stats.avgDuration > 240 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDuration(stats.avgDuration)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Satisfaction:</span>
                <span className="font-medium text-gray-900">
                  {stats.avgSatisfaction ? `${stats.avgSatisfaction}/5` : 'N/A'}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Resolution Types:</p>
                <div className="space-y-1">
                  {Object.entries(stats.resolutionTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Performance Score:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stats.avgDuration <= 240 ? 'bg-green-500' :
                        stats.avgDuration <= 300 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.max(20, Math.min(100, 100 - ((stats.avgDuration - 180) / 200) * 80))}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(Math.max(20, Math.min(100, 100 - ((stats.avgDuration - 180) / 200) * 80)))}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Performance Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h4 className="text-lg font-semibold">Detailed Agent Comparison</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Calls</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportMetrics && Object.entries(reportMetrics.agentStats || {})
                .sort(([,a], [,b]) => a.avgDuration - b.avgDuration)
                .map(([agentName, stats]) => {
                  const resolutionRate = stats.resolutionTypes.resolved 
                    ? Math.round((stats.resolutionTypes.resolved / stats.totalCalls) * 100)
                    : 0;
                  
                  return (
                    <tr key={agentName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{stats.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.totalCalls}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDuration(stats.avgDuration)}</div>
                        <div className={`text-xs ${stats.avgDuration > 240 ? 'text-red-500' : 'text-green-500'}`}>
                          {stats.avgDuration > 240 ? 'Above target' : 'Below target'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stats.avgSatisfaction ? `${stats.avgSatisfaction}/5` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          resolutionRate >= 90 ? 'text-green-600' : 
                          resolutionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {resolutionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          stats.avgDuration <= 240 ? 'bg-green-100 text-green-800' :
                          stats.avgDuration <= 300 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {stats.avgDuration <= 240 ? 'Excellent' : stats.avgDuration <= 300 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTechnologyImpact = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Technology Impact Analysis</h3>
      
      {/* Backend Services Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Backend Services</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportMetrics?.backendStats?.totalServices || 0}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" />
                Total executed
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportMetrics?.backendStats?.totalServices 
                  ? Math.round((reportMetrics.backendStats.successfulServices / reportMetrics.backendStats.totalServices) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                {reportMetrics?.backendStats?.successfulServices || 0} successful
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Backend Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportMetrics?.backendStats?.sessions 
                  ? Math.round(reportMetrics.backendStats.totalBackendTime / reportMetrics.backendStats.sessions)
                  : 0}ms
              </p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Per session
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Timing Savings Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-green-600" />
          Time Savings Impact
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">Total Time Saved</h5>
              <p className="text-2xl font-bold text-green-600">
                {reportMetrics?.timingSavings?.totalSaved 
                  ? Math.round(reportMetrics.timingSavings.totalSaved * 10) / 10 
                  : 0}s
              </p>
              <p className="text-sm text-green-700 mt-1">
                Across {reportMetrics?.timingSavings?.sessions || 0} sessions
              </p>
            </div>
          </div>
          <div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Avg Savings Per Session</h5>
              <p className="text-2xl font-bold text-blue-600">
                {reportMetrics?.timingSavings?.sessions 
                  ? Math.round((reportMetrics.timingSavings.totalSaved / reportMetrics.timingSavings.sessions) * 10) / 10
                  : 0}s
              </p>
              <p className="text-sm text-blue-700 mt-1">
                From prefetch & automation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Impact Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          AI Assistance Impact
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-medium text-purple-900 mb-2">AI Suggestions</h5>
            <p className="text-2xl font-bold text-purple-600">
              {reportMetrics?.aiImpact?.totalSuggestions || 0}
            </p>
            <p className="text-sm text-purple-700 mt-1">
              Avg {reportMetrics?.aiImpact?.sessions 
                ? Math.round(reportMetrics.aiImpact.totalSuggestions / reportMetrics.aiImpact.sessions * 10) / 10
                : 0} per session
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <h5 className="font-medium text-indigo-900 mb-2">Knowledge Base Articles</h5>
            <p className="text-2xl font-bold text-indigo-600">
              {reportMetrics?.aiImpact?.totalKnowledgeBase || 0}
            </p>
            <p className="text-sm text-indigo-700 mt-1">
              Avg {reportMetrics?.aiImpact?.sessions 
                ? Math.round(reportMetrics.aiImpact.totalKnowledgeBase / reportMetrics.aiImpact.sessions * 10) / 10
                : 0} per session
            </p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h5 className="font-medium text-pink-900 mb-2">Data Completeness</h5>
            <p className="text-2xl font-bold text-pink-600">
              {Math.round(reportMetrics?.dataCompleteness || 0)}%
            </p>
            <p className="text-sm text-pink-700 mt-1">
              Average across all sessions
            </p>
          </div>
        </div>
      </div>

      {/* Technology ROI Calculation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold mb-4">Technology ROI Analysis</h4>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Calculated Benefits</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Time Savings:</p>
                <p className="font-medium">
                  {reportMetrics?.timingSavings?.totalSaved 
                    ? `${Math.round(reportMetrics.timingSavings.totalSaved)} seconds total`
                    : '0 seconds'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Cost Reduction:</p>
                <p className="font-medium">
                  ${reportMetrics?.timingSavings?.totalSaved 
                    ? Math.round((reportMetrics.timingSavings.totalSaved / 3600) * 25)
                    : 0} estimated
                </p>
              </div>
              <div>
                <p className="text-gray-600">Efficiency Gain:</p>
                <p className="font-medium">
                  {reportMetrics?.avgDuration 
                    ? Math.round(((reportMetrics.timingSavings?.totalSaved || 0) / reportMetrics.avgDuration) * 100)
                    : 0}% improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedSessions = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Detailed Session Analysis</h3>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Individual Session Details</h4>
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Sessions
            </button>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredSessions().map((session) => (
                <tr key={session.sessionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {session.sessionId || 'N/A'}
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
                      session.resolutionDetails?.status === 'follow-up' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.resolutionDetails?.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.resolutionDetails?.customerSatisfaction 
                      ? `${session.resolutionDetails.customerSatisfaction}/5 ⭐`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.sentimentAnalysis?.currentSentiment?.overallSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      session.sentimentAnalysis?.currentSentiment?.overallSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.sentimentAnalysis?.currentSentiment?.overallSentiment || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-xs text-gray-600">
                      AI: {session.aiAnalytics?.suggestions?.length || 0} | 
                      KB: {session.aiAnalytics?.knowledgeBase?.length || 0}
                    </div>
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
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading session data...</p>
        </div>
      </div>
    );
  }

  if (sessionData.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Data Found</h3>
        <p className="text-gray-600 mb-4">Complete some sessions in the Contact Center UI to see reports here.</p>
        <button
          onClick={loadSessionData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Data Reports</h1>
        <p className="text-gray-600">Comprehensive analysis of contact center session data</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Agents</option>
              {reportMetrics && Object.keys(reportMetrics.agentStats || {}).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'agents', name: 'Agent Performance', icon: User },
              { id: 'technology', name: 'Technology Impact', icon: Target },
              { id: 'sessions', name: 'Detailed Sessions', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'agents' && renderAgentPerformance()}
          {activeTab === 'technology' && renderTechnologyImpact()}
          {activeTab === 'sessions' && renderDetailedSessions()}
        </div>
      </div>
    </div>
  );
};

export default SessionDataReports;
