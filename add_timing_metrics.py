import json
import re

# Define the timing data mapping
timing_data = {
    "Health Check": {"Average_Elapsed_Time_ms": 15080.61538, "MAX_TIME": 25000, "MIN_TIME": 10000},
    "GetPollDslamInfo": {"Average_Elapsed_Time_ms": 13573.8, "MAX_TIME": 20000, "MIN_TIME": 8000},
    "AppointmentInfo": {"Average_Elapsed_Time_ms": 10946.32692, "MAX_TIME": 18000, "MIN_TIME": 6000},
    "AutopayCompletion": {"Average_Elapsed_Time_ms": 7739.5, "MAX_TIME": 12000, "MIN_TIME": 4000},
    "Self Help Info": {"Average_Elapsed_Time_ms": 7276.481383, "MAX_TIME": 11500, "MIN_TIME": 3800},
    "Wireless Credential Notification": {"Average_Elapsed_Time_ms": 6782.5, "MAX_TIME": 10500, "MIN_TIME": 3500},
    "Wireless Modem Info": {"Average_Elapsed_Time_ms": 5916.418478, "MAX_TIME": 9200, "MIN_TIME": 3000},
    "Product Info": {"Average_Elapsed_Time_ms": 5786.835777, "MAX_TIME": 9000, "MIN_TIME": 2800},
    "AuthorizePayment": {"Average_Elapsed_Time_ms": 5420.824138, "MAX_TIME": 8500, "MIN_TIME": 2700},
    "BMSpeedUpgrade": {"Average_Elapsed_Time_ms": 5299.582524, "MAX_TIME": 8200, "MIN_TIME": 2600},
    "BMDataSource": {"Average_Elapsed_Time_ms": 5297.669903, "MAX_TIME": 8200, "MIN_TIME": 2600},
    "Outage Info": {"Average_Elapsed_Time_ms": 4591.359447, "MAX_TIME": 7200, "MIN_TIME": 2200},
    "RxDataSource": {"Average_Elapsed_Time_ms": 2941.331014, "MAX_TIME": 4800, "MIN_TIME": 1500},
    "Ticket Info": {"Average_Elapsed_Time_ms": 2929.415323, "MAX_TIME": 4800, "MIN_TIME": 1500},
    "RxSessionLessOutageInfoByTN": {"Average_Elapsed_Time_ms": 2820.689178, "MAX_TIME": 4600, "MIN_TIME": 1400},
    "Modem Reboot": {"Average_Elapsed_Time_ms": 247, "MAX_TIME": 247, "MIN_TIME": 1000},
    "Close Session": {"Average_Elapsed_Time_ms": 54, "MAX_TIME": 50, "MIN_TIME": 1000}
}

# Load the TN_DATA.json file
try:
    with open('src/utils/TN_DATA.json', 'r') as file:
        tn_data = json.load(file)
    
    # Process each backend entry
    total_updated = 0
    services_found = set()
    
    for backend_entry in tn_data.get('backend', []):
        if 'backendDetail' in backend_entry and isinstance(backend_entry['backendDetail'], list):
            for detail in backend_entry['backendDetail']:
                service_name = detail.get('SERVICE_NAME')
                
                if service_name in timing_data:
                    # Add timing metrics to the backend detail
                    detail['Average_Elapsed_Time_ms'] = timing_data[service_name]['Average_Elapsed_Time_ms']
                    detail['MAX_TIME'] = timing_data[service_name]['MAX_TIME']
                    detail['MIN_TIME'] = timing_data[service_name]['MIN_TIME']
                    
                    total_updated += 1
                    services_found.add(service_name)
                    print(f"Added timing data for: {service_name}")
                else:
                    print(f"No timing data found for: {service_name}")
    
    # Write the updated data back to the file
    with open('src/utils/TN_DATA.json', 'w') as file:
        json.dump(tn_data, file, indent=2)
    
    print(f"\nSuccessfully updated {total_updated} backend details with timing metrics")
    print(f"Services updated: {sorted(services_found)}")
    
except Exception as e:
    print(f"Error: {e}")
