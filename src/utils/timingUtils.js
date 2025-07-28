// Utility functions for backend timing data
export const timingData = {
  "Health Check": { Average_Elapsed_Time_ms: 15080.61538, MAX_TIME: 25000, MIN_TIME: 10000 },
  "GetPollDslamInfo": { Average_Elapsed_Time_ms: 13573.8, MAX_TIME: 20000, MIN_TIME: 8000 },
  "AppointmentInfo": { Average_Elapsed_Time_ms: 10946.32692, MAX_TIME: 18000, MIN_TIME: 6000 },
  "AutopayCompletion": { Average_Elapsed_Time_ms: 7739.5, MAX_TIME: 12000, MIN_TIME: 4000 },
  "Self Help Info": { Average_Elapsed_Time_ms: 7276.481383, MAX_TIME: 11500, MIN_TIME: 3800 },
  "Wireless Credential Notification": { Average_Elapsed_Time_ms: 6782.5, MAX_TIME: 10500, MIN_TIME: 3500 },
  "Wireless Modem Info": { Average_Elapsed_Time_ms: 5916.418478, MAX_TIME: 9200, MIN_TIME: 3000 },
  "Product Info": { Average_Elapsed_Time_ms: 5786.835777, MAX_TIME: 9000, MIN_TIME: 2800 },
  "AuthorizePayment": { Average_Elapsed_Time_ms: 5420.824138, MAX_TIME: 8500, MIN_TIME: 2700 },
  "BMSpeedUpgrade": { Average_Elapsed_Time_ms: 5299.582524, MAX_TIME: 8200, MIN_TIME: 2600 },
  "BMDataSource": { Average_Elapsed_Time_ms: 5297.669903, MAX_TIME: 8200, MIN_TIME: 2600 },
  "Outage Info": { Average_Elapsed_Time_ms: 4591.359447, MAX_TIME: 7200, MIN_TIME: 2200 },
  "RxDataSource": { Average_Elapsed_Time_ms: 2941.331014, MAX_TIME: 4800, MIN_TIME: 1500 },
  "Ticket Info": { Average_Elapsed_Time_ms: 2929.415323, MAX_TIME: 4800, MIN_TIME: 1500 },
  "RxSessionLessOutageInfoByTN": { Average_Elapsed_Time_ms: 2820.689178, MAX_TIME: 4600, MIN_TIME: 1400 },
  "Modem Reboot": { Average_Elapsed_Time_ms: 247, MAX_TIME: 247, MIN_TIME: 1000 },
  "Close Session": { Average_Elapsed_Time_ms: 54, MAX_TIME: 50, MIN_TIME: 1000 }
};

/**
 * Get timing metrics for a service
 * @param {string} serviceName - The name of the service
 * @returns {object|null} Timing data or null if not found
 */
export const getTimingDataForService = (serviceName) => {
  return timingData[serviceName] || null;
};

/**
 * Add timing metrics to a backend detail object
 * @param {object} backendDetail - Backend detail object with SERVICE_NAME
 * @returns {object} Enhanced backend detail with timing metrics
 */
export const enhanceBackendDetailWithTiming = (backendDetail) => {
  const timing = getTimingDataForService(backendDetail.SERVICE_NAME);
  
  if (timing) {
    return {
      ...backendDetail,
      Average_Elapsed_Time_ms: timing.Average_Elapsed_Time_ms,
      MAX_TIME: timing.MAX_TIME,
      MIN_TIME: timing.MIN_TIME
    };
  }
  
  return backendDetail;
};

/**
 * Process all backend details in TN data and add timing metrics
 * @param {object} tnData - The TN data object
 * @returns {object} Enhanced TN data with timing metrics
 */
export const enhanceTNDataWithTiming = (tnData) => {
  if (!tnData.backend || !Array.isArray(tnData.backend)) {
    return tnData;
  }

  const enhancedData = {
    ...tnData,
    backend: tnData.backend.map(backendEntry => ({
      ...backendEntry,
      backendDetail: backendEntry.backendDetail?.map(detail => 
        enhanceBackendDetailWithTiming(detail)
      ) || []
    }))
  };

  return enhancedData;
};

/**
 * Get performance summary for a TN
 * @param {object} tnEntry - Single TN entry from backend data
 * @returns {object} Performance summary
 */
export const getTNPerformanceSummary = (tnEntry) => {
  if (!tnEntry.backendDetail || !Array.isArray(tnEntry.backendDetail)) {
    return null;
  }

  const details = tnEntry.backendDetail.filter(detail => detail.Average_Elapsed_Time_ms);
  
  if (details.length === 0) {
    return null;
  }

  const totalTime = details.reduce((sum, detail) => sum + (detail.Average_Elapsed_Time_ms || 0), 0);
  const avgTime = totalTime / details.length;
  const maxTime = Math.max(...details.map(detail => detail.MAX_TIME || 0));
  const minTime = Math.min(...details.map(detail => detail.MIN_TIME || Infinity));

  return {
    tn: tnEntry.tn,
    serviceCount: details.length,
    averageTime: avgTime,
    totalTime,
    maxTime,
    minTime,
    services: details.map(detail => ({
      name: detail.SERVICE_NAME,
      avgTime: detail.Average_Elapsed_Time_ms,
      maxTime: detail.MAX_TIME,
      minTime: detail.MIN_TIME,
      actualTime: detail.TIME_TAKEN,
      status: detail.STATUS
    }))
  };
};
