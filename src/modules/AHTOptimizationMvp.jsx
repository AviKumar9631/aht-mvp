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
              {recentCalls.map((call) => (
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
                    <span className="text-sm font-medium text-green-600">-{Math.floor(Math.random() * 40 + 20)}s</span>
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
  Activity
} from 'lucide-react';

const AHTOptimizationMVP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  // Mock data
  const dashboardMetrics = {
    avgHandlingTime: 285,
    targetAHT: 240,
    totalCalls: 1247,
    activeAgents: 23,
    queueWaiting: 8,
    resolutionRate: 94.2
  };

  const contactDriverAnalysis = [
    { driver: 'Billing Issues', avgTime: 320, volume: 450, change: '+15%', reason: 'Complex pricing queries' },
    { driver: 'Technical Support', avgTime: 280, volume: 380, change: '-8%', reason: 'Product knowledge gaps' },
    { driver: 'Account Access', avgTime: 180, volume: 520, change: '+25%', reason: 'Password resets' },
    { driver: 'Product Information', avgTime: 240, volume: 290, change: '-5%', reason: 'Standard inquiries' }
  ];

  const issueVolumeData = [
    { category: 'Billing', jan: 420, feb: 380, mar: 450, trend: 'increasing' },
    { category: 'Technical', jan: 350, feb: 340, mar: 380, trend: 'stable' },
    { category: 'Account', jan: 280, feb: 320, mar: 520, trend: 'increasing' },
    { category: 'Product', jan: 310, feb: 295, mar: 290, trend: 'decreasing' }
  ];

  const agentBehaviorInsights = [
    { 
      agentId: 2, 
      patterns: ['Long hold times during info lookup', 'Frequent transfers to supervisor'],
      timeWasters: ['Manual data entry: 45s avg', 'System navigation: 30s avg'],
      suggestions: ['Implement auto-populate features', 'Provide quick reference guides']
    },
    {
      agentId: 5,
      patterns: ['Extended customer rapport building', 'Detailed explanation tendency'],
      timeWasters: ['Over-explanation: 60s avg', 'Redundant verification: 25s avg'],
      suggestions: ['Concise communication training', 'Verification process optimization']
    }
  ];

  const conversationHistory = {
    customerId: 'CUST-789456',
    previousInteractions: [
      { date: '2025-07-20', channel: 'IVR', issue: 'Billing inquiry - rates', duration: '3m 45s', resolved: false },
      { date: '2025-07-18', channel: 'Chat', issue: 'Account access help', duration: '8m 20s', resolved: true },
      { date: '2025-07-15', channel: 'Phone', issue: 'Service upgrade question', duration: '12m 15s', resolved: true }
    ],
    contextSummary: 'Recurring billing questions, premium customer, previous positive interactions',
    currentIssue: 'Follow-up on billing rate changes discussed in IVR',
    riskFactors: ['Potential churn risk due to billing concerns', 'High-value customer']
  };

  const aiSuggestions = {
    qAndA: [
      { q: 'What are the new billing rates?', a: 'Premium: $89/mo, Standard: $59/mo, Basic: $39/mo (effective Aug 1)' },
      { q: 'How to apply promotional discount?', a: 'Use code SAVE20 in billing portal or agent can apply directly' },
      { q: 'Cancellation policy?', a: '30-day notice required, prorated refund available for annual plans' }
    ],
    nextBestActions: [
      'Offer loyalty discount (15% available for this customer)',
      'Suggest plan optimization based on usage',
      'Schedule follow-up call in 1 week',
      'Add notes to account for future reference'
    ],
    automatedSummary: 'Customer called regarding billing rate changes discussed in IVR. Concerns about cost increase. Premium customer with 3-year history. Recommend retention offer.'
  };

  const agentData = [
    { id: 1, name: 'Sarah Johnson', aht: 245, calls: 42, resolution: 96, status: 'available', performance: 'excellent' },
    { id: 2, name: 'Mike Chen', aht: 312, calls: 38, resolution: 89, status: 'on-call', performance: 'needs-improvement' },
    { id: 3, name: 'Lisa Rodriguez', aht: 198, calls: 51, resolution: 98, status: 'available', performance: 'excellent' },
    { id: 4, name: 'David Kim', aht: 267, calls: 44, resolution: 92, status: 'break', performance: 'good' },
    { id: 5, name: 'Emily Watson', aht: 334, calls: 29, resolution: 85, status: 'on-call', performance: 'needs-improvement' }
  ];

  const recentCalls = [
    { id: 1, customer: 'John Doe', issue: 'Billing Inquiry', duration: 245, resolved: true, agent: 'Sarah Johnson' },
    { id: 2, customer: 'Jane Smith', issue: 'Technical Support', duration: 410, resolved: true, agent: 'Mike Chen' },
    { id: 3, customer: 'Bob Wilson', issue: 'Account Access', duration: 180, resolved: true, agent: 'Lisa Rodriguez' },
    { id: 4, customer: 'Alice Brown', issue: 'Product Info', duration: 320, resolved: false, agent: 'David Kim' }
  ];

  const skillGaps = [
    { skill: 'Product Knowledge', gap: 'High', agents: 8, training: 'CRM Basics Course' },
    { skill: 'Technical Troubleshooting', gap: 'Medium', agents: 5, training: 'Advanced Tech Support' },
    { skill: 'Soft Skills', gap: 'Low', agents: 3, training: 'Communication Excellence' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Handling Time</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.avgHandlingTime}s</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18% from target
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">IT Optimization Impact</p>
              <p className="text-3xl font-bold text-green-600">-35s</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                Prefetch & Auto-populate
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.resolutionRate}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Above target
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Driver Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Driver Time Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MoM Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Root Cause</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contactDriverAnalysis.map((driver, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{driver.driver}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${driver.avgTime > 240 ? 'text-red-600' : 'text-green-600'}`}>
                      {driver.avgTime}s
                    </span>
                  </td>
                  <td className="px-4 py-3">{driver.volume}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${driver.change.includes('+') ? 'text-red-600' : 'text-green-600'}`}>
                      {driver.change}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{driver.reason}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Optimize</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Volume Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Issue Category Volume Trends (Last 3 Months)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {issueVolumeData.map((category, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">{category.category}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Jan:</span>
                  <span>{category.jan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Feb:</span>
                  <span>{category.feb}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Mar:</span>
                  <span>{category.mar}</span>
                </div>
                <div className={`text-xs mt-2 ${
                  category.trend === 'increasing' ? 'text-red-600' :
                  category.trend === 'decreasing' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  Trend: {category.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IT Solutions Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">IT Optimization Results</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-green-900">Prefetch Implementation</p>
                <p className="text-sm text-green-600">Reduced data lookup time by 25s average</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Auto-populate Customer Data</p>
                <p className="text-sm text-blue-600">Eliminated 15s manual entry time</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-purple-900">IVR Context Transfer</p>
                <p className="text-sm text-purple-600">Reduced repeat information by 20s</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Business Impact Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-red-900">Billing Issues Spike</p>
                <p className="text-sm text-red-600">+25% volume increase needs immediate attention</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-yellow-900">Agent Behavior Pattern</p>
                <p className="text-sm text-yellow-600">5 agents showing inefficient navigation patterns</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-green-900">Training Impact</p>
                <p className="text-sm text-green-600">Product knowledge training reduced AHT by 18%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AHT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calls Today</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-500">ID: {agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.status === 'available' ? 'bg-green-100 text-green-800' :
                      agent.status === 'on-call' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.aht}s</div>
                    <div className={`text-xs ${agent.aht > 240 ? 'text-red-500' : 'text-green-500'}`}>
                      {agent.aht > 240 ? 'Above target' : 'Below target'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.calls}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.resolution}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                      agent.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedAgent(agent)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Assign Training
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

      {/* Live Call Interface */}
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
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> John Smith</p>
                  <p><span className="font-medium">Account:</span> #ACT-789456</p>
                  <p><span className="font-medium">Issue:</span> Billing Inquiry</p>
                  <p><span className="font-medium">Priority:</span> Medium</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">AI Suggestions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Suggest checking last 3 billing cycles</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Customer has premium support - escalate if needed</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Similar issue resolved in 180s average</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
                    View Account History
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
                    Process Refund
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
                    Escalate to Supervisor
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100">
                    Schedule Callback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Calls */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Calls</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCalls.map((call) => (
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Insights</h2>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg AHT Today</p>
              <p className="text-2xl font-bold text-gray-900">285s</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">IT Optimization</p>
              <p className="text-2xl font-bold text-green-600">-35s</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Best Performer</p>
              <p className="text-lg font-bold text-gray-900">Lisa R.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Behavioral Issues</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Behavior Analysis (Business Solution 1) */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Agent Behavior Analysis
        </h3>
        <div className="space-y-4">
          {agentBehaviorInsights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">Agent #{insight.agentId} - {agentData.find(a => a.id === insight.agentId)?.name}</h4>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Needs Attention
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">Behavioral Patterns</h5>
                  <ul className="text-sm space-y-1">
                    {insight.patterns.map((pattern, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <AlertCircle className="w-3 h-3 mr-2 text-yellow-500" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">Time Wasters Identified</h5>
                  <ul className="text-sm space-y-1">
                    {insight.timeWasters.map((waster, i) => (
                      <li key={i} className="flex items-center text-red-600">
                        <Clock className="w-3 h-3 mr-2" />
                        {waster}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">AI Suggestions</h5>
                  <ul className="text-sm space-y-1">
                    {insight.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-center text-green-600">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Apply Suggestions
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                  Schedule Coaching
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Driver Deep Dive */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Why Contact Drivers Take Time - Root Cause Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactDriverAnalysis.map((driver, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">{driver.driver}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  driver.avgTime > 300 ? 'bg-red-100 text-red-800' :
                  driver.avgTime > 240 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {driver.avgTime}s avg
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="font-medium">{driver.volume} calls</span>
                </div>
                <div className="flex justify-between">
                  <span>MoM Change:</span>
                  <span className={`font-medium ${driver.change.includes('+') ? 'text-red-600' : 'text-green-600'}`}>
                    {driver.change}
                  </span>
                </div>
                <div className="mt-3 p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Root Cause:</p>
                  <p className="font-medium">{driver.reason}</p>
                </div>
              </div>
              
              <button className="w-full mt-3 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm">
                View Detailed Analysis
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gap Analysis with Auto-Generation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Auto-Generated Training Suggestions
        </h3>
        <div className="space-y-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{gap.skill}</h4>
                  <p className="text-sm text-gray-600">{gap.agents} agents affected • Impact: -45s potential AHT reduction</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  gap.gap === 'High' ? 'bg-red-100 text-red-800' :
                  gap.gap === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {gap.gap} Priority
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">AI Recommended: {gap.training}</p>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Auto-Assign
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Volume Trend Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Issue Category Volume Changes (MoM Analysis)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feb</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issueVolumeData.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{category.category}</td>
                  <td className="px-4 py-3">{category.jan}</td>
                  <td className="px-4 py-3">{category.feb}</td>
                  <td className="px-4 py-3 font-medium">{category.mar}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      category.trend === 'increasing' ? 'bg-red-100 text-red-800' :
                      category.trend === 'decreasing' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {category.trend === 'increasing' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {category.trend === 'decreasing' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {category.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {category.trend === 'increasing' ? (
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Investigate
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Monitor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Training & Development</h2>

      {/* Training Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Training Recommendations</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">CRM Basics & Product Knowledge</h4>
                <p className="text-sm text-gray-600 mt-1">For agents with AHT > 300s due to information lookup delays</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">High Priority - 8 agents</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Assign
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">Advanced Communication Skills</h4>
                <p className="text-sm text-gray-600 mt-1">Focus on de-escalation and efficient problem resolution</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">Medium Priority - 5 agents</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Assign
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">Technical Troubleshooting Excellence</h4>
                <p className="text-sm text-gray-600 mt-1">Advanced technical support techniques</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm">Low Priority - 3 agents</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Training Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Product Knowledge Bootcamp</h4>
                <p className="text-sm text-gray-600">8 agents enrolled</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Progress: 60%</div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Communication Excellence</h4>
                <p className="text-sm text-gray-600">5 agents enrolled</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Progress: 85%</div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Performance</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Daily Performance</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Avg AHT:</span>
              <span className="font-medium">285s</span>
            </div>
            <div className="flex justify-between">
              <span>Total Calls:</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution Rate:</span>
              <span className="font-medium">94.2%</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            View Details
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Agent Performance</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Top Performer:</span>
              <span className="font-medium">Lisa Rodriguez</span>
            </div>
            <div className="flex justify-between">
              <span>Avg AHT:</span>
              <span className="font-medium">198s</span>
            </div>
            <div className="flex justify-between">
              <span>Need Training:</span>
              <span className="font-medium text-red-600">5 agents</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            View Details
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Training Impact</h3>
            <Brain className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium">12 agents</span>
            </div>
            <div className="flex justify-between">
              <span>AHT Improvement:</span>
              <span className="font-medium text-green-600">-45s avg</span>
            </div>
            <div className="flex justify-between">
              <span>ROI:</span>
              <span className="font-medium">$2,340/month</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            View Details
          </button>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weekly AHT Analysis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Performance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 hours ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                  <button className="text-indigo-600 hover:text-indigo-900">Share</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Agent Skill Assessment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Training</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 day ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                  <button className="text-indigo-600 hover:text-indigo-900">Share</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Customer Satisfaction Impact</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 days ago</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-400 cursor-not-allowed mr-3">Download</button>
                  <button className="text-gray-400 cursor-not-allowed">Share</button>
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
              { id: 'reports', label: 'Reports', icon: FileText }
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