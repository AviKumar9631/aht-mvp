// Script to add timing metrics to backend details
const fs = require('fs');
const path = require('path');

// Load the timing data
const timingData = [
  {
    "ENTRY_TYPE": "Health Check",
    "Average_Elapsed_Time_ms": 15080.61538,
    "MAX_TIME": 25000,
    "MIN_TIME": 10000
  },
  {
    "ENTRY_TYPE": "GetPollDslamInfo",
    "Average_Elapsed_Time_ms": 13573.8,
    "MAX_TIME": 20000,
    "MIN_TIME": 8000
  },
  {
    "ENTRY_TYPE": "AppointmentInfo",
    "Average_Elapsed_Time_ms": 10946.32692,
    "MAX_TIME": 18000,
    "MIN_TIME": 6000
  },
  {
    "ENTRY_TYPE": "AutopayCompletion",
    "Average_Elapsed_Time_ms": 7739.5,
    "MAX_TIME": 12000,
    "MIN_TIME": 4000
  },
  {
    "ENTRY_TYPE": "Self Help Info",
    "Average_Elapsed_Time_ms": 7276.481383,
    "MAX_TIME": 11500,
    "MIN_TIME": 3800
  },
  {
    "ENTRY_TYPE": "Wireless Credential Notification",
    "Average_Elapsed_Time_ms": 6782.5,
    "MAX_TIME": 10500,
    "MIN_TIME": 3500
  },
  {
    "ENTRY_TYPE": "Wireless Modem Info",
    "Average_Elapsed_Time_ms": 5916.418478,
    "MAX_TIME": 9200,
    "MIN_TIME": 3000
  },
  {
    "ENTRY_TYPE": "Product Info",
    "Average_Elapsed_Time_ms": 5786.835777,
    "MAX_TIME": 9000,
    "MIN_TIME": 2800
  },
  {
    "ENTRY_TYPE": "AuthorizePayment",
    "Average_Elapsed_Time_ms": 5420.824138,
    "MAX_TIME": 8500,
    "MIN_TIME": 2700
  },
  {
    "ENTRY_TYPE": "BMSpeedUpgrade",
    "Average_Elapsed_Time_ms": 5299.582524,
    "MAX_TIME": 8200,
    "MIN_TIME": 2600
  },
  {
    "ENTRY_TYPE": "BMDataSource",
    "Average_Elapsed_Time_ms": 5297.669903,
    "MAX_TIME": 8200,
    "MIN_TIME": 2600
  },
  {
    "ENTRY_TYPE": "Outage Info",
    "Average_Elapsed_Time_ms": 4591.359447,
    "MAX_TIME": 7200,
    "MIN_TIME": 2200
  },
  {
    "ENTRY_TYPE": "RxDataSource",
    "Average_Elapsed_Time_ms": 2941.331014,
    "MAX_TIME": 4800,
    "MIN_TIME": 1500
  },
  {
    "ENTRY_TYPE": "Ticket Info",
    "Average_Elapsed_Time_ms": 2929.415323,
    "MAX_TIME": 4800,
    "MIN_TIME": 1500
  },
  {
    "ENTRY_TYPE": "RxSessionLessOutageInfoByTN",
    "Average_Elapsed_Time_ms": 2820.689178,
    "MAX_TIME": 4600,
    "MIN_TIME": 1400
  },
  {
    "ENTRY_TYPE": "Modem Reboot",
    "Average_Elapsed_Time_ms": 247,
    "MAX_TIME": 247,
    "MIN_TIME": 1000
  },
  {
    "ENTRY_TYPE": "Close Session",
    "Average_Elapsed_Time_ms": 54,
    "MAX_TIME": 50,
    "MIN_TIME": 1000
  }
];

// Create a lookup map for timing data
const timingMap = {};
timingData.forEach(item => {
  timingMap[item.ENTRY_TYPE] = {
    Average_Elapsed_Time_ms: item.Average_Elapsed_Time_ms,
    MAX_TIME: item.MAX_TIME,
    MIN_TIME: item.MIN_TIME
  };
});

// Load the TN_DATA.json file
const tnDataPath = path.join(__dirname, 'src/utils/TN_DATA.json');
const tnData = JSON.parse(fs.readFileSync(tnDataPath, 'utf8'));

// Process each backend entry
tnData.backend.forEach(backendEntry => {
  if (backendEntry.backendDetail && Array.isArray(backendEntry.backendDetail)) {
    backendEntry.backendDetail.forEach(detail => {
      const serviceName = detail.SERVICE_NAME;
      
      // Look for matching timing data
      if (timingMap[serviceName]) {
        // Add timing metrics to the backend detail
        detail.Average_Elapsed_Time_ms = timingMap[serviceName].Average_Elapsed_Time_ms;
        detail.MAX_TIME = timingMap[serviceName].MAX_TIME;
        detail.MIN_TIME = timingMap[serviceName].MIN_TIME;
        
        console.log(`Added timing data for: ${serviceName}`);
      } else {
        console.log(`No timing data found for: ${serviceName}`);
      }
    });
  }
});

// Write the updated data back to the file
fs.writeFileSync(tnDataPath, JSON.stringify(tnData, null, 2));
console.log('Successfully updated TN_DATA.json with timing metrics');
