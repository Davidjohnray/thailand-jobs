import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { essay, task, essayType, mode } = await req.json()

    // Rewrite intro or conclusion mode
    if (mode === 'rewrite_intro' || mode === 'rewrite_conclusion') {
      const part = mode === 'rewrite_intro' ? 'introduction' : 'conclusion'
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `You are an IELTS writing coach. Rewrite the ${part} of this student's IELTS Task 2 essay at a Band 7-8 level. Keep their ideas but improve vocabulary, grammar, and structure. The ${part} should be 2-3 sentences for introduction (with a clear thesis) or 2-3 sentences for conclusion (restating position and main points).

Task: "${task}"
Student's full essay: "${essay}"

Respond with ONLY the rewritten ${part} paragraph as plain text. No labels, no explanation.`
          }]
        })
      })
      const data = await response.json()
      return NextResponse.json({ rewritten: data.content?.[0]?.text || '' })
    }

    // Main feedback mode
    const prompt = `You are an experienced IELTS examiner. Assess this student's IELTS Writing Task 2 essay against the official band descriptors.

Essay type: ${essayType}
Task: "${task}"
Student's essay: "${essay}"

Respond ONLY with this JSON, no other text, no markdown:
{
  "overallBand": 6,
  "criteria": {
    "taskAchievement": {
      "band": 6,
      "feedback": "2-3 sentences on how well the task was addressed, position clarity, and idea development."
    },
    "coherenceCohesion": {
      "band": 6,
      "feedback": "2-3 sentences on paragraph structure, linking words, and logical flow."
    },
    "lexicalResource": {
      "band": 6,
      "feedback": "2-3 sentences on vocabulary range, accuracy, and use of less common words."
    },
    "grammaticalRange": {
      "band": 6,
      "feedback": "2-3 sentences on sentence variety, grammar accuracy, and punctuation."
    }
  },
  "paragraphFeedback": {
    "introduction": "Specific feedback on the introduction — does it paraphrase the task, give a clear thesis?",
    "body1": "Specific feedback on the first body paragraph — is the main idea clear, well-supported with examples?",
    "body2": "Specific feedback on the second body paragraph — is the main idea clear, well-supported with examples?",
    "conclusion": "Specific feedback on the conclusion — does it restate the position and summarise main points?"
  },
  "vocabularyUpgrades": [
    { "original": "word or phrase from student essay", "upgrade": "better academic alternative", "example": "example sentence" },
    { "original": "word or phrase from student essay", "upgrade": "better academic alternative", "example": "example sentence" },
    { "original": "word or phrase from student essay", "upgrade": "better academic alternative", "example": "example sentence" },
    { "original": "word or phrase from student essay", "upgrade": "better academic alternative", "example": "example sentence" }
  ],
  "keyImprovement": "The single most important thing this student should focus on to improve their band score.",
  "modelEssayBand6": "A complete Band 6 essay of 250-260 words on this task. Clear position, adequate development, some linking, simple but correct vocabulary. Write as a complete essay with introduction, two body paragraphs, and conclusion.",
  "modelEssayBand7": "A complete Band 7-8 essay of 270-290 words on this task. Clear position, well-developed arguments with specific examples, good use of linking devices, range of vocabulary and grammar. Write as a complete essay with introduction, two body paragraphs, and conclusion."
}

Band scores should be numbers between 4 and 9. Overall band is the average of the four criteria rounded to nearest 0.5. Be realistic and honest. For the model essays, write complete essays, not summaries.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)

  } catch (err) {
    console.error('IELTS writing feedback error:', err)
    return NextResponse.json({ error: 'Failed to get feedback' }, { status: 500 })
  }
}
