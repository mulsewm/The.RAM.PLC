import knowledgeBase from '@/data/knowledge-base.json';

type KnowledgeBase = typeof knowledgeBase;

export function getRelevantContext(query: string): string {
  const queryLower = query.toLowerCase();
  let context = '';

  // Check for company information
  if (/about|company|who are you|what is the.ram/i.test(queryLower)) {
    context += `Company: ${knowledgeBase.company.name}\n`;
    context += `${knowledgeBase.company.description}\n\n`;
  }

  // Check for services
  if (/service|what do you do|offer|provide|solution/i.test(queryLower)) {
    context += 'Services we offer:\n';
    knowledgeBase.coreServices.forEach(service => {
      context += `- ${service.name}: ${service.description}\n`;
    });
    context += '\n';
  }

  // Check for specific service details
  knowledgeBase.coreServices.forEach(service => {
    if (queryLower.includes(service.name.toLowerCase())) {
      context += `${service.name}: ${service.description}\n`;
      context += 'Benefits:\n';
      service.benefits.forEach(benefit => {
        context += `- ${benefit}\n`;
      });
      context += '\n';
    }
  });

  // Check for contact information
  if (/contact|email|phone|address|reach|where are you/i.test(queryLower)) {
    context += 'Contact Information:\n';
    context += `Email: ${knowledgeBase.contact.email}\n`;
    context += `Phone: ${knowledgeBase.contact.phone}\n`;
    context += `Address: ${knowledgeBase.contact.address}\n`;
    context += `Working Hours: ${knowledgeBase.contact.workingHours}\n\n`;
  }

  // Check for FAQs
  knowledgeBase.faqs.forEach(faq => {
    if (queryLower.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
      context += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    }
  });

  // If no specific context found, provide general information
  if (!context) {
    context = `The.RAM.PLC is a leading AI-powered verification and compliance company operating across Africa. `;
    context += `We offer services including ${knowledgeBase.coreServices.map(s => s.name).join(', ')}. `;
    context += `For more specific information, please ask about our services, company information, or contact details.`;
  }

  return context;
}

export function getFallbackResponse(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Check greetings
  if (/hello|hi|hey|greeting/i.test(queryLower)) {
    return "Hello! 👋 I'm the.RAM chat assistant. How can I help you today?";
  }
  
  // Get context from knowledge base
  const context = getRelevantContext(queryLower);
  
  // If we found relevant context, use it
  if (context && !context.includes('The.RAM.PLC is a leading')) {
    return context;
  }
  
  // Default fallback
  return "I'm sorry, I can't process your request at the moment. Please try again later or contact us directly at support@theramplc.com.";
}
