import express from "express";
import axios from "axios";

const router = express.Router();

// Mock responses for testing without API credits
const mockResponses = {
  "workout": "Here are some great workout suggestions:\n\n1. **Full Body Strength** (3 days/week)\n   - Squats: 4x5\n   - Bench Press: 4x5\n   - Rows: 4x5\n\n2. **Cardio Days** (2 days/week)\n   - 30 min moderate intensity running\n   - Or 20 min HIIT training\n\n3. **Rest Days**: 2 days for recovery\n\nRemember to stay hydrated and stretch!",
  
  "nutrition": "Key nutrition tips for fitness:\n\n1. **Protein**: 0.7-1g per pound of body weight\n2. **Carbs**: Focus on complex carbs (oats, rice, sweet potatoes)\n3. **Fats**: Include healthy fats (avocado, nuts, olive oil)\n4. **Hydration**: 3-4 liters of water daily\n5. **Meal Timing**: Eat within 2 hours post-workout\n\nConsult with a nutritionist for personalized advice!",
  
  "weight loss": "Effective weight loss strategy:\n\n1. **Calorie Deficit**: Aim for 300-500 calorie deficit\n2. **Exercise**: 150 min moderate or 75 min vigorous activity/week\n3. **Protein**: High protein diet aids satiety\n4. **Sleep**: 7-9 hours nightly\n5. **Consistency**: Small changes over time work best\n\nExpect 1-2 lbs per week of healthy weight loss."
};

router.post("/askAI", async (req, res) => {
  try {
    const { messages, temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    
    // Check if we have a mock response for this query
    let mockResponse = null;
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lastUserMessage.includes(key)) {
        mockResponse = response;
        break;
      }
    }

    // If we found a mock response, use it
    if (mockResponse) {
      console.log("Using mock response for query");
      return res.status(200).json({ response: mockResponse });
    }

    // Otherwise try the real Grok API
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      console.error("GROK_API_KEY not set in environment");
      return res.status(500).json({ error: "GROK_API_KEY not configured on server" });
    }

    console.log("Calling Grok API with", messages.length, "messages");

    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        messages: messages,
        model: "grok-beta",
        stream: false,
        temperature: temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${grokApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    console.log("Got response from Grok API");
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("=== AI API Error ===");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Response Status:", error.response?.status);
    console.error("Response Data:", error.response?.data);
    console.error("===================");

    // Provide a helpful default response
    const defaultResponse = "I'm here to help with fitness advice! Ask me about:\n- Workout routines\n- Nutrition and meal planning\n- Weight loss strategies\n- Exercise techniques\n\nNote: The AI service is currently limited. For detailed responses, try asking about workouts, nutrition, or weight loss.";

    if (error.response?.status === 403) {
      return res.status(200).json({ 
        response: defaultResponse
      });
    } else if (error.response?.status === 401) {
      return res
        .status(401)
        .json({ error: "API authentication failed. Check GROK_API_KEY." });
    } else if (error.response?.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please wait a moment." });
    } else if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request timeout. Try again." });
    }

    res.status(500).json({
      error: error.message || "Failed to get response from AI",
      details: error.response?.data || "No additional details"
    });
  }
});

export default router;
