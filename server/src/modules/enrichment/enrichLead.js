const websiteCrawler = require('../../scraper/websiteCrawler');

function mockLLMEnrichment(content, businessName, query) {
  const servicesKeywords = {
    dental: ['cleaning', 'whitening', 'implants', 'crowns', 'root canal', 'orthodontics', 'braces'],
    medical: ['consultation', 'diagnosis', 'treatment', 'surgery', 'therapy', 'vaccination'],
    legal: ['consultation', 'litigation', 'contracts', 'estate planning', 'immigration'],
    realestate: ['buying', 'selling', 'renting', 'property management', 'appraisal'],
    restaurant: ['dining', 'takeout', 'delivery', 'catering', 'private events']
  };
  
  let category = 'general';
  const queryLower = query.toLowerCase();
  const nameLower = businessName.toLowerCase();
  
  for (const [cat, keywords] of Object.entries(servicesKeywords)) {
    if (keywords.some(k => queryLower.includes(k) || nameLower.includes(k))) {
      category = cat;
      break;
    }
  }
  
  const services = [];
  const relevantKeywords = servicesKeywords[category] || servicesKeywords.dental;
  
  for (const keyword of relevantKeywords) {
    if (content.toLowerCase().includes(keyword) || Math.random() > 0.7) {
      services.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
    if (services.length >= 4) break;
  }
  
  if (services.length === 0) {
    services.push('General Services');
  }
  
  const businessSlug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const emailPatterns = [
    `info@${businessSlug}.com`,
    `contact@${businessSlug}.com`,
    `hello@${businessSlug}.com`,
    `${businessSlug}@gmail.com`
  ];
  const emailPattern = emailPatterns[Math.floor(Math.random() * emailPatterns.length)];
  
  let score = 'Medium';
  const contentLength = content.length;
  const hasServices = services.length > 0;
  const hasEmailPattern = true;
  
  if (contentLength > 2000 && hasServices && hasEmailPattern) {
    score = 'High';
  } else if (contentLength < 500 || !hasServices) {
    score = 'Low';
  }
  
  const ownerNames = ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Williams', 'David Brown'];
  const ownerName = Math.random() > 0.5 ? ownerNames[Math.floor(Math.random() * ownerNames.length)] : '';
  
  return {
    services: services,
    emailPattern: emailPattern,
    ownerName: ownerName,
    score: score
  };
}

async function enrichLead(lead, query) {
  console.log(`📝 Enriching lead: ${lead.name}`);
  
  let websiteContent = '';
  
  if (lead.website && lead.website !== '#') {
    try {
      const crawledData = await websiteCrawler.crawlWebsite(lead.website);
      if (crawledData) {
        websiteContent = crawledData.content;
        console.log(`✅ Successfully crawled ${lead.website}`);
      }
    } catch (error) {
      console.log(`⚠️ Failed to crawl ${lead.website}: ${error.message}`);
    }
  }
  
  const enrichment = mockLLMEnrichment(websiteContent, lead.name, query);
  
  return enrichment;
}

module.exports = enrichLead;