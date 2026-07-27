/**
 * Groq API Service for EduWrap AI Study Buddy
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const SYSTEM_PROMPT = `You are a friendly, concise study assistant. Explain concepts clearly and briefly for a student studying for exams. Keep answers under 150 words unless asked for more detail.`;

export async function askStudyBuddy(question, messageHistory = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === 'paste_your_key_here' || apiKey === 'your_groq_api_key_here' || apiKey.trim() === '') {
    throw new Error('API key missing. Please paste your VITE_GROQ_API_KEY in the .env file.');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messageHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    { role: 'user', content: question }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        throw new Error('Invalid API Key. Please verify your VITE_GROQ_API_KEY in .env.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a few seconds and try again.');
      } else {
        const errorMsg = errorData?.error?.message || `Groq API Error (${response.status})`;
        throw new Error(errorMsg);
      }
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('Received empty response from AI.');
    }

    return reply;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw err;
  }
}
