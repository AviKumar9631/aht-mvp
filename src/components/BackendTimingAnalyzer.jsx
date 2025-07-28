import React, { useState, useEffect } from 'react';
import { getTNPerformanceSummary, getTimingDataForService } from '../utils/timingUtils';
import tnData from '../utils/TN_DATA.json';

const BackendTimingAnalyzer = () => {
  const [selectedTN, setSelectedTN] = useState('');
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    // Extract all unique services and their timing data
    const services = new Set();
    tnData.backend.forEach(entry => {
      entry.backendDetail?.forEach(detail => {
        if (detail.Average_Elapsed_Time_ms) {
          services.add(detail.SERVICE_NAME);
        }
      });
    });
    setAllServices(Array.from(services).sort());
  }, []);

  const handleTNSelection = (tn) => {
    setSelectedTN(tn);
    const tnEntry = tnData.backend.find(entry => entry.tn === tn);
    if (tnEntry) {
      const summary = getTNPerformanceSummary(tnEntry);
      setPerformanceSummary(summary);
    }
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (actualTime, avgTime) => {
    const ratio = actualTime / avgTime;
    if (ratio <= 0.8) return '#4CAF50'; // Green - Better than average
    if (ratio <= 1.2) return '#FF9800'; // Orange - Close to average
    return '#F44336'; // Red - Worse than average
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Backend Service Timing Analysis</h1>
      
      {/* TN Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Telephone Number:</label>
        <select 
          value={selectedTN} 
          onChange={(e) => handleTNSelection(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- Select a TN --</option>
          {tnData.backend.map(entry => (
            <option key={entry.tn} value={entry.tn}>{entry.tn}</option>
          ))}
        </select>
      </div>

      {/* Performance Summary */}
      {performanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800">Total Services</h3>
            <p className="text-2xl font-bold text-blue-600">{performanceSummary.serviceCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800">Average Time</h3>
            <p className="text-2xl font-bold text-green-600">{formatTime(performanceSummary.averageTime)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800">Total Time</h3>
            <p className="text-2xl font-bold text-orange-600">{formatTime(performanceSummary.totalTime)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800">Max Time</h3>
            <p className="text-2xl font-bold text-red-600">{formatTime(performanceSummary.maxTime)}</p>
          </div>
        </div>
      )}

      {/* Detailed Service Breakdown */}
      {performanceSummary && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Service Performance Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceSummary.services.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(parseInt(service.actualTime))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(service.avgTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(service.minTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(service.maxTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status === 'S' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status === 'S' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: getPerformanceColor(
                              parseInt(service.actualTime), 
                              service.avgTime
                            )
                          }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {((parseInt(service.actualTime) / service.avgTime) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Timing Reference */}
      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Service Timing Reference</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allServices.map(serviceName => {
                const timing = getTimingDataForService(serviceName);
                return timing ? (
                  <tr key={serviceName} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(timing.Average_Elapsed_Time_ms)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(timing.MIN_TIME)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(timing.MAX_TIME)}
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackendTimingAnalyzer;
