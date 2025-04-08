import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const enhancePost = async (req, res) => {
  try {
    const { content, type, category } = req.body;

    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Content and type are required'
      });
    }

    let prompt = '';
    switch (type) {
      case 'format':
        prompt = `Enhance this fitness-related post to make it more engaging and well-structured. The post is in the "${category}" category:\n\n${content}`;
        break;
      case 'suggestions':
        prompt = `Provide 3 suggestions to improve this fitness-related post in the "${category}" category. Make it more engaging and motivational:\n\n${content}`;
        break;
      case 'hashtags':
        prompt = `Suggest 5 relevant hashtags for this fitness-related post in the "${category}" category:\n\n${content}`;
        break;
      default:
        prompt = `Enhance this fitness-related post:\n\n${content}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness content creator and social media expert. Help users create engaging fitness-related content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const enhancedContent = completion.choices[0].message.content;

    let response = {};
    if (type === 'format') {
      response = { enhancedContent };
    } else if (type === 'suggestions') {
      response = { 
        suggestions: enhancedContent
          .split('\n')
          .filter(line => line.trim())
          .map(suggestion => suggestion.replace(/^\d+\.\s*/, ''))
      };
    } else if (type === 'hashtags') {
      response = {
        hashtags: enhancedContent
          .split('\n')
          .filter(line => line.trim())
          .map(tag => tag.replace(/^\d+\.\s*/, ''))
      };
    }

    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Error enhancing post:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}; 