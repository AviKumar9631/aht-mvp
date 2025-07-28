#!/usr/bin/env node
/**
 * Complete script to add timing metrics to all backend details in TN_DATA.json
 * Run with: node complete-timing-update.js
 */

const fs = require('fs');
const path = require('path');

const timingData = {
  "Health Check": { "Average_Elapsed_Time_ms": 15080.61538, "MAX_TIME": 25000, "MIN_TIME": 10000 },
  "GetPollDslamInfo": { "Average_Elapsed_Time_ms": 13573.8, "MAX_TIME": 20000, "MIN_TIME": 8000 },
  "AppointmentInfo": { "Average_Elapsed_Time_ms": 10946.32692, "MAX_TIME": 18000, "MIN_TIME": 6000 },
  "AutopayCompletion": { "Average_Elapsed_Time_ms": 7739.5, "MAX_TIME": 12000, "MIN_TIME": 4000 },
  "Self Help Info": { "Average_Elapsed_Time_ms": 7276.481383, "MAX_TIME": 11500, "MIN_TIME": 3800 },
  "Wireless Credential Notification": { "Average_Elapsed_Time_ms": 6782.5, "MAX_TIME": 10500, "MIN_TIME": 3500 },
  "Wireless Modem Info": { "Average_Elapsed_Time_ms": 5916.418478, "MAX_TIME": 9200, "MIN_TIME": 3000 },
  "Product Info": { "Average_Elapsed_Time_ms": 5786.835777, "MAX_TIME": 9000, "MIN_TIME": 2800 },
  "AuthorizePayment": { "Average_Elapsed_Time_ms": 5420.824138, "MAX_TIME": 8500, "MIN_TIME": 2700 },
  "BMSpeedUpgrade": { "Average_Elapsed_Time_ms": 5299.582524, "MAX_TIME": 8200, "MIN_TIME": 2600 },
  "BMDataSource": { "Average_Elapsed_Time_ms": 5297.669903, "MAX_TIME": 8200, "MIN_TIME": 2600 },
  "Outage Info": { "Average_Elapsed_Time_ms": 4591.359447, "MAX_TIME": 7200, "MIN_TIME": 2200 },
  "RxDataSource": { "Average_Elapsed_Time_ms": 2941.331014, "MAX_TIME": 4800, "MIN_TIME": 1500 },
  "Ticket Info": { "Average_Elapsed_Time_ms": 2929.415323, "MAX_TIME": 4800, "MIN_TIME": 1500 },
  "RxSessionLessOutageInfoByTN": { "Average_Elapsed_Time_ms": 2820.689178, "MAX_TIME": 4600, "MIN_TIME": 1400 },
  "Modem Reboot": { "Average_Elapsed_Time_ms": 247, "MAX_TIME": 247, "MIN_TIME": 1000 },
  "Close Session": { "Average_Elapsed_Time_ms": 54, "MAX_TIME": 50, "MIN_TIME": 1000 }
};

function updateTNDataWithTiming() {
  const tnDataPath = path.join(__dirname, 'src', 'utils', 'TN_DATA.json');
  
  try {
    console.log('Loading TN_DATA.json...');
    const tnData = JSON.parse(fs.readFileSync(tnDataPath, 'utf8'));
    
    let totalProcessed = 0;
    let totalUpdated = 0;
    let alreadyUpdated = 0;
    const servicesFound = new Set();
    const servicesNotFound = new Set();
    
    // Process each backend entry
    if (tnData.backend && Array.isArray(tnData.backend)) {
      tnData.backend.forEach((backendEntry, backendIndex) => {
        if (backendEntry.backendDetail && Array.isArray(backendEntry.backendDetail)) {
          backendEntry.backendDetail.forEach((detail, detailIndex) => {
            totalProcessed++;
            const serviceName = detail.SERVICE_NAME;
            
            // Check if timing data already exists
            if (detail.hasOwnProperty('Average_Elapsed_Time_ms')) {
              alreadyUpdated++;
              console.log(`[SKIP] ${serviceName} - Already has timing data`);
              return;
            }
            
            // Look for matching timing data
            if (timingData[serviceName]) {
              detail.Average_Elapsed_Time_ms = timingData[serviceName].Average_Elapsed_Time_ms;
              detail.MAX_TIME = timingData[serviceName].MAX_TIME;
              detail.MIN_TIME = timingData[serviceName].MIN_TIME;
              
              totalUpdated++;
              servicesFound.add(serviceName);
              console.log(`[UPDATE] ${serviceName} - Added timing data`);
            } else {
              servicesNotFound.add(serviceName);
              console.log(`[NO DATA] ${serviceName} - No timing data available`);
            }
          });
        }
      });
    }
    
    // Write the updated data back to the file
    console.log('\nWriting updated data to file...');
    fs.writeFileSync(tnDataPath, JSON.stringify(tnData, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('TIMING DATA UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total backend details processed: ${totalProcessed}`);
    console.log(`Already had timing data: ${alreadyUpdated}`);
    console.log(`Newly updated with timing data: ${totalUpdated}`);
    console.log(`Services with timing data: ${servicesFound.size}`);
    console.log(`Services without timing data: ${servicesNotFound.size}`);
    
    if (servicesFound.size > 0) {
      console.log('\nServices successfully updated:');
      Array.from(servicesFound).sort().forEach(service => {
        console.log(`  ✓ ${service}`);
      });
    }
    
    if (servicesNotFound.size > 0) {
      console.log('\nServices without timing data:');
      Array.from(servicesNotFound).sort().forEach(service => {
        console.log(`  ✗ ${service}`);
      });
    }
    
    console.log('\n✅ Successfully updated TN_DATA.json with timing metrics!');
    
  } catch (error) {
    console.error('❌ Error updating timing data:', error.message);
    process.exit(1);
  }
}

// Run the update function
updateTNDataWithTiming();
