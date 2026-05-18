const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = [
  'openrouter/free',
  'deepseek/deepseek-chat-v3-0324:free',
  'meta-llama/llama-4-scout:free',
];

/**
 * Helper: Call OpenRouter API with a prompt using a fallback mechanism
 * @param {string} prompt - The prompt to send to the AI model
 * @returns {string} The AI-generated response text
 */
const callOpenRouter = async (prompt) => {
  for (const model of MODELS) {
    try {
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert HR and employee management AI assistant. Provide clear, structured, actionable recommendations. Use markdown formatting for readability.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 3000,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
            'X-Title': 'Employee Management System',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      const code = err.response?.data?.error?.code || err.response?.status;
      console.warn(`Model ${model} failed with code ${code}. Trying next...`);
      // If the error is 404 (not found) or 429 (rate limited), try the next model
      if (code === 404 || code === 429) continue;
      
      throw err; // Other errors (like 401 Unauthorized) should bubble up
    }
  }
  throw new Error('All free models are currently unavailable (404/429). Please try again later.');
};

/**
 * @desc    AI Recommendation endpoint — supports promotion, ranking, training, feedback
 * @route   POST /api/ai/recommend
 * @access  Private (JWT required)
 */
const getRecommendation = async (req, res, next) => {
  try {
    const { employees, type } = req.body;

    if (!employees || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employees data and recommendation type',
      });
    }

    let prompt = '';

    switch (type) {
      case 'promotion':
        prompt = `You are an expert HR analyst. Analyze ALL of the following ${employees.length} employees and provide promotion recommendations for EACH ONE. You MUST cover every single employee — do not stop early or truncate.

Employee Data:
${JSON.stringify(employees, null, 2)}

For EACH employee, use this exact markdown structure:

## [Number]. [Employee Name]
**Department:** [dept] | **Score:** [score]/100 | **Experience:** [exp] years

### Promotion Decision: [Recommend / Hold / Not Ready]

**Justification:**
- Experience: ...
- Performance: ...
- Skills: ...

**Areas of Strength:**
- ...

**Areas for Improvement:**
- ...

---

Complete all ${employees.length} employees before finishing.`;
        break;

      case 'ranking':
        prompt = `You are an expert HR analyst. Rank ALL ${employees.length} of the following employees from best to least performer. You MUST include every single employee — do not stop early.

Employee Data:
${JSON.stringify(employees, null, 2)}

# Employee Performance Ranking

For EACH employee use this exact format:

## Rank #[N] — [Employee Name]
**Department:** [dept] | **Score:** [score]/100 | **Experience:** [exp] years
**Overall Rating:** [X.X]/10

**Justification:**
- Performance: ...
- Experience: ...
- Skills: ...

---

Complete all ${employees.length} employees before finishing.`;
        break;

      case 'training':
        prompt = `You are a Learning & Development specialist. Identify training needs for ALL ${employees.length} employees below. You MUST cover every employee — do not stop early.

Employee Data:
${JSON.stringify(employees, null, 2)}

For EACH employee use this markdown format:

## [Employee Name] — [Department]
**Current Skills:** [list their skills]
**Performance Score:** [score]/100

### Recommended Training Plan

| Priority | Training Program | Expected Outcome |
|----------|-----------------|------------------|
| High/Med/Low | Program name | Outcome |

**Identified Skill Gaps:**
- ...

**Development Goals:**
- ...

---

Complete all ${employees.length} employees before finishing.`;
        break;

      case 'feedback':
        prompt = `You are a senior HR performance coach. Write comprehensive quarterly performance feedback for ALL ${employees.length} employees. You MUST cover every single employee — do not stop early.

Employee Data:
${JSON.stringify(employees, null, 2)}

For EACH employee use this markdown format:

## Performance Review: [Employee Name]
**Department:** [dept] | **Score:** [score]/100 | **Tenure:** [exp] years

### Overall Summary
[2-3 sentence summary of their performance]

### Key Strengths 💪
- ...

### Areas for Improvement 🎯
- ...

### Goals for Next Quarter 📋
1. ...
2. ...
3. ...

### Manager's Note 🌟
[Brief encouragement note]

---

Complete all ${employees.length} employees before finishing.`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid recommendation type. Use: promotion, ranking, training, or feedback',
        });
    }

    const recommendation = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      type,
      data: recommendation,
    });
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI API authentication failed. Please check your OpenRouter API key.',
      });
    }
    next(error);
  }
};

module.exports = { getRecommendation };
