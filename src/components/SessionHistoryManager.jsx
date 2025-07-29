import React, { useState, useEffect } from 'react';
import { Database, Download, Trash2, Eye, Calendar, User, Phone, Clock, Star, AlertTriangle, CheckCircle } from 'lucide-react';

const SessionHistoryManager = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [filter, setFilter] = useState('all'); // all, resolved, escalated, follow-up
  const [sortBy, setSortBy] = useState('timestamp'); // timestamp, duration, satisfaction
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Load sessions on component mount
  useEffect(() => {
    loadSessions();
    calculateStatistics();
  }, []);

  const loadSessions = () => {
    try {
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      setSessions(completedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  const calculateStatistics = () => {
    try {
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      
      if (completedSessions.length === 0) {
        setStatistics(null);
        return;
      }
      
      const totalSessions = completedSessions.length;
      const sessionsWithValidation = completedSessions.filter(s => s.validation);
      const avgCompleteness = sessionsWithValidation.length > 0 
        ? Math.round(sessionsWithValidation.reduce((sum, s) => sum + s.validation.completeness, 0) / sessionsWithValidation.length)
        : 0;
      
      const resolutionStats = completedSessions.reduce((stats, session) => {
        const status = session.summary?.resolution?.status || 'unknown';
        stats[status] = (stats[status] || 0) + 1;
        return stats;
      }, {});
      
      const satisfactionScores = completedSessions
        .map(s => s.summary?.resolution?.satisfaction)
        .filter(score => score !== null && score !== undefined);
      
      const avgSatisfaction = satisfactionScores.length > 0
        ? Math.round((satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length) * 10) / 10
        : null;

      const totalDuration = completedSessions.reduce((sum, s) => sum + (s.summary?.performance?.duration || 0), 0);
      const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
      
      setStatistics({
        totalSessions,
        avgCompleteness,
        resolutionStats,
        avgSatisfaction,
        totalSatisfactionRatings: satisfactionScores.length,
        avgDuration: formatDuration(avgDuration),
        totalDuration: formatDuration(totalDuration)
      });
      
    } catch (error) {
      console.error('Error calculating statistics:', error);
      setStatistics(null);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const loadSessionDetails = (sessionMeta) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem(sessionMeta.dataKey) || '{}');
      setSelectedSession({ ...sessionMeta, fullData: sessionData });
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading session details:', error);
      alert('Failed to load session details');
    }
  };

  const exportSession = (sessionMeta) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem(sessionMeta.dataKey) || '{}');
      const filename = `session-${sessionMeta.sessionId}-${new Date(sessionMeta.timestamp).toISOString().split('T')[0]}.json`;
      
      const jsonData = JSON.stringify(sessionData, null, 2);
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
      
    } catch (error) {
      console.error('Error exporting session:', error);
      alert('Failed to export session');
    }
  };

  const deleteSession = (sessionMeta) => {
    if (confirm(`Are you sure you want to delete session ${sessionMeta.sessionId}?`)) {
      try {
        // Remove from localStorage
        localStorage.removeItem(sessionMeta.dataKey);
        
        // Update sessions list
        const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
        const updatedSessions = completedSessions.filter(s => s.dataKey !== sessionMeta.dataKey);
        localStorage.setItem('completed-sessions', JSON.stringify(updatedSessions));
        
        // Reload data
        loadSessions();
        calculateStatistics();
        
        alert('Session deleted successfully');
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session');
      }
    }
  };

  const exportAllSessions = () => {
    try {
      const allSessionsData = sessions.map(sessionMeta => {
        const sessionData = JSON.parse(localStorage.getItem(sessionMeta.dataKey) || '{}');
        return {
          metadata: sessionMeta,
          sessionData: sessionData
        };
      }).filter(session => Object.keys(session.sessionData).length > 0);
      
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          totalSessions: allSessionsData.length,
          exportedBy: 'SessionHistoryManager',
          version: '1.0'
        },
        statistics: statistics,
        sessions: allSessionsData
      };
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `session-history-export-${timestamp}.json`;
      
      const jsonData = JSON.stringify(exportData, null, 2);
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
      
      alert(`Successfully exported ${allSessionsData.length} sessions to ${filename}`);
      
    } catch (error) {
      console.error('Error exporting all sessions:', error);
      alert('Failed to export sessions');
    }
  };

  const getFilteredAndSortedSessions = () => {
    let filtered = sessions;
    
    // Apply filter
    if (filter !== 'all') {
      filtered = sessions.filter(session => 
        session.summary?.resolution?.status === filter
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'timestamp':
          valueA = new Date(a.timestamp);
          valueB = new Date(b.timestamp);
          break;
        case 'duration':
          valueA = a.summary?.performance?.duration || 0;
          valueB = b.summary?.performance?.duration || 0;
          break;
        case 'satisfaction':
          valueA = a.summary?.resolution?.satisfaction || 0;
          valueB = b.summary?.resolution?.satisfaction || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'follow-up':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredSessions = getFilteredAndSortedSessions();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Database className="w-6 h-6 mr-2 text-blue-600" />
          Session History Manager
        </h1>
        <p className="text-gray-600">Manage and analyze completed contact center sessions</p>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalSessions}</div>
            <div className="text-sm text-blue-800">Total Sessions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{statistics.avgSatisfaction || 'N/A'}</div>
            <div className="text-sm text-green-800">Avg Satisfaction</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{statistics.avgDuration}</div>
            <div className="text-sm text-purple-800">Avg Duration</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{statistics.avgCompleteness}%</div>
            <div className="text-sm text-orange-800">Data Completeness</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sessions</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
            <option value="follow-up">Follow-up Required</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
            <option value="satisfaction">Sort by Satisfaction</option>
          </select>
          
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        
        <button
          onClick={exportAllSessions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All ({filteredSessions.length})
        </button>
      </div>

      {/* Sessions List */}
      <div className="bg-gray-50 rounded-lg">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No sessions found</h3>
            <p>No completed sessions match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSessions.map((session, index) => (
              <div key={session.dataKey} className="p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(session.summary?.resolution?.status)}
                      <span className="font-medium text-gray-900">
                        {session.summary?.customer?.name || 'Unknown Customer'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Session {session.sessionId}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {session.summary?.resolution?.status || 'unknown'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {session.summary?.customer?.phone || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatTimestamp(session.timestamp)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.summary?.performance?.durationFormatted || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {session.summary?.resolution?.satisfaction ? `${session.summary.resolution.satisfaction}/5` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => loadSessionDetails(session)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => exportSession(session)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Export Session"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSession(session)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {showDetails && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Session Details - {selectedSession.sessionId}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedSession.summary?.customer?.name || 'N/A'}</div>
                    <div><strong>Phone:</strong> {selectedSession.summary?.customer?.phone || 'N/A'}</div>
                    <div><strong>Issue:</strong> {selectedSession.summary?.customer?.issue || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Resolution Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> {selectedSession.summary?.resolution?.status || 'N/A'}</div>
                    <div><strong>Category:</strong> {selectedSession.summary?.resolution?.category || 'N/A'}</div>
                    <div><strong>Satisfaction:</strong> {selectedSession.summary?.resolution?.satisfaction ? `${selectedSession.summary.resolution.satisfaction}/5` : 'N/A'}</div>
                    <div><strong>Follow-up Required:</strong> {selectedSession.summary?.resolution?.followUpRequired ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Duration:</strong> {selectedSession.summary?.performance?.durationFormatted || 'N/A'}</div>
                    <div><strong>Agent:</strong> {selectedSession.summary?.performance?.agent || 'N/A'}</div>
                    <div><strong>Backend Services:</strong> {selectedSession.summary?.performance?.backendServices || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Analytics</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Sentiment:</strong> {selectedSession.summary?.sentiment?.overall || 'N/A'}</div>
                    <div><strong>Escalation Risk:</strong> {selectedSession.summary?.sentiment?.escalationRisk || 'N/A'}</div>
                    <div><strong>AI Suggestions:</strong> {selectedSession.summary?.analytics?.aiSuggestions || 0}</div>
                    <div><strong>Transcript Messages:</strong> {selectedSession.summary?.analytics?.transcriptMessages || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => exportSession(selectedSession)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Data
                </button>
                <button
                  onClick={() => {
                    console.log('Full session data:', selectedSession.fullData);
                    alert('Full session data logged to console');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Log to Console
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistoryManager;
