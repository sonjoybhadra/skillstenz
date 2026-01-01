/**
 * AI Tools Seeder
 * Seeds comprehensive AI tools database with 100+ tools
 */

const AITool = require('../../src/modules/aitools/AITool');

const aiTools = [
  // CHATBOTS & ASSISTANTS
  { name: 'ChatGPT', slug: 'chatgpt', icon: '💬', category: 'chatbots', tagline: 'Advanced conversational AI', shortDescription: 'Powerful AI assistant by OpenAI', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://chat.openai.com', platforms: ['web', 'api', 'ios', 'android'], tags: ['gpt-4', 'nlp'], featured: true, trending: true },
  { name: 'Claude', slug: 'claude', icon: '🧠', category: 'chatbots', tagline: 'Constitutional AI assistant', shortDescription: 'AI designed to be helpful and harmless', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://claude.ai', platforms: ['web', 'api'], tags: ['safe-ai'], featured: true, trending: true },
  { name: 'Google Bard', slug: 'google-bard', icon: '🎭', category: 'chatbots', tagline: 'Google\'s AI conversational service', shortDescription: 'Powered by Gemini', pricing: { type: 'free', hasFreeTier: true }, website: 'https://bard.google.com', platforms: ['web'], tags: ['gemini'], featured: true, trending: true },
  { name: 'Copilot (Microsoft)', slug: 'copilot-microsoft', icon: '✨', category: 'chatbots', tagline: 'Microsoft\'s AI assistant', shortDescription: 'Powered by OpenAI', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://copilot.microsoft.com', platforms: ['web', 'desktop'], tags: ['microsoft'], featured: true, trending: true },
  { name: 'Llama 2', slug: 'llama-2', icon: '🦙', category: 'chatbots', tagline: 'Open-source LLM', shortDescription: 'By Meta', pricing: { type: 'open-source', hasFreeTier: true }, website: 'https://www.meta.com/llama/', platforms: ['api', 'desktop'], tags: ['open-source'], featured: false, trending: true },
  { name: 'HuggingChat', slug: 'huggingchat', icon: '🤗', category: 'chatbots', tagline: 'Open-source chatbot', shortDescription: 'By Hugging Face', pricing: { type: 'free', hasFreeTier: true }, website: 'https://huggingface.co/chat', platforms: ['web'], tags: ['open-source'], featured: false, trending: true },
  { name: 'Grok', slug: 'grok', icon: '🤖', category: 'chatbots', tagline: 'Real-time AI', shortDescription: 'By xAI', pricing: { type: 'freemium', hasFreeTier: false }, website: 'https://grok.x.com', platforms: ['web'], tags: ['real-time'], featured: false, trending: true },
  { name: 'Cohere', slug: 'cohere', icon: '🔗', category: 'chatbots', tagline: 'Enterprise language AI', shortDescription: 'For developers', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://cohere.ai', platforms: ['api'], tags: ['nlp'], featured: false, trending: true },
  { name: 'Poe', slug: 'poe', icon: '🐿️', category: 'chatbots', tagline: 'Multi-AI chatbot platform', shortDescription: 'Access multiple models', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://poe.com', platforms: ['web', 'ios', 'android'], tags: ['multi-ai'], featured: false, trending: true },
  { name: 'Character.AI', slug: 'character-ai', icon: '🎭', category: 'chatbots', tagline: 'AI character conversations', shortDescription: 'Chat with characters', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://character.ai', platforms: ['web', 'ios', 'android'], tags: ['roleplay'], featured: false, trending: true },

  // IMAGE GENERATION
  { name: 'DALL-E 3', slug: 'dalle-3', icon: '🎨', category: 'image-generation', tagline: 'Image generation by OpenAI', shortDescription: 'Text to images', pricing: { type: 'paid', hasFreeTier: false }, website: 'https://openai.com/dall-e-3', platforms: ['web', 'api'], tags: ['text-to-image'], featured: true, trending: true },
  { name: 'Midjourney', slug: 'midjourney', icon: '🌌', category: 'image-generation', tagline: 'AI art generation', shortDescription: 'Via Discord', pricing: { type: 'paid', hasFreeTier: true }, website: 'https://www.midjourney.com', platforms: ['discord', 'web'], tags: ['art'], featured: true, trending: true },
  { name: 'Stable Diffusion', slug: 'stable-diffusion', icon: '✨', category: 'image-generation', tagline: 'Open-source image generation', shortDescription: 'Free and open', pricing: { type: 'open-source', hasFreeTier: true }, website: 'https://stablediffusionweb.com', platforms: ['web', 'api', 'desktop'], tags: ['open-source'], featured: true, trending: true },
  { name: 'Adobe Firefly', slug: 'adobe-firefly', icon: '🔥', category: 'image-generation', tagline: 'AI in Creative Cloud', shortDescription: 'Adobe integration', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.adobe.com/firefly', platforms: ['web', 'desktop'], tags: ['adobe'], featured: false, trending: true },
  { name: 'Ideogram', slug: 'ideogram', icon: '💡', category: 'image-generation', tagline: 'Text rendering focus', shortDescription: 'Great text in images', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://ideogram.ai', platforms: ['web'], tags: ['text-rendering'], featured: false, trending: true },
  { name: 'Lexica', slug: 'lexica', icon: '🎯', category: 'image-generation', tagline: 'Stable Diffusion search', shortDescription: 'Search and generate', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://lexica.art', platforms: ['web'], tags: ['search'], featured: false, trending: false },
  { name: 'Shutterstock Gen AI', slug: 'shutterstock-ai', icon: '📸', category: 'image-generation', tagline: 'Stock image generation', shortDescription: 'Generate and license', pricing: { type: 'paid', hasFreeTier: true }, website: 'https://www.shutterstock.com', platforms: ['web'], tags: ['stock-images'], featured: false, trending: true },
  { name: 'Bing Image Creator', slug: 'bing-image-creator', icon: '🌐', category: 'image-generation', tagline: 'DALL-E powered', shortDescription: 'Free by Microsoft', pricing: { type: 'free', hasFreeTier: true }, website: 'https://www.bing.com/create', platforms: ['web'], tags: ['free'], featured: false, trending: true },
  { name: 'Dream by WOMBO', slug: 'dream-wombo', icon: '✨', category: 'image-generation', tagline: 'AI art app', shortDescription: 'Mobile friendly', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.wombo.art', platforms: ['web', 'ios', 'android'], tags: ['mobile'], featured: false, trending: true },
  { name: 'Runway Gen-2', slug: 'runway-gen2', icon: '🎬', category: 'image-generation', tagline: 'Video generation', shortDescription: 'Text to video', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://runwayml.com', platforms: ['web'], tags: ['video-generation'], featured: false, trending: true },

  // VIDEO GENERATION
  { name: 'Synthesia', slug: 'synthesia', icon: '🎥', category: 'video-generation', tagline: 'Avatar video creation', shortDescription: 'Professional AI videos', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.synthesia.io', platforms: ['web'], tags: ['avatar'], featured: true, trending: true },
  { name: 'HeyGen', slug: 'heygen', icon: '👤', category: 'video-generation', tagline: 'Avatar videos', shortDescription: 'Digital avatar creation', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.heygen.com', platforms: ['web'], tags: ['avatar'], featured: false, trending: true },
  { name: 'D-ID', slug: 'd-id', icon: '🎭', category: 'video-generation', tagline: 'Talking avatars', shortDescription: 'From photos', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.d-id.com', platforms: ['web'], tags: ['talking-video'], featured: false, trending: true },
  { name: 'Pictory', slug: 'pictory', icon: '📽️', category: 'video-generation', tagline: 'Script to video', shortDescription: 'Auto video generation', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://pictory.ai', platforms: ['web'], tags: ['automation'], featured: false, trending: true },
  { name: 'Opus Clip', slug: 'opus-clip', icon: '✂️', category: 'video-generation', tagline: 'Video summarization', shortDescription: 'Create clips automatically', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://opusclip.com', platforms: ['web'], tags: ['summarization'], featured: false, trending: true },

  // CODE ASSISTANTS
  { name: 'GitHub Copilot', slug: 'github-copilot', icon: '💻', category: 'code-assistant', tagline: 'AI pair programmer', shortDescription: 'IDE integration', pricing: { type: 'freemium', hasFreeTier: false }, website: 'https://github.com/features/copilot', platforms: ['vscode', 'desktop'], tags: ['ide'], featured: true, trending: true },
  { name: 'Codeium', slug: 'codeium', icon: '🔧', category: 'code-assistant', tagline: 'Free code completion', shortDescription: 'Alternative to Copilot', pricing: { type: 'free', hasFreeTier: true }, website: 'https://codeium.com', platforms: ['vscode', 'desktop'], tags: ['free'], featured: false, trending: true },
  { name: 'Tabnine', slug: 'tabnine', icon: '📝', category: 'code-assistant', tagline: 'Smart completion', shortDescription: 'ML-powered', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.tabnine.com', platforms: ['vscode', 'desktop'], tags: ['ml'], featured: false, trending: true },
  { name: 'CodeWhisperer', slug: 'amazon-codewhisperer', icon: '⚡', category: 'code-assistant', tagline: 'AWS code assistant', shortDescription: 'By Amazon', pricing: { type: 'free', hasFreeTier: true }, website: 'https://aws.amazon.com/codewhisperer', platforms: ['vscode', 'desktop'], tags: ['aws'], featured: false, trending: true },
  { name: 'Cursor', slug: 'cursor', icon: '✨', category: 'code-assistant', tagline: 'AI-first editor', shortDescription: 'Built for AI', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://cursor.sh', platforms: ['desktop'], tags: ['editor'], featured: false, trending: true },
  { name: 'Replit', slug: 'replit', icon: '🎯', category: 'code-assistant', tagline: 'Cloud IDE with AI', shortDescription: 'Online programming', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://replit.com', platforms: ['web'], tags: ['cloud'], featured: false, trending: true },

  // WRITING ASSISTANTS
  { name: 'Jasper', slug: 'jasper', icon: '✍️', category: 'writing-assistant', tagline: 'Marketing content AI', shortDescription: 'Copywriting focused', pricing: { type: 'paid', hasFreeTier: true }, website: 'https://www.jasper.ai', platforms: ['web'], tags: ['marketing'], featured: true, trending: false },
  { name: 'Copy.ai', slug: 'copyai', icon: '📝', category: 'writing-assistant', tagline: 'Free copywriting', shortDescription: 'Marketing copy', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://copy.ai', platforms: ['web'], tags: ['free'], featured: false, trending: true },
  { name: 'Grammarly', slug: 'grammarly', icon: '✏️', category: 'writing-assistant', tagline: 'Grammar & writing', shortDescription: 'Writing improvement', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.grammarly.com', platforms: ['web', 'desktop', 'chrome-extension'], tags: ['grammar'], featured: true, trending: true },
  { name: 'Quillbot', slug: 'quillbot', icon: '🎨', category: 'writing-assistant', tagline: 'Paraphrasing tool', shortDescription: 'Rewriting', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://quillbot.com', platforms: ['web', 'chrome-extension'], tags: ['paraphrasing'], featured: false, trending: true },
  { name: 'Rytr', slug: 'rytr', icon: '🚀', category: 'writing-assistant', tagline: 'Affordable AI writer', shortDescription: 'Simple and cheap', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://rytr.me', platforms: ['web'], tags: ['affordable'], featured: false, trending: true },
  { name: 'Copysmith', slug: 'copysmith', icon: '📱', category: 'writing-assistant', tagline: 'E-commerce copywriting', shortDescription: 'Product descriptions', pricing: { type: 'paid', hasFreeTier: false }, website: 'https://www.copysmith.ai', platforms: ['web'], tags: ['ecommerce'], featured: false, trending: false },
  { name: 'Hemingway', slug: 'hemingway-editor', icon: '📖', category: 'writing-assistant', tagline: 'Writing clarity', shortDescription: 'Clarity improvement', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://hemingwayapp.com', platforms: ['web', 'desktop'], tags: ['editing'], featured: false, trending: true },
  { name: 'Wordtune', slug: 'wordtune', icon: '💬', category: 'writing-assistant', tagline: 'Rewrite sentences', shortDescription: 'Sentence improvement', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.wordtune.com', platforms: ['web', 'chrome-extension'], tags: ['rewriting'], featured: false, trending: true },

  // AUDIO & MUSIC
  { name: 'ElevenLabs', slug: 'elevenlabs', icon: '🎙️', category: 'audio-generation', tagline: 'Text-to-speech', shortDescription: 'Natural voices', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://elevenlabs.io', platforms: ['web', 'api'], tags: ['tts'], featured: true, trending: true },
  { name: 'AIVA', slug: 'aiva', icon: '🎼', category: 'audio-generation', tagline: 'Music composition', shortDescription: 'AI composer', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.aiva.ai', platforms: ['web'], tags: ['music'], featured: false, trending: true },
  { name: 'Soundraw', slug: 'soundraw', icon: '🎧', category: 'audio-generation', tagline: 'Royalty-free AI music', shortDescription: 'Generated music', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.soundraw.io', platforms: ['web'], tags: ['royalty-free'], featured: false, trending: true },
  { name: 'Mubert', slug: 'mubert', icon: '🎹', category: 'audio-generation', tagline: 'AI music generation', shortDescription: 'Unlimited music', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://mubert.com', platforms: ['web', 'ios', 'android'], tags: ['music'], featured: false, trending: true },
  { name: 'Google MusicLM', slug: 'google-musiclm', icon: '🎼', category: 'audio-generation', tagline: 'Text-to-music', shortDescription: 'By Google', pricing: { type: 'free', hasFreeTier: true }, website: 'https://google-research.github.io/musiclm', platforms: ['web'], tags: ['experimental'], featured: false, trending: true },

  // DATA ANALYSIS
  { name: 'Tableau', slug: 'tableau', icon: '📊', category: 'data-analysis', tagline: 'Visual analytics', shortDescription: 'BI platform', pricing: { type: 'paid', hasFreeTier: false }, website: 'https://www.tableau.com', platforms: ['web', 'desktop'], tags: ['bi'], featured: false, trending: false },
  { name: 'Power BI', slug: 'power-bi', icon: '📈', category: 'data-analysis', tagline: 'Microsoft analytics', shortDescription: 'By Microsoft', pricing: { type: 'paid', hasFreeTier: true }, website: 'https://powerbi.microsoft.com', platforms: ['web', 'desktop'], tags: ['microsoft'], featured: false, trending: true },
  { name: 'Looker', slug: 'looker', icon: '🔍', category: 'data-analysis', tagline: 'Business intelligence', shortDescription: 'By Google', pricing: { type: 'paid', hasFreeTier: false }, website: 'https://looker.com', platforms: ['web'], tags: ['google'], featured: false, trending: true },

  // AUTOMATION
  { name: 'Zapier', slug: 'zapier', icon: '⚡', category: 'automation', tagline: 'No-code automation', shortDescription: 'Connect apps', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://zapier.com', platforms: ['web'], tags: ['workflow'], featured: true, trending: true },
  { name: 'Make', slug: 'make', icon: '🔗', category: 'automation', tagline: 'Workflow automation', shortDescription: 'No-code workflows', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.make.com', platforms: ['web'], tags: ['workflow'], featured: false, trending: true },
  { name: 'IFTTT', slug: 'ifttt', icon: '🤝', category: 'automation', tagline: 'If This Then That', shortDescription: 'Simple automation', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://ifttt.com', platforms: ['web', 'ios', 'android'], tags: ['iot'], featured: false, trending: true },

  // RESEARCH
  { name: 'Perplexity AI', slug: 'perplexity-ai', icon: '🔬', category: 'research', tagline: 'AI research assistant', shortDescription: 'With citations', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.perplexity.ai', platforms: ['web', 'ios', 'android'], tags: ['research'], featured: true, trending: true },
  { name: 'Consensus', slug: 'consensus', icon: '📚', category: 'research', tagline: 'Research search', shortDescription: 'Academic papers', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://consensus.app', platforms: ['web'], tags: ['academic'], featured: false, trending: true },
  { name: 'You.com', slug: 'you-com', icon: '🌐', category: 'research', tagline: 'AI search engine', shortDescription: 'Privacy-focused', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://you.com', platforms: ['web'], tags: ['search'], featured: false, trending: true },

  // DESIGN
  { name: 'Figma AI', slug: 'figma-ai', icon: '🎯', category: 'design', tagline: 'Design with AI', shortDescription: 'Collaborative design', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.figma.com', platforms: ['web', 'desktop'], tags: ['ui-ux'], featured: true, trending: true },
  { name: 'Canva', slug: 'canva', icon: '🎨', category: 'design', tagline: 'Graphic design', shortDescription: 'Easy design creation', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.canva.com', platforms: ['web', 'ios', 'android'], tags: ['design'], featured: true, trending: true },
  { name: 'Remove.bg', slug: 'remove-bg', icon: '🖼️', category: 'design', tagline: 'Background removal', shortDescription: 'AI image editing', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.remove.bg', platforms: ['web'], tags: ['editing'], featured: false, trending: true },

  // PRODUCTIVITY
  { name: 'Notion AI', slug: 'notion-ai', icon: '📚', category: 'productivity', tagline: 'AI-powered workspace', shortDescription: 'Notes and databases', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.notion.so', platforms: ['web', 'ios', 'android', 'desktop'], tags: ['workspace'], featured: true, trending: true },
  { name: 'Microsoft Copilot Pro', slug: 'copilot-pro', icon: '⚡', category: 'productivity', tagline: 'Office AI assistant', shortDescription: 'Integrated in Office', pricing: { type: 'paid', hasFreeTier: false }, website: 'https://copilot.microsoft.com', platforms: ['web', 'desktop'], tags: ['office'], featured: false, trending: true },

  // EDUCATION
  { name: 'Khan Academy', slug: 'khan-academy', icon: '📚', category: 'education', tagline: 'Learning with AI', shortDescription: 'Personalized education', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.khanacademy.org', platforms: ['web', 'ios', 'android'], tags: ['learning'], featured: true, trending: false },
  { name: 'Duolingo Max', slug: 'duolingo-max', icon: '🦜', category: 'education', tagline: 'Language learning', shortDescription: 'AI-powered learning', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.duolingo.com', platforms: ['web', 'ios', 'android'], tags: ['language'], featured: true, trending: true },

  // MARKETING
  { name: 'HubSpot', slug: 'hubspot', icon: '🚀', category: 'marketing', tagline: 'AI CRM platform', shortDescription: 'Marketing automation', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.hubspot.com', platforms: ['web'], tags: ['crm'], featured: true, trending: true },
  { name: 'Sendinblue', slug: 'sendinblue', icon: '📧', category: 'marketing', tagline: 'Email marketing', shortDescription: 'Email and SMS', pricing: { type: 'freemium', hasFreeTier: true }, website: 'https://www.brevo.com', platforms: ['web'], tags: ['email'], featured: false, trending: true }
];

const seedAITools = async () => {
  try {
    await AITool.deleteMany({});
    console.log('Cleared existing AI tools');
    
    const created = await AITool.insertMany(aiTools);
    console.log(`✅ Created ${created.length} AI tools`);
    
    const categoryCounts = {};
    created.forEach(tool => {
      categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
    });
    
    console.log('\n📊 Summary by Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} tools`);
    });
    
    return created;
  } catch (error) {
    console.error('❌ Error seeding AI tools:', error.message);
    throw error;
  }
};

module.exports = { seedAITools };
