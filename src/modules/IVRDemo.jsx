import React, { useState, useEffect } from 'react';
import { Phone, User, Bot, MessageSquare, Clock, CheckCircle, AlertCircle, Settings, Mic, PhoneCall, Activity, X, ChevronRight, Zap, Database, Brain } from 'lucide-react';
import TN_DATA from '../utils/TN_DATA.json';
import CONTACT_DRIVER from '../utils/CONTACT_DRIVER.json';
import AGENT_DATA from '../utils/AGENT_DATA.json';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';


const IVRDemo = () => {
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
      totalBackendTime: backendDetails.reduce((sum, s) => sum + parseInt(s.TIME_TAKEN || 0), 0),
      
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

  // Function to load backend details for a phone number
  const loadBackendDetails = (tn) => {
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
    addActivityLog('api', `Loading backend services for ${tn}...`, 'processing');
    addActivityLog('system', `Found ${tnData.backendDetail.length} backend services`, 'success');
    
    // Process each backend service with its TIME_TAKEN as delay
    tnData.backendDetail.forEach((service, index) => {
      const timeTaken = parseInt(service.TIME_TAKEN) || 1000;
      const serviceName = service.SERVICE_NAME;
      
      // Add to loading set
      setLoadingServices(prev => new Set([...prev, serviceName]));
      
      // Add processing log immediately
      setTimeout(() => {
        addActivityLog('api', `Fetching ${serviceName}...`, 'processing');
      }, index * 100); // Stagger the "fetching" messages slightly
      
      // Simulate API call with TIME_TAKEN delay
      setTimeout(() => {
        // Remove from loading set
        setLoadingServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(serviceName);
          return newSet;
        });
        
        // Add to backend details
        setBackendDetails(prev => [...prev, {
          ...service,
          id: `${tn}-${index}`,
          loadedAt: Date.now()
        }]);
        
        // Add success log
        const statusText = service.STATUS === 'S' ? 'Success' : 'Failed';
        addActivityLog('api', `${serviceName} loaded (${statusText})`, 
          service.STATUS === 'S' ? 'success' : 'warning', `${timeTaken}ms`);
        
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
      }, timeTaken);
    });
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
      
      setTimeout(() => {
        addActivityLog('api', 'Phone number validated', 'success', '300ms');
        // Load backend details for this TN
        loadBackendDetails(phoneNumber);
      }, 300);
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
    if (callStatus === 'connected' || callStatus === 'routing' || callStatus === 'routed') {
      const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PhoneCall className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IVR System Demo</h1>
                <p className="text-gray-600">Interactive Voice Response & Customer Routing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowActivityPanel(!showActivityPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showActivityPanel ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Backend Activity Panel"
              >
                <Database className="w-5 h-5" />
              </button>
              <div className={`flex items-center space-x-2 ${getStatusColor(callStatus)}`}>
                <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                <span className="font-medium">
                  {callStatus === 'waiting' && 'Waiting for call'}
                  {callStatus === 'connected' && 'Call connected'}
                  {callStatus === 'unknown' && 'Unknown number'}
                  {callStatus === 'routing' && 'Routing call...'}
                  {callStatus === 'routed' && 'Call routed'}
                </span>
              </div>
              {callDuration > 0 && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(callDuration)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AHT Optimization Flow Panel */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">AHT Optimization Flow</h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                  DEMO
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Traditional Flow */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Traditional Flow
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-red-700">
                    <Clock className="w-3 h-3 mr-2" />
                    Customer calls → Agent answers
                  </div>
                  <div className="flex items-center text-red-700">
                    <Database className="w-3 h-3 mr-2" />
                    Agent fetches customer data (5-15s)
                  </div>
                  <div className="flex items-center text-red-700">
                    <Brain className="w-3 h-3 mr-2" />
                    Agent reads context (3-8s)
                  </div>
                  <div className="flex items-center text-red-700">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Agent starts helping
                  </div>
                  <div className="mt-3 p-2 bg-red-100 rounded text-center">
                    <span className="font-bold text-red-800">Total AHT: ~11 min</span>
                  </div>
                </div>
              </div>

              {/* IVR Pre-fetch Process */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  IVR Pre-fetch Process
                </h4>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center ${phoneNumber ? 'text-green-700' : 'text-blue-700'}`}>
                    <Phone className="w-3 h-3 mr-2" />
                    {phoneNumber ? '✓ Customer identified' : 'Customer enters phone number'}
                  </div>
                  <div className={`flex items-center ${backendDetails.length > 0 ? 'text-green-700' : 'text-blue-700'}`}>
                    <Database className="w-3 h-3 mr-2" />
                    {backendDetails.length > 0 ? `✓ ${backendDetails.length} services pre-fetched` : 'Backend services loading...'}
                  </div>
                  <div className={`flex items-center ${routedAgent ? 'text-green-700' : 'text-blue-700'}`}>
                    <Brain className="w-3 h-3 mr-2" />
                    {routedAgent ? `✓ Routed to ${routedAgent.name}` : 'Routing to best agent...'}
                  </div>
                  <div className={`flex items-center ${callStatus === 'routed' ? 'text-green-700' : 'text-blue-700'}`}>
                    <CheckCircle className="w-3 h-3 mr-2" />
                    {callStatus === 'routed' ? '✓ Ready for transfer' : 'Preparing transfer...'}
                  </div>
                  {backendDetails.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-center">
                      <span className="font-bold text-green-800">
                        Pre-fetch time: {Math.round(backendDetails.reduce((sum, service) => 
                          sum + parseInt(service.TIME_TAKEN || 0), 0) / 1000)}s
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optimized Flow */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Optimized Flow
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-700">
                    <PhoneCall className="w-3 h-3 mr-2" />
                    Transfer from IVR → Agent
                  </div>
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Customer data already loaded
                  </div>
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Agent context ready
                  </div>
                  <div className="flex items-center text-green-700">
                    <Zap className="w-3 h-3 mr-2" />
                    Agent starts helping immediately
                  </div>
                  {backendDetails.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-center">
                      <span className="font-bold text-green-800">
                        Estimated AHT: ~{Math.max(1, 11 - Math.round(backendDetails.reduce((sum, service) => 
                          sum + parseInt(service.TIME_TAKEN || 0), 0) / 1000 / 60))} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer to Contact Center Button */}
            {callStatus === 'routed' && backendDetails.length > 0 && (
              <div className="mt-6 text-center">
                <Link to="/contact-center">
                  <button 
                    onClick={() => storeIVRSessionData()}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 mr-2" />
                    Transfer to Contact Center (Pre-loaded Data)
                    <Zap className="w-4 h-4 ml-2" />
                  </button>
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  All customer data and backend services are pre-loaded for the agent
                </p>
              </div>
            )}
          </div>

          {/* Backend Activity Panel */}
          {showActivityPanel && (
            <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Backend Activity</h3>
                </div>
                <button
                  onClick={() => setShowActivityPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {phoneNumber ? (
                <div className="space-y-3 overflow-y-auto max-h-96">
                  {backendDetails.length === 0 && loadingServices.size === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No backend data found</p>
                    </div>
                  ) : (
                    <>
                      {/* Loading services */}
                      {Array.from(loadingServices).map(serviceName => (
                        <div key={`loading-${serviceName}`} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center space-x-3">
                            <Database className="w-4 h-4 text-yellow-600 animate-pulse" />
                            <div>
                              <p className="font-medium text-yellow-800">{serviceName}</p>
                              <p className="text-sm text-yellow-600">Loading...</p>
                            </div>
                          </div>
                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ))}
                      
                      {/* Loaded services */}
                      {backendDetails
                        .sort((a, b) => a.loadedAt - b.loadedAt) // Sort by load time
                        .map(service => (
                        <div key={service.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                          service.STATUS === 'S' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {service.STATUS === 'S' 
                              ? <CheckCircle className="w-4 h-4 text-green-600" />
                              : <AlertCircle className="w-4 h-4 text-red-600" />
                            }
                            <div>
                              <p className={`font-medium ${
                                service.STATUS === 'S' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {service.SERVICE_NAME}
                              </p>
                              <p className={`text-sm ${
                                service.STATUS === 'S' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                Status: {service.STATUS === 'S' ? 'Success' : 'Failed'} • 
                                Response Time: {service.TIME_TAKEN}ms
                                {service.Average_Elapsed_Time_ms && 
                                  ` • Avg: ${Math.round(service.Average_Elapsed_Time_ms)}ms`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-mono px-2 py-1 rounded ${
                              service.STATUS === 'S' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {service.TIME_TAKEN}ms
                            </span>
                            {service.MAX_TIME && service.MIN_TIME && (
                              <p className="text-xs text-gray-500 mt-1">
                                {service.MIN_TIME}-{service.MAX_TIME}ms range
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter phone number to view backend activity</p>
                </div>
              )}
            </div>
          )}

          {/* Main IVR Interface */}
          <div className={`${showActivityPanel ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            {/* Phone Number Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Incoming Call</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {TN_DATA?.backend?.map(a => a.tn)?.map(num => (
                    <button
                      key={num}
                      onClick={() => setPhoneNumber(num)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-mono"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* IVR Options */}
            {phoneNumber && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">IVR Menu Options</h2>
                </div>
                <div className="space-y-3 flex flex-wrap gap-1">
                  {ivrOptions.map(option => (
                    <div
                      key={option.value}
                      onClick={() => setSelectedOption(option.value)}
                      className={`p-2 w-fit border-2 rounded-lg cursor-pointer transition-all ${
                        selectedOption === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.label}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(option.priority)}`}>
                          {option.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Routing Result */}
            {routedAgent && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-green-600">Call Routed Successfully</h2>
                  </div>
                  {/* Agent Match Score */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Match Score:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${routedAgent.matchPercentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {routedAgent.matchPercentage || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{routedAgent.name}</h3>
                      <p className="text-gray-600">{routedAgent.dept}</p>
                      <p className="text-sm text-gray-500">{routedAgent.availability}</p>
                      <div className="flex space-x-4 mt-2 text-xs text-gray-600">
                        <span>AHT: {Math.round(routedAgent.performance.averageHandleTimeSeconds / 60)}m</span>
                        <span>FCR: {routedAgent.performance.firstCallResolutionPercentage}%</span>
                        <span>Calls Today: {routedAgent.performance.callsHandled}</span>
                      </div>
                    </div>
                  </div>
                  {routedAgent.skillSet && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-gray-600 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {routedAgent.skillSet.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                <Link to="/contact-center" onClick={() => {
                  const success = storeIVRSessionData();
                  if (success) {
                    addActivityLog('system', 'Session data saved to localStorage', 'success');
                  } else {
                    addActivityLog('system', 'Failed to save session data', 'error');
                  }
                }}>
                  <Button className='w-full mt-2'>Move To Contact Center</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                {customerData && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
              {customerData ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Name</span>
                    <p className="font-medium">{customerData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account</span>
                    <p className="font-medium">{customerData.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tier</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customerData.tier === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      customerData.tier === 'Business' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customerData.tier}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Balance</span>
                    <p className="font-medium text-green-600">{customerData.balance}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Recent Issues</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customerData.issues.map(issue => (
                        <span key={issue} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : phoneNumber ? (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Customer not found</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Enter phone number</p>
                </div>
              )}
            </div>

            {/* Available Agents */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Available Agents</h3>
                {selectedOption && (
                  <span className="text-sm text-gray-500">
                    {categoryMapping[selectedOption] || 'General'}
                  </span>
                )}
              </div>
              <div className="space-y-3 max-h-84 overflow-y-auto">
                {selectedOption ? (
                  getAgentsForCategory(selectedOption).length > 0 ? (
                    getAgentsForCategory(selectedOption).slice(0, 5).map((agent, index) => (
                      <div key={agent.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                        routedAgent && routedAgent.id === agent.id 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.availability === 'Available' || agent.availability === 'Ready' 
                              ? 'bg-green-500' 
                              : agent.availability === 'After Call Work'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-sm text-gray-600">{agent.availability}</p>
                            <p className="text-xs text-gray-500">
                              AHT: {Math.round(agent.performance.averageHandleTimeSeconds / 60)}m | 
                              FCR: {agent.performance.firstCallResolutionPercentage}%
                            </p>
                          </div>
                        </div>
                        {routedAgent && routedAgent.id === agent.id && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No agents available for this category</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Select a category to view agents</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IVRDemo;