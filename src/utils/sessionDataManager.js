// Utility functions for managing session data storage

/**
 * Save session data to a JSON file in the browser
 * @param {Object} sessionData - The complete session data object
 * @param {string} filename - Optional custom filename
 */
export const saveSessionDataToFile = (sessionData, filename = null) => {
  try {
    // Generate filename if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `session-data-${timestamp}.json`;
    const finalFilename = filename || defaultFilename;
    
    // Convert data to JSON string with pretty formatting
    const jsonData = JSON.stringify(sessionData, null, 2);
    
    // Create blob and download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = finalFilename;
    downloadLink.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    
    console.log(`Session data saved to file: ${finalFilename}`);
    return { success: true, filename: finalFilename };
    
  } catch (error) {
    console.error('Error saving session data to file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save session data to localStorage with timestamp
 * @param {Object} sessionData - The complete session data object
 */
export const saveSessionDataToStorage = (sessionData) => {
  try {
    const timestamp = new Date().toISOString();
    const storageKey = `session-data-${timestamp}`;
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
    
    // Also maintain a list of all saved sessions
    const existingSessions = JSON.parse(localStorage.getItem('saved-sessions') || '[]');
    existingSessions.push({
      key: storageKey,
      timestamp: timestamp,
      sessionId: sessionData.callInfo?.sessionId || 'unknown',
      customerName: sessionData.customerInfo?.data?.name || 'Unknown',
      duration: sessionData.callInfo?.duration || 0
    });
    
    // Keep only last 50 sessions to prevent storage overflow
    const recentSessions = existingSessions.slice(-50);
    localStorage.setItem('saved-sessions', JSON.stringify(recentSessions));
    
    console.log(`Session data saved to localStorage: ${storageKey}`);
    return { success: true, key: storageKey };
    
  } catch (error) {
    console.error('Error saving session data to storage:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all saved session data from localStorage
 * @returns {Array} Array of saved session metadata
 */
export const getSavedSessions = () => {
  try {
    return JSON.parse(localStorage.getItem('saved-sessions') || '[]');
  } catch (error) {
    console.error('Error retrieving saved sessions:', error);
    return [];
  }
};

/**
 * Load specific session data from localStorage
 * @param {string} sessionKey - The storage key for the session
 * @returns {Object|null} The session data or null if not found
 */
export const loadSessionData = (sessionKey) => {
  try {
    const data = localStorage.getItem(sessionKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading session data:', error);
    return null;
  }
};

/**
 * Export all saved sessions as a single JSON file
 */
export const exportAllSessions = () => {
  try {
    const savedSessions = getSavedSessions();
    const allSessionsData = [];
    
    // Load all session data
    savedSessions.forEach(sessionMeta => {
      const sessionData = loadSessionData(sessionMeta.key);
      if (sessionData) {
        allSessionsData.push({
          metadata: sessionMeta,
          data: sessionData
        });
      }
    });
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `all-sessions-export-${timestamp}.json`;
    
    return saveSessionDataToFile(allSessionsData, filename);
    
  } catch (error) {
    console.error('Error exporting all sessions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate session summary for quick reference
 * @param {Object} sessionData - The complete session data object
 * @returns {Object} Summarized session information
 */
export const generateSessionSummary = (sessionData) => {
  return {
    sessionId: sessionData.callInfo?.sessionId || 'unknown',
    timestamp: sessionData.additionalContext?.completedAt || new Date().toISOString(),
    customer: {
      name: sessionData.customerInfo?.data?.name || 'Unknown',
      phone: sessionData.customerInfo?.phoneNumber || 'Not provided',
      issue: sessionData.customerInfo?.issue || sessionData.customerInfo?.selectedOption || 'Not specified'
    },
    resolution: {
      status: sessionData.resolutionDetails?.status || 'unknown',
      category: sessionData.resolutionDetails?.category || 'unknown',
      satisfaction: sessionData.resolutionDetails?.customerSatisfaction || null,
      followUpRequired: sessionData.resolutionDetails?.followUpRequired || false
    },
    performance: {
      duration: sessionData.callInfo?.duration || 0,
      durationFormatted: formatDuration(sessionData.callInfo?.duration || 0),
      agent: sessionData.agentInfo?.routedAgent?.name || 'Not assigned',
      agentMatchScore: sessionData.agentInfo?.agentMatchScore || null,
      backendServices: `${sessionData.backendData?.successfulServices || 0}/${sessionData.backendData?.totalServices || 0}`,
      timingSavings: sessionData.performanceMetrics?.timingSavings?.totalSaved || 0
    },
    sentiment: {
      overall: sessionData.sentimentAnalysis?.currentSentiment?.overallSentiment || 'unknown',
      score: sessionData.sentimentAnalysis?.currentSentiment?.sentimentScore || null,
      escalationRisk: sessionData.sentimentAnalysis?.escalationRisk || 'unknown',
      customerState: sessionData.sentimentAnalysis?.currentSentiment?.customerState || 'unknown'
    },
    analytics: {
      aiSuggestions: sessionData.aiAnalytics?.suggestions?.length || 0,
      knowledgeBaseArticles: sessionData.aiAnalytics?.knowledgeBase?.length || 0,
      transcriptMessages: sessionData.conversationData?.transcript?.length || 0
    }
  };
};

/**
 * Helper function to format duration in seconds to MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate session data structure
 * @param {Object} sessionData - The session data to validate
 * @returns {Object} Validation result with any missing fields
 */
export const validateSessionData = (sessionData) => {
  const requiredFields = [
    'callInfo',
    'customerInfo', 
    'agentInfo',
    'resolutionDetails',
    'conversationData'
  ];
  
  const missingFields = [];
  const warnings = [];
  
  requiredFields.forEach(field => {
    if (!sessionData[field]) {
      missingFields.push(field);
    }
  });
  
  // Check for important data completeness
  if (!sessionData.customerInfo?.data?.name) {
    warnings.push('Customer name is missing');
  }
  
  if (!sessionData.resolutionDetails?.status) {
    warnings.push('Resolution status is missing');
  }
  
  if (!sessionData.conversationData?.transcript?.length) {
    warnings.push('No transcript data available');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
    completeness: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
  };
};
