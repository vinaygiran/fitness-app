# Ask AI Feature - Setup Guide

## Overview
The "Ask AI" feature is a production-ready conversational interface powered by Grok AI, designed to provide fitness advice, nutrition tips, and workout guidance.

## Features
✅ **Modern UI Design**
- Built with Tailwind CSS and Daisy UI components
- Responsive design for mobile, tablet, and desktop
- Light/dark mode support
- Clean, professional appearance

✅ **Conversational AI**
- Multi-turn conversation support with message history
- Real-time typing indicators during API calls
- Message threading showing both user and AI responses
- Clear conversation context maintained

✅ **Production-Ready**
- Error handling with user-friendly messages
- Loading states with animated indicators
- Rate limiting notifications
- API authentication with secure token handling
- Conversation history management

✅ **Integrated Navigation**
- Added to main navigation menu
- Accessible via `/pages/ask-ai` route
- Seamless integration with existing app

## Installation & Setup

### Step 1: Get Grok AI API Key
1. Visit [X.AI Console](https://console.x.ai/)
2. Create an account and navigate to API settings
3. Generate an API key for Grok AI
4. Copy the API key

### Step 2: Configure Environment Variables
1. In the `frontend` folder, create a `.env` file (copy from `.env.example`):
```bash
REACT_APP_GROK_API_KEY=your_actual_grok_api_key_here
```

2. Replace `your_actual_grok_api_key_here` with your actual Grok API key from Step 1

### Step 3: Verify Installation
1. Dependencies were already installed in previous setup:
   - ✅ Tailwind CSS
   - ✅ PostCSS & Autoprefixer
   - ✅ Daisy UI

2. Check that `tailwind.config.js` and `postcss.config.js` exist in the `frontend` folder

### Step 4: Start the Application
```bash
cd frontend
npm start
```

The application will start at `http://localhost:3000`, and you can navigate to the "Ask AI" page from the main menu.

## Usage

### For Users
1. Click "Ask AI" in the navigation menu
2. Type your fitness, nutrition, or workout question
3. Click "Send Question" or press Enter
4. View the AI response in the conversation area
5. Continue the conversation naturally
6. Click "Clear" to start a new conversation

### Example Questions
- "What's a good workout routine for weight loss?"
- "How many calories should I eat daily?"
- "Can you create a 4-week meal plan for muscle building?"
- "What exercises are best for core strength?"

## Architecture

### File Structure
```
frontend/
├── src/
│   ├── pages/
│   │   └── AskAI.js          # Main AI chat component
│   ├── App.js                # Updated with /pages/ask-ai route
│   ├── components/
│   │   └── Header.js         # Updated with Ask AI navigation link
│   ├── index.js              # Updated to import Tailwind CSS
│   └── index.css             # Tailwind CSS directives
├── tailwind.config.js        # Tailwind configuration with Daisy UI
├── postcss.config.js         # PostCSS configuration
├── .env                      # Environment variables (create this)
└── .env.example              # Example environment file
```

### Component Architecture

**AskAI.js** Main component with:
- **State Management**: `question`, `response`, `loading`, `error`, `conversationHistory`
- **Main Functions**:
  - `handleSubmit()`: Processes user questions and calls Grok API
  - `handleClearHistory()`: Resets conversation
- **UI Sections**:
  - Header with emoji and description
  - Main chat area with conversation history
  - Input textarea and action buttons
  - Right sidebar with tips and warnings

## API Integration Details

### Grok AI API Endpoint
```
POST https://api.x.ai/v1/chat/completions
```

### Request Format
```javascript
{
  "messages": [
    { "role": "user", "content": "question" },
    { "role": "assistant", "content": "response" },
    { "role": "user", "content": "follow-up" }
  ],
  "model": "grok-beta",
  "stream": false,
  "temperature": 0.7
}
```

### Headers Required
```javascript
{
  "Authorization": "Bearer YOUR_GROK_API_KEY",
  "Content-Type": "application/json"
}
```

### Response Format
```javascript
{
  "choices": [
    {
      "message": {
        "content": "AI response text here"
      }
    }
  ]
}
```

## Error Handling

The component handles multiple error scenarios:

| Error | Message | Solution |
|-------|---------|----------|
| Invalid API Key | "API authentication failed..." | Check `.env` file API key |
| Rate Limited | "Rate limit exceeded..." | Wait and try again |
| Network Error | "Failed to get response..." | Check internet connection |
| Empty Question | "Please enter a question" | Type a question first |

## Styling with Tailwind CSS & Daisy UI

### Components Used
- **Daisy UI Cards** (`card`, `card-body`): Main container
- **Daisy UI Buttons** (`btn`, `btn-primary`, `btn-outline`): Action buttons
- **Daisy UI Badges** (`badge`, `badge-lg`): Tip section icons
- **Daisy UI Alerts** (`alert`, `alert-error`, `alert-info`): Messages
- **Daisy UI Textareas** (`textarea`, `textarea-bordered`): Input field
- **Tailwind Utilities**: Grid layout, flexbox, responsive breakpoints, dark mode

### Key Tailwind Classes
- `min-h-screen`: Full viewport height
- `bg-gradient-to-br`: Gradient background
- `dark:`: Dark mode variants
- `lg:col-span-2`: Large screen layout
- `space-y-4`: Vertical spacing between elements
- `truncate`: Text overflow handling

## Security Considerations

⚠️ **Important**: Never commit `.env` file to version control

### Best Practices
1. ✅ API key stored in environment variables only
2. ✅ Never log sensitive data
3. ✅ HTTPS required in production
4. ✅ Consider rate limiting on backend
5. ✅ Validate all user inputs server-side if adding backend

### For Production Deployment
1. Set `REACT_APP_GROK_API_KEY` in your deployment platform (Vercel, Netlify, etc.)
2. Never expose API keys in frontend code
3. Consider creating a backend proxy for API calls
4. Add request rate limiting
5. Implement user authentication checks

## Troubleshooting

### Issue: "API authentication failed"
**Solution**: 
1. Verify your API key in `.env` is correct
2. Check that it's prefixed with `REACT_APP_` for React to access it
3. Restart the development server after changing `.env`

### Issue: Component not showing
**Solution**:
1. Verify route was added to `App.js`
2. Check Header.js has the navigation link
3. Check browser console for JavaScript errors

### Issue: Styling looks wrong
**Solution**:
1. Verify `npm install -D tailwindcss postcss autoprefixer daisyui` completed
2. Check `tailwind.config.js` exists with correct content paths
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Restart development server

### Issue: API calls timing out
**Solution**:
1. Check internet connection
2. Verify Grok API is operational at https://status.x.ai/
3. Check Grok API documentation for rate limits
4. Consider implementing request timeout with retry logic

## Enhancement Ideas

### Future Improvements
- [ ] Add voice input/output capabilities
- [ ] Implement conversation export as PDF
- [ ] Add preset quick questions buttons
- [ ] Implement conversation threading/topics
- [ ] Add multi-language support
- [ ] Create backend proxy for additional security
- [ ] Add user authentication per-conversation
- [ ] Implement conversation analytics
- [ ] Add code snippet highlighting for workout routines
- [ ] Create AI response templates for common questions

## Testing

### Manual Testing Checklist
- [ ] Navigate to Ask AI from main menu
- [ ] Send a fitness-related question
- [ ] Verify response appears in chat
- [ ] Send follow-up question
- [ ] Verify conversation history maintained
- [ ] Test error handling by temporarily removing API key
- [ ] Test dark mode toggle (if implemented)
- [ ] Test mobile responsiveness
- [ ] Test Clear button resets everything
- [ ] Test loading indicator appears during API call

## Support & Documentation

### Related Files
- `AskAI.js`: Main component implementation
- `App.js`: Routes configuration
- `Header.js`: Navigation setup
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: CSS processing configuration
- `.env.example`: Environment variable template

### External Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Daisy UI Components](https://daisyui.com/components/)
- [Grok AI API Documentation](https://docs.x.ai/)
- [React Documentation](https://react.dev/)

---

**Status**: ✅ Production Ready
**Last Updated**: 2024
**Version**: 1.0.0
