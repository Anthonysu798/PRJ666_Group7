import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeForm = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Call GPT-4o with the base64 image directly
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: "You are a friendly fitness coach talking to a beginner. Look at this exercise and tell me in simple, clear words:\n1. Is the form good? (thumbs up or needs work)\n2. What looks good?\n3. What can be improved?\n4. Any safety tips?\n\nKeep it short and use everyday language - like you're talking to a friend!"
          },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ]
      }],
      max_tokens: 300
    });

    const analysis = parseAnalysis(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Error analyzing exercise form',
      error: error.response?.data || error.message
    });
  }
};

// Function to upload base64 image to Cloudinary
const uploadToCloudinary = async (base64Image) => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Data}`);
    // Don't specify upload_preset - use unsigned upload instead
    
    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        auth: {
          username: process.env.CLOUDINARY_API_KEY,
          password: process.env.CLOUDINARY_API_SECRET
        }
      }
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

const parseAnalysis = (content) => {
  // Initialize default structure
  const analysis = {
    isCorrect: false,
    feedback: '',
    suggestions: [],
    confidence: 0.5,
    safetyIssues: []
  };

  try {
    // Determine if form is correct (including more casual language)
    analysis.isCorrect = content.toLowerCase().includes('good form') || 
                        content.toLowerCase().includes('correct form') ||
                        content.toLowerCase().includes('proper form') ||
                        content.toLowerCase().includes('thumbs up') ||
                        content.toLowerCase().includes('looking good');

    // Extract main feedback
    analysis.feedback = content;

    // Extract suggestions (including more casual terms)
    const suggestions = content.split('\n')
      .filter(line => 
        line.toLowerCase().includes('try') ||
        line.toLowerCase().includes('could') ||
        line.toLowerCase().includes('maybe') ||
        line.toLowerCase().includes('better if') ||
        line.toLowerCase().includes('next time')
      )
      .map(line => line.trim());

    analysis.suggestions = suggestions;

    // Extract safety issues (including simpler terms)
    const safetyIssues = content.split('\n')
      .filter(line =>
        line.toLowerCase().includes('careful') ||
        line.toLowerCase().includes('watch out') ||
        line.toLowerCase().includes('make sure') ||
        line.toLowerCase().includes('be safe')
      )
      .map(line => line.trim());

    analysis.safetyIssues = safetyIssues;

    // Calculate confidence score with friendly terms
    if (content.toLowerCase().includes('perfect') || content.toLowerCase().includes('awesome')) {
      analysis.confidence = 0.95;
    } else if (content.toLowerCase().includes('good') || content.toLowerCase().includes('nice')) {
      analysis.confidence = 0.8;
    } else if (content.toLowerCase().includes('okay') || content.toLowerCase().includes('alright')) {
      analysis.confidence = 0.6;
    } else if (content.toLowerCase().includes('needs work') || content.toLowerCase().includes('not quite')) {
      analysis.confidence = 0.3;
    }

  } catch (error) {
    console.error('Error parsing analysis:', error);
  }

  return analysis;
};

export const handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a friendly fitness coach who explains things simply and clearly. Use everyday language, be encouraging, and keep responses short and easy to understand - like talking to a friend who's learning. Always be positive, even when giving corrections."
        },
        ...context.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message
        })),
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });

    return res.status(200).json({
      success: true,
      response: response.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message
    });
  }
};

export default { analyzeForm, handleChat };
