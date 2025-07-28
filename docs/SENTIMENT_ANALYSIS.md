# Customer Sentiment Analysis Integration

This document describes the comprehensive customer sentiment analysis feature integrated into the Contact Center UI using Gemini AI.

## Overview

The sentiment analysis system provides real-time monitoring of customer emotional states throughout the call lifecycle, enabling agents to respond appropriately and supervisors to identify escalation risks.

## Features

### 1. Real-time Sentiment Monitoring
- Analyzes customer messages every 3 interactions during active calls
- Provides immediate feedback on customer emotional state
- Updates sentiment trends continuously

### 2. Multi-stage Analysis
- **Call Start**: Initial sentiment assessment when first customer interaction occurs
- **Real-time**: Ongoing analysis every 3 customer messages
- **Call End**: Comprehensive final sentiment analysis

### 3. Sentiment Metrics
- **Overall Sentiment**: positive, neutral, negative
- **Sentiment Score**: 0.0 to 1.0 numerical rating
- **Confidence Level**: AI confidence percentage
- **Customer State**: calm, frustrated, angry, satisfied, confused, anxious, impatient
- **Escalation Risk**: low, medium, high
- **Satisfaction Prediction**: likely_satisfied, neutral, likely_dissatisfied

### 4. Emotional Indicators
- Identifies specific emotions (frustration, satisfaction, confusion, anger, joy, concern, trust)
- Categorizes intensity levels (low, medium, high)
- Extracts keywords that indicate each emotion

### 5. Visual Dashboard Components

#### Sentiment Overview Panel
- Real-time sentiment indicator with color coding
- Current customer state display
- Escalation risk assessment
- Satisfaction prediction
- Emotional indicators with intensity levels
- Quick action recommendations for high-risk situations

#### AI Suggestions Integration
- Sentiment analysis appears in AI suggestions panel
- Special formatting for sentiment insights
- Actionable recommendations based on emotional state
- Escalation warnings with high-risk indicators

#### Summary Statistics
- Integrated into AI suggestions stats
- Risk level indicator
- Sentiment trend display
- Real-time updates

### 6. Manual Controls
- Manual sentiment analysis trigger button
- Test conversation generator for development
- Refresh sentiment option in AI suggestions

## Technical Implementation

### State Management
```jsx
// Core sentiment state variables
const [currentSentiment, setCurrentSentiment] = useState(null);
const [sentimentHistory, setSentimentHistory] = useState([]);
const [sentimentTrend, setSentimentTrend] = useState('neutral');
const [emotionalIndicators, setEmotionalIndicators] = useState([]);
const [escalationRisk, setEscalationRisk] = useState('low');
const [sentimentAnalysisLoading, setSentimentAnalysisLoading] = useState(false);
```

### Gemini API Integration
- Uses Gemini 2.0 Flash model for sentiment analysis
- Structured JSON response format
- Robust error handling with fallback analysis
- Automatic cleanup of markdown formatting

### useEffect Hooks
1. **Real-time Analysis**: Triggers every 3 customer messages during active calls
2. **Call Start Analysis**: Initial assessment when customer interaction begins
3. **Call End Analysis**: Comprehensive final sentiment evaluation

### Data Persistence
- Sentiment data included in resolution completion logs
- Historical sentiment tracking with timestamps
- Integration with existing resolution data structure

## API Response Format

```json
{
  "overallSentiment": "positive|neutral|negative",
  "sentimentScore": 0.85,
  "confidence": 95,
  "emotionalIndicators": [
    {
      "emotion": "frustration|satisfaction|confusion|anger|joy|concern|trust",
      "intensity": "low|medium|high",
      "keywords": ["specific", "words", "that", "indicate", "this", "emotion"]
    }
  ],
  "escalationRisk": "low|medium|high",
  "escalationFactors": ["reason1", "reason2"],
  "sentimentTrend": "improving|stable|declining",
  "keyInsights": [
    "Customer shows signs of frustration with wait times",
    "Positive response to agent's explanation"
  ],
  "recommendations": [
    "Acknowledge the customer's frustration",
    "Provide clear timeline for resolution"
  ],
  "riskFactors": [
    "Multiple failed attempts mentioned",
    "Time sensitivity expressed"
  ],
  "customerState": "calm|frustrated|angry|satisfied|confused|anxious|impatient",
  "urgencyLevel": "low|medium|high",
  "satisfactionPrediction": "likely_satisfied|neutral|likely_dissatisfied"
}
```

## Error Handling

### JSON Parsing Issues
- Automatic cleanup of markdown code blocks
- Fallback text analysis when JSON parsing fails
- Basic sentiment detection from text content
- Graceful degradation with user-friendly error messages

### API Failures
- Network error handling
- Rate limiting consideration
- Fallback to manual sentiment assessment
- Error logging and user notification

## Usage Instructions

### For Agents
1. **Monitor the Sentiment Panel**: Keep an eye on the real-time sentiment indicator
2. **Watch for Escalation Warnings**: Red "HIGH RISK" indicators require immediate attention
3. **Use AI Recommendations**: Follow suggested actions based on sentiment analysis
4. **Manual Analysis**: Use the "Analyze Sentiment" button for on-demand assessment

### For Supervisors
1. **Risk Monitoring**: High escalation risk triggers automatic alerts
2. **Performance Metrics**: Sentiment trends included in call resolution data
3. **Quality Assurance**: Historical sentiment data for call review
4. **Training Opportunities**: Identify patterns in agent-customer interactions

## Development and Testing

### Test Features
- `addSentimentTestData()`: Generates sample conversation for testing
- Test button in development mode
- Console logging for debugging
- Fallback analysis for API issues

### Configuration
- API key managed through environment variables
- Configurable analysis frequency (currently every 3 messages)
- Adjustable confidence thresholds
- Customizable risk level criteria

## Future Enhancements

### Planned Features
1. **Historical Trend Analysis**: Multi-call sentiment patterns
2. **Predictive Escalation**: AI-powered escalation prediction
3. **Agent Performance Correlation**: Link sentiment outcomes to agent actions
4. **Real-time Coaching**: Live suggestions based on sentiment changes
5. **Customer Journey Mapping**: Sentiment across multiple touchpoints

### Integration Opportunities
1. **CRM Integration**: Store sentiment data in customer records
2. **Workforce Management**: Use sentiment for agent scheduling
3. **Quality Management**: Sentiment-based call scoring
4. **Training Systems**: Identify coaching opportunities

## Security and Privacy

### Data Handling
- Customer conversation data sent to Gemini API
- No permanent storage of sensitive information
- Compliance with data protection regulations
- Option for on-premises deployment

### API Security
- Secure API key management
- HTTPS encryption for all communications
- Rate limiting and usage monitoring
- Access control and authentication

## Performance Considerations

### Optimization
- Batched analysis to reduce API calls
- Efficient state management
- Minimal UI re-renders
- Asynchronous processing

### Scalability
- Designed for high-volume contact centers
- Efficient memory usage
- Graceful handling of concurrent analyses
- Load balancing considerations

---

## Conclusion

The sentiment analysis integration provides contact center agents and supervisors with powerful insights into customer emotional states, enabling proactive intervention and improved customer satisfaction outcomes. The system balances real-time responsiveness with practical usability, ensuring agents can focus on customer service while receiving valuable emotional intelligence support.
