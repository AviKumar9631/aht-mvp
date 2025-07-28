# Gemini AI Integration

This application integrates with Google's Gemini AI API to analyze backend service response XML data and provide intelligent insights to contact center agents.

## Setup

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
2. Create a `.env` file in the root directory (copy from `.env.example`)
3. Set your API key in the `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

## How it works

### Automatic Analysis
- When IVR session data is loaded with backend details, the Gemini API is automatically called
- All `RESPONSE_XML` data from backend services is sent to Gemini for analysis
- AI insights are added to the "AI Suggestions" panel

### Manual Analysis
- Click the 🤖 bot icon in the top navigation to manually trigger analysis
- The button is disabled when no backend data is available
- Loading state is shown during API calls

### Response Format
The Gemini API analyzes:
- Customer information from XML responses
- Service status and potential issues
- Recommendations for agent actions
- Context from multiple backend services

### AI Suggestions
Gemini responses appear in the AI Suggestions panel with:
- Type: "insight" 
- High confidence rating (95%)
- Source: "gemini_ai"
- Prefixed with "🤖 AI Analysis:"

## Example Backend Data Structure

The system analyzes `RESPONSE_XML` fields from backend services like:

```json
{
  "SERVICE_NAME": "Product Info",
  "STATUS": "S",
  "TIME_TAKEN": "1234",
  "RESPONSE_XML": {
    "RxPSProductInfoResponse": {
      "RxSessionId": "41515728",
      "CustomerServiceRecord": {
        "BillingName": "CUSTOMER NAME",
        "BillingAddress": { ... },
        // ... more customer data
      }
    }
  }
}
```

## Debug Panel

The debug panel shows:
- Gemini API status (Ready/Processing/Completed)
- Number of backend services with XML data
- Timestamp of last analysis

## Error Handling

- API errors are caught and displayed in AI Suggestions
- Network issues show helpful error messages
- Missing API key falls back to placeholder text

## API Limits

- Follow Google's Gemini API usage limits
- Consider implementing rate limiting for production use
- Monitor API costs based on token usage
