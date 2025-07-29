import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, User, Clock, MessageSquare, Search, Send, Star, AlertCircle, CheckCircle, Mic, MicOff, Volume2, VolumeX, Settings, BarChart3, FileText, Tag, Zap, Bot, ThumbsUp, ThumbsDown, X, Download, Save, Database } from 'lucide-react';
import TRANSCRIPT_DATA from '../utils/TRANSCRIPT_DATA.json';
import { 
  saveSessionDataToFile, 
  saveSessionDataToStorage, 
  generateSessionSummary, 
  validateSessionData,
  exportAllSessions,
  getSavedSessions 
} from '../utils/sessionDataManager';

const ContactCenterUI = () => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, incoming, active, hold, transferring
  const [customerData, setCustomerData] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [callNotes, setCallNotes] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentIssue, setCurrentIssue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Resolution section state
  const [resolutionStatus, setResolutionStatus] = useState(''); // pending, resolved, escalated, follow-up
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolutionCategory, setResolutionCategory] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [customerSatisfaction, setCustomerSatisfaction] = useState(null);
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);
  
  // IVR Session Data State Variables
  const [ivrSessionData, setIvrSessionData] = useState(null);
  const [ivrSessionSummary, setIvrSessionSummary] = useState(null);
  const [routedAgent, setRoutedAgent] = useState(null);
  const [backendDetails, setBackendDetails] = useState([]);
  
  // Additional IVR Data State Variables
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [categoryMapping, setCategoryMapping] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionTimestamp, setSessionTimestamp] = useState('');
  const [agentMatchScore, setAgentMatchScore] = useState(null);
  const [availableAgentsCount, setAvailableAgentsCount] = useState(0);
  const [totalBackendServices, setTotalBackendServices] = useState(0);
  const [successfulServices, setSuccessfulServices] = useState(0);
  const [failedServices, setFailedServices] = useState(0);
  const [totalBackendTime, setTotalBackendTime] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [lastIVRSession, setLastIVRSession] = useState('');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showOptimizationDemo, setShowOptimizationDemo] = useState(true);
  const [timingSavings, setTimingSavings] = useState(null);
  const [geminiApiLoading, setGeminiApiLoading] = useState(false);
  const [geminiApiResponse, setGeminiApiResponse] = useState(null);
  
  // Customer Sentiment Analysis State Variables
  const [currentSentiment, setCurrentSentiment] = useState(null);
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [sentimentTrend, setSentimentTrend] = useState('neutral');
  const [emotionalIndicators, setEmotionalIndicators] = useState([]);
  const [escalationRisk, setEscalationRisk] = useState('low');
  const [sentimentAnalysisLoading, setSentimentAnalysisLoading] = useState(false);
  
  // Rate limiting for Gemini API calls
  const [lastGeminiCall, setLastGeminiCall] = useState(0);
  const [geminiCallQueue, setGeminiCallQueue] = useState([]);
  const GEMINI_RATE_LIMIT_MS = 2000; // 2 seconds between calls
  
  const callTimerRef = useRef(null);

  // Helper functions for session data management (moved inside component scope)
  const exportAllCompletedSessions = () => {
    try {
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      
      if (completedSessions.length === 0) {
        alert('No completed sessions found to export.');
        return;
      }
      
      // Load all session data
      const allSessionsData = completedSessions.map(sessionMeta => {
        const sessionData = JSON.parse(localStorage.getItem(sessionMeta.dataKey) || '{}');
        return {
          metadata: sessionMeta,
          sessionData: sessionData
        };
      }).filter(session => Object.keys(session.sessionData).length > 0);
      
      // Create export data
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          totalSessions: allSessionsData.length,
          exportedBy: 'ContactCenterUI',
          version: '1.0'
        },
        sessions: allSessionsData
      };
      
      // Generate filename and download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `all-completed-sessions-${timestamp}.json`;
      
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
      alert('Failed to export sessions. Check console for details.');
    }
  };

  const getSessionStatistics = () => {
    try {
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      
      if (completedSessions.length === 0) {
        return null;
      }
      
      // Calculate statistics
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
      
      return {
        totalSessions,
        avgCompleteness,
        resolutionStats,
        avgSatisfaction,
        totalSatisfactionRatings: satisfactionScores.length
      };
      
    } catch (error) {
      console.error('Error calculating session statistics:', error);
      return null;
    }
  };

  const clearOldSessionData = (daysOld = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      const recentSessions = completedSessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate > cutoffDate;
      });
      
      // Remove old session data from localStorage
      const removedCount = completedSessions.length - recentSessions.length;
      completedSessions.forEach(session => {
        const sessionDate = new Date(session.timestamp);
        if (session.dataKey && sessionDate <= cutoffDate) {
          localStorage.removeItem(session.dataKey);
        }
      });
      
      // Update completed sessions list
      localStorage.setItem('completed-sessions', JSON.stringify(recentSessions));
      
      console.log(`Cleaned up ${removedCount} sessions older than ${daysOld} days`);
      return { removed: removedCount, remaining: recentSessions.length };
      
    } catch (error) {
      console.error('Error cleaning up old session data:', error);
      return { removed: 0, remaining: 0 };
    }
  };

  // Utility function to safely filter transcript messages
  const safeFilterTranscript = (messages, filterFn) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }
    return messages.filter(msg => msg && typeof msg === 'object' && filterFn(msg));
  };

  // Rate limiting wrapper for Gemini API calls
  const rateLimitedGeminiCall = async (apiFunction, ...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastGeminiCall;
    
    if (timeSinceLastCall < GEMINI_RATE_LIMIT_MS) {
      console.log(`Rate limiting Gemini API call. Waiting ${GEMINI_RATE_LIMIT_MS - timeSinceLastCall}ms`);
      return null; // Skip this call to avoid rate limiting
    }
    
    setLastGeminiCall(now);
    return await apiFunction(...args);
  };

  // Dialogflow chatbot integration
  useEffect(() => {
    // Function to load Dialogflow scripts and create chatbot
    const loadDialogflowChatbot = () => {
      // Check if scripts are already loaded
      if (document.querySelector('script[src*="df-messenger.js"]')) {
        return;
      }

      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
      document.head.appendChild(cssLink);

      // Load JavaScript
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
      script.onload = () => {
        // Create df-messenger element
        const dfMessenger = document.createElement('df-messenger');
        dfMessenger.setAttribute('location', 'us-central1');
        dfMessenger.setAttribute('project-id', 'prj-mm-genai-qa-001');
        dfMessenger.setAttribute('agent-id', 'b0f263de-3928-4f39-a20b-669b42b5f6de');
        dfMessenger.setAttribute('language-code', 'en');
        dfMessenger.setAttribute('max-query-length', '-1');
        dfMessenger.setAttribute('allow-feedback', 'all');

        // Create chat bubble
        const chatBubble = document.createElement('df-messenger-chat-bubble');
        chatBubble.setAttribute('chat-title', 'AHT_Demo');
        dfMessenger.appendChild(chatBubble);

        // Add to body
        document.body.appendChild(dfMessenger);

        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
          df-messenger {
            z-index: 999;
            position: fixed;
            --df-messenger-font-color: #000;
            --df-messenger-font-family: Google Sans;
            --df-messenger-chat-background: #f3f6fc;
            --df-messenger-message-user-background: #d3e3fd;
            --df-messenger-message-bot-background: #fff;
            bottom: 16px;
            right: 16px;
          }
        `;
        document.head.appendChild(style);
      };
      document.head.appendChild(script);
    };

    // Load chatbot when component mounts
    loadDialogflowChatbot();

    // Cleanup function
    return () => {
      // Remove df-messenger element
      const dfMessenger = document.querySelector('df-messenger');
      if (dfMessenger) {
        dfMessenger.remove();
      }
      
      // Remove custom styles (optional, might want to keep for other components)
      const customStyle = document.querySelector('style');
      if (customStyle && customStyle.textContent.includes('df-messenger')) {
        customStyle.remove();
      }
    };
  }, []);

  // Function to load IVR session data from localStorage
  const loadIVRSessionData = () => {
    try {
      const storedData = localStorage.getItem('ivrSessionData');
      const storedSummary = localStorage.getItem('ivrSessionSummary');
      const storedLastSession = localStorage.getItem('lastIVRSession');
      
      if (storedData) {
        const ivrData = JSON.parse(storedData);
        console.log('Loaded IVR session data:', ivrData);
        
        // Store complete IVR session data
        setIvrSessionData(ivrData);
        
        // Load individual data fields into state variables
        if (ivrData.phoneNumber) setPhoneNumber(ivrData.phoneNumber);
        if (ivrData.selectedOption) setSelectedOption(ivrData.selectedOption);
        if (ivrData.categoryMapping) setCategoryMapping(ivrData.categoryMapping);
        if (ivrData.sessionId) setSessionId(ivrData.sessionId);
        if (ivrData.timestamp) setSessionTimestamp(ivrData.timestamp);
        if (ivrData.agentMatchScore) setAgentMatchScore(ivrData.agentMatchScore);
        if (ivrData.availableAgentsCount) setAvailableAgentsCount(ivrData.availableAgentsCount);
        if (ivrData.totalBackendServices) setTotalBackendServices(ivrData.totalBackendServices);
        if (ivrData.successfulServices) setSuccessfulServices(ivrData.successfulServices);
        if (ivrData.failedServices) setFailedServices(ivrData.failedServices);
        if (ivrData.totalBackendTime) setTotalBackendTime(ivrData.totalBackendTime);
        if (ivrData.activityLog) setActivityLog(ivrData.activityLog);
        
        // Load customer data from IVR session
        if (ivrData.customerData) {
          setCustomerData({
            ...ivrData.customerData,
            phone: ivrData.phoneNumber,
            issue: ivrData.selectedOption || ivrData.customerData.issues?.[0] || 'General inquiry',
            sentiment: 'neutral' // Default, could be enhanced with sentiment analysis
          });
        }
        
        // Load routed agent information
        if (ivrData.routedAgent) {
          setRoutedAgent(ivrData.routedAgent);
        }
        
        // Load backend details
        if (ivrData.backendDetails) {
          setBackendDetails(ivrData.backendDetails);
          
          // Call Gemini API with backend details RESPONSE_XML (rate limited)
          rateLimitedGeminiCall(callGeminiAPI, ivrData.backendDetails);
        }
        
        // Set call duration from IVR session
        if (ivrData.callDuration) {
          setCallDuration(ivrData.callDuration);
        }
        
        // Set current issue based on IVR selection
        if (ivrData.selectedOption) {
          setCurrentIssue(ivrData.selectedOption);
        }
        
        // Generate AI suggestions based on IVR data
        generateAISuggestionsFromIVR(ivrData);
        
        // Generate knowledge base results based on IVR selection
        generateKnowledgeBaseFromIVR(ivrData);
        
        // Calculate timing savings from pre-fetched data
        calculateTimingSavings(ivrData);
        
        // Set call status to active since customer is being transferred
        setCallStatus('active');
        setIsRecording(true);
      }
      
      // Load session summary if available
      if (storedSummary) {
        const summaryData = JSON.parse(storedSummary);
        setIvrSessionSummary(summaryData);
        console.log('Loaded IVR session summary:', summaryData);
      }
      
      // Load last session timestamp
      if (storedLastSession) {
        setLastIVRSession(storedLastSession);
        console.log('Last IVR session:', storedLastSession);
      }
      
      if (storedData) {
        const ivrData = JSON.parse(storedData);
        return ivrData;
      } else {
        console.log('No IVR session data found in localStorage');
        return null;
      }
    } catch (error) {
      console.error('Error loading IVR session data:', error);
      return null;
    }
  };

  // Function to call Gemini API with backend details RESPONSE_XML
  const callGeminiAPI = async (backendDetails) => {
    if (!backendDetails || backendDetails.length === 0) {
      console.warn('No backend details available for Gemini API call');
      return null;
    }

    setGeminiApiLoading(true);

    try {
      // Extract all RESPONSE_XML data from backend details
      const responseXmlData = backendDetails
        .filter(service => service.RESPONSE_XML)
        .map(service => ({
          serviceName: service.SERVICE_NAME,
          responseXml: JSON.stringify(service.RESPONSE_XML, null, 2)
        }));

      if (responseXmlData.length === 0) {
        console.warn('No RESPONSE_XML data found in backend details');
        setGeminiApiLoading(false);
        return null;
      }

      // Prepare the text payload with all RESPONSE_XML data
      const xmlText = responseXmlData
        .map(item => `Service: ${item.serviceName}\nResponse XML:\n${item.responseXml}\n`)
        .join('\n---\n\n');

      // Gemini API payload
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Analyze this customer's backend data. Provide a brief summary bullet points:

• **Customer**: Name, account #, service address
• **Active Services**: Main products/services with status
• **Issues/Actions**: Any failures, pending tasks, or recommendations

Keep it under 150 words for quick agent reference:\n\n${xmlText}`
              }
            ]
          }
        ]
      };

      console.log('Calling Gemini API with backend details:', payload);

      // Make the API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyBvzv6AyNg-pojZ1LNWGg2MHtbpHRpySvs' // You'll need to set your API key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Gemini API rate limit hit for backend analysis. Skipping this call.');
          setGeminiApiLoading(false);
          return null;
        }
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);

      setGeminiApiResponse(data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        // Add the AI analysis as a suggestion
        setAiSuggestions(prev => [
          {
            type: 'insight',
            text: `🤖 AI Analysis: ${generatedText}`,
            confidence: 95,
            source: 'gemini_ai'
          },
          ...prev
        ]);
      }

      setGeminiApiLoading(false);
      return data;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Add error as a suggestion for debugging
      setAiSuggestions(prev => [
        {
          type: 'context',
          text: `⚠️ Failed to analyze backend data with AI: ${error.message}`,
          confidence: 50,
          source: 'gemini_error'
        },
        ...prev
      ]);
      
      setGeminiApiLoading(false);
      return null;
    }
  };

  // Function to call Gemini API with transcript data for analysis and resolution suggestions
  const callGeminiAPIWithTranscript = async (transcriptMessages) => {
    if (!transcriptMessages || transcriptMessages.length === 0) {
      console.warn('No transcript available for Gemini API call');
      return null;
    }

    setGeminiApiLoading(true);

    try {
      // Format transcript for analysis
      const transcriptText = safeFilterTranscript(transcriptMessages, msg => !msg.isSystem)
        .map(msg => `${msg.speaker}: ${msg.text}`)
        .join('\n');

      // Include customer context if available
      const customerContext = customerData ? `
Customer Information:
- Name: ${customerData.name}
- Phone: ${customerData.phone}
- Account: ${customerData.account}
- Issue Category: ${selectedOption || 'General Inquiry'}
` : '';

      // Gemini API payload for transcript analysis
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Agent Assistant: Quick call analysis.

${customerContext}

Transcript:
${transcriptText}

Provide brief summary (under 100 words):
• **Main Issue**: What does customer need?
• **Next Steps**: Top 2 actions to take
• **Risk Level**: Low/Medium/High escalation risk

Be concise and actionable.`
              }
            ]
          }
        ]
      };

      console.log('Calling Gemini API with transcript data:', payload);

      // Make the API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyBvzv6AyNg-pojZ1LNWGg2MHtbpHRpySvs' // You'll need to set your API key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Gemini API rate limit hit for transcript analysis. Skipping this call.');
          setGeminiApiLoading(false);
          return null;
        }
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API transcript response:', data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        // Add the transcript analysis as a suggestion
        setAiSuggestions(prev => [
          {
            type: 'insight',
            text: `📋 Transcript Analysis: ${generatedText}`,
            confidence: 90,
            source: 'gemini_transcript'
          },
          ...prev
        ]);
      }

      setGeminiApiLoading(false);
      return data;
    } catch (error) {
      console.error('Error calling Gemini API with transcript:', error);
      
      // Add error as a suggestion for debugging
      setAiSuggestions(prev => [
        {
          type: 'context',
          text: `⚠️ Failed to analyze transcript with AI: ${error.message}`,
          confidence: 0,
          source: 'gemini_transcript_error'
        },
        ...prev
      ]);
      
      setGeminiApiLoading(false);
      return null;
    }
  };

  // Function to analyze customer sentiment using Gemini API
  const analyzeSentimentWithGemini = async (transcriptMessages, stage = 'real-time') => {
    if (!transcriptMessages || transcriptMessages.length === 0) {
      console.warn('No transcript available for sentiment analysis');
      return null;
    }

    setSentimentAnalysisLoading(true);

    try {
      // Format transcript for sentiment analysis
      const transcriptText = safeFilterTranscript(transcriptMessages, msg => !msg.isSystem && msg.speaker === 'Customer')
        .slice(-10) // Analyze last 10 customer messages for real-time analysis
        .map((msg, index) => `[${index + 1}] ${msg.text}`)
        .join('\n');

      if (!transcriptText.trim()) {
        setSentimentAnalysisLoading(false);
        return null;
      }

      // Include customer context if available
      const customerContext = customerData ? `
Customer Profile:
- Name: ${customerData.name}
- Phone: ${customerData.phone}
- Account: ${customerData.account}
- Issue Category: ${selectedOption || 'General Inquiry'}
` : '';

      const currentStageContext = stage === 'real-time' ? 
        'This is a real-time analysis during an active call.' :
        stage === 'call-end' ? 
        'This is an end-of-call comprehensive analysis.' :
        'This is an initial call assessment.';

      // Gemini API payload for sentiment analysis
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Quick sentiment analysis for agent dashboard.

${customerContext}
Stage: ${currentStageContext}

Recent Customer Messages:
${transcriptText}

Return concise JSON (no markdown):

{
  "overallSentiment": "positive|neutral|negative",
  "sentimentScore": 0.85,
  "confidence": 95,
  "escalationRisk": "low|medium|high",
  "customerState": "calm|frustrated|angry|satisfied",
  "urgencyLevel": "low|medium|high",
  "keyInsights": ["brief insight 1", "brief insight 2"],
  "recommendations": ["quick action 1", "quick action 2"]
}`
              }
            ]
          }
        ]
      };

      console.log('Calling Gemini API for sentiment analysis:', payload);

      // Make the API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyBvzv6AyNg-pojZ1LNWGg2MHtbpHRpySvs'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Gemini API rate limit hit for sentiment analysis. Skipping this call.');
          setSentimentAnalysisLoading(false);
          return null;
        }
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API sentiment response:', data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        try {
          // Clean the generated text by removing markdown code block syntax
          let cleanedText = generatedText.trim();
          
          // Remove ```json at the beginning and ``` at the end if present
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '');
          }
          if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '');
          }
          if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.replace(/\s*```$/, '');
          }
          
          console.log('Cleaned sentiment response text:', cleanedText);
          
          // Parse the JSON response
          const sentimentData = JSON.parse(cleanedText);
          
          // Update sentiment state
          setCurrentSentiment(sentimentData);
          
          // Add to sentiment history
          setSentimentHistory(prev => [
            ...prev,
            {
              timestamp: new Date().toISOString(),
              stage: stage,
              sentiment: sentimentData.overallSentiment,
              score: sentimentData.sentimentScore,
              confidence: sentimentData.confidence,
              customerState: sentimentData.customerState,
              escalationRisk: sentimentData.escalationRisk
            }
          ].slice(-20)); // Keep last 20 sentiment analyses
          
          // Update derived states
          setSentimentTrend(sentimentData.sentimentTrend);
          setEmotionalIndicators(sentimentData.emotionalIndicators || []);
          setEscalationRisk(sentimentData.escalationRisk);
          
          // Add sentiment insights as AI suggestions
          setAiSuggestions(prev => [
            {
              type: 'sentiment',
              text: `😊 Customer Sentiment: ${sentimentData.overallSentiment.toUpperCase()} (${sentimentData.confidence}% confidence)\n\nKey Insights:\n${sentimentData.keyInsights?.map(insight => `• ${insight}`).join('\n')}\n\nRecommendations:\n${sentimentData.recommendations?.map(rec => `• ${rec}`).join('\n')}`,
              confidence: sentimentData.confidence,
              source: 'gemini_sentiment',
              sentiment: sentimentData.overallSentiment,
              escalationRisk: sentimentData.escalationRisk,
              timestamp: new Date().toISOString()
            },
            ...prev.filter(s => s.source !== 'gemini_sentiment') // Remove previous sentiment analysis
          ]);
          
          console.log('Sentiment analysis completed:', sentimentData);
          
        } catch (parseError) {
          console.error('Error parsing sentiment JSON:', parseError);
          console.log('Raw response:', generatedText);
          console.log('Cleaned response for parsing:', cleanedText);
          
          // Try to extract useful information even if JSON parsing fails
          let fallbackSentiment = 'neutral';
          let fallbackConfidence = 50;
          
          // Simple text analysis as fallback
          const lowerText = generatedText.toLowerCase();
          if (lowerText.includes('positive') || lowerText.includes('satisfied') || lowerText.includes('happy')) {
            fallbackSentiment = 'positive';
            fallbackConfidence = 70;
          } else if (lowerText.includes('negative') || lowerText.includes('frustrated') || lowerText.includes('angry')) {
            fallbackSentiment = 'negative';
            fallbackConfidence = 70;
          }
          
          // Set basic sentiment data as fallback
          setCurrentSentiment({
            overallSentiment: fallbackSentiment,
            sentimentScore: fallbackConfidence / 100,
            confidence: fallbackConfidence,
            customerState: 'unknown',
            escalationRisk: fallbackSentiment === 'negative' ? 'medium' : 'low',
            keyInsights: ['Unable to parse detailed analysis'],
            recommendations: ['Manual review recommended']
          });
          
          // Fallback: treat as text response
          setAiSuggestions(prev => [
            {
              type: 'sentiment',
              text: `😊 Sentiment Analysis (Fallback): ${fallbackSentiment.toUpperCase()}\n\nNote: JSON parsing failed, showing simplified analysis.\n\nRaw Analysis:\n${generatedText}`,
              confidence: fallbackConfidence,
              source: 'gemini_sentiment_text',
              sentiment: fallbackSentiment,
              escalationRisk: fallbackSentiment === 'negative' ? 'medium' : 'low',
              timestamp: new Date().toISOString()
            },
            ...prev.filter(s => s.source !== 'gemini_sentiment')
          ]);
        }
      }

      setSentimentAnalysisLoading(false);
      return data;
    } catch (error) {
      console.error('Error calling Gemini API for sentiment analysis:', error);
      
      // Add error as a suggestion for debugging
      setAiSuggestions(prev => [
        {
          type: 'context',
          text: `⚠️ Failed to analyze customer sentiment: ${error.message}`,
          confidence: 0,
          source: 'gemini_sentiment_error'
        },
        ...prev
      ]);
      
      setSentimentAnalysisLoading(false);
      return null;
    }
  };

  // Calculate timing savings from pre-fetched IVR data
  const calculateTimingSavings = (ivrData) => {
    if (!ivrData || !ivrData.backendDetails) return;
    
    // Calculate total time for backend services that were pre-fetched
    const preFetchedTime = ivrData.backendDetails.reduce((total, service) => {
      return total + parseInt(service.TIME_TAKEN || 0);
    }, 0);
    
    // Estimate additional time saved from having customer data ready
    const customerDataLookupTime = 5000; // 5 seconds typical lookup time
    const agentContextSwitchTime = 3000; // 3 seconds for agent to understand context
    
    const totalTimeSaved = preFetchedTime + customerDataLookupTime + agentContextSwitchTime;
    
    // Calculate percentage improvement in AHT
    const traditionalAHTSeconds = 660; // 11 minutes average
    const optimizedAHTSeconds = traditionalAHTSeconds - (totalTimeSaved / 1000);
    const improvementPercentage = ((traditionalAHTSeconds - optimizedAHTSeconds) / traditionalAHTSeconds) * 100;
    
    setTimingSavings({
      preFetchedTime: preFetchedTime / 1000, // Convert to seconds
      customerDataTime: customerDataLookupTime / 1000,
      contextTime: agentContextSwitchTime / 1000,
      totalSaved: totalTimeSaved / 1000,
      traditionalAHT: traditionalAHTSeconds,
      optimizedAHT: optimizedAHTSeconds,
      improvement: improvementPercentage.toFixed(1),
      servicesPreFetched: ivrData.backendDetails.length
    });
  };

  // Generate AI suggestions based on IVR data
  const generateAISuggestionsFromIVR = (ivrData) => {
    const suggestions = [];
    
    if (ivrData.selectedOption) {
      const category = ivrData.selectedOption.toLowerCase();
      
      // Find relevant conversations from transcript data for more contextual suggestions
      const relevantConversations = TRANSCRIPT_DATA.filter(conversation => {
        const entryCategory = conversation.issue_category.toLowerCase();
        if (category.includes('billing')) {
          return entryCategory.includes('billing') || entryCategory.includes('payment');
        }
        if (category.includes('technical') || category.includes('internet')) {
          return entryCategory.includes('internet') || entryCategory.includes('connection') || entryCategory.includes('outage');
        }
        if (category.includes('service') || category.includes('account')) {
          return entryCategory.includes('service') || entryCategory.includes('account') || entryCategory.includes('transfer');
        }
        return false;
      });
      
      // Generate category-specific suggestions enhanced with conversation context
      if (category.includes('billing')) {
        suggestions.push(
          { type: 'action', text: 'Review recent billing statements and charges', confidence: 95 },
          { type: 'response', text: 'I can help you understand your billing details', confidence: 88 },
          { type: 'escalation', text: 'Consider billing specialist for disputes > $100', confidence: 72 }
        );
        
        // Add context-specific suggestions from conversations
        if (relevantConversations.length > 0) {
          const billingConversation = relevantConversations.find(c => c.issue_category.includes('Billing'));
          if (billingConversation) {
            suggestions.push({
              type: 'context',
              text: `Common billing issue: ${billingConversation.telecom_relevance}`,
              confidence: 85,
              source: billingConversation.conversation_id
            });
          }
        }
      } else if (category.includes('technical') || category.includes('internet')) {
        suggestions.push(
          { type: 'action', text: 'Run network diagnostics and connectivity tests', confidence: 92 },
          { type: 'response', text: 'Let me check your service status and connection', confidence: 90 },
          { type: 'escalation', text: 'Consider tech specialist for complex issues', confidence: 75 }
        );
        
        // Add technical context from conversations
        const techConversations = relevantConversations.filter(c => 
          c.issue_category.includes('Internet') || c.issue_category.includes('Connection')
        );
        if (techConversations.length > 0) {
          suggestions.push({
            type: 'context',
            text: `Technical pattern: Most issues resolved with modem restart or line diagnostics`,
            confidence: 88,
            source: 'conversation_analysis'
          });
        }
      } else if (category.includes('service') || category.includes('account')) {
        suggestions.push(
          { type: 'action', text: 'Check current service plan and available upgrades', confidence: 89 },
          { type: 'response', text: 'I can help you with service changes and options', confidence: 85 },
          { type: 'escalation', text: 'Consider retention specialist for cancellations', confidence: 78 }
        );
        
        // Add service context
        const serviceConversations = relevantConversations.filter(c => 
          c.issue_category.includes('Transfer') || c.issue_category.includes('Order')
        );
        if (serviceConversations.length > 0) {
          suggestions.push({
            type: 'context',
            text: `Service request pattern: Most transfers require address validation and installation scheduling`,
            confidence: 82,
            source: 'service_analysis'
          });
        }
      } else {
        // General suggestions
        suggestions.push(
          { type: 'action', text: 'Verify customer account and recent activity', confidence: 85 },
          { type: 'response', text: 'I\'m here to help with your inquiry', confidence: 80 },
          { type: 'escalation', text: 'Consider specialist based on specific needs', confidence: 70 }
        );
      }
    }
    
    // Add conversation-driven insights
    if (TRANSCRIPT_DATA.length > 0) {
      const totalConversations = TRANSCRIPT_DATA.length;
      const billingCount = TRANSCRIPT_DATA.filter(c => c.issue_category.toLowerCase().includes('billing')).length;
      const techCount = TRANSCRIPT_DATA.filter(c => 
        c.issue_category.toLowerCase().includes('internet') || 
        c.issue_category.toLowerCase().includes('connection') ||
        c.issue_category.toLowerCase().includes('outage')
      ).length;
      
      suggestions.push({
        type: 'insight',
        text: `Data insight: ${Math.round((billingCount/totalConversations)*100)}% billing, ${Math.round((techCount/totalConversations)*100)}% technical issues in recent conversations`,
        confidence: 90,
        source: 'conversation_analytics'
      });
    }
    
    // Add suggestions based on agent performance
    if (ivrData.routedAgent) {
      const agent = ivrData.routedAgent;
      if (agent.performance?.firstCallResolutionPercentage > 90) {
        suggestions.push({
          type: 'action',
          text: `Agent has ${agent.performance.firstCallResolutionPercentage}% FCR - aim for single-call resolution`,
          confidence: 95
        });
      }
    }
    
    setAiSuggestions(suggestions);
  };

  // Generate knowledge base results based on IVR selection
  const generateKnowledgeBaseFromIVR = (ivrData) => {
    const articles = [];
    
    if (ivrData.selectedOption) {
      const category = ivrData.selectedOption.toLowerCase();
      
      // Find relevant conversations to extract knowledge patterns
      const relevantConversations = TRANSCRIPT_DATA.filter(conversation => {
        const entryCategory = conversation.issue_category.toLowerCase();
        if (category.includes('billing')) {
          return entryCategory.includes('billing') || entryCategory.includes('payment');
        }
        if (category.includes('technical') || category.includes('internet')) {
          return entryCategory.includes('internet') || entryCategory.includes('connection') || 
                 entryCategory.includes('outage') || entryCategory.includes('speed');
        }
        if (category.includes('service') || category.includes('account')) {
          return entryCategory.includes('service') || entryCategory.includes('account') || 
                 entryCategory.includes('transfer') || entryCategory.includes('order');
        }
        return false;
      });
      
      if (category.includes('billing')) {
        articles.push(
          { 
            title: 'Billing Dispute Resolution Process', 
            relevance: 94, 
            content: 'Step-by-step guide for handling billing disputes and refund requests...',
            source: 'knowledge_base'
          },
          { 
            title: 'Understanding Your Bill Breakdown', 
            relevance: 87, 
            content: 'Detailed explanation of charges, fees, and billing cycles...',
            source: 'knowledge_base'
          },
          { 
            title: 'Payment Methods and Auto-Pay Setup', 
            relevance: 76, 
            content: 'How to update payment information and set up automatic payments...',
            source: 'knowledge_base'
          }
        );
        
        // Add conversation-based insights
        if (relevantConversations.length > 0) {
          const billingPatterns = relevantConversations.slice(0, 3);
          billingPatterns.forEach((conversation, index) => {
            articles.push({
              title: `Real Case: ${conversation.issue_category}`,
              relevance: 90 - (index * 5),
              content: `${conversation.telecom_relevance} Key resolution steps from actual conversation.`,
              source: conversation.conversation_id,
              type: 'case_study'
            });
          });
        }
      } else if (category.includes('technical') || category.includes('internet')) {
        articles.push(
          { 
            title: 'Network Troubleshooting Guide', 
            relevance: 96, 
            content: 'Common connectivity issues and resolution steps...',
            source: 'knowledge_base'
          },
          { 
            title: 'Equipment Setup and Configuration', 
            relevance: 88, 
            content: 'Router, modem, and device setup instructions...',
            source: 'knowledge_base'
          },
          { 
            title: 'Service Outage Procedures', 
            relevance: 79, 
            content: 'How to report and track service outages...',
            source: 'knowledge_base'
          }
        );
        
        // Add technical conversation insights
        const techConversations = relevantConversations.filter(c => 
          c.issue_category.includes('Internet') || c.issue_category.includes('Connection') || c.issue_category.includes('Outage')
        );
        techConversations.slice(0, 2).forEach((conversation, index) => {
          articles.push({
            title: `Technical Resolution: ${conversation.issue_category}`,
            relevance: 85 - (index * 3),
            content: `${conversation.telecom_relevance} Common resolution patterns and troubleshooting steps.`,
            source: conversation.conversation_id,
            type: 'technical_guide'
          });
        });
      } else if (category.includes('service') || category.includes('account')) {
        articles.push(
          { 
            title: 'Service Plan Comparison Guide', 
            relevance: 91, 
            content: 'Overview of available plans, speeds, and pricing...',
            source: 'knowledge_base'
          },
          { 
            title: 'Account Changes and Upgrades', 
            relevance: 84, 
            content: 'How to modify services, add features, or upgrade plans...',
            source: 'knowledge_base'
          },
          { 
            title: 'Cancellation and Retention Policies', 
            relevance: 77, 
            content: 'Process for service changes and retention offers...',
            source: 'knowledge_base'
          }
        );
        
        // Add service conversation insights
        const serviceConversations = relevantConversations.filter(c => 
          c.issue_category.includes('Transfer') || c.issue_category.includes('Order') || c.issue_category.includes('Cancel')
        );
        serviceConversations.slice(0, 2).forEach((conversation, index) => {
          articles.push({
            title: `Service Case: ${conversation.issue_category}`,
            relevance: 82 - (index * 4),
            content: `${conversation.telecom_relevance} Best practices for handling similar requests.`,
            source: conversation.conversation_id,
            type: 'service_guide'
          });
        });
      } else {
        // General articles
        articles.push(
          { 
            title: 'Customer Account Management', 
            relevance: 80, 
            content: 'Overview of account features and self-service options...',
            source: 'knowledge_base'
          },
          { 
            title: 'Contact Center Services Guide', 
            relevance: 75, 
            content: 'Available support channels and service hours...',
            source: 'knowledge_base'
          },
          { 
            title: 'Frequently Asked Questions', 
            relevance: 70, 
            content: 'Common customer inquiries and quick answers...',
            source: 'knowledge_base'
          }
        );
      }
      
      // Add conversation analytics as knowledge
      if (TRANSCRIPT_DATA.length > 0) {
        const conversationTypes = {};
        TRANSCRIPT_DATA.forEach(conv => {
          const category = conv.issue_category;
          conversationTypes[category] = (conversationTypes[category] || 0) + 1;
        });
        
        const topCategories = Object.entries(conversationTypes)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);
        
        articles.push({
          title: 'Conversation Analytics Insights',
          relevance: 88,
          content: `Top conversation categories: ${topCategories.map(([cat, count]) => `${cat} (${count})`).join(', ')}. Use this data to anticipate customer needs.`,
          source: 'analytics',
          type: 'analytics'
        });
      }
    }
    
    setKnowledgeBase(articles);
  };

  // Load IVR session data on component mount
  useEffect(() => {
    const ivrData = loadIVRSessionData();
    
    // If we have IVR data, we can skip the simulated incoming call
    if (ivrData && ivrData.routedAgent) {
      console.log('Customer transferred from IVR to agent:', ivrData.routedAgent.name);
      
      // Add initial call notes based on IVR session
      const initialNotes = `
Customer transferred from IVR system:
- Phone: ${phoneNumber}
- Selected Category: ${selectedOption}
- Agent Match Score: ${agentMatchScore}%
- Backend Services: ${totalBackendServices} (${successfulServices} successful)
- Total Backend Time: ${totalBackendTime}ms
- Session ID: ${sessionId}
- Timestamp: ${sessionTimestamp}
      `.trim();
      
      // setCallNotes(initialNotes);
    }
  }, []);

  // Function to get all localStorage state data (for debugging)
  const getAllLocalStorageState = () => {
    return {
      ivrSessionData,
      ivrSessionSummary,
      phoneNumber,
      selectedOption,
      categoryMapping,
      sessionId,
      sessionTimestamp,
      agentMatchScore,
      availableAgentsCount,
      totalBackendServices,
      successfulServices,
      failedServices,
      totalBackendTime,
      activityLog,
      lastIVRSession,
      routedAgent,
      backendDetails,
      customerData
    };
  };

  // Function to log all state data (useful for debugging)
  const logAllStateData = () => {
    console.log('All localStorage state data:', getAllLocalStorageState());
  };

  // Function to automatically populate resolution fields based on context
  const autoPopulateResolution = () => {
    setIsAutoPopulating(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      // Determine resolution category based on IVR selection or customer issue
      let category = '';
      let status = 'resolved';
      let summary = '';
      let followUp = false;
      let satisfaction = 4; // Default to good rating

      // Map IVR selection to resolution category
      if (selectedOption) {
        const option = selectedOption.toLowerCase();
        if (option.includes('billing') || option.includes('payment')) {
          category = 'billing-inquiry';
          summary = 'Assisted customer with billing inquiry. ';
        } else if (option.includes('technical') || option.includes('internet') || option.includes('connection')) {
          category = 'technical-support';
          summary = 'Provided technical support for connectivity issue. ';
        } else if (option.includes('service') || option.includes('account')) {
          category = 'account-management';
          summary = 'Helped customer with account service request. ';
        } else {
          category = 'other';
          summary = 'Addressed customer inquiry. ';
        }
      } else if (customerData?.issue) {
        const issue = customerData.issue.toLowerCase();
        if (issue.includes('billing')) {
          category = 'billing-inquiry';
          summary = 'Resolved billing-related inquiry. ';
        } else if (issue.includes('technical') || issue.includes('internet')) {
          category = 'technical-support';
          summary = 'Provided technical assistance. ';
        } else {
          category = 'service-request';
          summary = 'Assisted with service request. ';
        }
      }

      // Enhance summary based on AI suggestions
      const relevantSuggestions = aiSuggestions.filter(s => 
        s.type === 'action' || s.type === 'response'
      ).slice(0, 2);
      
      if (relevantSuggestions.length > 0) {
        const actions = relevantSuggestions.map(s => 
          s.text.replace(/^(Review|Check|Run|Verify|Consider)/i, 'Reviewed')
        ).join('. ');
        summary += actions + '. ';
      }

      // Add backend service information if available
      if (backendDetails && backendDetails.length > 0) {
        const successfulServices = backendDetails.filter(s => s.STATUS === 'S').length;
        summary += `Verified ${successfulServices} backend services during call. `;
      }

      // Add customer context
      if (customerData) {
        if (customerData.tier === 'Premium' || customerData.tier === 'VIP') {
          summary += 'Provided premium customer service. ';
          satisfaction = 5; // Higher rating for premium customers
        }
        
        // Check sentiment and adjust accordingly
        if (customerData.sentiment === 'negative') {
          status = 'follow-up';
          followUp = true;
          satisfaction = 3;
          summary += 'Customer expressed concerns - follow-up scheduled. ';
        } else if (customerData.sentiment === 'positive') {
          satisfaction = 5;
          summary += 'Customer expressed satisfaction with service. ';
        }
      }

      // Check if there are escalation suggestions
      const escalationSuggestions = aiSuggestions.filter(s => s.type === 'escalation');
      if (escalationSuggestions.length > 0) {
        status = 'escalated';
        followUp = true;
        summary += 'Issue escalated to specialist team. ';
      }

      // Set call duration context
      if (callDuration > 600) { // More than 10 minutes
        followUp = true;
        summary += 'Extended call duration - monitoring for customer satisfaction. ';
      }

      // Update resolution fields
      setResolutionCategory(category);
      setResolutionStatus(status);
      setResolutionSummary(summary.trim());
      setFollowUpRequired(followUp);
      setCustomerSatisfaction(satisfaction);

      // Set follow-up date if required (3 days from now)
      if (followUp) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 3);
        setFollowUpDate(followUpDate.toISOString().split('T')[0]);
      }
      
      setIsAutoPopulating(false);
    }, 800); // 800ms delay to show loading
  };

  // Function to generate resolution summary based on transcript
  const generateResolutionFromTranscript = () => {
    if (transcript.length === 0) return;

    let summary = 'Call summary: ';
    const customerMessages = safeFilterTranscript(transcript, msg => msg.speaker === 'Customer' && !msg.isSystem);
    const agentMessages = safeFilterTranscript(transcript, msg => msg.speaker === 'Agent' && !msg.isSystem);

    // Analyze customer concerns from transcript
    const concerns = [];
    customerMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      if (text.includes('problem') || text.includes('issue') || text.includes('trouble')) {
        concerns.push('Technical issue discussed');
      }
      if (text.includes('bill') || text.includes('charge') || text.includes('payment')) {
        concerns.push('Billing matter addressed');
      }
      if (text.includes('cancel') || text.includes('disconnect')) {
        concerns.push('Service cancellation discussed');
      }
    });

    // Add agent actions from transcript
    const actions = [];
    agentMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      if (text.includes('check') || text.includes('verify')) {
        actions.push('Verified account information');
      }
      if (text.includes('reset') || text.includes('restart')) {
        actions.push('Performed system reset');
      }
      if (text.includes('transfer') || text.includes('escalate')) {
        actions.push('Escalated to appropriate team');
      }
    });

    // Combine findings
    if (concerns.length > 0) {
      summary += concerns.join(', ') + '. ';
    }
    if (actions.length > 0) {
      summary += actions.join(', ') + '. ';
    }

    // Determine resolution status from transcript
    let status = 'resolved';
    const lastFewMessages = transcript.slice(-3);
    const hasUnresolvedIndicators = lastFewMessages.some(msg => 
      msg.text.toLowerCase().includes('still') || 
      msg.text.toLowerCase().includes('not working') ||
      msg.text.toLowerCase().includes('problem')
    );

    if (hasUnresolvedIndicators) {
      status = 'follow-up';
      setFollowUpRequired(true);
      summary += 'Issue requires additional follow-up. ';
    } else {
      summary += 'Issue successfully resolved. ';
    }

    setResolutionSummary(summary);
    setResolutionStatus(status);
  };

  // Function to suggest resolution based on AI analysis
  const suggestResolutionFromAI = () => {
    const geminiSuggestions = aiSuggestions.filter(s => s.source === 'gemini_ai' || s.source === 'gemini_transcript');
    
    if (geminiSuggestions.length === 0) return;

    let summary = 'AI-assisted resolution: ';
    let category = 'other';
    let status = 'resolved';

    geminiSuggestions.forEach(suggestion => {
      const text = suggestion.text.toLowerCase();
      
      // Extract category from AI suggestion
      if (text.includes('billing') || text.includes('payment')) {
        category = 'billing-inquiry';
      } else if (text.includes('technical') || text.includes('internet') || text.includes('connection')) {
        category = 'technical-support';
      } else if (text.includes('service') || text.includes('account')) {
        category = 'account-management';
      }

      // Extract status indicators
      if (text.includes('escalat') || text.includes('specialist')) {
        status = 'escalated';
        setFollowUpRequired(true);
      } else if (text.includes('follow') || text.includes('monitor')) {
        status = 'follow-up';
        setFollowUpRequired(true);
      }
    });

    summary += 'Utilized AI insights to provide comprehensive customer assistance. ';
    summary += `Confidence level: ${Math.max(...geminiSuggestions.map(s => s.confidence))}%. `;

    setResolutionCategory(category);
    setResolutionStatus(status);
    setResolutionSummary(prev => prev + summary);
  };

  

  // Simulate incoming call only if no IVR data is available
  useEffect(() => {
    // Only run simulation if we don't have IVR session data
    if (callStatus === 'active' && !ivrSessionData) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Simulate customer data loading only if no real data exists
      setTimeout(() => {
        if (!customerData) {
          setCustomerData({
            name: 'Sarah Johnson',
            phone: '+1 (555) 123-4567',
            email: 'sarah.johnson@email.com',
            tier: 'Premium',
            accountNumber: 'ACC-789456',
            lastContact: '2024-07-15',
            issue: 'Billing inquiry',
            sentiment: 'neutral',
            previousIssues: ['Payment failed', 'Account upgrade', 'Service interruption']
          });
        }
        
        // Simulate AI suggestions only if none exist
        if (aiSuggestions.length === 0) {
          setAiSuggestions([
            { type: 'action', text: 'Check recent billing statements', confidence: 95 },
            { type: 'response', text: 'I can help you review your recent charges', confidence: 88 },
            { type: 'escalation', text: 'Consider billing specialist if dispute > $100', confidence: 72 }
          ]);
        }
        
        // Simulate knowledge base results only if none exist
        if (knowledgeBase.length === 0) {
          setKnowledgeBase([
            { title: 'Billing Dispute Process', relevance: 94, content: 'Step-by-step guide for handling billing disputes...' },
            { title: 'Premium Account Benefits', relevance: 87, content: 'Overview of premium tier features and billing...' },
            { title: 'Payment Method Updates', relevance: 76, content: 'How to update payment information...' }
          ]);
        }
      }, 1000);
    } else if (callStatus === 'active' && ivrSessionData) {
      // For IVR sessions, just start the timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }
    
    return () => clearInterval(callTimerRef.current);
  }, [callStatus, ivrSessionData]);

  // Generate real-time transcript based on IVR data or simulate
  useEffect(() => {
    if (callStatus === 'active') {
      let messages = [];
      
      // Generate transcript based on IVR data if available
      if (ivrSessionData && customerData) {
        const customerName = customerData.name.split(' ')[0];
        const issueType = selectedOption || 'general inquiry';
        
        // Initial system and greeting messages
        messages = [
          { 
            speaker: 'System', 
            text: `Call transferred from IVR - Customer: ${customerData.name}, Issue: ${issueType}`, 
            time: new Date().toLocaleTimeString(),
            isSystem: true
          },
          { 
            speaker: 'Customer', 
            text: `Hi, I was just transferred from the automated system regarding my ${issueType.toLowerCase().replace(/_/g, ' ')}.`, 
            time: new Date(Date.now() + 1000).toLocaleTimeString() 
          },
          { 
            speaker: 'Agent', 
            text: `Hello ${customerName}, I can see you were routed here for ${issueType.toLowerCase().replace(/_/g, ' ')}. I have your account information from the system. How can I help you today?`, 
            time: new Date(Date.now() + 2000).toLocaleTimeString() 
          }
        ];
        
        if (agentMatchScore) {
          messages.push({
            speaker: 'System',
            text: `Agent match confidence: ${agentMatchScore}% - Specialized in ${categoryMapping || issueType}`,
            time: new Date(Date.now() + 3000).toLocaleTimeString(),
            isSystem: true
          });
        }

        // Find relevant transcript data based on the selected issue category
        const relevantConversations = TRANSCRIPT_DATA.filter(conversation => {
          const entryCategory = conversation.issue_category.toLowerCase();
          const selectedCategory = issueType.toLowerCase();
          
          // Map IVR categories to transcript categories with more specific matching
          if (selectedCategory.includes('billing')) {
            return entryCategory.includes('billing') || entryCategory.includes('payment') || entryCategory.includes('make payment');
          }
          if (selectedCategory.includes('technical') || selectedCategory.includes('internet')) {
            return entryCategory.includes('internet') || entryCategory.includes('connection') || 
                   entryCategory.includes('wi-fi') || entryCategory.includes('outage') || 
                   entryCategory.includes('modem') || entryCategory.includes('speed');
          }
          if (selectedCategory.includes('service') || selectedCategory.includes('account')) {
            return entryCategory.includes('service') || entryCategory.includes('account') || 
                   entryCategory.includes('transfer') || entryCategory.includes('order') ||
                   entryCategory.includes('profile');
          }
          if (selectedCategory.includes('cancel')) {
            return entryCategory.includes('cancel') || entryCategory.includes('return');
          }
          // Default to general inquiries or first available conversation
          return entryCategory.includes('general') || entryCategory.includes('inquiry');
        });

        // Select the most relevant conversation and use its interactions
        if (relevantConversations.length > 0) {
          const selectedConversation = relevantConversations[0];
          console.log('Selected conversation:', selectedConversation.conversation_id, 'for category:', issueType);
          
          // Add conversation context to call notes
          const conversationContext = `\nRelevant Conversation Context:\n- Category: ${selectedConversation.issue_category}\n- Conversation ID: ${selectedConversation.conversation_id}\n- Telecom Relevance: ${selectedConversation.telecom_relevance}\n`;
          setCallNotes(prev => prev + conversationContext);
          
          // Add interactions as transcript messages (limit to prevent overflow)
          const interactions = selectedConversation.interactions.slice(0, 10);
          interactions.forEach((interaction, index) => {
            messages.push({
              speaker: interaction.speaker,
              text: interaction.text,
              time: interaction.timestamp || new Date(Date.now() + 4000 + (index * 1500)).toLocaleTimeString(),
              conversationId: selectedConversation.conversation_id
            });
          });
        } else {
          // Fallback: use interactions from the first available conversation
          if (TRANSCRIPT_DATA.length > 0) {
            const fallbackConversation = TRANSCRIPT_DATA[0];
            const interactions = fallbackConversation.interactions.slice(0, 6);
            interactions.forEach((interaction, index) => {
              messages.push({
                speaker: interaction.speaker,
                text: interaction.text,
                time: interaction.timestamp || new Date(Date.now() + 4000 + (index * 1500)).toLocaleTimeString(),
                conversationId: fallbackConversation.conversation_id
              });
            });
          }
        }

      } else {
        // Fallback: use interactions from general inquiry conversations
        const generalConversations = TRANSCRIPT_DATA.filter(conversation => 
          conversation.issue_category.toLowerCase().includes('general') ||
          conversation.issue_category.toLowerCase().includes('inquiry')
        );

        if (generalConversations.length > 0) {
          const fallbackConversation = generalConversations[0];
          const interactions = fallbackConversation.interactions.slice(0, 6);
          messages = interactions.map((interaction, index) => ({
            speaker: interaction.speaker,
            text: interaction.text,
            time: interaction.timestamp || new Date(Date.now() + (index * 1500)).toLocaleTimeString(),
            conversationId: fallbackConversation.conversation_id
          }));
        } else {
          // Final fallback to basic messages
          messages = [
            { speaker: 'Customer', text: 'Hi, I have a question about my recent bill', time: '10:31:15' },
            { speaker: 'Agent', text: 'Of course, I\'d be happy to help you with that. Let me pull up your account.', time: '10:31:18' },
            { speaker: 'Customer', text: 'I see a charge for $89.99 that I don\'t recognize', time: '10:31:25' },
            { speaker: 'Agent', text: 'I can see that charge here. It appears to be for the premium service upgrade from last month.', time: '10:31:32' }
          ];
        }
      }
      
      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex < messages.length) {
          setTranscript(prev => [...prev, messages[messageIndex]]);
          messageIndex++;
        } else {
          clearInterval(interval);
          // Automatic transcript analysis disabled to reduce Gemini API calls
          console.log('Transcript loading complete. Manual analysis available via buttons.');
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [callStatus, ivrSessionData, customerData, selectedOption, agentMatchScore, categoryMapping]);

  // Auto-populate resolution fields when call becomes active and we have context
  useEffect(() => {
    if (callStatus === 'active' && (ivrSessionData || customerData)) {
      // Wait a bit for other data to load, then auto-populate
      setTimeout(() => {
        autoPopulateResolution();
      }, 3000); // 3 second delay to allow data to settle
    }
  }, [callStatus, ivrSessionData, customerData, selectedOption]);

  // Update resolution when AI suggestions are updated
  useEffect(() => {
    if (callStatus === 'active' && aiSuggestions.length > 0) {
      // If we have Gemini AI suggestions, enhance the resolution
      const hasGeminiSuggestions = aiSuggestions.some(s => 
        s.source === 'gemini_ai' || s.source === 'gemini_transcript'
      );
      
      if (hasGeminiSuggestions) {
        setTimeout(() => {
          suggestResolutionFromAI();
        }, 1000); // 1 second delay after AI suggestions arrive
      }
    }
  }, [aiSuggestions, callStatus]);

  // Update resolution when transcript is updated (for real-time insights)
  useEffect(() => {
    if (callStatus === 'active' && transcript.length > 3) {
      // Only update after we have substantial transcript content
      const shouldUpdate = transcript.length % 5 === 0; // Update every 5 messages
      
      if (shouldUpdate) {
        generateResolutionFromTranscript();
      }
    }
  }, [transcript, callStatus]);

  // Auto-populate when call ends to ensure resolution is captured
  useEffect(() => {
    if (callStatus === 'idle' && transcript.length > 0) {
      // Call just ended, ensure we have resolution data
      if (!resolutionStatus || !resolutionSummary) {
        autoPopulateResolution();
      }
    }
  }, [callStatus, transcript.length]);

  // Real-time sentiment analysis during active calls (reduced frequency)
  useEffect(() => {
    if (callStatus === 'active' && transcript.length > 0) {
      // Analyze sentiment every 5 customer messages to reduce API calls
      const customerMessages = safeFilterTranscript(transcript, msg => !msg.isSystem && msg.speaker === 'Customer');
      const shouldAnalyze = customerMessages.length > 0 && customerMessages.length % 5 === 0;
      
      if (shouldAnalyze) {
        rateLimitedGeminiCall(analyzeSentimentWithGemini, transcript, 'real-time');
      }
    }
  }, [transcript, callStatus]);

  // Sentiment analysis at call start (disabled to reduce API calls)
  useEffect(() => {
    // Disabled to reduce Gemini API calls and avoid rate limiting
    // Initial sentiment analysis can be done manually if needed
  }, [callStatus, transcript, sentimentHistory.length]);

  // Comprehensive sentiment analysis at call end
  useEffect(() => {
    if (callStatus === 'idle' && transcript.length > 0) {
      // Perform final comprehensive sentiment analysis (rate limited)
      const customerMessages = safeFilterTranscript(transcript, msg => !msg.isSystem && msg.speaker === 'Customer');
      if (customerMessages.length > 0) {
        rateLimitedGeminiCall(analyzeSentimentWithGemini, transcript, 'call-end');
      }
    }
  }, [callStatus, transcript.length]);

  // Function to handle complete resolution - gather all data and save it
  const handleCompleteResolution = async () => {
    // Gather all session data
    const resolutionData = {
      // Call Information
      callInfo: {
        status: callStatus,
        duration: callDuration,
        startTime: sessionTimestamp || new Date().toISOString(),
        endTime: new Date().toISOString(),
        isRecording: isRecording,
        isMuted: isMuted,
        sessionId: sessionId,
      },
      
      // Customer Information
      customerInfo: {
        data: customerData,
        phoneNumber: phoneNumber,
        issue: currentIssue,
        selectedOption: selectedOption,
        categoryMapping: categoryMapping,
      },
      
      // Agent Information
      agentInfo: {
        routedAgent: routedAgent,
        agentMatchScore: agentMatchScore,
        availableAgentsCount: availableAgentsCount,
      },
      
      // Resolution Details
      resolutionDetails: {
        status: resolutionStatus,
        summary: resolutionSummary,
        category: resolutionCategory,
        followUpRequired: followUpRequired,
        followUpDate: followUpDate,
        customerSatisfaction: customerSatisfaction,
        callNotes: callNotes,
      },
      
      // Backend Services Data
      backendData: {
        details: backendDetails,
        totalServices: totalBackendServices,
        successfulServices: successfulServices,
        failedServices: failedServices,
        totalBackendTime: totalBackendTime,
      },
      
      // IVR Session Data
      ivrData: {
        sessionData: ivrSessionData,
        summary: ivrSessionSummary,
        activityLog: activityLog,
        lastSession: lastIVRSession,
      },
      
      // AI and Analytics
      aiAnalytics: {
        suggestions: aiSuggestions,
        knowledgeBase: knowledgeBase,
        geminiApiResponse: geminiApiResponse,
        geminiApiLoading: geminiApiLoading,
        timingSavings: timingSavings,
      },
      
      // Customer Sentiment Analysis
      sentimentAnalysis: {
        currentSentiment: currentSentiment,
        sentimentHistory: sentimentHistory,
        sentimentTrend: sentimentTrend,
        emotionalIndicators: emotionalIndicators,
        escalationRisk: escalationRisk,
        finalSentimentScore: currentSentiment?.sentimentScore || null,
        overallCustomerState: currentSentiment?.customerState || 'unknown',
        satisfactionPrediction: currentSentiment?.satisfactionPrediction || 'neutral',
        sentimentAnalysisLoading: sentimentAnalysisLoading,
      },
      
      // Transcript Data
      conversationData: {
        transcript: transcript,
        searchQuery: searchQuery,
      },
      
      // Performance Metrics
      performanceMetrics: {
        timingSavings: timingSavings,
        showOptimizationDemo: showOptimizationDemo,
      },
      
      // Additional Context
      additionalContext: {
        isAutoPopulating: isAutoPopulating,
        showDebugPanel: showDebugPanel,
        completedAt: new Date().toISOString(),
        allLocalStorageState: getAllLocalStorageState(),
      }
    };

    // Validate session data
    const validation = validateSessionData(resolutionData);
    console.log('Session data validation:', validation);

    // Generate session summary
    const sessionSummary = generateSessionSummary(resolutionData);
    console.log('Session summary:', sessionSummary);

    // Save session data to file (JSON download)
    const fileResult = saveSessionDataToFile(resolutionData);
    
    // Also save to localStorage for future reference
    const storageResult = saveSessionDataToStorage(resolutionData);

    // Log the complete resolution data to console
    console.log('=== COMPLETE RESOLUTION DATA ===');
    console.log(JSON.stringify(resolutionData, null, 2));
    console.log('=== END RESOLUTION DATA ===');
    
    // Log a summary for easier reading
    console.log('=== RESOLUTION SUMMARY ===');
    console.log('Customer:', customerData?.name || 'Unknown');
    console.log('Phone:', phoneNumber || 'Not provided');
    console.log('Issue:', currentIssue || selectedOption || 'Not specified');
    console.log('Resolution Status:', resolutionStatus);
    console.log('Duration:', formatTime(callDuration));
    console.log('Agent:', routedAgent?.name || 'Not assigned');
    console.log('Satisfaction:', customerSatisfaction ? `${customerSatisfaction}/5` : 'Not rated');
    console.log('Follow-up Required:', followUpRequired ? 'Yes' : 'No');
    console.log('Backend Services:', `${successfulServices}/${totalBackendServices} successful`);
    console.log('AI Suggestions:', aiSuggestions?.length || 0);
    console.log('Sentiment:', currentSentiment?.overallSentiment || 'Unknown');
    console.log('Escalation Risk:', escalationRisk || 'Unknown');
    console.log('=== END SUMMARY ===');
    
    // Show success message with file save results
    const successMessage = `Resolution completed successfully!\n\n` +
      `📁 JSON File: ${fileResult.success ? `Downloaded as ${fileResult.filename}` : 'Failed to download'}\n` +
      `💾 Local Storage: ${storageResult.success ? 'Saved successfully' : 'Failed to save'}\n` +
      `📊 Data Completeness: ${validation.completeness}%\n` +
      `⚠️ Warnings: ${validation.warnings.length} issues noted\n\n` +
      `Check browser console for detailed logs.`;
    
    alert(successMessage);
    
    // Add the completed session to a maintained list for export functionality
    try {
      const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
      completedSessions.push({
        sessionId: sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        summary: sessionSummary,
        dataKey: storageResult.key,
        validation: validation
      });
      
      // Keep only last 100 completed sessions
      const recentSessions = completedSessions.slice(-100);
      localStorage.setItem('completed-sessions', JSON.stringify(recentSessions));
      
      console.log(`Added to completed sessions list. Total sessions: ${recentSessions.length}`);
    } catch (error) {
      console.error('Error updating completed sessions list:', error);
    }
    
    // Optional: Clear the call state or perform other cleanup
    // You could add additional logic here like:
    // - Sending data to an API endpoint
    // - Clearing localStorage IVR data
    // - Resetting call state for next call
    // - Navigating to dashboard or next call
    
    // Clear current session IVR data since resolution is complete
    localStorage.removeItem('ivrSessionData');
    localStorage.removeItem('ivrSessionSummary');
    
    // Reset call status to idle for next call
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setTranscript([]);
      setCallNotes('');
      setResolutionSummary('');
      setResolutionStatus('');
      setResolutionCategory('');
      setFollowUpRequired(false);
      setFollowUpDate('');
      setCustomerSatisfaction(null);
    }, 2000); // 2 second delay to allow user to see the completion message
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to add sample transcript for sentiment testing
  const addSentimentTestData = () => {
    const testMessages = [
      { speaker: 'Agent', text: 'Hello, thank you for calling. How can I help you today?', timestamp: new Date(), isSystem: false },
      { speaker: 'Customer', text: 'Hi, I\'ve been trying to fix my internet connection for hours and nothing is working. I\'m really frustrated right now.', timestamp: new Date(), isSystem: false },
      { speaker: 'Agent', text: 'I understand your frustration. Let me help you resolve this issue quickly.', timestamp: new Date(), isSystem: false },
      { speaker: 'Customer', text: 'This is the third time I\'ve called about this same problem. I\'m starting to think about switching providers.', timestamp: new Date(), isSystem: false },
      { speaker: 'Agent', text: 'I sincerely apologize for the inconvenience. Let me check your account and see what\'s been happening.', timestamp: new Date(), isSystem: false },
      { speaker: 'Customer', text: 'Thank you, I really hope you can help me this time.', timestamp: new Date(), isSystem: false }
    ];
    
    setTranscript(testMessages);
    
    // Trigger sentiment analysis after adding test data
    setTimeout(() => {
      analyzeSentimentWithGemini(testMessages, 'manual');
    }, 500);
  };

  const handleAnswerCall = () => {
    setCallStatus('active');
    setIsRecording(true);
    setCallDuration(0);
    setTranscript([]);
  };

  const handleEndCall = () => {
    setCallStatus('idle');
    setIsRecording(false);
    setCallDuration(0);
    setCustomerData(null);
    setTranscript([]);
    setAiSuggestions([]);
    setKnowledgeBase([]);
    setCallNotes('');
    
    // Reset resolution data
    setResolutionStatus('');
    setResolutionSummary('');
    setResolutionCategory('');
    setFollowUpRequired(false);
    setFollowUpDate('');
    setCustomerSatisfaction(null);
    setIsAutoPopulating(false);
  };

  const handleIncomingCall = () => {
    setCallStatus('incoming');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* IVR Pre-load Banner */}
      {ivrSessionData && timingSavings && (
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                <span className="font-bold text-lg">AHT OPTIMIZATION ACTIVE</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>{timingSavings.servicesPreFetched} services pre-loaded</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-300" />
                  <span>{timingSavings.totalSaved.toFixed(1)}s saved</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4 text-purple-300" />
                  <span>{timingSavings.improvement}% AHT improvement</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Estimated AHT</div>
              <div className="font-bold">
                {Math.floor(timingSavings.optimizedAHT / 60)}:{Math.round(timingSavings.optimizedAHT % 60).toString().padStart(2, '0')}
                <span className="text-xs ml-1 opacity-75">vs {Math.floor(timingSavings.traditionalAHT / 60)}:{(timingSavings.traditionalAHT % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Left Sidebar - Call Controls & Customer Info */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200">
        {/* Call Status Header */}
        <div className={`p-4 ${callStatus === 'active' ? 'bg-green-500' : callStatus === 'incoming' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">
                {callStatus === 'active' ? 'Active Call' : 
                 callStatus === 'incoming' ? 'Incoming Call' : 'Ready'}
              </span>
            </div>
            <div className="text-sm">
              {callStatus === 'active' && formatTime(callDuration)}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-center space-x-3">
            {callStatus === 'idle' && !ivrSessionData && (
              <button 
                onClick={handleIncomingCall}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Simulate Call
              </button>
            )}

            {callStatus === 'idle' && ivrSessionData && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">IVR Session Data Loaded</p>
                <button 
                  onClick={handleAnswerCall}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Start IVR Transfer
                </button>
              </div>
            )}
            
            {callStatus === 'incoming' && (
              <button 
                onClick={handleAnswerCall}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Answer
              </button>
            )}
            
            {callStatus === 'active' && (
              <>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Hold
                </button>
                <button 
                  onClick={handleEndCall}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Sentiment Analysis Quick Controls */}
          {callStatus === 'active' && transcript.length > 0 && (
            <div className="mt-3 flex justify-center space-x-2">
              <button 
                onClick={() => rateLimitedGeminiCall(analyzeSentimentWithGemini, transcript, 'manual')}
                disabled={sentimentAnalysisLoading}
                className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
                  sentimentAnalysisLoading 
                    ? 'bg-purple-100 text-purple-600 cursor-not-allowed' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {sentimentAnalysisLoading ? (
                  <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Bot className="w-3 h-3 mr-2" />
                )}
                {sentimentAnalysisLoading ? 'Analyzing...' : 'Analyze Sentiment'}
              </button>
              
              {currentSentiment && (
                <div className={`flex items-center px-3 py-1 text-xs rounded-lg ${
                  currentSentiment.overallSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  currentSentiment.overallSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    currentSentiment.overallSentiment === 'positive' ? 'bg-green-500' :
                    currentSentiment.overallSentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  {currentSentiment.overallSentiment.toUpperCase()}
                </div>
              )}
              
              {escalationRisk === 'high' && (
                <div className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-800 rounded-lg animate-pulse border border-red-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  HIGH RISK
                </div>
              )}
            </div>
          )}
          
          {/* Development Test Controls - Remove in production */}
          {/* {callStatus === 'active' && (
            <div className="mt-2 flex justify-center">
              <button 
                onClick={addSentimentTestData}
                className="flex items-center px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Add Test Conversation
              </button>
            </div>
          )} */}
          
          {/* IVR Transfer Status */}
          {ivrSessionData && callStatus !== 'active' && (
            <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="text-purple-700 text-sm font-medium">
                  Customer transferred from IVR • Ready to connect
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        {customerData && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {customerData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{customerData.name}</h3>
                <p className="text-sm text-gray-600">{customerData.tier} Customer</p>
                {ivrSessionData && (
                  <p className="text-xs text-purple-600">Transferred from IVR</p>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                customerData.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                customerData.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {customerData.sentiment}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Phone:</span> {customerData.phone}</div>
              {customerData.email && <div><span className="font-medium">Email:</span> {customerData.email}</div>}
              <div><span className="font-medium">Account:</span> {customerData.accountNumber}</div>
              {customerData.lastContact && <div><span className="font-medium">Last Contact:</span> {customerData.lastContact}</div>}
              <div><span className="font-medium">Current Issue:</span> {customerData.issue}</div>
              {ivrSessionData?.agentMatchScore && (
                <div><span className="font-medium">Agent Match:</span> {ivrSessionData.agentMatchScore}%</div>
              )}
            </div>

            {/* IVR Session Info */}
            {ivrSessionData && (
              <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-medium text-purple-800 mb-1">IVR Session Details:</p>
                <div className="text-xs text-purple-700 space-y-1">
                  <div>Session ID: {ivrSessionData.sessionId}</div>
                  <div>Backend Services: {ivrSessionData.totalBackendServices} ({ivrSessionData.successfulServices} successful)</div>
                  <div>Total Processing Time: {ivrSessionData.totalBackendTime}ms</div>
                  {routedAgent && <div>Routed to: {routedAgent.name} ({routedAgent.dept})</div>}
                </div>
              </div>
            )}

            <div className="mt-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Previous Issues:</p>
              <div className="flex flex-wrap gap-1">
                {(customerData.previousIssues || customerData.issues || []).map((issue, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

 

        {/* AHT Optimization Demo Panel */}
        {showOptimizationDemo && timingSavings && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <h4 className="font-semibold text-gray-900">AHT Optimization</h4>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  -{timingSavings.improvement}% AHT
                </span>
              </div>
              <button 
                onClick={() => setShowOptimizationDemo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time Savings Breakdown */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
              <div className="text-center mb-2">
                <div className="text-2xl font-bold text-green-600">
                  {timingSavings.totalSaved.toFixed(1)}s
                </div>
                <div className="text-xs text-gray-600">Total Time Saved</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-blue-600">
                    {timingSavings.preFetchedTime.toFixed(1)}s
                  </div>
                  <div className="text-gray-600">Backend Services</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-600">
                    {timingSavings.customerDataTime}s
                  </div>
                  <div className="text-gray-600">Customer Lookup</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-orange-600">
                    {timingSavings.contextTime}s
                  </div>
                  <div className="text-gray-600">Context Switch</div>
                </div>
              </div>
            </div>

            {/* Traditional vs Optimized Comparison */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded border-l-4 border-red-400">
                <span className="text-red-800">Traditional AHT:</span>
                <span className="font-bold text-red-700">{Math.floor(timingSavings.traditionalAHT / 60)}m {timingSavings.traditionalAHT % 60}s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded border-l-4 border-green-400">
                <span className="text-green-800">Optimized AHT:</span>
                <span className="font-bold text-green-700">{Math.floor(timingSavings.optimizedAHT / 60)}m {Math.round(timingSavings.optimizedAHT % 60)}s</span>
              </div>
            </div>

            {/* Pre-fetched Data Indicator */}
            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-1 mb-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-blue-800">
                  Pre-fetched during IVR ({timingSavings.servicesPreFetched} services)
                </span>
              </div>
              <div className="text-xs text-blue-700">
                ✓ Customer data ready • ✓ Backend services loaded • ✓ Agent context prepared
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Contact Center Dashboard</h1>
              {ivrSessionData && (
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                    IVR Transfer
                  </span>
                  {agentMatchScore && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      {agentMatchScore}% Match
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Dynamic AHT based on IVR data */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {routedAgent?.performance?.averageHandleTimeSeconds 
                    ? `AHT: ${Math.round(routedAgent.performance.averageHandleTimeSeconds / 60)}:${(routedAgent.performance.averageHandleTimeSeconds % 60).toString().padStart(2, '0')}`
                    : 'AHT: 4:32 (-32%)'
                  }
                </span>
              </div>
              {/* Dynamic FCR based on agent data */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>
                  {routedAgent?.performance?.firstCallResolutionPercentage 
                    ? `FCR: ${routedAgent.performance.firstCallResolutionPercentage}%`
                    : 'FCR: 87%'
                  }
                </span>
              </div>
              {/* Backend Performance */}
              {totalBackendTime > 0 && (
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <span>Backend: {totalBackendTime}ms</span>
                </div>
              )}
              {sessionId && (
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <span>Session: {sessionId.split('_')[1]}</span>
                </div>
              )}
              <button 
                onClick={() => setShowOptimizationDemo(!showOptimizationDemo)}
                className={`p-2 rounded transition-colors ${
                  showOptimizationDemo ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Toggle AHT Optimization Panel"
              >
                <Zap className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className={`p-2 rounded transition-colors ${
                  showDebugPanel ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Toggle Debug Panel"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button 
                onClick={logAllStateData}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Log State Data to Console"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => rateLimitedGeminiCall(callGeminiAPI, backendDetails)}
                className={`p-2 rounded transition-colors ${
                  geminiApiLoading 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Call Gemini API with Backend Data"
                disabled={!backendDetails || backendDetails.length === 0 || geminiApiLoading}
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Debug Panel */}
          {showDebugPanel && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">localStorage State Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Phone Number:</span>
                  <p className="text-gray-900">{phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Selected Option:</span>
                  <p className="text-gray-900">{selectedOption || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Session ID:</span>
                  <p className="text-gray-900 font-mono text-xs">{sessionId || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Agent Match Score:</span>
                  <p className="text-gray-900">{agentMatchScore ? `${agentMatchScore}%` : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Backend Services:</span>
                  <p className="text-gray-900">{totalBackendServices || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Successful:</span>
                  <p className="text-green-600">{successfulServices || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Failed:</span>
                  <p className="text-red-600">{failedServices || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Backend Time:</span>
                  <p className="text-gray-900">{totalBackendTime || 0}ms</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Available Agents:</span>
                  <p className="text-gray-900">{availableAgentsCount || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category Mapping:</span>
                  <p className="text-gray-900">{categoryMapping || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Activity Log Entries:</span>
                  <p className="text-gray-900">{activityLog?.length || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Session:</span>
                  <p className="text-gray-900 text-xs">{lastIVRSession ? new Date(lastIVRSession).toLocaleTimeString() : 'N/A'}</p>
                </div>
              </div>
              
              {routedAgent && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Routed Agent Details:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">Name:</span>
                      <p className="text-blue-900">{routedAgent.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Department:</span>
                      <p className="text-blue-900">{routedAgent.dept}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Agent ID:</span>
                      <p className="text-blue-900">{routedAgent.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Availability:</span>
                      <p className="text-blue-900">{routedAgent.availability}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">FCR:</span>
                      <p className="text-blue-900">{routedAgent.performance?.firstCallResolutionPercentage}%</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">AHT:</span>
                      <p className="text-blue-900">{Math.round(routedAgent.performance?.averageHandleTimeSeconds / 60)}m</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Gemini API Status */}
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">AI Analysis:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Status:</span>
                    <p className="text-green-900">
                      {geminiApiLoading ? 'Processing...' : 
                       geminiApiResponse ? 'Completed' : 'Ready'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Backend Services:</span>
                    <p className="text-green-900">
                      {backendDetails?.filter(s => s.RESPONSE_XML).length || 0} with XML data
                    </p>
                  </div>
                  {geminiApiResponse && (
                    <div className="col-span-2">
                      <span className="font-medium text-green-700">Last Analysis:</span>
                      <p className="text-green-900 text-xs">
                        {new Date().toLocaleTimeString()} - Check AI Suggestions for insights
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* IVR Session Summary Panel */}
        {ivrSessionData && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">IVR Session Transfer</h3>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-700 font-medium">Phone:</span>
                    <span className="text-purple-900 font-mono">{phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-700 font-medium">Category:</span>
                    <span className="text-purple-900">{selectedOption?.replace(/_/g, ' ') || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-700 font-medium">Services:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      successfulServices === totalBackendServices 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {successfulServices}/{totalBackendServices}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-700 font-medium">Processing Time:</span>
                    <span className="text-purple-900 font-mono">{totalBackendTime}ms</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {routedAgent && (
                  <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-purple-200">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900 font-medium">{routedAgent.name}</span>
                    <span className="text-purple-600 text-sm">({routedAgent.dept})</span>
                  </div>
                )}
                <div className="text-xs text-purple-600">
                  {new Date(sessionTimestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex">
          {/* No IVR Data State */}
          {!ivrSessionData && callStatus === 'idle' && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
                <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No IVR Session Data</h3>
                <p className="text-gray-600 mb-4">
                  To see the full Contact Center experience with customer context, backend services, and AI suggestions, please start from the IVR Demo first.
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Go to IVR Demo
                  </button>
                  <button 
                    onClick={handleIncomingCall}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Simulate Call Without IVR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Show when there's IVR data or active call */}
          {(ivrSessionData || callStatus !== 'idle') && (
            <>
              {/* Center Panel - Transcript & Notes */}
              <div className="flex-1 flex flex-col">
                
        {/* Customer Sentiment Analysis */}
        {(currentSentiment || sentimentAnalysisLoading) && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-4 h-4 rounded-full ${
                currentSentiment?.overallSentiment === 'positive' ? 'bg-green-500' :
                currentSentiment?.overallSentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <h4 className="font-semibold text-gray-900">Customer Sentiment</h4>
              {currentSentiment && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  currentSentiment.overallSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  currentSentiment.overallSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentSentiment.overallSentiment.toUpperCase()}
                </span>
              )}
              {sentimentAnalysisLoading && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-blue-600">Analyzing sentiment...</span>
                </div>
              )}
            </div>
            
            {currentSentiment && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Sentiment */}
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-sm font-medium text-gray-700 mb-1">Current State</div>
                  <div className={`text-lg font-bold ${
                    currentSentiment.overallSentiment === 'positive' ? 'text-green-600' :
                    currentSentiment.overallSentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {currentSentiment.customerState?.toUpperCase() || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentSentiment.confidence}% confidence
                  </div>
                </div>
                
                {/* Escalation Risk */}
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-sm font-medium text-gray-700 mb-1">Escalation Risk</div>
                  <div className={`text-lg font-bold ${
                    escalationRisk === 'low' ? 'text-green-600' :
                    escalationRisk === 'high' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {escalationRisk.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Trend: {sentimentTrend}
                  </div>
                </div>
                
                {/* Satisfaction Prediction */}
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-sm font-medium text-gray-700 mb-1">Satisfaction</div>
                  <div className={`text-lg font-bold ${
                    currentSentiment.satisfactionPrediction === 'likely_satisfied' ? 'text-green-600' :
                    currentSentiment.satisfactionPrediction === 'likely_dissatisfied' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {currentSentiment.satisfactionPrediction?.replace('likely_', '').replace('_', ' ').toUpperCase() || 'NEUTRAL'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Score: {(currentSentiment.sentimentScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
            
            {/* Emotional Indicators */}
            {emotionalIndicators && emotionalIndicators.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Emotional Indicators</div>
                <div className="flex flex-wrap gap-2">
                  {emotionalIndicators.map((indicator, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full border ${
                      indicator.intensity === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                      indicator.intensity === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {indicator.emotion} ({indicator.intensity})
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Actions based on sentiment */}
            {currentSentiment && escalationRisk === 'high' && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <div className="text-sm font-medium text-red-800 mb-1">⚠️ Recommended Actions</div>
                <div className="text-xs text-red-700">
                  High escalation risk detected. Consider supervisor involvement or immediate resolution focus.
                </div>
              </div>
            )}
          </div>
        )}
                
        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-4 h-4 text-purple-500" />
              <h4 className="font-semibold text-gray-900">AI Suggestions</h4>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {aiSuggestions.length} insights
              </span>
              {geminiApiLoading && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-blue-600">AI analyzing...</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {/* Show Gemini loading state if API is loading and no Gemini response exists yet */}
              {geminiApiLoading && !aiSuggestions.some(s => s.source === 'gemini_ai') && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold text-blue-900">Gemini AI is analyzing...</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Processing {backendDetails?.filter(s => s.RESPONSE_XML).length || 0} backend service responses to generate customer insights and recommendations.
                  </p>
                </div>
              )}
              
              {aiSuggestions.map((suggestion, index) => {
                // Special handling for Gemini AI response
                if (suggestion.source === 'gemini_ai') {
                  const analysisText = suggestion.text.replace('🤖 AI Analysis: ', '');
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex items-center space-x-2 mb-3">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">AI Analysis</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {suggestion.confidence}% Confidence
                        </span>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        {analysisText.split('\n').map((line, lineIndex) => {
                          const trimmedLine = line.trim();
                          
                          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                            // Header line
                            return (
                              <h5 key={lineIndex} className="font-semibold text-gray-900 mt-3 mb-2 text-sm">
                                {trimmedLine.replace(/\*\*/g, '')}
                              </h5>
                            );
                          } else if (trimmedLine.startsWith('* **') || trimmedLine.startsWith('*')) {
                            // Bullet point
                            return (
                              <div key={lineIndex} className="mb-2 pl-3">
                                <p className="text-gray-800 text-sm leading-relaxed" 
                                   dangerouslySetInnerHTML={{
                                     __html: trimmedLine.replace(/^\*\s*/, '• ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   }} />
                              </div>
                            );
                          } else if (trimmedLine.length > 0) {
                            // Regular paragraph
                            return (
                              <p key={lineIndex} className="text-gray-800 text-sm leading-relaxed mb-2" 
                                 dangerouslySetInnerHTML={{
                                   __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                 }} />
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-blue-100 pt-2">
                        <span>🤖 Generated by AI</span>
                        <span>Analyzed {backendDetails?.filter(s => s.RESPONSE_XML).length || 0} backend services</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <button className="text-xs text-green-600 hover:text-green-800 flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-800 flex items-center">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not helpful
                        </button>
                        <button 
                          onClick={() => rateLimitedGeminiCall(callGeminiAPI, backendDetails)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center ml-auto"
                          disabled={geminiApiLoading}
                        >
                          <Bot className="w-3 h-3 mr-1" />
                          Refresh Analysis
                        </button>
                      </div>
                    </div>
                  );
                }

                // Special handling for Sentiment Analysis
                if (suggestion.source === 'gemini_sentiment') {
                  const analysisText = suggestion.text.replace('😊 Customer Sentiment: ', '');
                  
                  return (
                    <div key={index} className={`bg-gradient-to-r border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                      suggestion.sentiment === 'positive' ? 
                        'from-green-50 to-emerald-50 border-green-200' :
                      suggestion.sentiment === 'negative' ? 
                        'from-red-50 to-rose-50 border-red-200' :
                        'from-yellow-50 to-amber-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-5 h-5 rounded-full ${
                          suggestion.sentiment === 'positive' ? 'bg-green-500' :
                          suggestion.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className={`font-semibold ${
                          suggestion.sentiment === 'positive' ? 'text-green-900' :
                          suggestion.sentiment === 'negative' ? 'text-red-900' : 'text-yellow-900'
                        }`}>
                          Customer Sentiment Analysis
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          suggestion.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          suggestion.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {suggestion.confidence}% Confidence
                        </span>
                        {suggestion.escalationRisk === 'high' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium animate-pulse">
                            ⚠️ HIGH RISK
                          </span>
                        )}
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        {analysisText.split('\n').map((line, lineIndex) => {
                          const trimmedLine = line.trim();
                          
                          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                            // Header line
                            return (
                              <h5 key={lineIndex} className="font-semibold text-gray-900 mt-3 mb-2 text-sm">
                                {trimmedLine.replace(/\*\*/g, '')}
                              </h5>
                            );
                          } else if (trimmedLine.startsWith('* **') || trimmedLine.startsWith('*')) {
                            // Bullet point
                            return (
                              <div key={lineIndex} className="mb-2 pl-3">
                                <p className="text-gray-800 text-sm leading-relaxed" 
                                   dangerouslySetInnerHTML={{
                                     __html: trimmedLine.replace(/^\*\s*/, '• ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   }} />
                              </div>
                            );
                          } else if (trimmedLine.length > 0) {
                            // Regular paragraph
                            return (
                              <p key={lineIndex} className="text-gray-800 text-sm leading-relaxed mb-2" 
                                 dangerouslySetInnerHTML={{
                                   __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                 }} />
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className={`mt-4 flex items-center justify-between text-xs border-t pt-2 ${
                        suggestion.sentiment === 'positive' ? 'text-gray-500 border-green-100' :
                        suggestion.sentiment === 'negative' ? 'text-gray-500 border-red-100' :
                        'text-gray-500 border-yellow-100'
                      }`}>
                        <span>😊 Real-time Sentiment Analysis</span>
                        <span>Updated: {new Date(suggestion.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <button className="text-xs text-green-600 hover:text-green-800 flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-800 flex items-center">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not helpful
                        </button>
                        <button 
                          onClick={() => rateLimitedGeminiCall(analyzeSentimentWithGemini, transcript, 'manual')}
                          className="text-xs text-purple-600 hover:text-purple-800 flex items-center ml-auto"
                          disabled={sentimentAnalysisLoading}
                        >
                          <Bot className="w-3 h-3 mr-1" />
                          Refresh Sentiment
                        </button>
                      </div>
                    </div>
                  );
                }

                // Special handling for Gemini Transcript Analysis  
                if (suggestion.source === 'gemini_transcript') {
                  const analysisText = suggestion.text.replace('📋 Transcript Analysis: ', '');
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Transcript Analysis</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {suggestion.confidence}% Confidence
                        </span>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        {analysisText.split('\n').map((line, lineIndex) => {
                          const trimmedLine = line.trim();
                          
                          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                            // Header line
                            return (
                              <h5 key={lineIndex} className="font-semibold text-gray-900 mt-3 mb-2 text-sm">
                                {trimmedLine.replace(/\*\*/g, '')}
                              </h5>
                            );
                          } else if (trimmedLine.startsWith('* **') || trimmedLine.startsWith('*')) {
                            // Bullet point
                            return (
                              <div key={lineIndex} className="mb-2 pl-3">
                                <p className="text-gray-800 text-sm leading-relaxed" 
                                   dangerouslySetInnerHTML={{
                                     __html: trimmedLine.replace(/^\*\s*/, '• ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   }} />
                              </div>
                            );
                          } else if (trimmedLine.length > 0) {
                            // Regular paragraph
                            return (
                              <p key={lineIndex} className="text-gray-800 text-sm leading-relaxed mb-2" 
                                 dangerouslySetInnerHTML={{
                                   __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                 }} />
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-green-100 pt-2">
                        <span>📋 Generated from Transcript</span>
                        <span>Analyzed {transcript.filter(msg => msg && !msg.isSystem).length} messages</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <button className="text-xs text-green-600 hover:text-green-800 flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-800 flex items-center">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not helpful
                        </button>
                        <button 
                          onClick={() => rateLimitedGeminiCall(callGeminiAPIWithTranscript, transcript)}
                          className="text-xs text-green-600 hover:text-green-800 flex items-center ml-auto"
                          disabled={geminiApiLoading}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Refresh Analysis
                        </button>
                      </div>
                    </div>
                  );
                }
                // Regular suggestions (non-Gemini)
                return (
                  <div key={index} className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                    suggestion.type === 'action' ? 'bg-blue-50 border-blue-200' :
                    suggestion.type === 'response' ? 'bg-green-50 border-green-200' :
                    suggestion.type === 'escalation' ? 'bg-orange-50 border-orange-200' :
                    suggestion.type === 'context' ? 'bg-purple-50 border-purple-200' :
                    suggestion.type === 'insight' ? 'bg-yellow-50 border-yellow-200' :
                    suggestion.source === 'gemini_error' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-800 flex-1 pr-2">
                        {suggestion.source === 'gemini_error' ? (
                          <span className="text-red-700">{suggestion.text}</span>
                        ) : (
                          suggestion.text
                        )}
                      </p>
                      <span className="text-xs font-medium ml-2 whitespace-nowrap">
                        {suggestion.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        suggestion.type === 'action' ? 'bg-blue-100 text-blue-800' :
                        suggestion.type === 'response' ? 'bg-green-100 text-green-800' :
                        suggestion.type === 'escalation' ? 'bg-orange-100 text-orange-800' :
                        suggestion.type === 'context' ? 'bg-purple-100 text-purple-800' :
                        suggestion.type === 'insight' ? 'bg-yellow-100 text-yellow-800' :
                        suggestion.source === 'gemini_error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {suggestion.type}
                      </span>
                      {suggestion.source && (
                        <span className="text-xs text-gray-500 font-mono">
                          {suggestion.source}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* AI Suggestions Summary Stats */}
            <div className="mt-3 p-2 bg-gray-50 rounded border">
              <div className="grid grid-cols-7 gap-2 text-xs text-center">
                <div>
                  <div className="font-medium text-blue-600">
                    {aiSuggestions.filter(s => s.source === 'gemini_ai').length}
                  </div>
                  <div className="text-gray-600">AI Analysis</div>
                </div>
                <div>
                  <div className={`font-medium ${
                    currentSentiment?.overallSentiment === 'positive' ? 'text-green-600' :
                    currentSentiment?.overallSentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {aiSuggestions.filter(s => s.source === 'gemini_sentiment').length}
                  </div>
                  <div className="text-gray-600">Sentiment</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">
                    {aiSuggestions.filter(s => s.type === 'action' && s.source !== 'gemini_ai').length}
                  </div>
                  <div className="text-gray-600">Actions</div>
                </div>
                <div>
                  <div className="font-medium text-purple-600">
                    {aiSuggestions.filter(s => s.type === 'context' && s.source !== 'gemini_ai').length}
                  </div>
                  <div className="text-gray-600">Context</div>
                </div>
                <div>
                  <div className="font-medium text-yellow-600">
                    {aiSuggestions.filter(s => s.type === 'insight' && s.source !== 'gemini_ai').length}
                  </div>
                  <div className="text-gray-600">Insights</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">
                    {aiSuggestions.filter(s => s.source === 'gemini_error').length}
                  </div>
                  <div className="text-gray-600">Errors</div>
                </div>
                <div>
                  <div className={`font-medium ${
                    escalationRisk === 'high' ? 'text-red-600 animate-pulse' :
                    escalationRisk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {escalationRisk.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-gray-600">Risk</div>
                </div>
              </div>
              
              {/* Show when Gemini analysis is available */}
              {aiSuggestions.some(s => s.source === 'gemini_ai') && (
                <div className="mt-2 text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
                    <Bot className="w-3 h-3" />
                    <span>Gemini AI analysis active • Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
              
              {/* Show sentiment trend when available */}
              {currentSentiment && (
                <div className="mt-2 text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      currentSentiment.overallSentiment === 'positive' ? 'bg-green-500' :
                      currentSentiment.overallSentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className={`${
                      currentSentiment.overallSentiment === 'positive' ? 'text-green-600' :
                      currentSentiment.overallSentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      Customer sentiment: {currentSentiment.overallSentiment} • Trend: {sentimentTrend}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


                {/* Live Transcript */}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
                    <div className="flex items-center space-x-2">
                      {isRecording && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-sm">Recording</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 h-96 overflow-y-auto p-4">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <MessageSquare className="w-8 h-8 mr-2" />
                        <span>
                          {ivrSessionData ? 'Call being transferred from IVR...' : 'No active conversation'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transcript.filter(message => message && message.speaker && message.text).map((message, index) => (
                          <div key={index} className={`flex ${
                            message.speaker === 'Agent' ? 'justify-end' : 
                            message.isSystem ? 'justify-center' : 'justify-start'
                          }`}>
                            <div className={`px-4 py-2 rounded-lg ${
                              message.speaker === 'Agent' 
                                ? 'bg-blue-500 text-white max-w-xs lg:max-w-md' 
                                : message.isSystem
                                ? 'bg-purple-100 text-purple-800 text-xs border border-purple-200 max-w-md'
                                : 'bg-gray-200 text-gray-900 max-w-xs lg:max-w-md'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${message.isSystem ? 'text-purple-600' : ''}`}>
                                  {message.speaker}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs ${message.isSystem ? 'text-purple-500' : 'opacity-75'}`}>
                                    {message.time || ''}
                                  </span>
                                  {message.conversationId && (
                                    <span className="text-xs bg-black bg-opacity-20 px-1 rounded font-mono">
                                      {message.conversationId.split('_')[1]}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className={`text-sm ${message.isSystem ? 'text-purple-800 font-medium' : ''}`}>
                                {message.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Notes */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Call Notes</h3>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Add notes about this conversation..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Add Tag
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Quick Action
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Call Resolution */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">Call Resolution</h3>
                      <button
                        onClick={autoPopulateResolution}
                        disabled={isAutoPopulating}
                        className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                          isAutoPopulating 
                            ? 'bg-blue-200 text-blue-600 cursor-not-allowed' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        title="Auto-fill resolution fields based on call context"
                      >
                        {isAutoPopulating ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Auto-Filling...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3" />
                            <span>Auto-Fill</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resolutionStatus === 'resolved' ? 'bg-green-100 text-green-800' :
                      resolutionStatus === 'escalated' ? 'bg-red-100 text-red-800' :
                      resolutionStatus === 'follow-up' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {resolutionStatus || 'Pending'}
                    </span>
                  </div>

                  {/* Resolution Status */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['resolved', 'escalated', 'follow-up', 'pending'].map(status => (
                        <button
                          key={status}
                          onClick={() => setResolutionStatus(status)}
                          className={`p-2 text-sm rounded border transition-colors ${
                            resolutionStatus === status
                              ? status === 'resolved' ? 'bg-green-500 text-white border-green-500' :
                                status === 'escalated' ? 'bg-red-500 text-white border-red-500' :
                                status === 'follow-up' ? 'bg-yellow-500 text-white border-yellow-500' :
                                'bg-gray-500 text-white border-gray-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Category */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Category</label>
                    <select
                      value={resolutionCategory}
                      onChange={(e) => setResolutionCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="billing-inquiry">Billing Inquiry</option>
                      <option value="service-request">Service Request</option>
                      <option value="account-management">Account Management</option>
                      <option value="complaint-resolution">Complaint Resolution</option>
                      <option value="product-information">Product Information</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Resolution Summary */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Summary</label>
                    <textarea
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      placeholder="Describe how the issue was resolved or current status..."
                      className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Follow-up Section */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="followUpRequired"
                        checked={followUpRequired}
                        onChange={(e) => setFollowUpRequired(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                        Follow-up Required
                      </label>
                    </div>
                    
                    {followUpRequired && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  </div>

                  {/* Customer Satisfaction */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Satisfaction</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setCustomerSatisfaction(rating)}
                          className={`p-1 transition-colors ${
                            customerSatisfaction >= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      {customerSatisfaction && (
                        <span className="text-sm text-gray-600 ml-2">
                          {customerSatisfaction}/5 stars
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setResolutionStatus('');
                          setResolutionSummary('');
                          setResolutionCategory('');
                          setFollowUpRequired(false);
                          setFollowUpDate('');
                          setCustomerSatisfaction(null);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={generateResolutionFromTranscript}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 flex items-center space-x-1"
                        title="Generate resolution from transcript"
                        disabled={transcript.length === 0}
                      >
                        <FileText className="w-3 h-3" />
                        <span>From Transcript</span>
                      </button>
                      <button 
                        onClick={suggestResolutionFromAI}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 flex items-center space-x-1"
                        title="Use AI suggestions for resolution"
                        disabled={aiSuggestions.length === 0}
                      >
                        <Bot className="w-3 h-3" />
                        <span>AI Suggest</span>
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        Save Draft
                      </button>
                    </div>
                    <button 
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        resolutionStatus && resolutionSummary
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!resolutionStatus || !resolutionSummary}
                      onClick={handleCompleteResolution}
                    >
                      Complete Resolution
                    </button>
                  </div>

                  {/* Resolution Summary Display */}
                  {resolutionStatus && resolutionSummary && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                      <div className="text-xs text-gray-600 mb-1">Resolution Preview:</div>
                      <div className="text-sm">
                        <span className="font-medium">Status:</span> {resolutionStatus.replace('-', ' ')} • 
                        <span className="font-medium ml-2">Category:</span> {resolutionCategory || 'Not specified'} • 
                        {followUpRequired && <span className="font-medium ml-2">Follow-up:</span>}
                        {followUpRequired && <span className="ml-1">{followUpDate}</span>}
                        {customerSatisfaction && (
                          <>
                            <span className="font-medium ml-2">Rating:</span>
                            <span className="ml-1">{customerSatisfaction}/5 ⭐</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {resolutionSummary}
                      </div>
                    </div>
                  )}

                  {/* Session Data Management Panel */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-900">Session Data Management</h4>
                      <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const stats = getSessionStatistics();
                          if (stats) {
                            alert(`Session Statistics:\n\nTotal Sessions: ${stats.totalSessions}\nAvg Completeness: ${stats.avgCompleteness}%\nAvg Satisfaction: ${stats.avgSatisfaction || 'N/A'}\n\nResolution Status:\n${Object.entries(stats.resolutionStats).map(([status, count]) => `${status}: ${count}`).join('\n')}`);
                          } else {
                            alert('No session statistics available.');
                          }
                        }}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        View Stats
                      </button>
                      <button
                        onClick={exportAllCompletedSessions}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center justify-center"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export All
                      </button>
                      <button
                        onClick={() => {
                          const result = clearOldSessionData(30);
                          alert(`Cleanup completed!\n\nRemoved: ${result.removed} old sessions\nRemaining: ${result.remaining} sessions`);
                        }}
                        className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                      >
                        Cleanup (30d)
                      </button>
                      <button
                        onClick={() => {
                          const savedSessions = getSavedSessions();
                          console.log('All saved sessions:', savedSessions);
                          alert(`Found ${savedSessions.length} saved session(s). Check console for details.`);
                        }}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        List All
                      </button>
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      💡 Each completed resolution automatically saves to JSON file & localStorage
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Knowledge Base */}
              <div className="w-80 bg-white border-l border-gray-200">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search knowledge base..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Knowledge Base Results */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Knowledge Base</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {knowledgeBase.length} articles
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {knowledgeBase.map((article, index) => (
                      <div key={index} className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                        article.type === 'case_study' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                        article.type === 'technical_guide' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                        article.type === 'service_guide' ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' :
                        article.type === 'analytics' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                        'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 flex-1 pr-2">{article.title}</h4>
                          <div className="flex items-center space-x-2">
                            {article.type && (
                              <span className={`text-xs px-2 py-1 rounded font-medium ${
                                article.type === 'case_study' ? 'bg-blue-100 text-blue-800' :
                                article.type === 'technical_guide' ? 'bg-green-100 text-green-800' :
                                article.type === 'service_guide' ? 'bg-purple-100 text-purple-800' :
                                article.type === 'analytics' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {article.type.replace('_', ' ')}
                              </span>
                            )}
                            <span className="text-xs text-green-600 font-medium">{article.relevance}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{article.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              View Full
                            </button>
                            <button className="text-xs text-green-600 hover:text-green-800 flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful
                            </button>
                          </div>
                          {article.source && article.source !== 'knowledge_base' && (
                            <span className="text-xs text-gray-400 font-mono">
                              {article.source}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Knowledge Base Summary */}
                  {knowledgeBase.length > 0 && (
                    <div className="mt-3 p-2 bg-gray-50 rounded border">
                      <div className="grid grid-cols-3 gap-3 text-xs text-center">
                        <div>
                          <div className="font-medium text-blue-600">
                            {knowledgeBase.filter(a => a.source === 'knowledge_base').length}
                          </div>
                          <div className="text-gray-600">KB Articles</div>
                        </div>
                        <div>
                          <div className="font-medium text-purple-600">
                            {knowledgeBase.filter(a => a.source && a.source.startsWith('conversation')).length}
                          </div>
                          <div className="text-gray-600">Live Cases</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-600">
                            {Math.round(knowledgeBase.reduce((sum, a) => sum + a.relevance, 0) / knowledgeBase.length)}%
                          </div>
                          <div className="text-gray-600">Avg Relevance</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full p-2 text-left text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                      Transfer to Billing
                    </button>
                    <button className="w-full p-2 text-left text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">
                      Schedule Callback
                    </button>
                    <button className="w-full p-2 text-left text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                      Create Follow-up Task
                    </button>
                    <button className="w-full p-2 text-left text-sm bg-orange-50 text-orange-700 rounded hover:bg-orange-100">
                      Escalate to Manager
                    </button>
                  </div>
                </div>

                {/* Backend Services from IVR */}
                {backendDetails && backendDetails.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Backend Services (IVR)</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 font-medium">
                          {successfulServices}/{totalBackendServices} successful
                        </span>
                        <span className="text-xs text-gray-500">
                          {totalBackendTime}ms total
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {backendDetails
                        .sort((a, b) => parseInt(b.TIME_TAKEN) - parseInt(a.TIME_TAKEN)) // Sort by processing time
                        .map((service, index) => (
                        <div key={index} className={`p-3 rounded-lg text-xs border transition-all hover:shadow-sm ${
                          service.STATUS === 'S' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm">{service.SERVICE_NAME}</div>
                            <div className="flex items-center space-x-2">
                              {service.STATUS === 'S' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-mono font-bold">{service.TIME_TAKEN}ms</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Status: {service.STATUS === 'S' ? 'Success' : 'Failed'}</span>
                            {service.Average_Elapsed_Time_ms && (
                              <span className="text-gray-600">
                                Avg: {Math.round(service.Average_Elapsed_Time_ms)}ms
                              </span>
                            )}
                          </div>
                          {service.MIN_TIME && service.MAX_TIME && (
                            <div className="mt-1 text-gray-600">
                              Range: {service.MIN_TIME}ms - {service.MAX_TIME}ms
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Performance Summary */}
                    <div className="mt-3 p-2 bg-gray-50 rounded border">
                      <div className="grid grid-cols-3 gap-4 text-xs text-center">
                        <div>
                          <div className="font-medium text-green-600">{successfulServices}</div>
                          <div className="text-gray-600">Success</div>
                        </div>
                        <div>
                          <div className="font-medium text-red-600">{failedServices}</div>
                          <div className="text-gray-600">Failed</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-600">
                            {Math.round(totalBackendTime / totalBackendServices)}ms
                          </div>
                          <div className="text-gray-600">Avg Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ContactCenterUI;
