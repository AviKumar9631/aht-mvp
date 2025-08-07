import fs from 'fs';

// Read the current TN_DATA.json file
const data = JSON.parse(fs.readFileSync('./src/utils/TN_DATA.json', 'utf8'));

// Template services based on the first comprehensive entry
const createComprehensiveServices = (tn, sessionId, callReasonCode, customerProductId, customerInfo) => {
  const baseSessionId = parseInt(sessionId);
  
  return [
    {
      "SERVICE_NAME": "Product Info",
      "RESPONSE_XML": {
        "RxPSProductInfoResponse": {
          "RxSessionId": sessionId,
          "CustomerServiceRecord": {
            "BillingName": customerInfo.name,
            "BillingAddress": {
              "ns6:StreetAddress": {
                "xmlns:ns6": "http://www.qwest.com/XMLSchema/BIM",
                "#text": customerInfo.address
              },
              "ns7:City": {
                "xmlns:ns7": "http://www.qwest.com/XMLSchema/BIM",
                "#text": customerInfo.city
              },
              "ns8:StateProvince": {
                "xmlns:ns8": "http://www.qwest.com/XMLSchema/BIM",
                "#text": customerInfo.state
              },
              "ns9:PostalCode": {
                "xmlns:ns9": "http://www.qwest.com/XMLSchema/BIM",
                "#text": customerInfo.zip
              }
            },
            "BAN": customerInfo.ban,
            "CustomerType": customerInfo.type,
            "CustomerSubType": "R",
            "SvcDeniedNonPaymentFlag": "false",
            "AccountStatus": "Open",
            "CustomerSvcDetail": {
              "ServiceID": tn,
              "ns10:WTN": {
                "xmlns:ns10": "http://www.qwest.com/XMLSchema/BIM",
                "ns10:NPA": tn.substring(0, 3),
                "ns10:NXX": tn.substring(3, 6),
                "ns10:LineNumber": tn.substring(6, 10)
              },
              "ServiceAddress": {
                "ns11:StreetAddress": {
                  "xmlns:ns11": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": customerInfo.address
                },
                "ns12:City": {
                  "xmlns:ns12": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": customerInfo.city
                },
                "ns13:StateProvince": {
                  "xmlns:ns13": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": customerInfo.state
                },
                "ns14:PostalCode": {
                  "xmlns:ns14": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": customerInfo.zipShort
                }
              },
              "CustomerProduct": [
                {
                  "CustomerProductId": customerProductId,
                  "ProductCode": "IP",
                  "ProductType": "Data",
                  "ProductStatus": "ACTIVE",
                  "ProductDescription": "Internet",
                  "SvcDeniedNonPaymentFlag": "false",
                  "NewSvcInd": "New",
                  "ProductActivationDate": "2023-06-15",
                  "SeasonalDisconnectFlag": "false",
                  "LongDistanceFlag": "false",
                  "PendingOrderFlag": "false",
                  "AccessTechnology": "Fiber",
                  "TransportInfo": {
                    "ProvisionSpeedUp": "100000K",
                    "ProvisionSpeedDown": "100000K"
                  }
                }
              ]
            }
          },
          "CallReasonCode": callReasonCode,
          "SourceSystem": "C2E",
          "Territory": customerInfo.territory
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 3000 + 4000).toString(),
      "STATUS": "S",
      "Average_Elapsed_Time_ms": Math.floor(Math.random() * 2000 + 5000),
      "MAX_TIME": Math.floor(Math.random() * 2000 + 8000),
      "MIN_TIME": Math.floor(Math.random() * 1000 + 2500)
    },
    {
      "SERVICE_NAME": "Health Check",
      "RESPONSE_XML": {
        "RxPSHealthCheckResponse": {
          "RxSessionId": sessionId,
          "HealthCheckInfo": {
            "CustomerProductId": customerProductId
          },
          "CallReasonCode": callReasonCode
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 8000 + 12000).toString(),
      "STATUS": "S",
      "Average_Elapsed_Time_ms": Math.floor(Math.random() * 3000 + 14000),
      "MAX_TIME": Math.floor(Math.random() * 5000 + 20000),
      "MIN_TIME": Math.floor(Math.random() * 2000 + 9000)
    },
    {
      "SERVICE_NAME": "Outage Info",
      "RESPONSE_XML": {
        "RxPSOutageInfoResponse": {
          "RxSessionId": sessionId,
          "CallReasonCode": callReasonCode,
          "EmailAddress": customerInfo.email,
          "SMSNumber": {
            "ns6:NPA": {
              "xmlns:ns6": "http://www.qwest.com/XMLSchema/BIM",
              "#text": tn.substring(0, 3)
            },
            "ns7:NXX": {
              "xmlns:ns7": "http://www.qwest.com/XMLSchema/BIM",
              "#text": tn.substring(3, 6)
            },
            "ns8:LineNumber": {
              "xmlns:ns8": "http://www.qwest.com/XMLSchema/BIM",
              "#text": tn.substring(6, 10)
            }
          }
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 800 + 1200).toString(),
      "STATUS": "S"
    },
    {
      "SERVICE_NAME": "Ticket Info",
      "RESPONSE_XML": {
        "RxPSTicketInfoResponse": {
          "RxSessionId": sessionId,
          "CallReasonCode": callReasonCode,
          "TicketInfo": {
            "CustomerProductId": customerProductId,
            "Ticket": {
              "TicketNumber": customerInfo.ticketNumber,
              "TicketStatus": "CLOSED",
              "NativeTroubleTicketNumber": customerInfo.ticketNumber,
              "OriginatingSessionId": "RX38833" + Math.floor(Math.random() * 900 + 100),
              "CanCompleteHandoffFlag": "false",
              "CanRescheduleFlag": "false",
              "CanCloseTicketFlag": "false",
              "isCompanyMiss": "false",
              "CompanyMissSubReasonCd": null,
              "SourceSystem": "LMOS",
              "CommitmentDateTime": {
                "timeInCustomerTimezone": "true",
                "timeZoneAbbreviation": "EST",
                "#text": "07/25/25 15:00"
              },
              "CreateDateTime": {
                "timeInCustomerTimezone": "true",
                "timeZoneAbbreviation": "EST",
                "#text": "07/23/25 10:30"
              },
              "ClosedDateTime": {
                "timeInCustomerTimezone": "true",
                "timeZoneAbbreviation": "EST",
                "#text": "07/25/25 14:45"
              },
              "PastDueFlag": "false",
              "CanBeReachedTN": {
                "ns6:NPA": {
                  "xmlns:ns6": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": tn.substring(0, 3)
                },
                "ns7:NXX": {
                  "xmlns:ns7": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": tn.substring(3, 6)
                },
                "ns8:LineNumber": {
                  "xmlns:ns8": "http://www.qwest.com/XMLSchema/BIM",
                  "#text": tn.substring(6, 10)
                }
              }
            }
          },
          "BuriedServiceWireFetchOperations": {
            "status": "SUCCESS",
            "DataFetchResult": {
              "KeyUsed": {
                "keyName": "Service_TN",
                "#text": tn.substring(0, 3) + "-" + tn.substring(3, 6) + "-" + tn.substring(6, 10)
              },
              "ResultCode": "SUCCESS",
              "Message": "No dispatches were found based on the provided information."
            }
          }
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 1000 + 2500).toString(),
      "STATUS": "S"
    },
    {
      "SERVICE_NAME": "Self Help Info",
      "RESPONSE_XML": {
        "RxPSSelfHelpEligibiltyResponse": {
          "RxSessionId": sessionId,
          "CallReasonCode": callReasonCode,
          "SelfHelpCode": "Offer",
          "ChronicCustomer": "false",
          "RuleName": "StandardOffer"
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 2000 + 6000).toString(),
      "STATUS": "S"
    },
    {
      "SERVICE_NAME": "Wireless Credential Notification",
      "RESPONSE_XML": {
        "RxPSWirelessCredentialsNotificationResponse": {
          "RxSessionId": sessionId
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 100 + 200).toString(),
      "STATUS": Math.random() > 0.7 ? "F" : "S"
    },
    {
      "SERVICE_NAME": "MLT Info",
      "RESPONSE_XML": {
        "RxPSMLTInfoResponse": {
          "RxSessionId": sessionId,
          "MLTDetail": {
            "CustomerProductId": customerProductId,
            "TN": tn,
            "MLTServiceRequestType": "Initiate",
            "RecommendationDetail": {
              "Recommendation": "Poll",
              "ResponseStatus": null,
              "ResponseMessage": null,
              "ResponseCode": "-1"
            }
          }
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 50 + 70).toString(),
      "STATUS": "S"
    },
    {
      "SERVICE_NAME": "Set POC",
      "RESPONSE_XML": {
        "RxPSSetPOCResponse": {
          "RxSessionId": sessionId,
          "CallReasonCode": callReasonCode
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 50 + 130).toString(),
      "STATUS": "S"
    },
    {
      "SERVICE_NAME": "Modem Reboot",
      "RESPONSE_XML": {
        "RxPSModemRebootResponse": {
          "RxSessionId": sessionId,
          "RebootDetail": {
            "CustomerProductId": customerProductId,
            "TN": tn,
            "ModemRebootRequestType": "Initiate",
            "RebootStatus": Math.random() > 0.3 ? "Success" : "Failed"
          }
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 200 + 250).toString(),
      "STATUS": Math.random() > 0.3 ? "S" : "F"
    },
    {
      "SERVICE_NAME": "Wireless Modem Info",
      "RESPONSE_XML": {
        "RxPSWirelessModemInfoResponse": {
          "RxSessionId": sessionId,
          "ModemInfo": {
            "CustomerProductId": customerProductId,
            "ModemModel": "FiberGateway3000",
            "ModemStatus": "ONLINE",
            "SignalStrength": Math.random() > 0.5 ? "Excellent" : "Good"
          }
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 100 + 180).toString(),
      "STATUS": Math.random() > 0.2 ? "S" : "F"
    },
    {
      "SERVICE_NAME": "Close Session",
      "RESPONSE_XML": {
        "RxPSSessionCloseResponse": {
          "RxSessionId": sessionId,
          "CallReasonCode": callReasonCode
        }
      },
      "TIME_TAKEN": Math.floor(Math.random() * 30 + 45).toString(),
      "STATUS": "S"
    }
  ];
};

// Customer info templates
const customerTemplates = [
  { name: "ALEX JONES", address: "100 MAIN ST", city: "DENVER", state: "CO", zip: "80201-1000", zipShort: "80201", ban: "300000001", type: "Consumer", territory: "L-Q", email: "ajones@email.com", ticketNumber: "DEN10001" },
  { name: "MARY WILSON", address: "200 ELM AVE", city: "PHOENIX", state: "AZ", zip: "85001-2000", zipShort: "85001", ban: "400000002", type: "Consumer", territory: "SW-AZ", email: "mwilson@email.com", ticketNumber: "PHX20002" },
  { name: "JAMES BROWN", address: "300 OAK BLVD", city: "SEATTLE", state: "WA", zip: "98101-3000", zipShort: "98101", ban: "500000003", type: "Consumer", territory: "NW-WA", email: "jbrown@email.com", ticketNumber: "SEA30003" },
  { name: "LISA DAVIS", address: "400 PINE RD", city: "PORTLAND", state: "OR", zip: "97204-4000", zipShort: "97204", ban: "600000004", type: "Consumer", territory: "NW-OR", email: "ldavis@email.com", ticketNumber: "POR40004" },
  { name: "MIKE MILLER", address: "500 CEDAR LN", city: "LAS VEGAS", state: "NV", zip: "89109-5000", zipShort: "89109", ban: "700000005", type: "Consumer", territory: "SW-NV", email: "mmiller@email.com", ticketNumber: "LAS50005" }
];

// Find entries that need enhancement (less than 5 services)
const incompleteEntries = data.backend.filter(entry => entry.backendDetail.length < 5);

console.log(`Found ${incompleteEntries.length} entries to enhance...`);

// Enhance each incomplete entry
let sessionCounter = 41515740;
let productIdCounter = 138663970;

incompleteEntries.forEach((entry, index) => {
  const customerInfo = customerTemplates[index % customerTemplates.length];
  const sessionId = (sessionCounter + index).toString();
  const callReasonCode = "DVA" + (70 + index);
  const customerProductId = (productIdCounter + index).toString();
  
  console.log(`Enhancing TN: ${entry.tn} (${index + 1}/${incompleteEntries.length})`);
  
  // Replace the minimal backend detail with comprehensive services
  entry.backendDetail = createComprehensiveServices(
    entry.tn,
    sessionId,
    callReasonCode,
    customerProductId,
    customerInfo
  );
});

// Write the enhanced data back to the file
fs.writeFileSync('./src/utils/TN_DATA.json', JSON.stringify(data, null, 2));

console.log(`\nSuccessfully enhanced ${incompleteEntries.length} TN entries with comprehensive backend details!`);
console.log("Each entry now has 11 comprehensive services with realistic timing metrics and XML responses.");
