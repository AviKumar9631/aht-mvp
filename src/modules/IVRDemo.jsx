import React, { useState, useEffect } from 'react';
import { Phone, User, Bot, MessageSquare, Clock, CheckCircle, AlertCircle, Settings, Mic, PhoneCall, Activity, X, ChevronRight, Zap, Database, Brain } from 'lucide-react';
import TN_DATA from '../utils/TN_DATA.json';
import CONTACT_DRIVER from '../utils/CONTACT_DRIVER.json';
import AGENT_DATA from '../utils/AGENT_DATA.json';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import ahtSampleData from '../utils/aht-sample.json';


const IVRDemo = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [routedAgent, setRoutedAgent] = useState(null);
  const [callStatus, setCallStatus] = useState('waiting');
  const [showEngines, setShowEngines] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [showActivityPanel, setShowActivityPanel] = useState(true);
  const [backendDetails, setBackendDetails] = useState([]);
  const [loadingServices, setLoadingServices] = useState(new Set());
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Function to store IVR session data to localStorage
  const storeIVRSessionData = () => {
    const ivrSessionData = {
      // Basic call information
      phoneNumber,
      selectedOption,
      callStatus,
      callDuration,
      sessionId: `ivr_${Date.now()}`,
      timestamp: new Date().toISOString(),
      
      // Customer information
      customerData,
      
      // Agent routing information
      routedAgent,
      selectedCategory: selectedOption,
      categoryMapping: categoryMapping[selectedOption] || selectedOption,
      
      // Backend service details
      backendDetails: backendDetails.map(service => ({
        ...service,
        // Clean up any circular references or non-serializable data
        loadedAt: service.loadedAt
      })),
      
      // Activity log for debugging/audit trail
      activityLog: activityLog.slice(0, 20), // Keep last 20 entries
      
      // Additional metadata
      totalBackendServices: backendDetails.length,
      successfulServices: backendDetails.filter(s => s.STATUS === 'S').length,
      failedServices: backendDetails.filter(s => s.STATUS !== 'S').length,
      totalBackendTime: backendDetails.length > 0 ? Math.max(...backendDetails.map(s => parseInt(s.TIME_TAKEN || 0))) : 0, // Parallel time
      sequentialBackendTime: backendDetails.reduce((sum, s) => sum + parseInt(s.TIME_TAKEN || 0), 0), // Keep for comparison
      
      // Agent matching info
      agentMatchScore: routedAgent?.matchPercentage || null,
      availableAgentsCount: selectedOption ? getAgentsForCategory(selectedOption).length : 0
    };
    
    try {
      localStorage.setItem('ivrSessionData', JSON.stringify(ivrSessionData));
      localStorage.setItem('lastIVRSession', new Date().toISOString());
      console.log('IVR session data stored to localStorage:', ivrSessionData);
      
      // Also store a summary for quick access
      const sessionSummary = {
        phoneNumber,
        customerName: customerData?.name || 'Unknown',
        agentName: routedAgent?.name || 'Not routed',
        category: selectedOption,
        timestamp: new Date().toISOString(),
        callDuration,
        sessionId: ivrSessionData.sessionId
      };
      localStorage.setItem('ivrSessionSummary', JSON.stringify(sessionSummary));
      
      return true;
    } catch (error) {
      console.error('Error storing IVR session data:', error);
      return false;
    }
  };

  // Function to add activity log entry
  const addActivityLog = (type, message, status = 'success', duration = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog(prev => [{
      id: Date.now(),
      type,
      message,
      status,
      duration,
      timestamp
    }, ...prev.slice(0, 19)]); // Keep last 20 entries
  };

  // Function to call the agent assist API
  const callAgentAssistAPI = async (phoneNumber) => {
    try {
      setApiLoading(true);
      addActivityLog('api', 'Calling Agent Assist API...', 'processing');

      // Create IVR interaction transcript based on current session
      const ivrTranscript = [];
      
      // Add system greeting
      ivrTranscript.push({
        speaker: "IVR System",
        text: `Thank you for calling. I see you're calling from ${phoneNumber}.`,
        time: new Date().toLocaleTimeString(),
        isSystem: true
      });

      // Add customer selection
      if (selectedOption) {
        ivrTranscript.push({
          speaker: "Customer",
          text: `Selected option: ${selectedOption}`,
          time: new Date().toLocaleTimeString()
        });
      }

      // Add customer identification if available
      if (customerData) {
        ivrTranscript.push({
          speaker: "IVR System",
          text: `Customer identified: ${customerData.name}, Account: ${customerData.accountNumber}`,
          time: new Date().toLocaleTimeString(),
          isSystem: true
        });
      }

      // Add agent routing information
      if (routedAgent) {
        ivrTranscript.push({
          speaker: "IVR System",
          text: `Routing to ${routedAgent.name} in ${routedAgent.dept} department (${routedAgent.matchPercentage}% match)`,
          time: new Date().toLocaleTimeString(),
          isSystem: true
        });
      }

      // Add backend services information
      if (backendDetails.length > 0) {
        ivrTranscript.push({
          speaker: "IVR System",
          text: `Pre-loaded ${backendDetails.filter(s => s.STATUS === 'S').length} backend services: ${backendDetails.filter(s => s.STATUS === 'S').map(s => s.SERVICE_NAME).join(', ')}`,
          time: new Date().toLocaleTimeString(),
          isSystem: true
        });
      }

      // Create the payload structure similar to aht-sample.json
      const payload = {
        callInfo: {
          status: "active",
          duration: callDuration,
          startTime: new Date(Date.now() - callDuration * 1000).toISOString(),
          endTime: new Date().toISOString(),
          isRecording: true,
          isMuted: false,
          sessionId: `ivr_${Date.now()}`
        },
        customerInfo: {
          data: customerData || {
            name: "Unknown Customer",
            accountNumber: "N/A",
            tier: "Standard",
            balance: "$0.00",
            lastPayment: "N/A",
            issues: [selectedOption || "General Inquiry"],
            callHistory: 1,
            phone: phoneNumber,
            issue: selectedOption || "General Inquiry",
            sentiment: "neutral"
          },
          phoneNumber: phoneNumber,
          issue: selectedOption || "General Inquiry",
          selectedOption: selectedOption || "General Inquiry",
          categoryMapping: selectedOption || "General Inquiry"
        },
        agentInfo: routedAgent ? {
          routedAgent: routedAgent,
          agentMatchScore: routedAgent.matchPercentage,
          availableAgentsCount: getAgentsForCategory(selectedOption).length
        } : null,
        backendData: {
          details: backendDetails
        },
        conversationData: {
          transcript: ivrTranscript,
          searchQuery: ""
        },
        performanceMetrics: {
          timingSavings: {
            preFetchedTime: backendDetails.reduce((sum, service) => sum + parseInt(service.TIME_TAKEN || 0), 0) / 1000,
            servicesPreFetched: backendDetails.length,
            totalSaved: backendDetails.length > 0 ? 
              (backendDetails.reduce((sum, service) => sum + parseInt(service.TIME_TAKEN || 0), 0) - 
               Math.max(...backendDetails.map(service => parseInt(service.TIME_TAKEN || 0)))) / 1000 : 0
          },
          showOptimizationDemo: true
        },
        // API-specific fields
        transcript: ivrTranscript
          .filter(entry => !entry.isSystem && entry.speaker && entry.text)
          .map(entry => `${entry.speaker}: ${entry.text}`)
          .join('\n') || `Customer called from ${phoneNumber} regarding ${selectedOption || 'general inquiry'}`,
        telephone_number: phoneNumber,
        customer_account_id: customerData?.accountNumber || null
      };

      addActivityLog('api', `Sending payload with ${ivrTranscript.length} transcript entries`, 'processing');

      const response = await fetch('http://localhost:8000/process_transcript/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      addActivityLog('api', 'Agent Assist API call successful', 'success', `${response.headers.get('x-response-time') || 'unknown'}ms`);
      addActivityLog('ai', `Intent: ${data.intent}`, 'success');
      addActivityLog('ai', `Sentiment: ${data.sentiment_analysis?.sentiment || 'unknown'}`, 'success');
      
      return data;
    } catch (error) {
      console.error('Agent Assist API call failed:', error);
      addActivityLog('api', `Agent Assist API call failed: ${error.message}`, 'error');
      throw error;
    } finally {
      setApiLoading(false);
    }
  };

  // Function to handle transfer to contact center
  const handleTransferToContactCenter = async () => {
    try {
      // Store IVR session data first
      const success = storeIVRSessionData();
      if (success) {
        addActivityLog('system', 'Session data saved to localStorage', 'success');
      } else {
        addActivityLog('system', 'Failed to save session data', 'error');
      }

      // Make API call with the current IVR session data
      if (phoneNumber) {
        await callAgentAssistAPI(phoneNumber);
      }

      // Navigate to contact center
      navigate('/contact-center');
    } catch (error) {
      console.error('Transfer failed:', error);
      // Still navigate even if API call fails
      navigate('/contact-center');
    }
  };

  // Function to simulate an async backend API call
  const simulateBackendCall = (service, tn, index) => {
    return new Promise((resolve) => {
      const timeTaken = parseInt(service.TIME_TAKEN) || 1000;
      const serviceName = service.SERVICE_NAME;
      
      // Add processing log immediately
      setTimeout(() => {
        addActivityLog('api', `Fetching ${serviceName}...`, 'processing');
      }, index * 50); // Slight stagger for UI clarity
      
      // Simulate the actual API call delay
      setTimeout(() => {
        const serviceResult = {
          ...service,
          id: `${tn}-${index}`,
          loadedAt: Date.now(),
          actualLoadTime: timeTaken
        };
        
        resolve(serviceResult);
      }, timeTaken);
    });
  };

  // Function to load backend details for a phone number (now async and parallel)
  const loadBackendDetails = async (tn) => {
    // Find the TN data
    const tnData = TN_DATA?.backend?.find(item => item.tn === tn);
    
    if (!tnData || !tnData.backendDetail) {
      addActivityLog('api', `No backend data found for ${tn}`, 'error');
      setBackendDetails([]);
      return;
    }

    // Clear previous data
    setBackendDetails([]);
    setLoadingServices(new Set());
    
    // Add initial log
    addActivityLog('api', `Loading ${tnData.backendDetail.length} backend services for ${tn}...`, 'processing');
    addActivityLog('system', `Starting parallel backend calls`, 'success');
    
    // Set all services as loading initially
    const allServiceNames = tnData.backendDetail.map(service => service.SERVICE_NAME);
    setLoadingServices(new Set(allServiceNames));
    
    try {
      // Create all API call promises
      const apiCalls = tnData.backendDetail.map((service, index) => 
        simulateBackendCall(service, tn, index)
      );
      
      // Start timing for parallel execution
      const startTime = Date.now();
      addActivityLog('system', `Initiating ${apiCalls.length} parallel API calls`, 'processing');
      
      // Execute all calls in parallel and handle results as they complete
      const results = await Promise.allSettled(apiCalls);
      
      const totalParallelTime = Date.now() - startTime;
      addActivityLog('system', `All parallel calls completed in ${totalParallelTime}ms`, 'success');
      
      // Process results
      const successfulServices = [];
      const failedServices = [];
      
      results.forEach((result, index) => {
        const serviceName = tnData.backendDetail[index].SERVICE_NAME;
        
        // Remove from loading set
        setLoadingServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(serviceName);
          return newSet;
        });
        
        if (result.status === 'fulfilled') {
          const service = result.value;
          successfulServices.push(service);
          
          // Add to backend details
          setBackendDetails(prev => [...prev, service]);
          
          // Add success log
          const statusText = service.STATUS === 'S' ? 'Success' : 'Failed';
          addActivityLog('api', `${serviceName} loaded (${statusText})`, 
            service.STATUS === 'S' ? 'success' : 'warning', `${service.actualLoadTime}ms`);
          
          // Check if customer data can be extracted from Product Info service
          if (serviceName === 'Product Info' && service.RESPONSE_XML?.RxPSProductInfoResponse?.CustomerServiceRecord) {
            const customerRecord = service.RESPONSE_XML.RxPSProductInfoResponse.CustomerServiceRecord;
            setCustomerData({
              name: customerRecord.BillingName || 'Unknown Customer',
              accountNumber: customerRecord.BAN || 'N/A',
              tier: customerRecord.CustomerType || 'Standard',
              balance: '$0.00', // This would come from another service
              lastPayment: 'N/A',
              issues: ['Service Inquiry'],
              callHistory: 1
            });
            if (callStatus !== 'routed') {
              setCallStatus('connected');
            }
            addActivityLog('system', `Customer identified: ${customerRecord.BillingName}`, 'success');
          }
        } else {
          failedServices.push(serviceName);
          addActivityLog('api', `${serviceName} failed to load`, 'error');
        }
      });
      
      // Log summary
      addActivityLog('system', 
        `Backend loading complete: ${successfulServices.length} successful, ${failedServices.length} failed`, 
        failedServices.length === 0 ? 'success' : 'warning'
      );
      
    } catch (error) {
      console.error('Error loading backend services:', error);
      addActivityLog('system', 'Error during parallel backend loading', 'error');
      setLoadingServices(new Set());
    }
  };

  // Mock customer database
  const customerDatabase = {
    '+1234567890': {
      name: 'John Smith',
      accountNumber: 'ACC-789123',
      tier: 'Premium',
      balance: '$2,450.00',
      lastPayment: '2024-01-15',
      issues: ['Billing Inquiry'],
      callHistory: 3
    },
    '+1987654321': {
      name: 'Sarah Johnson',
      accountNumber: 'ACC-456789',
      tier: 'Standard',
      balance: '$890.50',
      lastPayment: '2024-01-20',
      issues: ['Technical Support'],
      callHistory: 1
    },
    '+1555123456': {
      name: 'Michael Chen',
      accountNumber: 'ACC-321654',
      tier: 'Business',
      balance: '$5,720.00',
      lastPayment: '2024-01-22',
      issues: ['Account Changes'],
      callHistory: 7
    }
  };

  const ivrOptions = CONTACT_DRIVER.IVR_Categories?.map(a => (
    {
      value: a.category_name,
      label: a.category_name,
    }
  ));

  const aiEngines = [
    { name: 'Speech Recognition', status: 'active', accuracy: '98.5%', model: 'Whisper-v3' },
    { name: 'Intent Classification', status: 'active', confidence: '94.2%', model: 'BERT-Large' },
    { name: 'Customer Sentiment', status: 'active', score: 'Neutral', model: 'RoBERTa' },
    { name: 'Agent Routing', status: 'processing', match: '89.7%', model: 'Custom-ML' },
    { name: 'Queue Optimization', status: 'standby', waitTime: '2.3min', model: 'Prophet' }
  ];

  // Mapping IVR categories to agent categories
  const categoryMapping = {
    'billing_&_payments': 'Billing & Payments',
    'technical_support_-_internet': 'Technical Support - Internet',
    'technical_support_-_phone/voice': 'Technical Support - Phone/Voice',
    'service_management_&_orders': 'Service Management & Orders',
    'equipment': 'Equipment',
    'customer_service_&_account': 'Customer Service & Account',
    'outages_&_technician_visits': 'Technical Support - Internet', // Map to general technical
    'specialized_programs/requests': 'Specialized Programs/Requests',
    'general_inquiries/routing': 'General Inquiries/Routing',
    'agent_interaction_(direct_transfer/request)': 'Agent Interaction (Direct Transfer/Request)'
  };

  // Function to get available agents for a category
  const getAgentsForCategory = (selectedCategory) => {
    console.log('Selected Category:', selectedCategory);
    // const agentCategory = categoryMapping[selectedCategory];
    if (!selectedCategory) return [];
    
    return AGENT_DATA.agents.filter(agent => 
      agent.agentCategory === selectedCategory && 
      (agent.status === 'IDLE')
    ).map(agent => ({
      id: agent.agentId,
      name: agent.agentName,
      dept: agent.agentCategory,
      experience: `${agent.performance.thisWeek.callsHandled} calls this week`,
      availability: agent.status,
      performance: agent.performance.today,
      skillSet: agent.skillSet
    }));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'api': return <Database className="w-4 h-4 text-blue-600" />;
      case 'ai': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'system': return <Zap className="w-4 h-4 text-green-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'processing': return 'border-l-yellow-500 bg-yellow-50 animate-pulse';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 3) {
      addActivityLog('api', 'Validating phone number format...', 'processing');
      
      const validateAndLoad = async () => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Validation delay
        addActivityLog('api', 'Phone number validated', 'success', '300ms');
        // Load backend details for this TN (now async)
        await loadBackendDetails(phoneNumber);
      };
      
      validateAndLoad().catch(error => {
        console.error('Error during phone number validation and loading:', error);
        addActivityLog('system', 'Error during backend loading process', 'error');
      });
    } else {
      // Clear data when phone number is empty or too short
      setBackendDetails([]);
      setLoadingServices(new Set());
      setCustomerData(null);
      setCallStatus('waiting');
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (selectedOption && customerData) {
      setCallStatus('routing');
      addActivityLog('ai', 'Speech Recognition: Whisper-v3', 'success', '89ms');
      addActivityLog('ai', 'Intent Classification: BERT-Large', 'processing');
      
      setTimeout(() => {
        addActivityLog('ai', `Intent detected: ${selectedOption}`, 'success', '156ms');
        addActivityLog('api', 'GET /api/agents/available', 'processing');
        
        setTimeout(() => {
          const availableAgents = getAgentsForCategory(selectedOption);
          
          if (availableAgents.length === 0) {
            addActivityLog('api', 'No agents available in category', 'warning', '67ms');
            addActivityLog('system', 'Routing to general queue', 'warning');
            setCallStatus('routing');
            return;
          }
          
          // Select best agent based on performance (lowest AHT with good FCR)
          const bestAgent = availableAgents.reduce((best, current) => {
            const bestScore = (best.performance.firstCallResolutionPercentage / 100) - (best.performance.averageHandleTimeSeconds / 1000);
            const currentScore = (current.performance.firstCallResolutionPercentage / 100) - (current.performance.averageHandleTimeSeconds / 1000);
            return currentScore > bestScore ? current : best;
          }, availableAgents[0]);
          
          // Calculate match percentage based on agent performance and category fit
          const calculateMatchPercentage = (agent) => {
            const fcrWeight = 0.4; // First Call Resolution weight
            const ahtWeight = 0.3; // Average Handle Time weight (lower is better)
            const skillWeight = 0.3; // Skill match weight
            
            const fcrScore = agent.performance.firstCallResolutionPercentage / 100;
            const ahtScore = Math.max(0, (600 - agent.performance.averageHandleTimeSeconds) / 600); // Normalize AHT (10min max)
            const skillScore = agent.skillSet ? 
              agent.skillSet.some(skill => skill.toLowerCase().includes(selectedOption.toLowerCase().split('_')[0])) ? 1 : 0.7 
              : 0.8;
            
            const totalScore = (fcrScore * fcrWeight) + (ahtScore * ahtWeight) + (skillScore * skillWeight);
            return Math.min(98, Math.max(75, Math.round(totalScore * 100))); // Cap between 75-98%
          };
          
          const matchPercentage = calculateMatchPercentage(bestAgent);
          bestAgent.matchPercentage = matchPercentage;
          
          addActivityLog('api', 'Agent availability retrieved', 'success', '67ms');
          addActivityLog('ai', 'Running routing optimization...', 'processing');
          
          setTimeout(() => {
            addActivityLog('ai', 'Routing Model: Custom-ML', 'success', '234ms');
            addActivityLog('ai', `Agent match score: ${matchPercentage}%`, 'success');
            addActivityLog('api', 'POST /api/routing/assign', 'success', '45ms');
            setRoutedAgent(bestAgent);
            setCallStatus('routed');
            addActivityLog('system', `Routed to ${bestAgent.name} (${bestAgent.dept})`, 'success');
          }, 800);
        }, 400);
      }, 600);
    }
  }, [selectedOption, customerData]);

  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 3) {
      const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Reset timer when phone number is cleared
      setCallDuration(0);
    }
  }, [phoneNumber]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'routing': return 'text-yellow-600';
      case 'routed': return 'text-blue-600';
      case 'unknown': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl shadow-lg ${getStatusColor(callStatus).replace('text-', 'bg-').replace('-600', '-100')} border ${getStatusColor(callStatus).replace('text-', 'border-').replace('-600', '-200')}`}>
                <PhoneCall className={`w-6 h-6 ${getStatusColor(callStatus)}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IVR System</h1>
                <div className="flex items-center space-x-6 text-sm mt-1">
                  <div className={`flex items-center space-x-2 ${getStatusColor(callStatus)}`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    <span className="font-medium">
                      {callStatus === 'waiting' && 'Standby'}
                      {callStatus === 'connected' && 'Connected'}
                      {callStatus === 'unknown' && 'Unknown'}
                      {callStatus === 'routing' && 'Routing...'}
                      {callStatus === 'routed' && 'Ready to Transfer'}
                    </span>
                  </div>
                  {(callDuration > 0 || phoneNumber) && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm font-medium">{formatDuration(callDuration)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowActivityPanel(!showActivityPanel)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${
                  showActivityPanel 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                title="Backend Activity"
              >
                <Database className="w-4 h-4 mr-2 inline" />
                Backend Activity
              </button>
              {backendDetails.length > 0 && (
                <div className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-lg border border-green-200">
                  <span className="font-medium text-green-700">
                    {backendDetails.filter(s => s.STATUS === 'S').length}/{backendDetails.length}
                  </span>
                  <span className="text-green-600 ml-1">services</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced AHT Optimization Summary */}
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-200">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AHT Impact Summary</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm rounded-full font-medium border border-orange-300">
                      LIVE ANALYSIS
                    </span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              {backendDetails.length > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    Saved: ~{Math.round((backendDetails.reduce((sum, service) => 
                      sum + parseInt(service.TIME_TAKEN || 0), 0) - 
                      Math.max(...backendDetails.map(service => parseInt(service.TIME_TAKEN || 0)))) / 1000)}s
                  </div>
                  <div className="text-sm text-gray-600">parallel vs sequential processing</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before */}
              <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-red-800 mb-3 flex items-center text-base">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Traditional (11+ min AHT)
                </h4>
                <div className="space-y-2 text-sm text-red-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Agent answers blind</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Fetch customer data (8-15s)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Read context (5-10s)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Start helping</span>
                  </div>
                </div>
              </div>

              {/* Current Process */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center text-base">
                  <Bot className="w-4 h-4 mr-2" />
                  IVR Pre-processing
                </h4>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center space-x-2 ${phoneNumber ? 'text-green-700' : 'text-blue-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${phoneNumber ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                    <span>{phoneNumber ? '✓' : '○'} Customer identified</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${backendDetails.length > 0 ? 'text-green-700' : 'text-blue-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${backendDetails.length > 0 ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                    <span>{backendDetails.length > 0 ? '✓' : '○'} {backendDetails.length} services pre-loaded</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${routedAgent ? 'text-green-700' : 'text-blue-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${routedAgent ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                    <span>{routedAgent ? '✓' : '○'} Agent matched ({routedAgent?.matchPercentage || 0}%)</span>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-green-800 mb-3 flex items-center text-base">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Optimized Result
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Context pre-loaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Agent starts immediately</span>
                  </div>
                  {backendDetails.length > 0 && (
                    <>
                      <div className="font-bold text-green-800 text-base mt-3">
                        New AHT: ~{Math.max(6, 11 - Math.round(Math.max(...backendDetails.map(service => 
                          parseInt(service.TIME_TAKEN || 0))) / 1000 / 60))} min
                      </div>
                      <div className="text-green-600">
                        {Math.round((1 - (Math.max(6, 11 - Math.round(Math.max(...backendDetails.map(service => 
                          parseInt(service.TIME_TAKEN || 0))) / 1000 / 60)) / 11)) * 100)}% improvement
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Button */}
            {callStatus === 'routed' && backendDetails.length > 0 && (
              <div className="mt-4 flex items-center justify-center">
                <Button 
                  onClick={handleTransferToContactCenter}
                  disabled={apiLoading}
                  className="w-full mt-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {apiLoading ? (
                    <>
                      <div className="w-4 h-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Transfer to Contact Center
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                        {backendDetails.filter(s => s.STATUS === 'S').length} services ready
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Backend Activity Panel - Compact */}
          {showActivityPanel && (
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold">Backend Services</h3>
                  {backendDetails.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {backendDetails.filter(s => s.STATUS === 'S').length}/{backendDetails.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowActivityPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              {phoneNumber ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {backendDetails.length === 0 && loadingServices.size === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Database className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No data available</p>
                    </div>
                  ) : (
                    <>
                      {/* Loading Services - Compact */}
                      {Array.from(loadingServices).map(serviceName => (
                        <div key={`loading-${serviceName}`} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-yellow-800 truncate">{serviceName}</span>
                          </div>
                          <div className="w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ))}
                      
                      {/* Loaded Services - Compact */}
                      {backendDetails
                        .sort((a, b) => a.loadedAt - b.loadedAt)
                        .map(service => (
                        <div key={service.id} className={`flex items-center justify-between p-2 rounded border ${
                          service.STATUS === 'S' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              service.STATUS === 'S' ? 'bg-green-600' : 'bg-red-600'
                            }`}></div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-medium truncate ${
                                service.STATUS === 'S' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {service.SERVICE_NAME}
                              </p>
                              <p className={`text-xs ${
                                service.STATUS === 'S' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {service.TIME_TAKEN}ms
                              </p>
                            </div>
                          </div>
                          <div className={`text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                            service.STATUS === 'S' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {service.STATUS === 'S' ? '✓' : '✗'}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Phone className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Enter phone number</p>
                </div>
              )}
            </div>
          )}

          {/* Main IVR Interface - Compact */}
          <div className={`${showActivityPanel ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
            {/* Phone Input & IVR Options Combined */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-semibold">Call Processing</h2>
              </div>
              
              <div className="space-y-3">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {TN_DATA?.backend?.map(a => a.tn).map(num => (
                      <button
                        key={num}
                        onClick={() => setPhoneNumber(num)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded font-mono"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* IVR Options */}
                {phoneNumber && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Customer Selection • {ivrOptions.length} options available
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ivrOptions.slice(0, 8).map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedOption(option.value)}
                          className={`p-2 text-left border rounded text-xs transition-all ${
                            selectedOption === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-800'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="font-medium truncate">{option.label}</div>
                        </button>
                      ))}
                      {ivrOptions.length > 8 && (
                        <div className="p-2 text-xs text-gray-500 border border-dashed rounded">
                          +{ivrOptions.length - 8} more options...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Routing Result - Compact */}
            {routedAgent && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h2 className="text-base font-semibold text-green-600">Agent Matched</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Match:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${routedAgent.matchPercentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-green-600 min-w-[2rem]">
                        {routedAgent.matchPercentage || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded border border-green-200 p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{routedAgent.name}</h3>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          {routedAgent.availability}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{routedAgent.dept}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <div className="text-center p-1 bg-white/50 rounded">
                          <div className="font-medium text-gray-900">{Math.round(routedAgent.performance.averageHandleTimeSeconds / 60)}m</div>
                          <div className="text-gray-500">AHT</div>
                        </div>
                        <div className="text-center p-1 bg-white/50 rounded">
                          <div className="font-medium text-gray-900">{routedAgent.performance.firstCallResolutionPercentage}%</div>
                          <div className="text-gray-500">FCR</div>
                        </div>
                        <div className="text-center p-1 bg-white/50 rounded">
                          <div className="font-medium text-gray-900">{routedAgent.performance.callsHandled}</div>
                          <div className="text-gray-500">Today</div>
                        </div>
                      </div>
                      
                      {routedAgent.skillSet && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {routedAgent.skillSet.slice(0, 2).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {routedAgent.skillSet.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{routedAgent.skillSet.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Compact */}
          <div className="lg:col-span-1 space-y-4">
            {/* Customer Information - Compact */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Customer
                </h3>
                {customerData && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
              
              {customerData ? (
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Name</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        customerData.tier === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        customerData.tier === 'Business' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customerData.tier}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{customerData.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Account</span>
                      <p className="font-medium text-gray-900 truncate">{customerData.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Balance</span>
                      <p className="font-medium text-green-600">{customerData.balance}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Recent Issues</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customerData.issues.slice(0, 2).map(issue => (
                        <span key={issue} className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {issue}
                        </span>
                      ))}
                      {customerData.issues.length > 2 && (
                        <span className="text-xs text-gray-500">+{customerData.issues.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : phoneNumber ? (
                <div className="text-center py-4">
                  <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Customer not found</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Phone className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Enter phone number</p>
                </div>
              )}
            </div>

            {/* Available Agents - Compact */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Agents
                </h3>
                {selectedOption && getAgentsForCategory(selectedOption).length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {getAgentsForCategory(selectedOption).length} available
                  </span>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedOption ? (
                  getAgentsForCategory(selectedOption).length > 0 ? (
                    getAgentsForCategory(selectedOption).slice(0, 4).map((agent, index) => (
                      <div key={agent.id} className={`flex items-center justify-between p-2 rounded border transition-all ${
                        routedAgent && routedAgent.id === agent.id 
                          ? 'bg-green-50 border-green-200 ring-1 ring-green-300' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            agent.availability === 'Available' || agent.availability === 'Ready' || agent.availability === 'IDLE'
                              ? 'bg-green-500' 
                              : agent.availability === 'After Call Work'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          }`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs text-gray-900 truncate">{agent.name}</p>
                            <div className="flex justify-between items-center text-xs text-gray-600">
                              <span>{Math.round(agent.performance.averageHandleTimeSeconds / 60)}m AHT</span>
                              <span>{agent.performance.firstCallResolutionPercentage}% FCR</span>
                            </div>
                          </div>
                        </div>
                        {routedAgent && routedAgent.id === agent.id && (
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 ml-1" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">No agents available</p>
                      <p className="text-xs text-gray-400">for this category</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <MessageSquare className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Select category to</p>
                    <p className="text-xs text-gray-400">view agents</p>
                  </div>
                )}
                
                {selectedOption && getAgentsForCategory(selectedOption).length > 4 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      +{getAgentsForCategory(selectedOption).length - 4} more agents
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats - New compact panel */}
            {(backendDetails.length > 0 || routedAgent) && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  Session Stats
                </h3>
                
                <div className="space-y-2 text-xs">
                  {backendDetails.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backend Services</span>
                        <span className="font-medium">
                          {backendDetails.filter(s => s.STATUS === 'S').length}/{backendDetails.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Load Time</span>
                        <span className="font-medium text-green-600">
                          {Math.round(Math.max(...backendDetails.map(s => parseInt(s.TIME_TAKEN || 0))) / 1000)}s
                        </span>
                      </div>
                    </>
                  )}
                  
                  {routedAgent && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent Match</span>
                      <span className="font-medium text-blue-600">
                        {routedAgent.matchPercentage}%
                      </span>
                    </div>
                  )}
                  
                  {callDuration > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IVR Duration</span>
                      <span className="font-medium text-gray-900 font-mono">
                        {formatDuration(callDuration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IVRDemo;