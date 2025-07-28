import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, User, Clock, MessageSquare, Search, Send, Star, AlertCircle, CheckCircle, Mic, MicOff, Volume2, VolumeX, Settings, BarChart3, FileText, Tag, Zap, Bot, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import TRANSCRIPT_DATA from '../utils/TRANSCRIPT_DATA.json';

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
  
  const callTimerRef = useRef(null);

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
          
          // Call Gemini API with backend details RESPONSE_XML
          callGeminiAPI(ivrData.backendDetails);
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
                text: `Analyze the following backend service response XML data, which includes various service call responses. For the customer associated with this data, please provide a summary that includes:

* **Customer Information**: Extract the customer's name, billing and service address, account number (BAN), customer type, and any relevant contact details like email or phone numbers for notifications.
* **Services**: List all active products/services, their Customer Product IDs, product codes, types, statuses, descriptions, activation dates, and any relevant technical details (e.g., internet speeds, access technology).
* **Potential Issues and Recommendations**: Identify any failed operations (e.g., modem reboots), pending actions (e.g., MLT polls), open or past-due tickets, and any patterns of recurring issues from historical ticket data. Also, note any self-help eligibility or chronic customer flags.

Ensure the summary is clear, concise, and highlights key findings.:\n\n${xmlText}`
              }
            ]
          }
        ]
      };

      console.log('Calling Gemini API with backend details:', payload);

      // Make the API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyCroQ-BaLYAuriHkGfr9PxLL950RNQctfY' // You'll need to set your API key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
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
      const transcriptText = transcriptMessages
        .filter(msg => !msg.isSystem) // Exclude system messages
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
                text: `You are an AI assistant helping a contact center agent. Analyze the following customer service transcript and provide specific suggestions and information for resolution.

${customerContext}

Transcript:
${transcriptText}

Please provide:

**Issue Analysis:**
- Identify the main customer issues or concerns
- Determine the urgency level (Low/Medium/High)
- Note any emotional indicators (frustration, satisfaction, confusion)

**Resolution Recommendations:**
- Provide specific steps the agent should take to resolve the issue
- Suggest follow-up actions needed
- Recommend any additional services or products that might help

**Customer Sentiment:**
- Assess overall customer satisfaction during the call
- Identify any potential escalation risks
- Note opportunities to improve customer experience

**Next Best Actions:**
- List immediate actions the agent should prioritize
- Suggest proactive measures to prevent similar issues
- Recommend any system checks or account updates needed

**Knowledge Base Suggestions:**
- Identify relevant help articles or procedures
- Suggest internal resources the agent should reference
- Note any training opportunities for similar cases

Please format your response clearly with specific, actionable recommendations that will help the agent provide excellent customer service.`
              }
            ]
          }
        ]
      };

      console.log('Calling Gemini API with transcript data:', payload);

      // Make the API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyCroQ-BaLYAuriHkGfr9PxLL950RNQctfY' // You'll need to set your API key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
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
    const traditionalAHTSeconds = 420; // 7 minutes average
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
          // Once all transcript messages are loaded, send to Gemini for analysis
          console.log('Transcript loading complete, sending to Gemini for analysis...');
          setTimeout(() => {
            callGeminiAPIWithTranscript(messages);
          }, 1000); // Wait 1 second after transcript is complete before analyzing
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [callStatus, ivrSessionData, customerData, selectedOption, agentMatchScore, categoryMapping]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                onClick={() => callGeminiAPI(backendDetails)}
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
                          onClick={() => callGeminiAPI(backendDetails)}
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
                          onClick={() => callGeminiAPIWithTranscript(transcript)}
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
              <div className="grid grid-cols-6 gap-2 text-xs text-center">
                <div>
                  <div className="font-medium text-blue-600">
                    {aiSuggestions.filter(s => s.source === 'gemini_ai').length}
                  </div>
                  <div className="text-gray-600">AI Analysis</div>
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
