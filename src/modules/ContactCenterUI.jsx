import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  User,
  Clock,
  MessageSquare,
  Search,
  Send,
  Star,
  AlertCircle,
  CheckCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  BarChart3,
  FileText,
  Tag,
  Zap,
  Bot,
  ThumbsUp,
  ThumbsDown,
  X,
  Download,
  Save,
  Database,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import TRANSCRIPT_DATA from "../utils/TRANSCRIPT_DATA.json";
import {
  saveSessionDataToFile,
  saveSessionDataToStorage,
  generateSessionSummary,
  validateSessionData,
  exportAllSessions,
  getSavedSessions,
} from "../utils/sessionDataManager";

// Debug Panel Component
const DebugPanel = ({
  phoneNumber,
  selectedOption,
  sessionId,
  agentMatchScore,
  totalBackendServices,
  successfulServices,
  failedServices,
  totalBackendTime,
  availableAgentsCount,
  categoryMapping,
  activityLog,
  lastIVRSession,
  routedAgent,
  geminiApiLoading,
  geminiApiResponse,
  backendDetails,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          localStorage State Data
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Phone Number:</span>
            <p className="text-gray-900">{phoneNumber || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Selected Option:</span>
            <p className="text-gray-900">{selectedOption || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Session ID:</span>
            <p className="text-gray-900 font-mono text-xs">
              {sessionId || "N/A"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              Agent Match Score:
            </span>
            <p className="text-gray-900">
              {agentMatchScore ? `${agentMatchScore}%` : "N/A"}
            </p>
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
            <span className="font-medium text-gray-700">
              Total Backend Time (Parallel):
            </span>
            <p className="text-gray-900">{totalBackendTime || 0}ms</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Available Agents:</span>
            <p className="text-gray-900">{availableAgentsCount || 0}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Category Mapping:</span>
            <p className="text-gray-900">{categoryMapping || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              Activity Log Entries:
            </span>
            <p className="text-gray-900">{activityLog?.length || 0}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Session:</span>
            <p className="text-gray-900 text-xs">
              {lastIVRSession
                ? new Date(lastIVRSession).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        </div>

        {routedAgent && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Routed Agent Details:
            </h4>
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
                <p className="text-blue-900">
                  {routedAgent.performance?.firstCallResolutionPercentage}%
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-700">AHT:</span>
                <p className="text-blue-900">
                  {Math.round(
                    routedAgent.performance?.averageHandleTimeSeconds / 60
                  )}
                  m
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Section */}
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">AI Analysis:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-green-700">Status:</span>
              <p className="text-green-900">
                {geminiApiLoading
                  ? "Processing..."
                  : geminiApiResponse
                  ? "Completed"
                  : "Ready"}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Backend Services:
              </span>
              <p className="text-green-900">
                {backendDetails?.filter((s) => s.RESPONSE_XML).length || 0} with
                XML data
              </p>
            </div>
            {geminiApiResponse && (
              <div className="col-span-2">
                <span className="font-medium text-green-700">
                  Last Analysis:
                </span>
                <p className="text-green-900 text-xs">
                  {new Date().toLocaleTimeString()} - Check AI Suggestions for
                  insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCenterUI = () => {
  const [callStatus, setCallStatus] = useState("idle"); // idle, incoming, active, hold, transferring
  const [customerData, setCustomerData] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);
  // aiSuggestions stores ONLY backend processed Gemini data (no simulated content or sentiment data)
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [callNotes, setCallNotes] = useState("");
  const [notesExpanded, setNotesExpanded] = useState(true); // Control call notes expansion
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentIssue, setCurrentIssue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Resolution section state
  const [resolutionStatus, setResolutionStatus] = useState(""); // pending, resolved, escalated, follow-up
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [resolutionCategory, setResolutionCategory] = useState("");
  const [resolutionExpanded, setResolutionExpanded] = useState(true); // Control call resolution expansion
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [customerSatisfaction, setCustomerSatisfaction] = useState(null);
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  // IVR Session Data State Variables
  const [ivrSessionData, setIvrSessionData] = useState(null);
  const [ivrSessionSummary, setIvrSessionSummary] = useState(null);
  const [routedAgent, setRoutedAgent] = useState(null);
  const [backendDetails, setBackendDetails] = useState([]);

  // Additional IVR Data State Variables
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [categoryMapping, setCategoryMapping] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessionTimestamp, setSessionTimestamp] = useState("");
  const [agentMatchScore, setAgentMatchScore] = useState(null);
  const [availableAgentsCount, setAvailableAgentsCount] = useState(0);
  const [totalBackendServices, setTotalBackendServices] = useState(0);
  const [successfulServices, setSuccessfulServices] = useState(0);
  const [failedServices, setFailedServices] = useState(0);
  const [totalBackendTime, setTotalBackendTime] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [lastIVRSession, setLastIVRSession] = useState("");
  const [showOptimizationDemo, setShowOptimizationDemo] = useState(true);
  const [timingSavings, setTimingSavings] = useState(null);
  const [geminiApiLoading, setGeminiApiLoading] = useState(false);
  const [geminiApiResponse, setGeminiApiResponse] = useState(null);
  const [geminiBackendAnalyzed, setGeminiBackendAnalyzed] = useState(false);
  const [geminiBackendData, setGeminiBackendData] = useState(null); // Stores parsed JSON from Gemini

  // Customer Sentiment Analysis State Variables
  const [currentSentiment, setCurrentSentiment] = useState(null);
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [sentimentTrend, setSentimentTrend] = useState("neutral");
  const [emotionalIndicators, setEmotionalIndicators] = useState([]);
  const [escalationRisk, setEscalationRisk] = useState("low");
  const [sentimentAnalysisLoading, setSentimentAnalysisLoading] =
    useState(false);
  const [sentimentApiError, setSentimentApiError] = useState(null);

  // Agent typing and message states
  const [agentIsTyping, setAgentIsTyping] = useState(false);
  const [agentTypingMessage, setAgentTypingMessage] = useState("");
  const [pendingAgentMessage, setPendingAgentMessage] = useState(null);
  const [customerIsTyping, setCustomerIsTyping] = useState(false);
  const [currentAgentMessage, setCurrentAgentMessage] = useState("");
  const [isManuallyTyping, setIsManuallyTyping] = useState(false);

  // Rate limiting for Gemini API calls
  const [lastGeminiCall, setLastGeminiCall] = useState(0);
  const [geminiCallQueue, setGeminiCallQueue] = useState([]);
  const GEMINI_RATE_LIMIT_MS = 2000; // 2 seconds between calls

  // Dropdown and popup controls for combined navigation
  const [showIVRDetailsDropdown, setShowIVRDetailsDropdown] = useState(false);
  const [showBackendServicesDropdown, setShowBackendServicesDropdown] =
    useState(false);
  const [showAgentInfoDropdown, setShowAgentInfoDropdown] = useState(false);
  const [showSentimentDetailsDialog, setShowSentimentDetailsDialog] =
    useState(false);

  const callTimerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowIVRDetailsDropdown(false);
        setShowBackendServicesDropdown(false);
        setShowAgentInfoDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper functions for session data management (moved inside component scope)
  const exportAllCompletedSessions = () => {
    try {
      const completedSessions = JSON.parse(
        localStorage.getItem("completed-sessions") || "[]"
      );

      if (completedSessions.length === 0) {
        alert("No completed sessions found to export.");
        return;
      }

      // Load all session data
      const allSessionsData = completedSessions
        .map((sessionMeta) => {
          const sessionData = JSON.parse(
            localStorage.getItem(sessionMeta.dataKey) || "{}"
          );
          return {
            metadata: sessionMeta,
            sessionData: sessionData,
          };
        })
        .filter((session) => Object.keys(session.sessionData).length > 0);

      // Create export data
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          totalSessions: allSessionsData.length,
          exportedBy: "ContactCenterUI",
          version: "1.0",
        },
        sessions: allSessionsData,
      };

      // Generate filename and download
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `all-completed-sessions-${timestamp}.json`;

      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      alert(
        `Successfully exported ${allSessionsData.length} sessions to ${filename}`
      );
    } catch (error) {
      console.error("Error exporting all sessions:", error);
      alert("Failed to export sessions. Check console for details.");
    }
  };

  const getSessionStatistics = () => {
    try {
      const completedSessions = JSON.parse(
        localStorage.getItem("completed-sessions") || "[]"
      );

      if (completedSessions.length === 0) {
        return null;
      }

      // Calculate statistics
      const totalSessions = completedSessions.length;
      const sessionsWithValidation = completedSessions.filter(
        (s) => s.validation
      );
      const avgCompleteness =
        sessionsWithValidation.length > 0
          ? Math.round(
              sessionsWithValidation.reduce(
                (sum, s) => sum + s.validation.completeness,
                0
              ) / sessionsWithValidation.length
            )
          : 0;

      const resolutionStats = completedSessions.reduce((stats, session) => {
        const status = session.summary?.resolution?.status || "unknown";
        stats[status] = (stats[status] || 0) + 1;
        return stats;
      }, {});

      const satisfactionScores = completedSessions
        .map((s) => s.summary?.resolution?.satisfaction)
        .filter((score) => score !== null && score !== undefined);

      const avgSatisfaction =
        satisfactionScores.length > 0
          ? Math.round(
              (satisfactionScores.reduce((sum, score) => sum + score, 0) /
                satisfactionScores.length) *
                10
            ) / 10
          : null;

      return {
        totalSessions,
        avgCompleteness,
        resolutionStats,
        avgSatisfaction,
        totalSatisfactionRatings: satisfactionScores.length,
      };
    } catch (error) {
      console.error("Error calculating session statistics:", error);
      return null;
    }
  };

  const clearOldSessionData = (daysOld = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const completedSessions = JSON.parse(
        localStorage.getItem("completed-sessions") || "[]"
      );
      const recentSessions = completedSessions.filter((session) => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate > cutoffDate;
      });

      // Remove old session data from localStorage
      const removedCount = completedSessions.length - recentSessions.length;
      completedSessions.forEach((session) => {
        const sessionDate = new Date(session.timestamp);
        if (session.dataKey && sessionDate <= cutoffDate) {
          localStorage.removeItem(session.dataKey);
        }
      });

      // Update completed sessions list
      localStorage.setItem(
        "completed-sessions",
        JSON.stringify(recentSessions)
      );

      console.log(
        `Cleaned up ${removedCount} sessions older than ${daysOld} days`
      );
      return { removed: removedCount, remaining: recentSessions.length };
    } catch (error) {
      console.error("Error cleaning up old session data:", error);
      return { removed: 0, remaining: 0 };
    }
  };

  // Utility function to safely filter transcript messages
  const safeFilterTranscript = (messages, filterFn) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }
    return messages.filter(
      (msg) => msg && typeof msg === "object" && filterFn(msg)
    );
  };

  // Rate limiting wrapper for Gemini API calls
  const rateLimitedGeminiCall = async (apiFunction, ...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastGeminiCall;

    if (timeSinceLastCall < GEMINI_RATE_LIMIT_MS) {
      console.log(
        `Rate limiting Gemini API call. Waiting ${
          GEMINI_RATE_LIMIT_MS - timeSinceLastCall
        }ms`
      );
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
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css";
      document.head.appendChild(cssLink);

      // Load JavaScript
      const script = document.createElement("script");
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
      script.onload = () => {
        // Create df-messenger element
        const dfMessenger = document.createElement("df-messenger");
        dfMessenger.setAttribute("location", "us-central1");
        dfMessenger.setAttribute("project-id", "prj-mm-genai-qa-001");
        dfMessenger.setAttribute(
          "agent-id",
          "b0f263de-3928-4f39-a20b-669b42b5f6de"
        );
        dfMessenger.setAttribute("language-code", "en");
        dfMessenger.setAttribute("max-query-length", "-1");
        dfMessenger.setAttribute("allow-feedback", "all");

        // Create chat bubble
        const chatBubble = document.createElement("df-messenger-chat-bubble");
        chatBubble.setAttribute("chat-title", "AHT_Demo");
        dfMessenger.appendChild(chatBubble);

        // Add to body
        document.body.appendChild(dfMessenger);

        // Add custom styles
        const style = document.createElement("style");
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
      const dfMessenger = document.querySelector("df-messenger");
      if (dfMessenger) {
        dfMessenger.remove();
      }

      // Remove custom styles (optional, might want to keep for other components)
      const customStyle = document.querySelector("style");
      if (customStyle && customStyle.textContent.includes("df-messenger")) {
        customStyle.remove();
      }
    };
  }, []);

  // Function to load IVR session data from localStorage
  const loadIVRSessionData = () => {
    try {
      const storedData = localStorage.getItem("ivrSessionData");
      const storedSummary = localStorage.getItem("ivrSessionSummary");
      const storedLastSession = localStorage.getItem("lastIVRSession");

      // Reset Gemini backend analysis flag for new session
      setGeminiBackendAnalyzed(false);

      if (storedData) {
        const ivrData = JSON.parse(storedData);
        console.log("Loaded IVR session data:", ivrData);

        // Store complete IVR session data
        setIvrSessionData(ivrData);

        // Load individual data fields into state variables
        if (ivrData.phoneNumber) setPhoneNumber(ivrData.phoneNumber);
        if (ivrData.selectedOption) setSelectedOption(ivrData.selectedOption);
        if (ivrData.categoryMapping)
          setCategoryMapping(ivrData.categoryMapping);
        if (ivrData.sessionId) setSessionId(ivrData.sessionId);
        if (ivrData.timestamp) setSessionTimestamp(ivrData.timestamp);
        if (ivrData.agentMatchScore)
          setAgentMatchScore(ivrData.agentMatchScore);
        if (ivrData.availableAgentsCount)
          setAvailableAgentsCount(ivrData.availableAgentsCount);
        if (ivrData.totalBackendServices)
          setTotalBackendServices(ivrData.totalBackendServices);
        if (ivrData.successfulServices)
          setSuccessfulServices(ivrData.successfulServices);
        if (ivrData.failedServices) setFailedServices(ivrData.failedServices);
        if (ivrData.totalBackendTime)
          setTotalBackendTime(ivrData.totalBackendTime);
        if (ivrData.activityLog) setActivityLog(ivrData.activityLog);

        // Load customer data from IVR session
        if (ivrData.customerData) {
          setCustomerData({
            ...ivrData.customerData,
            phone: ivrData.phoneNumber,
            issue:
              ivrData.selectedOption ||
              ivrData.customerData.issues?.[0] ||
              "General inquiry",
            sentiment: "neutral", // Default, could be enhanced with sentiment analysis
          });
        }

        // Load routed agent information
        if (ivrData.routedAgent) {
          setRoutedAgent(ivrData.routedAgent);
        }

        // Load backend details
        if (ivrData.backendDetails) {
          setBackendDetails(ivrData.backendDetails);

          // Call Gemini API with backend details only once per session
          if (
            !geminiBackendAnalyzed &&
            !aiSuggestions.some((s) => s.source === "gemini_ai")
          ) {
            console.log("Triggering Gemini API analysis for backend details");
            rateLimitedGeminiCall(callGeminiAPI, ivrData.backendDetails);
          } else {
            console.log("Gemini API analysis already completed or in progress");
          }
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
        setCallStatus("active");
        setIsRecording(true);
      }

      // Load session summary if available
      if (storedSummary) {
        const summaryData = JSON.parse(storedSummary);
        setIvrSessionSummary(summaryData);
        console.log("Loaded IVR session summary:", summaryData);
      }

      // Load last session timestamp
      if (storedLastSession) {
        setLastIVRSession(storedLastSession);
        console.log("Last IVR session:", storedLastSession);
      }

      if (storedData) {
        const ivrData = JSON.parse(storedData);
        return ivrData;
      } else {
        console.log("No IVR session data found in localStorage");
        return null;
      }
    } catch (error) {
      console.error("Error loading IVR session data:", error);
      return null;
    }
  };

  // Function to call Gemini API with backend details RESPONSE_XML
  const callGeminiAPI = async (backendDetails) => {
    if (!backendDetails || backendDetails.length === 0) {
      console.warn("No backend details available for Gemini API call");
      return null;
    }

    // Check if already analyzed to prevent duplicate calls
    if (geminiBackendAnalyzed) {
      console.log(
        "Backend details already analyzed by Gemini API, skipping duplicate call"
      );
      return null;
    }

    // Check if we already have a Gemini AI suggestion to prevent duplicates
    if (aiSuggestions.some((s) => s.source === "gemini_ai")) {
      console.log("Gemini AI analysis already exists, skipping duplicate call");
      setGeminiBackendAnalyzed(true);
      return null;
    }

    setGeminiApiLoading(true);
    setGeminiBackendAnalyzed(true); // Set flag immediately to prevent multiple calls

    try {
      // Extract all RESPONSE_XML data from backend details
      const responseXmlData = backendDetails
        .filter((service) => service.RESPONSE_XML)
        .map((service) => ({
          serviceName: service.SERVICE_NAME,
          responseXml: JSON.stringify(service.RESPONSE_XML, null, 2),
        }));

      if (responseXmlData.length === 0) {
        console.warn("No RESPONSE_XML data found in backend details");
        setGeminiApiLoading(false);
        return null;
      }

      // Prepare the text payload with all RESPONSE_XML data
      const xmlText = responseXmlData
        .map(
          (item) =>
            `Service: ${item.serviceName}\nResponse XML:\n${item.responseXml}\n`
        )
        .join("\n---\n\n");

      // Gemini API payload - optimized for agent-friendly structured JSON output
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Analyze the following backend service response data for a contact center agent. Extract and organize the information into a structured JSON format for immediate agent use.

Return ONLY JSON in this exact format (no markdown, no explanations):

{
  "customerInfo": {
    "name": "CUSTOMER NAME",
    "accountDetails": {
      "ban": "account_number",
      "accountStatus": "status",
      "customerType": "type",
      "customerSubType": "subtype"
    },
    "contactInfo": {
      "phone": "phone_number",
      "email": "email_address",
      "sms": "sms_number"
    },
    "serviceAddress": "full_address"
  },
  "activeServices": [
    {
      "product": "service_name",
      "status": "ACTIVE/INACTIVE",
      "productId": "product_id",
      "technology": "tech_type",
      "speeds": "speed_info"
    }
  ],
  "issuesAndActions": {
    "modemReboot": "Success/Failed",
    "pendingActions": "actions_needed",
    "openTickets": [
      {
        "ticketNumber": "ticket_id",
        "status": "ticket_status",
        "appointment": "appointment_info"
      }
    ],
    "closedTickets": 0,
    "recommendation": "next_steps",
    "notes": "important_notes"
  }
}

Backend Service Data:
${xmlText}`,
              },
            ],
          },
        ],
      };

      console.log("Calling Gemini API with backend details:", payload);

      // Make the API call
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyAuoqm2vGsdwbdV4pCewGJjT1PtWTQuXOg",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(
            "Gemini API rate limit hit for backend analysis. Skipping this call."
          );
          setGeminiApiLoading(false);
          return null;
        }
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Gemini API response:", data);

      setGeminiApiResponse(data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        try {
          // Try to parse the response as JSON first
          const cleanedText = generatedText
            .replace(/```json\n?|\n?```/g, "")
            .trim();
          const parsedResponse = JSON.parse(cleanedText);

          // Store the parsed backend data for UI display
          setGeminiBackendData(parsedResponse);

          // Handle structured customer information
          if (parsedResponse.customerInfo) {
            const customerInfo = parsedResponse.customerInfo;

            // Update customer data with parsed information
            if (
              customerInfo.name ||
              customerInfo.accountDetails ||
              customerInfo.contactInfo
            ) {
              setCustomerData((prev) => ({
                ...prev,
                name: customerInfo.name || prev?.name,
                phone: customerInfo.contactInfo?.phone || prev?.phone,
                email: customerInfo.contactInfo?.email || prev?.email,
                accountNumber:
                  customerInfo.accountDetails?.ban || prev?.accountNumber,
                serviceAddress:
                  customerInfo.serviceAddress || prev?.serviceAddress,
                accountStatus: customerInfo.accountDetails?.accountStatus,
                customerType: customerInfo.accountDetails?.customerType,
                issue: prev?.issue || "Account inquiry",
              }));
            }
          }

          // Create comprehensive AI suggestions from parsed data
          const suggestions = [];

          // Customer info summary
          if (parsedResponse.customerInfo) {
            const info = parsedResponse.customerInfo;
            suggestions.push({
              type: "insight",
              text: `👤 Customer: ${info.name || "N/A"} | Account: ${
                info.accountDetails?.ban || "N/A"
              } | Status: ${info.accountDetails?.accountStatus || "Unknown"}`,
              confidence: 95,
              source: "gemini_ai",
            });
          }

          // Active services summary
          if (
            parsedResponse.activeServices &&
            parsedResponse.activeServices.length > 0
          ) {
            const services = parsedResponse.activeServices;
            const serviceList = services
              .map((s) => `${s.product} (${s.status})`)
              .join(", ");
            suggestions.push({
              type: "context",
              text: `📡 Active Services: ${serviceList}`,
              confidence: 90,
              source: "gemini_ai",
            });

            // Internet service details
            const internetService = services.find((s) =>
              s.product.toLowerCase().includes("internet")
            );
            if (internetService && internetService.speeds) {
              suggestions.push({
                type: "technical",
                text: `🌐 Internet: ${internetService.technology} - ${internetService.speeds} | Product ID: ${internetService.productId}`,
                confidence: 88,
                source: "gemini_ai",
              });
            }
          }

          // Issues and actions
          if (parsedResponse.issuesAndActions) {
            const issues = parsedResponse.issuesAndActions;

            // Failed actions
            if (issues.modemReboot === "Failed") {
              suggestions.push({
                type: "action",
                text: `⚠️ Modem reboot failed - Consider manual reset or technician dispatch`,
                confidence: 92,
                source: "gemini_ai",
              });
            }

            // Open tickets
            if (issues.openTickets && issues.openTickets.length > 0) {
              issues.openTickets.forEach((ticket) => {
                suggestions.push({
                  type: "escalation",
                  text: `🎫 Open Ticket: ${ticket.ticketNumber} | Status: ${ticket.status} | Appointment: ${ticket.appointment}`,
                  confidence: 95,
                  source: "gemini_ai",
                });
              });
            }

            // Recommendations
            if (issues.recommendation) {
              suggestions.push({
                type: "response",
                text: `💡 Recommended Action: ${issues.recommendation}`,
                confidence: 85,
                source: "gemini_ai",
              });
            }

            // Additional notes
            if (issues.notes) {
              suggestions.push({
                type: "context",
                text: `📝 Notes: ${issues.notes}`,
                confidence: 80,
                source: "gemini_ai",
              });
            }
          }

          // Add all parsed suggestions
          setAiSuggestions((prev) => [...suggestions, ...prev]);
        } catch (parseError) {
          console.log("Response is not JSON, treating as plain text");
          // Fallback to original text-based handling
          setAiSuggestions((prev) => [
            {
              type: "insight",
              text: `🤖 AI Analysis: ${generatedText}`,
              confidence: 95,
              source: "gemini_ai",
            },
            ...prev,
          ]);
        }
      }

      setGeminiApiLoading(false);
      return data;
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // Add error as a suggestion for debugging
      setAiSuggestions((prev) => [
        {
          type: "context",
          text: `⚠️ Failed to analyze backend data with AI: ${error.message}`,
          confidence: 50,
          source: "gemini_error",
        },
        ...prev,
      ]);

      setGeminiApiLoading(false);
      return null;
    }
  };

  // Function to call Gemini API with transcript data for analysis and resolution suggestions
  const callGeminiAPIWithTranscript = async (transcriptMessages) => {
    if (!transcriptMessages || transcriptMessages.length === 0) {
      console.warn("No transcript available for Gemini API call");
      return null;
    }

    setGeminiApiLoading(true);

    try {
      // Format transcript for analysis
      const transcriptText = safeFilterTranscript(
        transcriptMessages,
        (msg) => !msg.isSystem
      )
        .map((msg) => `${msg.speaker}: ${msg.text}`)
        .join("\n");

      // Include customer context if available
      const customerContext = customerData
        ? `
Customer Information:
- Name: ${customerData.name}
- Phone: ${customerData.phone}
- Account: ${customerData.account}
- Issue Category: ${selectedOption || "General Inquiry"}
`
        : "";

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

Be concise and actionable.`,
              },
            ],
          },
        ],
      };

      console.log("Calling Gemini API with transcript data:", payload);

      // Make the API call
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyAuoqm2vGsdwbdV4pCewGJjT1PtWTQuXOg1", // You'll need to set your API key
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(
            "Gemini API rate limit hit for transcript analysis. Skipping this call."
          );
          setGeminiApiLoading(false);
          return null;
        }
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Gemini API transcript response:", data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        // Add the transcript analysis as a suggestion
        setAiSuggestions((prev) => [
          {
            type: "insight",
            text: `📋 Transcript Analysis: ${generatedText}`,
            confidence: 90,
            source: "gemini_transcript",
          },
          ...prev,
        ]);
      }

      setGeminiApiLoading(false);
      return data;
    } catch (error) {
      console.error("Error calling Gemini API with transcript:", error);

      // Add error as a suggestion for debugging
      setAiSuggestions((prev) => [
        {
          type: "context",
          text: `⚠️ Failed to analyze transcript with AI: ${error.message}`,
          confidence: 0,
          source: "gemini_transcript_error",
        },
        ...prev,
      ]);

      setGeminiApiLoading(false);
      return null;
    }
  };

  // Function to analyze customer sentiment using Gemini API
  const analyzeSentimentWithGemini = async (
    transcriptMessages,
    stage = "real-time"
  ) => {
    if (!transcriptMessages || transcriptMessages.length === 0) {
      console.warn("No transcript available for sentiment analysis");
      return null;
    }

    setSentimentAnalysisLoading(true);

    try {
      // Format transcript for sentiment analysis
      const transcriptText = safeFilterTranscript(
        transcriptMessages,
        (msg) => !msg.isSystem && msg.speaker === "Customer"
      )
        .slice(-10) // Analyze last 10 customer messages for real-time analysis
        .map((msg, index) => `[${index + 1}] ${msg.text}`)
        .join("\n");

      if (!transcriptText.trim()) {
        setSentimentAnalysisLoading(false);
        return null;
      }

      // Include customer context if available
      const customerContext = customerData
        ? `
Customer Profile:
- Name: ${customerData.name}
- Phone: ${customerData.phone}
- Account: ${customerData.account}
- Issue Category: ${selectedOption || "General Inquiry"}
`
        : "";

      const currentStageContext =
        stage === "real-time"
          ? "This is a real-time analysis during an active call."
          : stage === "call-end"
          ? "This is an end-of-call comprehensive analysis."
          : "This is an initial call assessment.";

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
}`,
              },
            ],
          },
        ],
      };

      console.log("Calling Gemini API for sentiment analysis:", payload);

      // Make the API call
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyAuoqm2vGsdwbdV4pCewGJjT1PtWTQuXOg1",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(
            "Gemini API rate limit hit for sentiment analysis. Skipping this call."
          );
          setSentimentAnalysisLoading(false);
          return null;
        }
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Gemini API sentiment response:", data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        try {
          // Clean the generated text by removing markdown code block syntax
          let cleanedText = generatedText.trim();

          // Remove ```json at the beginning and ``` at the end if present
          if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.replace(/^```json\s*/, "");
          }
          if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.replace(/^```\s*/, "");
          }
          if (cleanedText.endsWith("```")) {
            cleanedText = cleanedText.replace(/\s*```$/, "");
          }

          console.log("Cleaned sentiment response text:", cleanedText);

          // Parse the JSON response
          const sentimentData = JSON.parse(cleanedText);

          // Update sentiment state
          setCurrentSentiment(sentimentData);

          // Clear any previous errors on successful analysis
          setSentimentApiError(null);

          // Add to sentiment history
          setSentimentHistory((prev) =>
            [
              ...prev,
              {
                timestamp: new Date().toISOString(),
                stage: stage,
                sentiment: sentimentData.overallSentiment,
                score: sentimentData.sentimentScore,
                confidence: sentimentData.confidence,
                customerState: sentimentData.customerState,
                escalationRisk: sentimentData.escalationRisk,
              },
            ].slice(-20)
          ); // Keep last 20 sentiment analyses

          // Update derived states
          setSentimentTrend(sentimentData.sentimentTrend);
          setEmotionalIndicators(sentimentData.emotionalIndicators || []);
          setEscalationRisk(sentimentData.escalationRisk);

          // Note: Sentiment insights are no longer added to aiSuggestions
          // Only backend processed Gemini data should be stored in aiSuggestions

          console.log("Sentiment analysis completed:", sentimentData);
        } catch (parseError) {
          console.error("Error parsing sentiment JSON:", parseError);
          console.log("Raw response:", generatedText);
          console.log("Cleaned response for parsing:", cleanedText);

          // Try to extract useful information even if JSON parsing fails
          let fallbackSentiment = "neutral";
          let fallbackConfidence = 50;

          // Simple text analysis as fallback
          const lowerText = generatedText.toLowerCase();
          if (
            lowerText.includes("positive") ||
            lowerText.includes("satisfied") ||
            lowerText.includes("happy")
          ) {
            fallbackSentiment = "positive";
            fallbackConfidence = 70;
          } else if (
            lowerText.includes("negative") ||
            lowerText.includes("frustrated") ||
            lowerText.includes("angry")
          ) {
            fallbackSentiment = "negative";
            fallbackConfidence = 70;
          }

          // Set basic sentiment data as fallback
          setCurrentSentiment({
            overallSentiment: fallbackSentiment,
            sentimentScore: fallbackConfidence / 100,
            confidence: fallbackConfidence,
            customerState: "unknown",
            escalationRisk: fallbackSentiment === "negative" ? "medium" : "low",
            keyInsights: ["Unable to parse detailed analysis"],
            recommendations: ["Manual review recommended"],
          });

          // Note: Fallback sentiment analysis is no longer added to aiSuggestions
          // Only backend processed Gemini data should be stored in aiSuggestions
        }
      }

      setSentimentAnalysisLoading(false);
      return data;
    } catch (error) {
      console.error("Error calling Gemini API for sentiment analysis:", error);

      // Set error state for UI display
      setSentimentApiError({
        message: error.message,
        timestamp: Date.now(),
        type: "sentiment_analysis",
      });

      // Note: Sentiment analysis errors are no longer added to aiSuggestions
      // Only backend processed Gemini data should be stored in aiSuggestions

      setSentimentAnalysisLoading(false);
      return null;
    }
  };

  // Calculate timing savings from pre-fetched IVR data
  const calculateTimingSavings = (ivrData) => {
    if (!ivrData || !ivrData.backendDetails) return;

    // Calculate parallel time for backend services that were pre-fetched
    const preFetchedTime = ivrData.backendDetails.length > 0 
      ? Math.max(...ivrData.backendDetails.map(service => parseInt(service.TIME_TAKEN || 0)))
      : 0;

    // Calculate sequential time for comparison
    const sequentialTime = ivrData.backendDetails.reduce((total, service) => {
      return total + parseInt(service.TIME_TAKEN || 0);
    }, 0);

    // Estimate additional time saved from having customer data ready
    const customerDataLookupTime = 5000; // 5 seconds typical lookup time
    const agentContextSwitchTime = 3000; // 3 seconds for agent to understand context

    // Use parallel fetch time as the actual time spent
    const totalTimeSaved =
      preFetchedTime + customerDataLookupTime + agentContextSwitchTime;

    // Calculate percentage improvement in AHT
    const traditionalAHTSeconds = 660; // 11 minutes average
    const optimizedAHTSeconds = traditionalAHTSeconds - totalTimeSaved / 1000;
    const improvementPercentage =
      ((traditionalAHTSeconds - optimizedAHTSeconds) / traditionalAHTSeconds) *
      100;

    setTimingSavings({
      preFetchedTime: preFetchedTime / 1000, // Convert to seconds
      customerDataTime: customerDataLookupTime / 1000,
      contextTime: agentContextSwitchTime / 1000,
      totalSaved: totalTimeSaved / 1000,
      traditionalAHT: traditionalAHTSeconds,
      optimizedAHT: optimizedAHTSeconds,
      improvement: improvementPercentage.toFixed(1),
      servicesPreFetched: ivrData.backendDetails.length,
    });
  };

  // Generate AI suggestions based on IVR data - Only from Gemini API
  const generateAISuggestionsFromIVR = (ivrData) => {
    // Only set AI suggestions from Gemini API responses
    // Don't generate any simulated/hardcoded suggestions
    // The suggestions will be populated by Gemini API calls elsewhere in the code

    // Initialize with empty array - suggestions will come from Gemini API only
    setAiSuggestions([]);
  };

  // State for knowledge base loading
  const [knowledgeBaseLoading, setKnowledgeBaseLoading] = useState(false);

  // Function to fetch knowledge base articles from Gemini API
  const fetchKnowledgeBaseFromGemini = async (
    customerIssue,
    category = null,
    customerData = null
  ) => {
    if (!customerIssue && !category) return;

    setKnowledgeBaseLoading(true);

    try {
      const issueContext = customerIssue || category || "general inquiry";
      const customerContext = customerData
        ? `
Customer Info:
- Tier: ${customerData.tier}
- Previous Issues: ${(customerData.previousIssues || []).join(", ")}
- Account Type: ${customerData.accountNumber}`
        : "";

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Generate 4 concise knowledge base articles for contact center agents dealing with: "${issueContext}"

${customerContext}

Return JSON format (no markdown):
{
  "articles": [
    {
      "title": "Article Title",
      "relevance": 95,
      "content": "Brief summary of key information and resolution steps (2-3 sentences)",
      "type": "technical_guide|service_guide|case_study|analytics",
      "source": "knowledge_base"
    }
  ]
}

Focus on:
- Practical resolution steps
- Common troubleshooting
- Policy information
- Best practices

Keep content concise and action-oriented for agents.`,
              },
            ],
          },
        ],
      };

      console.log("Fetching knowledge base from Gemini for:", issueContext);

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyAuoqm2vGsdwbdV4pCewGJjT1PtWTQuXOg1",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        try {
          // Clean the response text (remove markdown formatting if present)
          const cleanedText = generatedText
            .replace(/```json\n?|\n?```/g, "")
            .trim();
          const knowledgeData = JSON.parse(cleanedText);

          if (knowledgeData.articles && Array.isArray(knowledgeData.articles)) {
            console.log(
              "Successfully fetched knowledge base articles from Gemini:",
              knowledgeData.articles
            );
            setKnowledgeBase(knowledgeData.articles);
            setKnowledgeBaseLoading(false);
            return knowledgeData.articles;
          }
        } catch (parseError) {
          console.error(
            "Error parsing Gemini knowledge base response:",
            parseError
          );
          // Fallback: try to extract articles manually if JSON parsing fails
          setKnowledgeBase([
            {
              title: "AI-Generated Resolution Guide",
              relevance: 90,
              content:
                "Comprehensive solution approach for the reported issue. Review available options and escalation procedures.",
              type: "case_study",
              source: "gemini_ai",
            },
          ]);
          setKnowledgeBaseLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching knowledge base from Gemini:", error);
      // Set minimal fallback knowledge base
      setKnowledgeBase([
        {
          title: "Standard Resolution Process",
          relevance: 75,
          content:
            "Follow standard troubleshooting procedures and escalation guidelines for customer issues.",
          type: "service_guide",
          source: "fallback",
        },
      ]);
      setKnowledgeBaseLoading(false);
    }
  };

  // Generate knowledge base results based on IVR selection or customer issue
  const generateKnowledgeBaseFromIVR = async (ivrData) => {
    if (!ivrData) return;

    const category = ivrData.selectedOption || "";
    const customerIssue = customerData?.issue || ivrData.categoryMapping || "";

    // Use Gemini API to fetch relevant knowledge base articles
    await rateLimitedGeminiCall(
      fetchKnowledgeBaseFromGemini,
      customerIssue,
      category,
      customerData
    );
  };

  // Load IVR session data on component mount
  useEffect(() => {
    const ivrData = loadIVRSessionData();

    // If we have IVR data, we can skip the simulated incoming call
    if (ivrData && ivrData.routedAgent) {
      console.log(
        "Customer transferred from IVR to agent:",
        ivrData.routedAgent.name
      );

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
      customerData,
    };
  };

  // Function to log all state data (useful for debugging)
  const logAllStateData = () => {
    console.log("All localStorage state data:", getAllLocalStorageState());
  };

  // Function to automatically populate resolution fields based on context
  const autoPopulateResolution = () => {
    setIsAutoPopulating(true);

    // Add a small delay to show the loading state
    setTimeout(() => {
      // Determine resolution category based on IVR selection or customer issue
      let category = "";
      let status = "resolved";
      let summary = "";
      let followUp = false;
      let satisfaction = 4; // Default to good rating

      // Map IVR selection to resolution category
      if (selectedOption) {
        const option = selectedOption.toLowerCase();
        if (option.includes("billing") || option.includes("payment")) {
          category = "billing-inquiry";
          summary = "Assisted customer with billing inquiry. ";
        } else if (
          option.includes("technical") ||
          option.includes("internet") ||
          option.includes("connection")
        ) {
          category = "technical-support";
          summary = "Provided technical support for connectivity issue. ";
        } else if (option.includes("service") || option.includes("account")) {
          category = "account-management";
          summary = "Helped customer with account service request. ";
        } else {
          category = "other";
          summary = "Addressed customer inquiry. ";
        }
      } else if (customerData?.issue) {
        const issue = customerData.issue.toLowerCase();
        if (issue.includes("billing")) {
          category = "billing-inquiry";
          summary = "Resolved billing-related inquiry. ";
        } else if (issue.includes("technical") || issue.includes("internet")) {
          category = "technical-support";
          summary = "Provided technical assistance. ";
        } else {
          category = "service-request";
          summary = "Assisted with service request. ";
        }
      }

      // Enhance summary based on AI suggestions
      const relevantSuggestions = aiSuggestions
        .filter((s) => s.type === "action" || s.type === "response")
        .slice(0, 2);

      if (relevantSuggestions.length > 0) {
        const actions = relevantSuggestions
          .map((s) =>
            s.text.replace(/^(Review|Check|Run|Verify|Consider)/i, "Reviewed")
          )
          .join(". ");
        summary += actions + ". ";
      }

      // Add backend service information if available
      if (backendDetails && backendDetails.length > 0) {
        const successfulServices = backendDetails.filter(
          (s) => s.STATUS === "S"
        ).length;
        summary += `Verified ${successfulServices} backend services during call. `;
      }

      // Add customer context
      if (customerData) {
        if (customerData.tier === "Premium" || customerData.tier === "VIP") {
          summary += "Provided premium customer service. ";
          satisfaction = 5; // Higher rating for premium customers
        }

        // Check sentiment and adjust accordingly
        if (customerData.sentiment === "negative") {
          status = "follow-up";
          followUp = true;
          satisfaction = 3;
          summary += "Customer expressed concerns - follow-up scheduled. ";
        } else if (customerData.sentiment === "positive") {
          satisfaction = 5;
          summary += "Customer expressed satisfaction with service. ";
        }
      }

      // Check if there are escalation suggestions
      const escalationSuggestions = aiSuggestions.filter(
        (s) => s.type === "escalation"
      );
      if (escalationSuggestions.length > 0) {
        status = "escalated";
        followUp = true;
        summary += "Issue escalated to specialist team. ";
      }

      // Set call duration context
      if (callDuration > 600) {
        // More than 10 minutes
        followUp = true;
        summary +=
          "Extended call duration - monitoring for customer satisfaction. ";
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
        setFollowUpDate(followUpDate.toISOString().split("T")[0]);
      }

      setIsAutoPopulating(false);
    }, 800); // 800ms delay to show loading
  };

  // Function to generate resolution summary based on transcript
  const generateResolutionFromTranscript = () => {
    if (transcript.length === 0) return;

    let summary = "Call summary: ";
    const customerMessages = safeFilterTranscript(
      transcript,
      (msg) => msg.speaker === "Customer" && !msg.isSystem
    );
    const agentMessages = safeFilterTranscript(
      transcript,
      (msg) => msg.speaker === "Agent" && !msg.isSystem
    );

    // Analyze customer concerns from transcript
    const concerns = [];
    customerMessages.forEach((msg) => {
      if (!msg || !msg.text) return;
      const text = msg.text.toLowerCase();
      if (
        text.includes("problem") ||
        text.includes("issue") ||
        text.includes("trouble")
      ) {
        concerns.push("Technical issue discussed");
      }
      if (
        text.includes("bill") ||
        text.includes("charge") ||
        text.includes("payment")
      ) {
        concerns.push("Billing matter addressed");
      }
      if (text.includes("cancel") || text.includes("disconnect")) {
        concerns.push("Service cancellation discussed");
      }
    });

    // Add agent actions from transcript
    const actions = [];
    agentMessages.forEach((msg) => {
      if (!msg || !msg.text) return;
      const text = msg.text.toLowerCase();
      if (text.includes("check") || text.includes("verify")) {
        actions.push("Verified account information");
      }
      if (text.includes("reset") || text.includes("restart")) {
        actions.push("Performed system reset");
      }
      if (text.includes("transfer") || text.includes("escalate")) {
        actions.push("Escalated to appropriate team");
      }
    });

    // Combine findings
    if (concerns.length > 0) {
      summary += concerns.join(", ") + ". ";
    }
    if (actions.length > 0) {
      summary += actions.join(", ") + ". ";
    }

    // Determine resolution status from transcript
    let status = "resolved";
    const lastFewMessages = safeFilterTranscript(
      transcript.slice(-3),
      (msg) => msg.text
    );
    const hasUnresolvedIndicators = lastFewMessages.some(
      (msg) =>
        msg &&
        msg.text &&
        (msg.text.toLowerCase().includes("still") ||
          msg.text.toLowerCase().includes("not working") ||
          msg.text.toLowerCase().includes("problem"))
    );

    if (hasUnresolvedIndicators) {
      status = "follow-up";
      setFollowUpRequired(true);
      summary += "Issue requires additional follow-up. ";
    } else {
      summary += "Issue successfully resolved. ";
    }

    setResolutionSummary(summary);
    setResolutionStatus(status);
  };

  // Function to suggest resolution based on AI analysis
  const suggestResolutionFromAI = () => {
    const geminiSuggestions = aiSuggestions.filter(
      (s) => s.source === "gemini_ai" || s.source === "gemini_transcript"
    );

    if (geminiSuggestions.length === 0) return;

    let summary = "AI-assisted resolution: ";
    let category = "other";
    let status = "resolved";

    geminiSuggestions.forEach((suggestion) => {
      const text = suggestion.text.toLowerCase();

      // Extract category from AI suggestion
      if (text.includes("billing") || text.includes("payment")) {
        category = "billing-inquiry";
      } else if (
        text.includes("technical") ||
        text.includes("internet") ||
        text.includes("connection")
      ) {
        category = "technical-support";
      } else if (text.includes("service") || text.includes("account")) {
        category = "account-management";
      }

      // Extract status indicators
      if (text.includes("escalat") || text.includes("specialist")) {
        status = "escalated";
        setFollowUpRequired(true);
      } else if (text.includes("follow") || text.includes("monitor")) {
        status = "follow-up";
        setFollowUpRequired(true);
      }
    });

    summary +=
      "Utilized AI insights to provide comprehensive customer assistance. ";
    summary += `Confidence level: ${Math.max(
      ...geminiSuggestions.map((s) => s.confidence)
    )}%. `;

    setResolutionCategory(category);
    setResolutionStatus(status);
    setResolutionSummary((prev) => prev + summary);
  };

  // Simulate incoming call only if no IVR data is available
  useEffect(() => {
    // Only run simulation if we don't have IVR session data
    if (callStatus === "active" && !ivrSessionData) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Simulate customer data loading only if no real data exists
      setTimeout(() => {
        if (!customerData) {
          setCustomerData({
            name: "Sarah Johnson",
            phone: "+1 (555) 123-4567",
            email: "sarah.johnson@email.com",
            tier: "Premium",
            accountNumber: "ACC-789456",
            lastContact: "2024-07-15",
            issue: "Billing inquiry",
            sentiment: "neutral",
            previousIssues: [
              "Payment failed",
              "Account upgrade",
              "Service interruption",
            ],
          });
        }

        // Generate knowledge base from customer issue using Gemini API
        if (customerData?.issue) {
          rateLimitedGeminiCall(
            fetchKnowledgeBaseFromGemini,
            customerData.issue,
            null,
            customerData
          );
        }
      }, 1000);
    } else if (callStatus === "active" && ivrSessionData) {
      // For IVR sessions, just start the timer
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }

    return () => clearInterval(callTimerRef.current);
  }, [callStatus, ivrSessionData]);

  // Generate real-time transcript based on IVR data or simulate
  useEffect(() => {
    if (callStatus === "active") {
      let messages = [];

      // Generate transcript based on IVR data if available
      if (ivrSessionData && customerData) {
        const customerName = customerData.name.split(" ")[0];
        const issueType = selectedOption || "general inquiry";

        // Initial system and greeting messages
        messages = [
          {
            speaker: "System",
            text: `Call transferred from IVR - Customer: ${customerData.name}, Issue: ${issueType}`,
            time: new Date().toLocaleTimeString(),
            isSystem: true,
          },
          {
            speaker: "Customer",
            text: `Hi, I was just transferred from the automated system regarding my ${issueType
              .toLowerCase()
              .replace(/_/g, " ")}.`,
            time: new Date(Date.now() + 1000).toLocaleTimeString(),
          },
          {
            speaker: "Agent",
            text: `Hello ${customerName}, I can see you were routed here for ${issueType
              .toLowerCase()
              .replace(
                /_/g,
                " "
              )}. I have your account information from the system. How can I help you today?`,
            time: new Date(Date.now() + 2000).toLocaleTimeString(),
          },
        ];

        if (agentMatchScore) {
          messages.push({
            speaker: "System",
            text: `Agent match confidence: ${agentMatchScore}% - Specialized in ${
              categoryMapping || issueType
            }`,
            time: new Date(Date.now() + 3000).toLocaleTimeString(),
            isSystem: true,
          });
        }

        // Find relevant transcript data based on the selected issue category
        const relevantConversations = TRANSCRIPT_DATA.filter((conversation) => {
          const entryCategory = conversation.issue_category.toLowerCase();
          const selectedCategory = issueType.toLowerCase();

          // Map IVR categories to transcript categories with more specific matching
          if (selectedCategory.includes("billing")) {
            return (
              entryCategory.includes("billing") ||
              entryCategory.includes("payment") ||
              entryCategory.includes("make payment")
            );
          }
          if (
            selectedCategory.includes("technical") ||
            selectedCategory.includes("internet")
          ) {
            return (
              entryCategory.includes("internet") ||
              entryCategory.includes("connection") ||
              entryCategory.includes("wi-fi") ||
              entryCategory.includes("outage") ||
              entryCategory.includes("modem") ||
              entryCategory.includes("speed")
            );
          }
          if (
            selectedCategory.includes("service") ||
            selectedCategory.includes("account")
          ) {
            return (
              entryCategory.includes("service") ||
              entryCategory.includes("account") ||
              entryCategory.includes("transfer") ||
              entryCategory.includes("order") ||
              entryCategory.includes("profile")
            );
          }
          if (selectedCategory.includes("cancel")) {
            return (
              entryCategory.includes("cancel") ||
              entryCategory.includes("return")
            );
          }
          // Default to general inquiries or first available conversation
          return (
            entryCategory.includes("general") ||
            entryCategory.includes("inquiry")
          );
        });

        // Select the most relevant conversation and use its interactions
        if (relevantConversations.length > 0) {
          const selectedConversation = relevantConversations[0];
          console.log(
            "Selected conversation:",
            selectedConversation.conversation_id,
            "for category:",
            issueType
          );

          // Add conversation context to call notes
          const conversationContext = `\nRelevant Conversation Context:\n- Category: ${selectedConversation.issue_category}\n- Conversation ID: ${selectedConversation.conversation_id}\n- Telecom Relevance: ${selectedConversation.telecom_relevance}\n`;
          setCallNotes((prev) => prev + conversationContext);

          // Add interactions as transcript messages (limit to prevent overflow)
          const interactions = selectedConversation.interactions.slice(0, 10);
          interactions.forEach((interaction, index) => {
            messages.push({
              speaker: interaction.speaker,
              text: interaction.text,
              time:
                interaction.timestamp ||
                new Date(Date.now() + 4000 + index * 1500).toLocaleTimeString(),
              conversationId: selectedConversation.conversation_id,
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
                time:
                  interaction.timestamp ||
                  new Date(
                    Date.now() + 4000 + index * 1500
                  ).toLocaleTimeString(),
                conversationId: fallbackConversation.conversation_id,
              });
            });
          }
        }
      } else {
        // Fallback: use interactions from general inquiry conversations
        const generalConversations = TRANSCRIPT_DATA.filter(
          (conversation) =>
            conversation.issue_category.toLowerCase().includes("general") ||
            conversation.issue_category.toLowerCase().includes("inquiry")
        );

        if (generalConversations.length > 0) {
          const fallbackConversation = generalConversations[0];
          const interactions = fallbackConversation.interactions.slice(0, 6);
          messages = interactions.map((interaction, index) => ({
            speaker: interaction.speaker,
            text: interaction.text,
            time:
              interaction.timestamp ||
              new Date(Date.now() + index * 1500).toLocaleTimeString(),
            conversationId: fallbackConversation.conversation_id,
          }));
        } else {
          // Final fallback to basic messages
          messages = [
            {
              speaker: "Customer",
              text: "Hi, I have a question about my recent bill",
              time: "10:31:15",
            },
            {
              speaker: "Agent",
              text: "Of course, I'd be happy to help you with that. Let me pull up your account.",
              time: "10:31:18",
            },
            {
              speaker: "Customer",
              text: "I see a charge for $89.99 that I don't recognize",
              time: "10:31:25",
            },
            {
              speaker: "Agent",
              text: "I can see that charge here. It appears to be for the premium service upgrade from last month.",
              time: "10:31:32",
            },
          ];
        }
      }

      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex < messages.length) {
          setTranscript((prev) => [...prev, messages[messageIndex]]);
          messageIndex++;
        } else {
          clearInterval(interval);
          // Automatic transcript analysis disabled to reduce Gemini API calls
          console.log(
            "Transcript loading complete. Manual analysis available via buttons."
          );
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [
    callStatus,
    ivrSessionData,
    customerData,
    selectedOption,
    agentMatchScore,
    categoryMapping,
  ]);

  // Auto-populate resolution fields when call becomes active and we have context
  useEffect(() => {
    if (callStatus === "active" && (ivrSessionData || customerData)) {
      // Wait a bit for other data to load, then auto-populate
      setTimeout(() => {
        autoPopulateResolution();
      }, 3000); // 3 second delay to allow data to settle
    }
  }, [callStatus, ivrSessionData, customerData, selectedOption]);

  // Fetch knowledge base articles when customer data becomes available
  useEffect(() => {
    if (customerData?.issue && callStatus === "active") {
      // Fetch relevant knowledge base articles based on customer's issue
      rateLimitedGeminiCall(
        fetchKnowledgeBaseFromGemini,
        customerData.issue,
        selectedOption,
        customerData
      );
    }
  }, [customerData, callStatus, selectedOption]);

  // Update resolution when AI suggestions are updated
  useEffect(() => {
    if (callStatus === "active" && aiSuggestions.length > 0) {
      // If we have Gemini AI suggestions, enhance the resolution
      const hasGeminiSuggestions = aiSuggestions.some(
        (s) => s.source === "gemini_ai" || s.source === "gemini_transcript"
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
    if (callStatus === "active" && transcript.length > 3) {
      // Only update after we have substantial transcript content
      const shouldUpdate = transcript.length % 5 === 0; // Update every 5 messages

      if (shouldUpdate) {
        generateResolutionFromTranscript();
      }
    }
  }, [transcript, callStatus]);

  // Auto-populate when call ends to ensure resolution is captured
  useEffect(() => {
    if (callStatus === "idle" && transcript.length > 0) {
      // Call just ended, ensure we have resolution data
      if (!resolutionStatus || !resolutionSummary) {
        autoPopulateResolution();
      }
    }
  }, [callStatus, transcript.length]);

  // Real-time sentiment analysis during active calls (reduced frequency)
  useEffect(() => {
    if (callStatus === "active" && transcript.length > 0) {
      // Analyze sentiment every 5 customer messages to reduce API calls
      const customerMessages = safeFilterTranscript(
        transcript,
        (msg) => !msg.isSystem && msg.speaker === "Customer"
      );
      const shouldAnalyze =
        customerMessages.length > 0 && customerMessages.length % 5 === 0;

      if (shouldAnalyze) {
        rateLimitedGeminiCall(
          analyzeSentimentWithGemini,
          transcript,
          "real-time"
        );
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
    if (callStatus === "idle" && transcript.length > 0) {
      // Perform final comprehensive sentiment analysis (rate limited)
      const customerMessages = safeFilterTranscript(
        transcript,
        (msg) => !msg.isSystem && msg.speaker === "Customer"
      );
      if (customerMessages.length > 0) {
        rateLimitedGeminiCall(
          analyzeSentimentWithGemini,
          transcript,
          "call-end"
        );
      }
    }
  }, [callStatus, transcript.length]);

  // Realistic typing simulation functions
  const simulateAgentTyping = (message, delay = 1000) => {
    setAgentIsTyping(true);
    setAgentTypingMessage("typing...");

    // Simulate typing progress
    let typingProgress = "";
    const typingSteps = ["typing", "typing.", "typing..", "typing..."];
    let stepIndex = 0;

    const typingInterval = setInterval(() => {
      setAgentTypingMessage(typingSteps[stepIndex % typingSteps.length]);
      stepIndex++;
    }, 300);

    // After delay, show the actual message being sent
    setTimeout(() => {
      clearInterval(typingInterval);
      setAgentTypingMessage("sending...");
      setPendingAgentMessage({
        text: message,
        timestamp: Date.now(),
      });

      // After a brief sending delay, add to transcript
      setTimeout(() => {
        setTranscript((prev) => [
          ...prev,
          {
            speaker: "Agent",
            text: message,
            time: new Date().toLocaleTimeString(),
            status: "sent",
          },
        ]);
        setAgentIsTyping(false);
        setAgentTypingMessage("");
        setPendingAgentMessage(null);
        // Clear the input field if this was a manual message
        setCurrentAgentMessage("");
      }, 800);
    }, delay);
  };

  const simulateCustomerTyping = (duration = 2000) => {
    setCustomerIsTyping(true);
    setTimeout(() => {
      setCustomerIsTyping(false);
    }, duration);
  };

  // Handle real agent message sending
  const handleSendAgentMessage = () => {
    if (!currentAgentMessage.trim() || pendingAgentMessage) return;

    const message = currentAgentMessage.trim();

    // Clear manual typing state
    setIsManuallyTyping(false);

    // Use realistic typing simulation with shorter delay since user already typed
    simulateAgentTyping(message, 300 + Math.random() * 500);
  };

  // Auto-simulate realistic conversation flow
  useEffect(() => {
    if (callStatus === "active" && transcript.length > 0) {
      const lastMessage = transcript[transcript.length - 1];

      // Simulate customer typing after agent messages
      if (lastMessage?.speaker === "Agent" && Math.random() > 0.7) {
        setTimeout(() => {
          simulateCustomerTyping(1500 + Math.random() * 2000);
        }, 2000 + Math.random() * 3000);
      }

      // Occasionally simulate agent preparing responses
      if (lastMessage?.speaker === "Customer" && Math.random() > 0.6) {
        const agentResponses = [
          "I understand your concern. Let me check that for you.",
          "Thank you for providing that information. I can help with that.",
          "I see the issue now. Let me pull up your account details.",
          "That's a great question. Give me just a moment to verify this.",
          "I apologize for the inconvenience. Let me resolve this right away.",
        ];

        setTimeout(() => {
          const randomResponse =
            agentResponses[Math.floor(Math.random() * agentResponses.length)];
          simulateAgentTyping(randomResponse, 2000 + Math.random() * 3000);
        }, 3000 + Math.random() * 4000);
      }
    }
  }, [transcript.length, callStatus]);

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
        overallCustomerState: currentSentiment?.customerState || "unknown",
        satisfactionPrediction:
          currentSentiment?.satisfactionPrediction || "neutral",
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
        completedAt: new Date().toISOString(),
        allLocalStorageState: getAllLocalStorageState(),
      },
    };

    // Validate session data
    const validation = validateSessionData(resolutionData);
    console.log("Session data validation:", validation);

    // Generate session summary
    const sessionSummary = generateSessionSummary(resolutionData);
    console.log("Session summary:", sessionSummary);

    // Save session data to file (JSON download)
    const fileResult = saveSessionDataToFile(resolutionData);

    // Also save to localStorage for future reference
    const storageResult = saveSessionDataToStorage(resolutionData);

    // Log the complete resolution data to console
    console.log("=== COMPLETE RESOLUTION DATA ===");
    console.log(JSON.stringify(resolutionData, null, 2));
    console.log("=== END RESOLUTION DATA ===");

    // Log a summary for easier reading
    console.log("=== RESOLUTION SUMMARY ===");
    console.log("Customer:", customerData?.name || "Unknown");
    console.log("Phone:", phoneNumber || "Not provided");
    console.log("Issue:", currentIssue || selectedOption || "Not specified");
    console.log("Resolution Status:", resolutionStatus);
    console.log("Duration:", formatTime(callDuration));
    console.log("Agent:", routedAgent?.name || "Not assigned");
    console.log(
      "Satisfaction:",
      customerSatisfaction ? `${customerSatisfaction}/5` : "Not rated"
    );
    console.log("Follow-up Required:", followUpRequired ? "Yes" : "No");
    console.log(
      "Backend Services:",
      `${successfulServices}/${totalBackendServices} successful`
    );
    console.log("AI Suggestions:", aiSuggestions?.length || 0);
    console.log("Sentiment:", currentSentiment?.overallSentiment || "Unknown");
    console.log("Escalation Risk:", escalationRisk || "Unknown");
    console.log("=== END SUMMARY ===");

    // Show success message with file save results
    const successMessage =
      `Resolution completed successfully!\n\n` +
      `📁 JSON File: ${
        fileResult.success
          ? `Downloaded as ${fileResult.filename}`
          : "Failed to download"
      }\n` +
      `💾 Local Storage: ${
        storageResult.success ? "Saved successfully" : "Failed to save"
      }\n` +
      `📊 Data Completeness: ${validation.completeness}%\n` +
      `⚠️ Warnings: ${validation.warnings.length} issues noted\n\n` +
      `Check browser console for detailed logs.`;

    alert(successMessage);

    // Add the completed session to a maintained list for export functionality
    try {
      const completedSessions = JSON.parse(
        localStorage.getItem("completed-sessions") || "[]"
      );
      completedSessions.push({
        sessionId: sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        summary: sessionSummary,
        dataKey: storageResult.key,
        validation: validation,
      });

      // Keep only last 100 completed sessions
      const recentSessions = completedSessions.slice(-100);
      localStorage.setItem(
        "completed-sessions",
        JSON.stringify(recentSessions)
      );

      console.log(
        `Added to completed sessions list. Total sessions: ${recentSessions.length}`
      );
    } catch (error) {
      console.error("Error updating completed sessions list:", error);
    }

    // Optional: Clear the call state or perform other cleanup
    // You could add additional logic here like:
    // - Sending data to an API endpoint
    // - Clearing localStorage IVR data
    // - Resetting call state for next call
    // - Navigating to dashboard or next call

    // Clear current session IVR data since resolution is complete
    localStorage.removeItem("ivrSessionData");
    localStorage.removeItem("ivrSessionSummary");

    // Reset call status to idle for next call
    setTimeout(() => {
      setCallStatus("idle");
      setCallDuration(0);
      setTranscript([]);
      setCallNotes("");
      setResolutionSummary("");
      setResolutionStatus("");
      setResolutionCategory("");
      setFollowUpRequired(false);
      setFollowUpDate("");
      setCustomerSatisfaction(null);
    }, 2000); // 2 second delay to allow user to see the completion message
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to add sample transcript for sentiment testing
  const addSentimentTestData = () => {
    const testMessages = [
      {
        speaker: "Agent",
        text: "Hello, thank you for calling. How can I help you today?",
        timestamp: new Date(),
        isSystem: false,
      },
      {
        speaker: "Customer",
        text: "Hi, I've been trying to fix my internet connection for hours and nothing is working. I'm really frustrated right now.",
        timestamp: new Date(),
        isSystem: false,
      },
      {
        speaker: "Agent",
        text: "I understand your frustration. Let me help you resolve this issue quickly.",
        timestamp: new Date(),
        isSystem: false,
      },
      {
        speaker: "Customer",
        text: "This is the third time I've called about this same problem. I'm starting to think about switching providers.",
        timestamp: new Date(),
        isSystem: false,
      },
      {
        speaker: "Agent",
        text: "I sincerely apologize for the inconvenience. Let me check your account and see what's been happening.",
        timestamp: new Date(),
        isSystem: false,
      },
      {
        speaker: "Customer",
        text: "Thank you, I really hope you can help me this time.",
        timestamp: new Date(),
        isSystem: false,
      },
    ];

    setTranscript(testMessages);

    // Trigger sentiment analysis after adding test data
    setTimeout(() => {
      analyzeSentimentWithGemini(testMessages, "manual");
    }, 500);
  };

  const handleAnswerCall = () => {
    setCallStatus("active");
    setIsRecording(true);
    setCallDuration(0);
    setTranscript([]);
  };

  const handleEndCall = () => {
    setCallStatus("idle");
    setIsRecording(false);
    setCallDuration(0);
    setCustomerData(null);
    setTranscript([]);
    setAiSuggestions([]);
    setKnowledgeBase([]);
    setCallNotes("");

    // Reset resolution data
    setResolutionStatus("");
    setResolutionSummary("");
    setResolutionCategory("");
    setFollowUpRequired(false);
    setFollowUpDate("");
    setCustomerSatisfaction(null);
    setIsAutoPopulating(false);

    // Reset Gemini backend analysis data
    setGeminiBackendData(null);
    setGeminiApiResponse(null);
    setGeminiBackendAnalyzed(false);
  };

  const handleIncomingCall = () => {
    setCallStatus("incoming");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Contact Center</h1>
                  <p className="text-sm text-slate-600">AI-Powered Agent Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                <div className={`w-2 h-2 rounded-full ${
                  callStatus === "active" ? "bg-green-500 animate-pulse" :
                  callStatus === "incoming" ? "bg-blue-500 animate-pulse" :
                  "bg-slate-400"
                }`}></div>
                <span className="text-sm font-medium text-slate-700">
                  {callStatus === "active" ? "Live Call" :
                   callStatus === "incoming" ? "Incoming" : "Ready"}
                </span>
                {callStatus === "active" && (
                  <span className="text-sm font-mono text-slate-600">
                    {formatTime(callDuration)}
                  </span>
                )}
              </div>
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-2 p-2">
        {/* Left Sidebar - Call Controls & Customer Info */}
        <div className="w-80 bg-white/60 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl flex flex-col overflow-hidden">
          {/* Enhanced Call Status Header */}
          <div className={`relative ${
              callStatus === "active"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : callStatus === "incoming"
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gradient-to-r from-slate-600 to-slate-700"
            } text-white`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {callStatus === "active"
                        ? "Live Call"
                        : callStatus === "incoming"
                        ? "Incoming Call"
                        : "Ready for Calls"}
                    </div>
                    {callStatus === "active" && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs opacity-90">Recording</span>
                      </div>
                    )}
                  </div>
                </div>
                {callStatus === "active" && (
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold">
                      {formatTime(callDuration)}
                    </div>
                    <div className="text-xs opacity-75">Duration</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Call Controls */}
          <div className="p-4 bg-gradient-to-b from-white/60 to-slate-50/60 border-b border-slate-200/60">
            <div className="flex justify-center space-x-3">
              {callStatus === "idle" && !ivrSessionData && (
                <button
                  onClick={handleIncomingCall}
                  className="group flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
                >
                  <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Start New Call
                </button>
              )}

              {callStatus === "idle" && ivrSessionData && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-600 font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>IVR Transfer Ready</span>
                  </div>
                  <button
                    onClick={handleAnswerCall}
                    className="group flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
                  >
                    <PhoneCall className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Accept Transfer
                  </button>
                </div>
              )}

              {callStatus === "incoming" && (
                <button
                  onClick={handleAnswerCall}
                  className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium animate-pulse"
                >
                  <PhoneCall className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Answer Call
                </button>
              )}

              {callStatus === "active" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`group p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
                      isMuted
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                    }`}
                    title={isMuted ? "Unmute (Ctrl+M)" : "Mute (Ctrl+M)"}
                  >
                    {isMuted ? (
                      <MicOff className="w-4 h-4 mx-auto group-hover:animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 mx-auto" />
                    )}
                  </button>
                  <button
                    className="group p-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    title="Volume (Ctrl+V)"
                  >
                    <Volume2 className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    className="group p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 text-xs font-medium"
                    title="Hold (Ctrl+H)"
                  >
                    Hold
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="group p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    title="End Call (Ctrl+E)"
                  >
                    <PhoneOff className="w-4 h-4 mx-auto group-hover:animate-pulse" />
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Sentiment Analysis & Status Indicators */}
            {callStatus === "active" && transcript.length > 0 && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={() =>
                    rateLimitedGeminiCall(
                      analyzeSentimentWithGemini,
                      transcript,
                      "manual"
                    )
                  }
                  disabled={sentimentAnalysisLoading}
                  className={`w-full flex items-center justify-center px-3 py-2 text-xs rounded-lg font-medium transition-all duration-200 ${
                    sentimentAnalysisLoading
                      ? "bg-purple-100 text-purple-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md transform hover:scale-105"
                  }`}
                >
                  {sentimentAnalysisLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 mr-2" />
                      AI Sentiment Analysis
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between space-x-2">
                  {currentSentiment && (
                    <div
                      className={`flex items-center px-3 py-1.5 text-xs rounded-lg font-medium shadow-sm ${
                        currentSentiment.overallSentiment === "positive"
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                          : currentSentiment.overallSentiment === "negative"
                          ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                          : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          currentSentiment.overallSentiment === "positive"
                            ? "bg-green-500"
                            : currentSentiment.overallSentiment === "negative"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {currentSentiment.overallSentiment.toUpperCase()}
                    </div>
                  )}

                  {escalationRisk === "high" && (
                    <div className="flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-lg animate-pulse border border-red-300 shadow-sm">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      ESCALATE
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced IVR Transfer Status */}
            {ivrSessionData && callStatus !== "active" && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/60 shadow-sm">
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-700 text-sm font-medium">
                    IVR Transfer Ready
                  </span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Customer Information */}
          {customerData && (
            <div className="p-4 bg-gradient-to-b from-white/60 to-slate-50/60 border-b border-slate-200/60">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {customerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">
                      {customerData.name}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium shadow-sm ${
                        customerData.sentiment === "positive"
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                          : customerData.sentiment === "negative"
                          ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                          : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {customerData.sentiment.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <span className="font-medium">{customerData.tier} Customer</span>
                    {ivrSessionData && (
                      <>
                        <span>•</span>
                        <span className="text-purple-600 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">
                          IVR Transfer
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg shadow-sm border border-slate-100">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-mono font-medium text-slate-900">{customerData.phone}</span>
                  </div>
                  {customerData.email && (
                    <div className="flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg shadow-sm border border-slate-100">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-medium text-slate-900 truncate">
                        {customerData.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg shadow-sm border border-slate-100">
                    <span className="text-slate-600">Account:</span>
                    <span className="font-mono font-medium text-slate-900">
                      {customerData.accountNumber}
                    </span>
                  </div>
                  {customerData.lastContact && (
                    <div className="flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg shadow-sm border border-slate-100">
                      <span className="text-slate-600">Last Contact:</span>
                      <span className="font-medium text-slate-900">
                        {customerData.lastContact}
                      </span>
                    </div>
                  )}
                  {ivrSessionData?.agentMatchScore && (
                    <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200">
                      <span className="text-green-700">Agent Match:</span>
                      <span className="font-bold text-green-800">
                        {ivrSessionData.agentMatchScore}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-800">
                      Current Issue
                    </p>
                  </div>
                  <p className="text-sm text-orange-700 leading-relaxed">{customerData.issue}</p>
                </div>

                {/* Enhanced IVR Session Info */}
                {ivrSessionData && (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-semibold text-purple-800">
                          IVR Session
                        </p>
                      </div>
                      <span className="text-xs text-purple-600 font-mono bg-purple-100 px-2 py-1 rounded">
                        {ivrSessionData.sessionId?.slice(-8)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white/80 rounded-lg border border-purple-100">
                        <div className="text-lg font-bold text-purple-800">
                          {ivrSessionData.successfulServices}/{ivrSessionData.totalBackendServices}
                        </div>
                        <div className="text-xs text-purple-600">Services</div>
                      </div>
                      <div className="text-center p-2 bg-white/80 rounded-lg border border-purple-100">
                        <div className="text-lg font-bold text-purple-800">
                          {ivrSessionData.totalBackendTime}ms
                        </div>
                        <div className="text-xs text-purple-600">Response</div>
                      </div>
                    </div>
                    {routedAgent && (
                      <div className="mt-2 p-2 bg-white/80 rounded-lg border border-purple-100">
                        <span className="text-purple-600 text-xs">Routed to:</span>{" "}
                        <span className="font-medium text-purple-800">
                          {routedAgent.name} ({routedAgent.dept})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Previous Issues */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Issue History</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(customerData.previousIssues || customerData.issues || [])
                      .slice(0, 3)
                      .map((issue, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-sm border border-slate-200"
                        >
                          {issue}
                        </span>
                      ))}
                    {(customerData.previousIssues || customerData.issues || [])
                      .length > 3 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600 rounded-lg text-xs font-medium shadow-sm border border-slate-300">
                        +
                        {(
                          customerData.previousIssues ||
                          customerData.issues ||
                          []
                        ).length - 3}{" "}
                        more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compact AHT Optimization Demo Panel */}
          {showOptimizationDemo && timingSavings && (
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-3 h-3 text-orange-500" />
                  <h4 className="font-semibold text-gray-900 text-sm">
                    AHT Optimization
                  </h4>
                  <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-bold">
                    -{timingSavings.improvement}%
                  </span>
                </div>
                <button
                  onClick={() => setShowOptimizationDemo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Compact Time Savings */}
              <div className="bg-white rounded-lg p-2 mb-2 border border-green-200">
                <div className="text-center mb-1.5">
                  <div className="text-xl font-bold text-green-600">
                    -{timingSavings.totalSaved.toFixed(1)}s
                  </div>
                  <div className="text-xs text-gray-600">Time Saved</div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-blue-600 text-xs">
                      {timingSavings.preFetchedTime.toFixed(1)}s
                    </div>
                    <div className="text-gray-600">Backend</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600 text-xs">
                      {timingSavings.customerDataTime}s
                    </div>
                    <div className="text-gray-600">Lookup</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600 text-xs">
                      {timingSavings.contextTime}s
                    </div>
                    <div className="text-gray-600">Context</div>
                  </div>
                </div>
              </div>

              {/* Compact AHT Comparison */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-1.5 bg-red-50 rounded border-l-2 border-red-400">
                  <span className="text-red-800 font-medium">Before:</span>
                  <span className="font-bold text-red-700">
                    {Math.floor(timingSavings.traditionalAHT / 60)}m{" "}
                    {timingSavings.traditionalAHT % 60}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-1.5 bg-green-50 rounded border-l-2 border-green-400">
                  <span className="text-green-800 font-medium">After:</span>
                  <span className="font-bold text-green-700">
                    {Math.floor(timingSavings.optimizedAHT / 60)}m{" "}
                    {Math.round(timingSavings.optimizedAHT % 60)}s
                  </span>
                </div>
              </div>

              {/* Pre-fetched Status */}
              <div className="mt-2 p-1.5 bg-blue-100 rounded border border-blue-300">
                <div className="flex items-center space-x-1 mb-0.5">
                  <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                  <span className="text-xs font-medium text-blue-800">
                    Pre-fetched ({timingSavings.servicesPreFetched} services)
                  </span>
                </div>
                <div className="text-xs text-blue-700">
                  ✓ Customer ready • ✓ Backend loaded • ✓ Context prepared
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Main Content Area */}
        <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Enhanced Top Navigation with IVR Banner and Session Details */}
          <div
            className={`border-b border-slate-200/60 p-4 ${
              ivrSessionData && timingSavings
                ? "bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white shadow-lg"
                : "bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* <h1 className={`text-xl font-semibold ${
                  ivrSessionData && timingSavings ? "text-white" : "text-gray-900"
                }`}>
                  Contact Center Dashboard
                </h1> */}

                {/* Enhanced IVR Session Info with Dropdown */}
                {ivrSessionData && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() =>
                        setShowIVRDetailsDropdown(!showIVRDetailsDropdown)
                      }
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
                        ivrSessionData && timingSavings
                          ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                          : "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 border border-purple-300"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      <span>IVR Transfer</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
                        style={{
                          transform: showIVRDetailsDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Enhanced IVR Details Dropdown */}
                    {showIVRDetailsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                          <h4 className="font-bold text-lg">
                            IVR Session Details
                          </h4>
                          <p className="text-purple-100 text-sm">
                            Session {ivrSessionData.sessionId?.slice(-8)}
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="text-gray-900 font-mono">
                                {phoneNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="text-gray-900">
                                {selectedOption?.replace(/_/g, " ") || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Session ID:</span>
                              <span className="text-gray-900 font-mono">
                                {sessionId?.split("_")[1] || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Timestamp:</span>
                              <span className="text-gray-900">
                                {sessionTimestamp
                                  ? new Date(
                                      sessionTimestamp
                                    ).toLocaleTimeString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Agent Match Score */}
                {agentMatchScore && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() =>
                        setShowAgentInfoDropdown(!showAgentInfoDropdown)
                      }
                      className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium hover:bg-green-200 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{agentMatchScore}% Match</span>
                      <svg
                        className="w-4 h-4 transition-transform"
                        style={{
                          transform: showAgentInfoDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Agent Info Dropdown */}
                    {showAgentInfoDropdown && routedAgent && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Agent Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="text-gray-900 font-medium">
                                {routedAgent.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Department:</span>
                              <span className="text-gray-900">
                                {routedAgent.dept}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Specializations:
                              </span>
                              <span className="text-gray-900">
                                {routedAgent.specializations?.join(", ") ||
                                  "N/A"}
                              </span>
                            </div>
                            {routedAgent.performance && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">AHT:</span>
                                  <span className="text-gray-900">
                                    {Math.round(
                                      routedAgent.performance
                                        .averageHandleTimeSeconds / 60
                                    )}
                                    :
                                    {(
                                      routedAgent.performance
                                        .averageHandleTimeSeconds % 60
                                    )
                                      .toString()
                                      .padStart(2, "0")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">FCR:</span>
                                  <span className="text-gray-900">
                                    {
                                      routedAgent.performance
                                        .firstCallResolutionPercentage
                                    }
                                    %
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Backend Services Status */}
                {totalBackendServices > 0 && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() =>
                        setShowBackendServicesDropdown(
                          !showBackendServicesDropdown
                        )
                      }
                      className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-full font-medium transition-colors ${
                        successfulServices === totalBackendServices
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>
                        Services: {successfulServices}/{totalBackendServices}
                      </span>
                      <svg
                        className="w-4 h-4 transition-transform"
                        style={{
                          transform: showBackendServicesDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Backend Services Dropdown */}
                    {showBackendServicesDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Backend Services Status
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Total Services:
                              </span>
                              <span className="text-gray-900">
                                {totalBackendServices}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Successful:</span>
                              <span className="text-green-600 font-medium">
                                {successfulServices}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Failed:</span>
                              <span className="text-red-600 font-medium">
                                {failedServices}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Processing Time:
                              </span>
                              <span className="text-gray-900 font-mono">
                                {totalBackendTime}ms
                              </span>
                            </div>
                            {backendDetails && backendDetails.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-gray-600 font-medium">
                                  Service Details:
                                </span>
                                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto ">
                                  {backendDetails.map((service, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center w-full"
                                    >
                                      <span className="text-gray-700">
                                        {service.SERVICE_NAME}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 text-xs">
                                          {service.TIME_TAKEN}ms
                                        </span>
                                        <span
                                          className={`w-2 h-2 rounded-full ${
                                            service.STATUS === "S"
                                              ? "bg-green-500"
                                              : "bg-red-500"
                                          }`}
                                        ></span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* IVR Optimization Metrics - Compact */}
                {ivrSessionData && timingSavings && (
                  <div className="flex items-center space-x-4">
                    {/* <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                      <span className="font-bold text-sm">AHT OPT ACTIVE</span>
                    </div> */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-300" />
                        <span>
                          {timingSavings.servicesPreFetched} pre-loaded
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-blue-300" />
                        <span>
                          {timingSavings.totalSaved.toFixed(1)}s saved
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3 text-purple-300" />
                        <span>{timingSavings.improvement}% improved</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Optimized AHT Display */}
                {ivrSessionData && timingSavings ? (
                  <div className="text-right">
                    <div className="text-xs opacity-90">Estimated AHT</div>
                    <div className="font-bold text-sm">
                      {Math.floor(timingSavings.optimizedAHT / 60)}:
                      {Math.round(timingSavings.optimizedAHT % 60)
                        .toString()
                        .padStart(2, "0")}
                      <span className="text-xs ml-1 opacity-75">
                        vs {Math.floor(timingSavings.traditionalAHT / 60)}:
                        {(timingSavings.traditionalAHT % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Dynamic AHT based on IVR data */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {routedAgent?.performance?.averageHandleTimeSeconds
                          ? `AHT: ${Math.round(
                              routedAgent.performance.averageHandleTimeSeconds /
                                60
                            )}:${(
                              routedAgent.performance.averageHandleTimeSeconds %
                              60
                            )
                              .toString()
                              .padStart(2, "0")}`
                          : "AHT: 4:32 (-32%)"}
                      </span>
                    </div>
                    {/* Dynamic FCR based on agent data */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BarChart3 className="w-4 h-4" />
                      <span>
                        {routedAgent?.performance?.firstCallResolutionPercentage
                          ? `FCR: ${routedAgent.performance.firstCallResolutionPercentage}%`
                          : "FCR: 87%"}
                      </span>
                    </div>
                  </>
                )}

                {/* <button
                  onClick={() => setShowOptimizationDemo(!showOptimizationDemo)}
                  className={`p-2 rounded transition-colors ${
                    showOptimizationDemo
                      ? "bg-orange-500 text-white"
                      : ivrSessionData && timingSavings
                      ? "text-purple-200 hover:text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Toggle AHT Optimization Panel"
                >
                  <Zap className="w-5 h-5" />
                </button> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className={`p-2 rounded transition-colors ${
                        ivrSessionData && timingSavings
                          ? "text-purple-200 hover:text-white"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      title="Open Debug Panel"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Debug Panel - Session State Data
                      </DialogTitle>
                    </DialogHeader>
                    <DebugPanel
                      phoneNumber={phoneNumber}
                      selectedOption={selectedOption}
                      sessionId={sessionId}
                      agentMatchScore={agentMatchScore}
                      totalBackendServices={totalBackendServices}
                      successfulServices={successfulServices}
                      failedServices={failedServices}
                      totalBackendTime={totalBackendTime}
                      availableAgentsCount={availableAgentsCount}
                      categoryMapping={categoryMapping}
                      activityLog={activityLog}
                      lastIVRSession={lastIVRSession}
                      routedAgent={routedAgent}
                      geminiApiLoading={geminiApiLoading}
                      geminiApiResponse={geminiApiResponse}
                      backendDetails={backendDetails}
                    />
                  </DialogContent>
                </Dialog>
                {/* <button
                  onClick={logAllStateData}
                  className={`p-2 transition-colors ${
                    ivrSessionData && timingSavings
                      ? "text-purple-200 hover:text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Log State Data to Console"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    rateLimitedGeminiCall(callGeminiAPI, backendDetails)
                  }
                  className={`p-2 rounded transition-colors ${
                    geminiApiLoading
                      ? "bg-blue-500 text-white animate-pulse"
                      : ivrSessionData && timingSavings
                      ? "text-purple-200 hover:text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Call Gemini API with Backend Data"
                  disabled={
                    !backendDetails ||
                    backendDetails.length === 0 ||
                    geminiApiLoading
                  }
                >
                  <Bot className="w-5 h-5" />
                </button> */}
              </div>
            </div>
          </div>

          <div>
            {/* AI Customer Insights - Compact Agent-Friendly UI */}
            {geminiApiResponse && (
              <div className="p-3 border-b border-gray-200">
                {/* Compact AI Insights Display */}
                <div className="space-y-2">
                  {(() => {
                    // Extract the generated text from Gemini API response
                    const analysisText =
                      geminiApiResponse?.candidates?.[0]?.content?.parts?.[0]
                        ?.text || "";

                    if (!analysisText) return null;

                    // Parse the analysis into structured sections
                    const sections = {};
                    let currentSection = "";

                    analysisText.split("\n").forEach((line) => {
                      const trimmed = line.trim();
                      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                        currentSection = trimmed
                          .replace(/\*\*/g, "")
                          .toLowerCase();
                        sections[currentSection] = [];
                      } else if (trimmed.startsWith("*") && currentSection) {
                        const cleanLine = trimmed
                          .replace(/^\*\s*/, "")
                          .replace(/\*\*(.*?)\*\*/g, "$1");
                        if (cleanLine) sections[currentSection].push(cleanLine);
                      } else if (
                        trimmed &&
                        !trimmed.startsWith("**") &&
                        currentSection
                      ) {
                        sections[currentSection].push(trimmed);
                      }
                    });

                    return (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                        {/* Key Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          {/* Customer Information */}
                          {sections["customer information"] && (
                            <div className="bg-white/70 rounded p-2">
                              <div className="font-semibold text-blue-700 mb-1 flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                Customer
                              </div>
                              <div className="space-y-1">
                                {sections["customer information"]
                                  .slice(0, 3)
                                  .map((info, i) => (
                                    <div
                                      key={i}
                                      className="text-gray-700 text-xs"
                                    >
                                      {info}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Active Services */}
                          {sections["active services"] && (
                            <div className="bg-white/70 rounded p-2">
                              <div className="font-semibold text-green-700 mb-1 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Services
                              </div>
                              <div className="space-y-1">
                                {sections["active services"]
                                  .slice(0, 3)
                                  .map((service, i) => (
                                    <div
                                      key={i}
                                      className="text-gray-700 text-xs"
                                    >
                                      {service}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Issues & Actions */}
                          {sections["issues & actions"] && (
                            <div className="bg-white/70 rounded p-2">
                              <div className="font-semibold text-orange-700 mb-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Actions
                              </div>
                              <div className="space-y-1">
                                {sections["issues & actions"]
                                  .slice(0, 3)
                                  .map((action, i) => (
                                    <div
                                      key={i}
                                      className="text-gray-700 text-xs"
                                    >
                                      {action}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-purple-500" />
                            <h4 className="font-medium text-gray-900 text-sm">
                              Customer Information
                            </h4>
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                              Powered by Ai
                            </span>
                          </div>
                          {geminiApiLoading && (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs text-blue-600">
                                Processing...
                              </span>
                            </div>
                          )}
                        </div>
                        <div id={`full-gemini-analysis`} className="  text-xs">
                          {/* Customer Info Section */}
                          {geminiBackendData.customerInfo && (
                            <div className="mb-3 p-2 bg-white rounded border border-purple-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-purple-800">
                                  👤 Customer
                                </span>
                                <span className="text-xs text-purple-600">
                                  {geminiBackendData.customerInfo.accountDetails
                                    ?.accountStatus || "Active"}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {geminiBackendData.customerInfo.name}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                  <span className="font-medium">Account:</span>{" "}
                                  {
                                    geminiBackendData.customerInfo
                                      .accountDetails?.ban
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {
                                    geminiBackendData.customerInfo.contactInfo
                                      ?.phone
                                  }
                                </div>
                                {geminiBackendData.customerInfo
                                  .serviceAddress && (
                                  <div className="col-span-2">
                                    <span className="font-medium">
                                      Address:
                                    </span>{" "}
                                    {
                                      geminiBackendData.customerInfo
                                        .serviceAddress
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Active Services Section */}
                          {geminiBackendData.activeServices &&
                            geminiBackendData.activeServices.length > 0 && (
                              <div className="mb-3 p-2 bg-white rounded border border-purple-100">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-purple-800">
                                    📡 Services (
                                    {geminiBackendData.activeServices.length})
                                  </span>
                                  <span className="text-xs text-green-600 font-medium">
                                    {
                                      geminiBackendData.activeServices.filter(
                                        (s) => s.status === "ACTIVE"
                                      ).length
                                    }{" "}
                                    Active
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {geminiBackendData.activeServices
                                    .slice(0, 3)
                                    .map((service, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between text-xs"
                                      >
                                        <div className="flex items-center space-x-1">
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              service.status === "ACTIVE"
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                            }`}
                                          ></div>
                                          <span className="text-gray-900">
                                            {service.product}
                                          </span>
                                        </div>
                                        <div className="text-gray-600">
                                          {service.speeds && (
                                            <span>{service.speeds}</span>
                                          )}
                                          {service.technology && (
                                            <span className="ml-1 text-purple-600">
                                              ({service.technology})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  {geminiBackendData.activeServices.length >
                                    3 && (
                                    <div className="text-xs text-gray-500 text-center">
                                      +
                                      {geminiBackendData.activeServices.length -
                                        3}{" "}
                                      more services
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Issues & Actions Section */}
                          {geminiBackendData.issuesAndActions && (
                            <div className="p-2 bg-white rounded border border-purple-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-purple-800">
                                  ⚠️ Issues & Actions
                                </span>
                                {geminiBackendData.issuesAndActions.openTickets
                                  ?.length > 0 && (
                                  <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                                    {
                                      geminiBackendData.issuesAndActions
                                        .openTickets.length
                                    }{" "}
                                    Open
                                  </span>
                                )}
                              </div>

                              {/* Failed Operations */}
                              {geminiBackendData.issuesAndActions
                                .modemReboot === "Failed" && (
                                <div className="text-xs text-red-600 mb-1 flex items-center space-x-1">
                                  <span>🔴</span>
                                  <span>Modem reboot failed</span>
                                </div>
                              )}

                              {/* Open Tickets */}
                              {geminiBackendData.issuesAndActions.openTickets &&
                                geminiBackendData.issuesAndActions.openTickets
                                  .length > 0 && (
                                  <div className="space-y-1 mb-2">
                                    {geminiBackendData.issuesAndActions.openTickets
                                      .slice(0, 2)
                                      .map((ticket, index) => (
                                        <div
                                          key={index}
                                          className="text-xs bg-orange-50 p-1.5 rounded border border-orange-200"
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="font-medium text-orange-800">
                                              Ticket #{ticket.ticketNumber}
                                            </span>
                                            <span className="text-orange-600">
                                              {ticket.status}
                                            </span>
                                          </div>
                                          {ticket.appointment && (
                                            <div className="text-orange-700 mt-0.5">
                                              📅 {ticket.appointment}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                )}

                              {/* Recommendation */}
                              {geminiBackendData.issuesAndActions
                                .recommendation && (
                                <div className="text-xs bg-blue-50 p-1.5 rounded border border-blue-200">
                                  <div className="flex items-center space-x-1 text-blue-800">
                                    <span>💡</span>
                                    <span className="font-medium">
                                      Recommended:
                                    </span>
                                  </div>
                                  <div className="text-blue-700 mt-0.5">
                                    {
                                      geminiBackendData.issuesAndActions
                                        .recommendation
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Quick Actions */}
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                const dataStr = JSON.stringify(
                                  geminiBackendData,
                                  null,
                                  2
                                );
                                navigator.clipboard.writeText(dataStr);
                              }}
                              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center space-x-1"
                            >
                              <span>📋</span>
                              <span>Copy</span>
                            </button>{" "}
                            <button
                              onClick={() =>
                                setCallNotes(
                                  (prev) =>
                                    prev + "\n\nAI Insights:\n" + analysisText
                                )
                              }
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              Add to Notes
                            </button>
                            {!geminiApiLoading && (
                              <button
                                onClick={() =>
                                  rateLimitedGeminiCall(
                                    callGeminiAPI,
                                    backendDetails
                                  )
                                }
                                className="mt-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center mx-auto"
                                disabled={
                                  !backendDetails || backendDetails.length === 0
                                }
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                Refresh Analysis
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <span className="mr-1">🤖</span>
                            Gemini AI Response
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

     
          </div>

          <div className="flex-1 flex">
            {/* No IVR Data State */}
            {!ivrSessionData && callStatus === "idle" && (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
                  <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No IVR Session Data
                  </h3>
                  <p className="text-gray-600 mb-4">
                    To see the full Contact Center experience with customer
                    context, backend services, and AI suggestions, please start
                    from the IVR Demo first.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => (window.location.href = "/")}
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
            {(ivrSessionData || callStatus !== "idle") && (
              <>
                {/* Center Panel - Transcript & Notes */}
                <div className="flex-1 flex flex-col">
                  {/* Conversation Panel with Sentiment Integration - Compact UI */}
                  <div className="flex-1 flex flex-col space-y-3 p-2">
                    {/* Customer Sentiment Analysis - Ultra Compact */}
                    {(currentSentiment || sentimentAnalysisLoading) && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-3">
                          {/* Inline Sentiment Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="relative">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                    currentSentiment?.overallSentiment ===
                                    "positive"
                                      ? "bg-green-100 text-green-600"
                                      : currentSentiment?.overallSentiment ===
                                        "negative"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {currentSentiment?.overallSentiment ===
                                  "positive"
                                    ? "😊"
                                    : currentSentiment?.overallSentiment ===
                                      "negative"
                                    ? "😟"
                                    : "😐"}
                                </div>
                                {escalationRisk === "high" && (
                                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900 text-xs">
                                  Mood:
                                </h4>
                                {currentSentiment && (
                                  <span
                                    className={`font-medium text-xs ${
                                      currentSentiment.overallSentiment ===
                                      "positive"
                                        ? "text-green-600"
                                        : currentSentiment.overallSentiment ===
                                          "negative"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                                    }`}
                                  >
                                    {currentSentiment.overallSentiment?.toUpperCase() ||
                                      "NEUTRAL"}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  ({currentSentiment?.confidence || 0}%)
                                </span>
                              </div>
                            </div>

                            {/* Compact Risk & Loading */}
                            <div className="flex items-center space-x-2">
                              {escalationRisk === "high" && (
                                <div className="bg-red-100 border border-red-300 rounded px-2 py-0.5">
                                  <span className="text-xs font-medium text-red-800">
                                    ⚠️ HIGH RISK
                                  </span>
                                </div>
                              )}
                              {sentimentAnalysisLoading && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs text-blue-600">
                                    Analyzing
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ultra Compact Metrics Row */}
                          {currentSentiment && (
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                                <div className="font-bold text-gray-900">
                                  {currentSentiment.customerState
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    currentSentiment.customerState?.slice(1) ||
                                    "Unknown"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  State
                                </div>
                              </div>

                              <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                                <div
                                  className={`font-bold ${
                                    escalationRisk === "low"
                                      ? "text-green-600"
                                      : escalationRisk === "high"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                  }`}
                                >
                                  {escalationRisk?.charAt(0).toUpperCase() ||
                                    "M"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Risk
                                </div>
                              </div>

                              <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                                <div className="font-bold text-gray-900">
                                  {(
                                    currentSentiment.sentimentScore * 100
                                  ).toFixed(0)}
                                  %
                                </div>
                                <div className="text-xs text-gray-500">
                                  Score
                                </div>
                              </div>

                              <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                                <div
                                  className={`font-bold ${
                                    sentimentTrend === "improving"
                                      ? "text-green-600"
                                      : sentimentTrend === "declining"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {sentimentTrend === "improving"
                                    ? "↗"
                                    : sentimentTrend === "declining"
                                    ? "↘"
                                    : "→"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Trend
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Inline Quick Tip */}
                          {currentSentiment && (
                            <div className="flex items-center justify-between space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs">💡</span>
                                <div className="text-xs text-blue-800 font-medium">
                                  {currentSentiment.overallSentiment ===
                                    "positive" &&
                                    "Customer receptive - good for solutions"}
                                  {currentSentiment.overallSentiment ===
                                    "negative" &&
                                    escalationRisk === "high" &&
                                    "Focus on active listening & immediate help"}
                                  {currentSentiment.overallSentiment ===
                                    "negative" &&
                                    escalationRisk !== "high" &&
                                    "Acknowledge concern, provide clear steps"}
                                  {currentSentiment.overallSentiment ===
                                    "neutral" &&
                                    "Build rapport & gather information"}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setShowSentimentDetailsDialog(true)
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-100 flex items-center space-x-1"
                              >
                                <span>Details</span>
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* API Error Banner */}
                    {sentimentApiError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-red-800">
                                  Sentiment Analysis Service Unavailable
                                </h4>
                                <p className="text-xs text-red-600 mt-0.5">
                                  {sentimentApiError.message.includes("503") &&
                                    "The sentiment analysis service is temporarily down. Please try again later."}
                                  {sentimentApiError.message.includes("429") &&
                                    "Rate limit exceeded. Please wait before trying again."}
                                  {!sentimentApiError.message.includes("503") &&
                                    !sentimentApiError.message.includes(
                                      "429"
                                    ) &&
                                    `Error: ${sentimentApiError.message}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSentimentApiError(null);
                                  rateLimitedGeminiCall(
                                    analyzeSentimentWithGemini,
                                    transcript,
                                    "manual"
                                  );
                                }}
                                disabled={sentimentAnalysisLoading}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                <span>Retry</span>
                              </button>
                              <button
                                onClick={() => setSentimentApiError(null)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Dismiss"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Error Details Expandable */}
                          <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                            <div className="flex items-center space-x-2 text-red-700">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                Real-time sentiment insights are temporarily
                                unavailable. Conversation analysis will continue
                                without sentiment data.
                              </span>
                            </div>
                            <div className="mt-1 text-red-600">
                              <span className="font-medium">
                                Last attempted:
                              </span>{" "}
                              {new Date(
                                sentimentApiError.timestamp
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Live Transcript - Ultra Compact */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1">
                      {/* Ultra Compact Header */}
                      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <MessageSquare className="w-3 h-3 text-blue-600" />
                            {isRecording && (
                              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <h3 className="text-xs font-semibold text-gray-900">
                            Chat
                          </h3>
                          <span className="text-xs text-gray-500">
                            (
                            {
                              transcript.filter((m) => m && m.speaker && m.text)
                                .length
                            }
                            )
                          </span>

                          {/* Live Typing Indicators in Header */}
                          {(agentIsTyping || customerIsTyping) && (
                            <div className="flex items-center space-x-1">
                              {agentIsTyping && (
                                <div className="flex items-center space-x-1 text-blue-600">
                                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-medium">
                                    Agent typing
                                  </span>
                                </div>
                              )}
                              {customerIsTyping && (
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-medium">
                                    Customer typing
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {isRecording &&
                            !agentIsTyping &&
                            !customerIsTyping && (
                              <div className="flex items-center space-x-1 text-red-600">
                                <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">REC</span>
                              </div>
                            )}
                        </div>

                        {/* Ultra Compact Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setTranscript([])}
                            className="px-1.5 py-0.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                            title="Clear"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => simulateCustomerTyping(3000)}
                            disabled={customerIsTyping}
                            className={`px-1.5 py-0.5 text-xs border rounded ${
                              customerIsTyping
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            title="Simulate Customer Typing"
                          >
                            Test
                          </button>
                          <button
                            className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Export"
                          >
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Ultra Compact Transcript Content */}
                      <div className="h-48 overflow-y-auto">
                        {transcript.length === 0 &&
                        !agentIsTyping &&
                        !customerIsTyping ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-3">
                            <MessageSquare className="w-6 h-6 text-gray-300 mb-1" />
                            <p className="text-xs text-center">
                              {ivrSessionData
                                ? "Connecting..."
                                : "No conversation"}
                            </p>
                          </div>
                        ) : (
                          <div className="p-2 space-y-1.5">
                            {transcript
                              .filter(
                                (message) =>
                                  message && message.speaker && message.text
                              )
                              .map((message, index) => (
                                <div
                                  key={index}
                                  className={`flex ${
                                    message.speaker === "Agent"
                                      ? "justify-end"
                                      : message.isSystem
                                      ? "justify-center"
                                      : "justify-start"
                                  }`}
                                >
                                  <div
                                    className={`max-w-xs ${
                                      message.speaker === "Agent"
                                        ? "order-2"
                                        : ""
                                    }`}
                                  >
                                    {/* Ultra Compact Message Bubble */}
                                    <div
                                      className={`px-2 py-1 rounded text-xs ${
                                        message.speaker === "Agent"
                                          ? "bg-blue-500 text-white"
                                          : message.isSystem
                                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                                          : "bg-gray-100 text-gray-900"
                                      }`}
                                    >
                                      {/* Inline Header */}
                                      <div
                                        className={`flex items-center justify-between mb-0.5 ${
                                          message.isSystem
                                            ? "text-purple-600"
                                            : message.speaker === "Agent"
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        <span className="font-medium text-xs">
                                          {message.isSystem
                                            ? "Sys"
                                            : message.speaker === "Agent"
                                            ? "Agt"
                                            : "Cust"}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                          {message.status === "sent" &&
                                            message.speaker === "Agent" && (
                                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                            )}
                                          <span className="text-xs opacity-75">
                                            {message.time ||
                                              new Date().toLocaleTimeString(
                                                "en-US",
                                                {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                }
                                              )}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Message Text */}
                                      <p className="text-xs leading-tight">
                                        {message.text}
                                      </p>

                                      {/* Conversation ID for system messages */}
                                      {message.conversationId && (
                                        <div className="mt-0.5 pt-0.5 border-t border-opacity-20 border-current">
                                          <span className="text-xs font-mono opacity-60">
                                            #
                                            {
                                              message.conversationId.split(
                                                "_"
                                              )[1]
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                            {/* Customer Typing Indicator */}
                            {customerIsTyping && (
                              <div className="flex justify-start">
                                <div className="max-w-xs">
                                  <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-900">
                                    <div className="flex items-center justify-between mb-0.5 text-gray-500">
                                      <span className="font-medium text-xs">
                                        Cust
                                      </span>
                                      <span className="text-xs opacity-75">
                                        typing...
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                          style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                          style={{ animationDelay: "0.2s" }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500 ml-2">
                                        typing
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Agent Typing Indicator */}
                            {agentIsTyping && (
                              <div className="flex justify-end">
                                <div className="max-w-xs order-2">
                                  <div className="px-2 py-1 rounded text-xs bg-blue-500 text-white">
                                    <div className="flex items-center justify-between mb-0.5 text-blue-100">
                                      <span className="font-medium text-xs">
                                        Agt
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        {pendingAgentMessage && (
                                          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                        )}
                                        <span className="text-xs opacity-75">
                                          {pendingAgentMessage
                                            ? "sending..."
                                            : "typing..."}
                                        </span>
                                      </div>
                                    </div>
                                    {pendingAgentMessage ? (
                                      <p className="text-xs leading-tight opacity-90">
                                        {pendingAgentMessage.text}
                                      </p>
                                    ) : (
                                      <div className="flex items-center space-x-1">
                                        <div className="flex space-x-1">
                                          <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></div>
                                          <div
                                            className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                          ></div>
                                          <div
                                            className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-blue-200 ml-2">
                                          {agentTypingMessage}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Ultra Compact Quick Response Bar */}
                      {transcript.length > 0 && (
                        <div className="border-t border-gray-100 p-1.5 bg-gray-50">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-medium text-gray-600 flex-shrink-0">
                              Quick:
                            </span>
                            <div className="flex space-x-1 overflow-x-auto">
                              {[
                                "Thanks",
                                "Understand",
                                "Checking",
                                "Else?",
                              ].map((response, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    const messageText =
                                      response === "Thanks"
                                        ? "Thank you for holding"
                                        : response === "Understand"
                                        ? "I understand your concern"
                                        : response === "Checking"
                                        ? "Let me check that for you"
                                        : "Is there anything else I can help you with?";

                                    // Use realistic typing simulation instead of direct message
                                    simulateAgentTyping(
                                      messageText,
                                      1500 + Math.random() * 1000
                                    );
                                  }}
                                  disabled={agentIsTyping}
                                  className={`flex-shrink-0 px-1.5 py-0.5 text-xs border rounded transition-colors ${
                                    agentIsTyping
                                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                  }`}
                                >
                                  {response}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Agent Message Input Area */}
                      <div className="border-t border-gray-200 bg-white">
                        <div className="p-2">
                          <div className="flex items-center space-x-2">
                            {/* Agent Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  A
                                </span>
                              </div>
                            </div>

                            {/* Message Input */}
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={currentAgentMessage}
                                onChange={(e) => {
                                  setCurrentAgentMessage(e.target.value);

                                  // Show typing indicator when agent starts typing manually
                                  if (e.target.value && !isManuallyTyping) {
                                    setIsManuallyTyping(true);
                                    // Only show typing if not already in a simulation
                                    if (!agentIsTyping) {
                                      setAgentIsTyping(true);
                                      setAgentTypingMessage("typing...");
                                    }
                                  } else if (
                                    !e.target.value &&
                                    isManuallyTyping
                                  ) {
                                    setIsManuallyTyping(false);
                                    // Only clear typing if this was manual typing, not simulation
                                    if (agentIsTyping && !pendingAgentMessage) {
                                      setAgentIsTyping(false);
                                      setAgentTypingMessage("");
                                    }
                                  }
                                }}
                                onKeyPress={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    currentAgentMessage.trim() &&
                                    !pendingAgentMessage
                                  ) {
                                    handleSendAgentMessage();
                                  }
                                }}
                                disabled={pendingAgentMessage}
                                placeholder={
                                  pendingAgentMessage
                                    ? "Sending message..."
                                    : agentIsTyping && !isManuallyTyping
                                    ? "Agent responding..."
                                    : "Type your message..."
                                }
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  pendingAgentMessage
                                    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-white border-gray-300 hover:border-gray-400"
                                }`}
                              />

                              {/* Real-time typing indicator for other agents/customer */}
                              {isManuallyTyping && currentAgentMessage && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div
                                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "0.2s" }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Send Button */}
                            <button
                              onClick={handleSendAgentMessage}
                              disabled={
                                !currentAgentMessage.trim() ||
                                pendingAgentMessage
                              }
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                                !currentAgentMessage.trim() ||
                                pendingAgentMessage
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {pendingAgentMessage ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Sending</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                  </svg>
                                  <span>Send</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Message Status */}
                          {(isManuallyTyping ||
                            agentIsTyping ||
                            customerIsTyping) && (
                            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                              {agentIsTyping && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  <span>
                                    {pendingAgentMessage
                                      ? "Sending message..."
                                      : isManuallyTyping
                                      ? "You are typing..."
                                      : "Agent responding..."}
                                  </span>
                                </div>
                              )}
                              {customerIsTyping && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                  <span>Customer is typing...</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call Notes */}
                  <div className="border-t border-gray-200">
                    {/* Compact Header with Toggle */}
                    <div
                      className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setNotesExpanded(!notesExpanded)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            Call Notes
                          </h3>
                          {callNotes && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              {callNotes.length} chars
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {callNotes && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="Has notes"
                            ></div>
                          )}
                          <span className="text-gray-400 text-xs">
                            {notesExpanded ? "▼" : "▶"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Notes Content */}
                    {notesExpanded && (
                      <div className="p-3 space-y-2">
                        {/* Quick Templates */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {[
                            "Customer called about",
                            "Issue resolved:",
                            "Follow-up needed:",
                            "Escalated to:",
                            "Customer satisfied",
                          ].map((template) => (
                            <button
                              key={template}
                              onClick={() => {
                                const newText = callNotes
                                  ? callNotes + " " + template + " "
                                  : template + " ";
                                setCallNotes(newText);
                              }}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              title={`Add "${template}" to notes`}
                            >
                              {template}
                            </button>
                          ))}
                        </div>

                        {/* Smart Textarea */}
                        <div className="relative">
                          <textarea
                            value={callNotes}
                            onChange={(e) => setCallNotes(e.target.value)}
                            placeholder="Type notes... Use Ctrl+Enter to save quickly"
                            className="w-full min-h-[60px] max-h-32 p-2 text-xs border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            style={{
                              height:
                                Math.max(
                                  60,
                                  Math.min(
                                    128,
                                    callNotes.split("\n").length * 20 + 20
                                  )
                                ) + "px",
                            }}
                            onKeyDown={(e) => {
                              if (e.ctrlKey && e.key === "Enter") {
                                // Quick save functionality
                                e.preventDefault();
                                // Could trigger save logic here
                              }
                            }}
                          />

                          {/* Character Counter */}
                          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                            {callNotes.length}/500
                          </div>
                        </div>

                        {/* Compact Action Bar */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex space-x-1">
                            {/* Quick Tags */}
                            <button
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center"
                              title="Add priority tag"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              Priority
                            </button>
                            <button
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center"
                              title="Mark as follow-up required"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              Follow-up
                            </button>
                            <button
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center"
                              title="Add to knowledge base"
                            >
                              <Database className="w-3 h-3 mr-1" />
                              KB
                            </button>
                          </div>

                          {/* Save Button */}
                          <div className="flex space-x-1">
                            <button
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                              title="Save notes (Ctrl+Enter)"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </button>
                          </div>
                        </div>

                        {/* Timestamp */}
                        {callNotes && (
                          <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                            Last updated: {new Date().toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Call Resolution */}
                  <div className="border-t border-gray-200">
                    {/* Compact Header with Status and Toggle */}
                    <div
                      className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setResolutionExpanded(!resolutionExpanded)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            Call Resolution
                          </h3>
                          {/* Progress Indicator */}
                          <div className="flex space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                resolutionStatus
                                  ? "bg-green-400"
                                  : "bg-gray-300"
                              }`}
                              title="Status set"
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                resolutionCategory
                                  ? "bg-green-400"
                                  : "bg-gray-300"
                              }`}
                              title="Category set"
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                resolutionSummary
                                  ? "bg-green-400"
                                  : "bg-gray-300"
                              }`}
                              title="Summary added"
                            ></div>
                          </div>

                          {/* Auto-fill Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              autoPopulateResolution();
                            }}
                            disabled={isAutoPopulating}
                            className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                              isAutoPopulating
                                ? "bg-blue-200 text-blue-600 cursor-not-allowed"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
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
                                <span>AI Fill</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Status Badge */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              resolutionStatus === "resolved"
                                ? "bg-green-100 text-green-800"
                                : resolutionStatus === "escalated"
                                ? "bg-red-100 text-red-800"
                                : resolutionStatus === "follow-up"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {resolutionStatus || "Pending"}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {resolutionExpanded ? "▼" : "▶"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Resolution Content */}
                    {resolutionExpanded && (
                      <div className="p-3 space-y-3">
                        {/* Quick Status Pills */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            "resolved",
                            "escalated",
                            "follow-up",
                            "pending",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() => setResolutionStatus(status)}
                              className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                                resolutionStatus === status
                                  ? status === "resolved"
                                    ? "bg-green-500 text-white shadow-sm"
                                    : status === "escalated"
                                    ? "bg-red-500 text-white shadow-sm"
                                    : status === "follow-up"
                                    ? "bg-yellow-500 text-white shadow-sm"
                                    : "bg-gray-500 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {status === "follow-up"
                                ? "Follow-up"
                                : status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                            </button>
                          ))}
                        </div>

                        {/* Compact Category and Summary Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Category Dropdown */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Category
                            </label>
                            <select
                              value={resolutionCategory}
                              onChange={(e) =>
                                setResolutionCategory(e.target.value)
                              }
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="technical-support">
                                Technical
                              </option>
                              <option value="billing-inquiry">Billing</option>
                              <option value="service-request">Service</option>
                              <option value="account-management">
                                Account
                              </option>
                              <option value="complaint-resolution">
                                Complaint
                              </option>
                              <option value="product-information">
                                Product Info
                              </option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* Customer Satisfaction */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Satisfaction
                            </label>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  onClick={() =>
                                    setCustomerSatisfaction(rating)
                                  }
                                  className={`p-1 transition-colors ${
                                    customerSatisfaction >= rating
                                      ? "text-yellow-400"
                                      : "text-gray-300 hover:text-yellow-300"
                                  }`}
                                >
                                  <Star className="w-4 h-4 fill-current" />
                                </button>
                              ))}
                              {customerSatisfaction && (
                                <span className="text-xs text-gray-600 ml-1">
                                  {customerSatisfaction}/5
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Resolution Summary */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Resolution Summary
                          </label>
                          <textarea
                            value={resolutionSummary}
                            onChange={(e) =>
                              setResolutionSummary(e.target.value)
                            }
                            placeholder="Brief description of resolution..."
                            className="w-full min-h-[60px] max-h-24 p-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{
                              height:
                                Math.max(
                                  60,
                                  Math.min(
                                    96,
                                    resolutionSummary.split("\n").length * 20 +
                                      20
                                  )
                                ) + "px",
                            }}
                          />
                          <div className="text-xs text-gray-400 mt-1">
                            {resolutionSummary.length}/250 chars
                          </div>
                        </div>

                        {/* Follow-up Section - Compact */}
                        {resolutionStatus === "follow-up" && (
                          <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                id="followUpRequired"
                                checked={followUpRequired}
                                onChange={(e) =>
                                  setFollowUpRequired(e.target.checked)
                                }
                                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                              />
                              <label
                                htmlFor="followUpRequired"
                                className="text-xs font-medium text-gray-700"
                              >
                                Schedule Follow-up
                              </label>
                            </div>
                            {followUpRequired && (
                              <input
                                type="date"
                                value={followUpDate}
                                onChange={(e) =>
                                  setFollowUpDate(e.target.value)
                                }
                                className="w-full p-2 text-sm border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500"
                                min={new Date().toISOString().split("T")[0]}
                              />
                            )}
                          </div>
                        )}

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={generateResolutionFromTranscript}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center space-x-1"
                            disabled={transcript.length === 0}
                            title="Generate from transcript"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Transcript</span>
                          </button>

                          <button
                            onClick={suggestResolutionFromAI}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center space-x-1"
                            disabled={aiSuggestions.length === 0}
                            title="AI suggestions"
                          >
                            <Bot className="w-3 h-3" />
                            <span>AI</span>
                          </button>

                          <button
                            onClick={() => {
                              setResolutionStatus("");
                              setResolutionSummary("");
                              setResolutionCategory("");
                              setFollowUpRequired(false);
                              setFollowUpDate("");
                              setCustomerSatisfaction(null);
                            }}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            Clear
                          </button>

                          <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Save Draft
                          </button>
                        </div>

                        {/* Complete Resolution Button */}
                        <button
                          className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                            resolutionStatus && resolutionSummary
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!resolutionStatus || !resolutionSummary}
                          onClick={handleCompleteResolution}
                        >
                          {resolutionStatus === "resolved"
                            ? "✓ Complete Resolution"
                            : resolutionStatus === "escalated"
                            ? "↗ Escalate Case"
                            : resolutionStatus === "follow-up"
                            ? "📅 Schedule Follow-up"
                            : "Complete Resolution"}
                        </button>

                        {/* Compact Resolution Preview */}
                        {resolutionStatus && resolutionSummary && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs border">
                            <div className="font-medium text-gray-700 mb-1">
                              Preview:
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">
                                {resolutionStatus.replace("-", " ")}
                              </span>
                              {resolutionCategory && (
                                <span>
                                  {" "}
                                  • {resolutionCategory.replace("-", " ")}
                                </span>
                              )}
                              {customerSatisfaction && (
                                <span> • {customerSatisfaction}⭐</span>
                              )}
                              {followUpRequired && followUpDate && (
                                <span> • Follow-up: {followUpDate}</span>
                              )}
                            </div>
                            <div className="text-gray-700 mt-1 whitespace-pre-wrap">
                              {resolutionSummary}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Session Data Management Panel */}
                  {/* <div className="border-t border-gray-200">
                    <div className="p-3 bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">
                          Session Data Management
                        </h4>
                        <Database className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const stats = getSessionStatistics();
                            if (stats) {
                              alert(
                                `Session Statistics:\n\nTotal Sessions: ${
                                  stats.totalSessions
                                }\nAvg Completeness: ${
                                  stats.avgCompleteness
                                }%\nAvg Satisfaction: ${
                                  stats.avgSatisfaction || "N/A"
                                }\n\nResolution Status:\n${Object.entries(
                                  stats.resolutionStats
                                )
                                  .map(
                                    ([status, count]) => `${status}: ${count}`
                                  )
                                  .join("\n")}`
                              );
                            } else {
                              alert("No session statistics available.");
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
                            alert(
                              `Cleanup completed!\n\nRemoved: ${result.removed} old sessions\nRemaining: ${result.remaining} sessions`
                            );
                          }}
                          className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                        >
                          Cleanup (30d)
                        </button>
                        <button
                          onClick={() => {
                            const savedSessions = getSavedSessions();
                            console.log("All saved sessions:", savedSessions);
                            alert(
                              `Found ${savedSessions.length} saved session(s). Check console for details.`
                            );
                          }}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                        >
                          List All
                        </button>
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        💡 Each completed resolution automatically saves to JSON
                        file & localStorage
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Right Panel - Knowledge Base */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-fit">
                  {/* Compact Header with Search and Stats */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Knowledge Hub
                      </h3>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            if (customerData?.issue || selectedOption) {
                              rateLimitedGeminiCall(
                                fetchKnowledgeBaseFromGemini,
                                customerData?.issue || "general inquiry",
                                selectedOption,
                                customerData
                              );
                            }
                          }}
                          disabled={knowledgeBaseLoading}
                          className={`text-xs p-1 rounded transition-colors ${
                            knowledgeBaseLoading
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          }`}
                          title="Refresh knowledge base with AI"
                        >
                          {knowledgeBaseLoading ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </button>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                          {knowledgeBase.length}
                        </span>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          {knowledgeBase.length > 0
                            ? Math.round(
                                knowledgeBase.reduce(
                                  (sum, a) => sum + a.relevance,
                                  0
                                ) / knowledgeBase.length
                              )
                            : 0}
                          % avg
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Quick search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && searchQuery.trim()) {
                            rateLimitedGeminiCall(
                              fetchKnowledgeBaseFromGemini,
                              searchQuery.trim(),
                              null,
                              customerData
                            );
                          }
                        }}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Knowledge Base Results - Compact Cards */}
                  <div className="flex-1 overflow-hidden">
                    <div className="p-3 h-full">
                      <div className="space-y-2 h-full overflow-y-auto">
                        {knowledgeBase.map((article, index) => (
                          <div
                            key={index}
                            className={`p-2.5 rounded-md border transition-all hover:shadow-sm cursor-pointer group ${
                              article.type === "case_study"
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : article.type === "technical_guide"
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                : article.type === "service_guide"
                                ? "bg-purple-50 border-purple-200 hover:bg-purple-100"
                                : article.type === "analytics"
                                ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1.5">
                              <h4 className="text-xs font-medium text-gray-900 flex-1 pr-2 leading-tight">
                                {article.title}
                              </h4>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-bold text-green-600 min-w-0">
                                  {article.relevance}%
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-tight">
                              {article.content}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                {article.type && (
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded text-xs font-medium ${
                                      article.type === "case_study"
                                        ? "bg-blue-100 text-blue-700"
                                        : article.type === "technical_guide"
                                        ? "bg-green-100 text-green-700"
                                        : article.type === "service_guide"
                                        ? "bg-purple-100 text-purple-700"
                                        : article.type === "analytics"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {article.type
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded">
                                  <FileText className="w-3 h-3" />
                                </button>
                                <button className="text-xs text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded">
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions - Compact Grid */}
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Quick Actions
                      </h3>
                      <span className="text-xs text-gray-500">
                        Hotkeys: 1-4
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        title="Press 1 for Billing Transfer"
                        className="p-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center"
                      >
                        <span className="font-medium">1.</span>&nbsp;Billing
                      </button>
                      <button
                        title="Press 2 for Callback"
                        className="p-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors border border-green-200 flex items-center justify-center"
                      >
                        <span className="font-medium">2.</span>&nbsp;Callback
                      </button>
                      <button
                        title="Press 3 for Follow-up"
                        className="p-2 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors border border-purple-200 flex items-center justify-center"
                      >
                        <span className="font-medium">3.</span>&nbsp;Follow-up
                      </button>
                      <button
                        title="Press 4 for Escalation"
                        className="p-2 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors border border-orange-200 flex items-center justify-center"
                      >
                        <span className="font-medium">4.</span>&nbsp;Escalate
                      </button>
                    </div>
                  </div>

                  {/* Backend Services from IVR - Compact Overview */}
                  {backendDetails && backendDetails.length > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            IVR Services
                          </h3>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                              {successfulServices}/{totalBackendServices}
                            </span>
                            <span className="text-gray-500 bg-white px-2 py-0.5 rounded-full border">
                              {totalBackendTime}ms
                            </span>
                          </div>
                        </div>

                        {/* Compact Service List */}
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {backendDetails
                            .sort(
                              (a, b) =>
                                parseInt(b.TIME_TAKEN) - parseInt(a.TIME_TAKEN)
                            )
                            .map((service, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded text-xs border transition-all ${
                                  service.STATUS === "S"
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    {service.STATUS === "S" ? (
                                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                    ) : (
                                      <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0" />
                                    )}
                                    <span className="font-medium text-xs truncate">
                                      {service.SERVICE_NAME}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <span className="font-mono font-bold">
                                      {service.TIME_TAKEN}ms
                                    </span>
                                    {service.Average_Elapsed_Time_ms && (
                                      <span className="text-gray-600">
                                        (avg:{" "}
                                        {Math.round(
                                          service.Average_Elapsed_Time_ms
                                        )}
                                        ms)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Performance Summary - Compact */}
                        <div className="mt-2 p-2 bg-white rounded border">
                          <div className="grid grid-cols-3 gap-3 text-xs text-center">
                            <div>
                              <div className="font-bold text-green-600 text-sm">
                                {successfulServices}
                              </div>
                              <div className="text-gray-600">Success</div>
                            </div>
                            <div>
                              <div className="font-bold text-red-600 text-sm">
                                {failedServices}
                              </div>
                              <div className="text-gray-600">Failed</div>
                            </div>
                            <div>
                              <div className="font-bold text-blue-600 text-sm">
                                {Math.round(
                                  totalBackendTime / totalBackendServices
                                )}
                                ms
                              </div>
                              <div className="text-gray-600">Avg Time</div>
                            </div>
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

      {/* Sentiment Analysis Details Dialog - Enhanced UX */}
      <Dialog
        open={showSentimentDetailsDialog}
        onOpenChange={setShowSentimentDetailsDialog}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 to-white">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-lg ${
                      currentSentiment?.overallSentiment === "positive"
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                        : currentSentiment?.overallSentiment === "negative"
                        ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                        : "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                    }`}
                  >
                    {currentSentiment?.overallSentiment === "positive"
                      ? "😊"
                      : currentSentiment?.overallSentiment === "negative"
                      ? "😟"
                      : "😐"}
                  </div>
                  {escalationRisk === "high" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Customer Sentiment Analysis
                  </h2>
                  <p className="text-sm text-gray-500">
                    Real-time emotional intelligence insights
                  </p>
                </div>
              </div>

              {escalationRisk === "high" && (
                <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex items-center space-x-2 animate-pulse">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-red-800">
                    HIGH ESCALATION RISK
                  </span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {currentSentiment ? (
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6 p-1">
              {/* Executive Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Sentiment Card */}
                <div className="lg:col-span-2">
                  <div
                    className={`rounded-xl p-6 shadow-lg border-2 ${
                      currentSentiment.overallSentiment === "positive"
                        ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
                        : currentSentiment.overallSentiment === "negative"
                        ? "bg-gradient-to-br from-red-50 to-rose-100 border-red-200"
                        : "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Current Emotional State
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            currentSentiment.overallSentiment === "positive"
                              ? "bg-green-200 text-green-800"
                              : currentSentiment.overallSentiment === "negative"
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {currentSentiment.overallSentiment?.toUpperCase() ||
                            "NEUTRAL"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentSentiment.confidence}% confidence
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {(currentSentiment.sentimentScore * 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Sentiment Score
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {currentSentiment.customerState
                            ?.charAt(0)
                            .toUpperCase() +
                            currentSentiment.customerState?.slice(1) ||
                            "Unknown"}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Customer State
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <div
                          className={`text-2xl font-bold mb-1 ${
                            sentimentTrend === "improving"
                              ? "text-green-600"
                              : sentimentTrend === "declining"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {sentimentTrend === "improving"
                            ? "↗"
                            : sentimentTrend === "declining"
                            ? "↘"
                            : "→"}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">
                          Trend
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="space-y-4">
                  <div
                    className={`rounded-xl p-4 shadow-lg ${
                      escalationRisk === "high"
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                        : escalationRisk === "low"
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
                    }`}
                  >
                    <h4 className="font-bold text-sm mb-2">ESCALATION RISK</h4>
                    <div className="text-2xl font-bold mb-2">
                      {escalationRisk?.toUpperCase() || "MEDIUM"}
                    </div>
                    <div className="text-xs opacity-90">
                      {escalationRisk === "high" &&
                        "Immediate attention required"}
                      {escalationRisk === "low" && "Conversation going well"}
                      {escalationRisk === "medium" && "Monitor closely"}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-3">
                      QUICK ACTIONS
                    </h4>
                    <div className="space-y-2">
                      {escalationRisk === "high" && (
                        <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                          🚨 Escalate to Supervisor
                        </button>
                      )}
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        💬 Use Recommended Response
                      </button>
                      <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        📝 Add to Call Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Section */}
              {aiSuggestions
                .filter(
                  (suggestion) => suggestion.source === "gemini_sentiment"
                )
                .slice(-1)
                .map((suggestion, index) => {
                  const analysisText = suggestion.text.replace(
                    "😊 Customer Sentiment: ",
                    ""
                  );

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                            <h3 className="text-lg font-bold">
                              AI Emotional Intelligence Analysis
                            </h3>
                          </div>
                          <div className="text-sm opacity-75">
                            Updated{" "}
                            {new Date(
                              suggestion.timestamp
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="prose prose-lg max-w-none">
                          {analysisText.split("\n").map((line, lineIndex) => {
                            const trimmedLine = line.trim();

                            if (
                              trimmedLine.startsWith("**") &&
                              trimmedLine.endsWith("**")
                            ) {
                              return (
                                <div key={lineIndex} className="mb-4">
                                  <h4 className="text-lg font-bold text-gray-900 border-l-4 border-blue-500 pl-4 mb-2">
                                    {trimmedLine.replace(/\*\*/g, "")}
                                  </h4>
                                </div>
                              );
                            } else if (
                              trimmedLine.startsWith("* **") ||
                              trimmedLine.startsWith("*")
                            ) {
                              return (
                                <div key={lineIndex} className="mb-3 ml-4">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p
                                      className="text-gray-700 leading-relaxed flex-1"
                                      dangerouslySetInnerHTML={{
                                        __html: trimmedLine
                                          .replace(/^\*\s*/, "")
                                          .replace(
                                            /\*\*(.*?)\*\*/g,
                                            "<strong class='text-gray-900'>$1</strong>"
                                          ),
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            } else if (trimmedLine.length > 0) {
                              return (
                                <p
                                  key={lineIndex}
                                  className="text-gray-700 leading-relaxed mb-4 text-base"
                                  dangerouslySetInnerHTML={{
                                    __html: trimmedLine.replace(
                                      /\*\*(.*?)\*\*/g,
                                      "<strong class='text-gray-900'>$1</strong>"
                                    ),
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Action Center */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Action Center</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Analysis Actions
                    </h4>
                    <button className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span className="font-medium">Mark as Helpful</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Mark as Reviewed</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Data Management
                    </h4>
                    <button
                      onClick={() =>
                        rateLimitedGeminiCall(
                          analyzeSentimentWithGemini,
                          transcript,
                          "manual"
                        )
                      }
                      disabled={sentimentAnalysisLoading}
                      className="w-full px-4 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="font-medium">Refresh Analysis</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium">Export Report</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Communication
                    </h4>
                    <button className="w-full px-4 py-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="font-medium">Share with Team</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span className="font-medium">Add Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-6">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Sentiment Data Available
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start analyzing customer emotions to gain valuable insights that
                help improve service quality and customer satisfaction.
              </p>
              <button
                onClick={() =>
                  rateLimitedGeminiCall(
                    analyzeSentimentWithGemini,
                    transcript,
                    "manual"
                  )
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
                disabled={sentimentAnalysisLoading}
              >
                🚀 Generate Sentiment Analysis
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactCenterUI;
