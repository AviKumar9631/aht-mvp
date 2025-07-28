                // Special handling for Gemini Transcript Analysis  
                if (suggestion.source === 'gemini_transcript') {
                  const analysisText = suggestion.text.replace('📋 Transcript Analysis: ', '');
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Transcript Analysis</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {suggestion.confidence}% Confidence
                        </span>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        {analysisText.split('\n').map((line, lineIndex) => {
                          const trimmedLine = line.trim();
                          
                          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                            // Header line
                            return (
                              <h5 key={lineIndex} className="font-semibold text-gray-900 mt-3 mb-2 text-sm">
                                {trimmedLine.replace(/\*\*/g, '')}
                              </h5>
                            );
                          } else if (trimmedLine.startsWith('* **') || trimmedLine.startsWith('*')) {
                            // Bullet point
                            return (
                              <div key={lineIndex} className="mb-2 pl-3">
                                <p className="text-gray-800 text-sm leading-relaxed" 
                                   dangerouslySetInnerHTML={{
                                     __html: trimmedLine.replace(/^\*\s*/, '• ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   }} />
                              </div>
                            );
                          } else if (trimmedLine.length > 0) {
                            // Regular paragraph
                            return (
                              <p key={lineIndex} className="text-gray-800 text-sm leading-relaxed mb-2" 
                                 dangerouslySetInnerHTML={{
                                   __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                 }} />
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-green-100 pt-2">
                        <span>📋 Generated from Transcript</span>
                        <span>Analyzed {transcript.filter(msg => !msg.isSystem).length} messages</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <button className="text-xs text-green-600 hover:text-green-800 flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-800 flex items-center">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not helpful
                        </button>
                        <button 
                          onClick={() => callGeminiAPIWithTranscript(transcript)}
                          className="text-xs text-green-600 hover:text-green-800 flex items-center ml-auto"
                          disabled={geminiApiLoading}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Refresh Analysis
                        </button>
                      </div>
                    </div>
                  );
                }
