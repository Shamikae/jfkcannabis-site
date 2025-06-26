import React, { useState } from 'react';
import { Brain, Send, AlertTriangle, X } from 'lucide-react';

interface AskAIProps {
  onClose: () => void;
}

const AskAI: React.FC<AskAIProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [conversation, setConversation] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Add user question to conversation
    setConversation(prev => [...prev, { role: 'user', content: question }]);
    
    // Simulate AI processing
    setIsLoading(true);
    
    // In a real implementation, this would call an API endpoint
    setTimeout(() => {
      let aiResponse = '';
      
      // Generate mock responses based on keywords in the question
      const lowerCaseQuestion = question.toLowerCase();
      
      if (lowerCaseQuestion.includes('migraine') || lowerCaseQuestion.includes('headache')) {
        aiResponse = "Based on your question about migraines, I can suggest exploring products with CBD and low THC content. Many users report that CBD-dominant products may help with headache symptoms. Our CBD Recovery Balm can be applied to temples and neck, or you might consider a 1:1 CBD:THC tincture for sublingual use. Remember, while cannabis may help manage symptoms for some people, it's not a medical treatment, and effects vary by individual. Would you like me to show you some specific products?";
      } 
      else if (lowerCaseQuestion.includes('sleep') || lowerCaseQuestion.includes('insomnia')) {
        aiResponse = "For sleep-related concerns, products containing CBN and indica strains with myrcene terpenes are popular choices among our customers. The 1906 PM Gummies with CBN or our Nanticoke Sleep Mints are specifically formulated with sleep in mind. Many users also prefer indica flower like OG Kush for evening use. These products are not medical treatments, but some users find them helpful as part of their nighttime routine. Would you like to see our sleep-focused products?";
      }
      else if (lowerCaseQuestion.includes('anxiety') || lowerCaseQuestion.includes('stress')) {
        aiResponse = "Many cannabis consumers choose products with balanced CBD:THC ratios for stress management. Terpenes like linalool (found in lavender) and limonene may also contribute to relaxing effects. Our MFNY Premium Tincture offers a balanced cannabinoid profile, and strains like Blue Dream are popular for their balanced effects. Remember that cannabis affects everyone differently, and what works for one person may not work for another. Would you like to explore some of these options?";
      }
      else if (lowerCaseQuestion.includes('pain') || lowerCaseQuestion.includes('inflammation')) {
        aiResponse = "For discomfort management, many consumers explore products with both CBD and THC, as they may work together through the entourage effect. Topicals like our CBD Recovery Balm can be applied directly to specific areas, while tinctures offer systemic effects. Terpenes like beta-caryophyllene, which binds to CB2 receptors, are also of interest to many consumers. These products are not medical treatments, but some users incorporate them into their wellness routines. Would you like to see some specific product recommendations?";
      }
      else {
        aiResponse = "Thank you for your question. While I can provide information about cannabis products and their reported effects, I'm not able to make medical claims or diagnose conditions. Many of our customers explore different products based on their personal wellness goals. Would you like me to suggest some popular products that might align with your interests?";
      }
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsLoading(false);
      setQuestion('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-primary-600 text-white">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <h3 className="font-bold">Ask AI About Cannabis</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Disclaimer */}
        <div className="bg-amber-50 p-3 border-b border-amber-100">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              This AI assistant provides information about cannabis products, not medical advice. 
              Always consult a healthcare professional for medical concerns.
            </p>
          </div>
        </div>
        
        {/* Conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          {conversation.length === 0 && (
            <div className="bg-neutral-100 p-4 rounded-lg">
              <p className="text-neutral-700">
                Hi there! I'm your cannabis AI assistant. I can help answer questions about cannabis products, 
                effects, consumption methods, and more. What would you like to know?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setQuestion("What products might help with sleep?")}
                  className="text-sm text-left p-2 bg-white rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  What products might help with sleep?
                </button>
                <button 
                  onClick={() => setQuestion("How can cannabis help with anxiety?")}
                  className="text-sm text-left p-2 bg-white rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  How can cannabis help with anxiety?
                </button>
                <button 
                  onClick={() => setQuestion("What are terpenes?")}
                  className="text-sm text-left p-2 bg-white rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  What are terpenes?
                </button>
                <button 
                  onClick={() => setQuestion("What's the difference between THC and CBD?")}
                  className="text-sm text-left p-2 bg-white rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  What's the difference between THC and CBD?
                </button>
              </div>
            </div>
          )}
          
          {/* Conversation messages */}
          {conversation.map((message, index) => (
            <div 
              key={index} 
              className={`${
                message.role === 'user' 
                  ? 'bg-primary-100 ml-12' 
                  : 'bg-neutral-100 mr-12'
              } p-4 rounded-lg`}
            >
              <p className={message.role === 'user' ? 'text-primary-800' : 'text-neutral-700'}>
                {message.content}
              </p>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-neutral-100 p-4 rounded-lg mr-12 flex items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-neutral-400 rounded-full"></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full"></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full"></div>
              </div>
              <span className="ml-3 text-neutral-500 text-sm">AI is thinking...</span>
            </div>
          )}
        </div>
        
        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t p-4 flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about cannabis products, effects, or consumption methods..."
            className="flex-1 p-2 border border-neutral-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700 disabled:opacity-50"
            disabled={isLoading || !question.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAI;