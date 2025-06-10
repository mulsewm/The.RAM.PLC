import knowledgeBase from './knowledge-base.json';

/**
 * Gets relevant context from the knowledge base based on the user's query
 * @param query The user's query
 * @returns A string containing relevant context
 */
export function getRelevantContext(query: string): string {
  if (!query) return '';
  
  const queryLower = query.toLowerCase();  
  let context = [];

  // Check company info
  if (queryLower.includes('company') || queryLower.includes('about') || queryLower.includes('the.ram')) {
    context.push(
      `Company: ${knowledgeBase.company.name} - ${knowledgeBase.company.tagline}`,
      `Description: ${knowledgeBase.company.description}`,
      `Founded: ${knowledgeBase.company.foundingYear}`,
      `Headquarters: ${knowledgeBase.company.headquarters}`
    );
  }

  // Check services
  if (queryLower.includes('service') || queryLower.includes('what do you offer')) {
    context.push('Our Services:');
    knowledgeBase.coreServices.forEach(service => {
      context.push(
        `- ${service.name}: ${service.description}`,
        `  Benefits: ${service.benefits.join(', ')}`
      );
    });
  }

  // Check specific services
  knowledgeBase.coreServices.forEach(service => {
    const serviceWithKeywords = service as { 
      name: string; 
      description: string; 
      benefits: string[]; 
      keywords?: string[] 
    };
    
    if (queryLower.includes(serviceWithKeywords.name.toLowerCase()) || 
        (serviceWithKeywords.keywords && serviceWithKeywords.keywords.some(k => queryLower.includes(k.toLowerCase())))) {
      context.push(
        `${serviceWithKeywords.name}: ${serviceWithKeywords.description}`,
        `Benefits: ${serviceWithKeywords.benefits.join(', ')}`
      );
    }
  });

  // Add contact info if asked
  if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('phone')) {
    context.push(
      'Contact Information:',
      `Email: ${knowledgeBase.contact.email}`,
      `Phone: ${knowledgeBase.contact.phone}`,
      `Address: ${knowledgeBase.contact.address}`
    );
  }

  return context.length > 0 
    ? context.join('\n')
    : getFallbackResponse();
}

/**
 * Gets a fallback response when no relevant context is found
 * @param message Optional user message to include in the fallback response
 * @returns A generic fallback response
 */
export function getFallbackResponse(message?: string): string {
  let response = "I'm an AI assistant for The.RAM.PLC. ";
  
  if (message) {
    response += `I'm not sure how to respond to "${message}". `;
  } else {
    response += "I couldn't find specific information about your query. ";
  }
  
  response += "I can help you with questions about our services, company information, or direct you to the right contact. " +
    "Would you like to know more about our verification services, background checks, or compliance solutions?";
    
  return response;
}

// Export the knowledge base for direct access if needed
export { knowledgeBase };
