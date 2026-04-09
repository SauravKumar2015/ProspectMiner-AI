const axios = require('axios');

class WebsiteCrawler {
  async crawlWebsite(url, timeout = 10000) {
    if (!url || url === '#') {
      return null;
    }
    
    try {
      let fullUrl = url;
      if (!url.startsWith('http')) {
        fullUrl = 'https://' + url;
      }
      
      const response = await axios.get(fullUrl, {
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        maxRedirects: 5
      });
      
      const html = response.data;
      const text = this.extractTextFromHtml(html);
      
      return {
        url: fullUrl,
        content: text.substring(0, 5000),
        title: this.extractTitle(html)
      };
      
    } catch (error) {
      console.log(`Failed to crawl ${url}: ${error.message}`);
      return null;
    }
  }
  
  extractTextFromHtml(html) {
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"');
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }
  
  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }
}

module.exports = new WebsiteCrawler();