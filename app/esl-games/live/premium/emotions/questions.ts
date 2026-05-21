export type EmotionsQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const emotionsQuestions: EmotionsQuestion[] = [
  // Round 1 — basic emotions
  { question: 'Find HAPPY! 😊', emoji: '😊', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😊', name: 'Happy' }, { emoji: '😠', name: 'Angry' }, { emoji: '😨', name: 'Scared' }], answer: 1 },
  { question: 'Find SAD! 😢', emoji: '😢', options: [{ emoji: '😊', name: 'Happy' }, { emoji: '😢', name: 'Sad' }, { emoji: '😴', name: 'Tired' }, { emoji: '😲', name: 'Surprised' }], answer: 1 },
  { question: 'Find ANGRY! 😠', emoji: '😠', options: [{ emoji: '😠', name: 'Angry' }, { emoji: '😊', name: 'Happy' }, { emoji: '😢', name: 'Sad' }, { emoji: '🤒', name: 'Sick' }], answer: 0 },
  { question: 'Find SCARED! 😨', emoji: '😨', options: [{ emoji: '😲', name: 'Surprised' }, { emoji: '😊', name: 'Happy' }, { emoji: '😨', name: 'Scared' }, { emoji: '😠', name: 'Angry' }], answer: 2 },
  { question: 'Find SURPRISED! 😲', emoji: '😲', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😴', name: 'Tired' }, { emoji: '😠', name: 'Angry' }, { emoji: '😲', name: 'Surprised' }], answer: 3 },

  // Round 2 — more emotions
  { question: 'Find TIRED! 😴', emoji: '😴', options: [{ emoji: '😴', name: 'Tired' }, { emoji: '😊', name: 'Happy' }, { emoji: '😢', name: 'Sad' }, { emoji: '🤒', name: 'Sick' }], answer: 0 },
  { question: 'Find SICK! 🤒', emoji: '🤒', options: [{ emoji: '😊', name: 'Happy' }, { emoji: '🤒', name: 'Sick' }, { emoji: '😴', name: 'Tired' }, { emoji: '😠', name: 'Angry' }], answer: 1 },
  { question: 'Find EXCITED! 🤩', emoji: '🤩', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😨', name: 'Scared' }, { emoji: '🤩', name: 'Excited' }, { emoji: '😠', name: 'Angry' }], answer: 2 },
  { question: 'Find BORED! 😑', emoji: '😑', options: [{ emoji: '😊', name: 'Happy' }, { emoji: '😲', name: 'Surprised' }, { emoji: '😢', name: 'Sad' }, { emoji: '😑', name: 'Bored' }], answer: 3 },
  { question: 'Find CONFUSED! 😕', emoji: '😕', options: [{ emoji: '😕', name: 'Confused' }, { emoji: '😊', name: 'Happy' }, { emoji: '😠', name: 'Angry' }, { emoji: '🤩', name: 'Excited' }], answer: 0 },

  // Round 3 — how do you feel when...
  { question: 'It\'s your birthday! You feel...? 🎂', emoji: '🎂', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😠', name: 'Angry' }, { emoji: '🤩', name: 'Excited' }, { emoji: '😴', name: 'Tired' }], answer: 2 },
  { question: 'You fall and hurt your knee. You feel...? 🦵', emoji: '🦵', options: [{ emoji: '🤩', name: 'Excited' }, { emoji: '😢', name: 'Sad' }, { emoji: '😊', name: 'Happy' }, { emoji: '😑', name: 'Bored' }], answer: 1 },
  { question: 'You see a big spider! You feel...? 🕷️', emoji: '🕷️', options: [{ emoji: '😊', name: 'Happy' }, { emoji: '🤩', name: 'Excited' }, { emoji: '😨', name: 'Scared' }, { emoji: '😑', name: 'Bored' }], answer: 2 },
  { question: 'You get a present! You feel...? 🎁', emoji: '🎁', options: [{ emoji: '😲', name: 'Surprised' }, { emoji: '😢', name: 'Sad' }, { emoji: '😠', name: 'Angry' }, { emoji: '😴', name: 'Tired' }], answer: 0 },
  { question: 'You didn\'t sleep. You feel...? 🌙', emoji: '🌙', options: [{ emoji: '🤩', name: 'Excited' }, { emoji: '😊', name: 'Happy' }, { emoji: '😠', name: 'Angry' }, { emoji: '😴', name: 'Tired' }], answer: 3 },

  // Round 4 — opposites
  { question: 'What is the opposite of HAPPY? 😊', emoji: '😊🔄', options: [{ emoji: '😠', name: 'Angry' }, { emoji: '😢', name: 'Sad' }, { emoji: '😨', name: 'Scared' }, { emoji: '😑', name: 'Bored' }], answer: 1 },
  { question: 'What is the opposite of ANGRY? 😠', emoji: '😠🔄', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😴', name: 'Tired' }, { emoji: '😊', name: 'Happy' }, { emoji: '😲', name: 'Surprised' }], answer: 2 },
  { question: 'What is the opposite of SCARED? 😨', emoji: '😨🔄', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '💪', name: 'Brave' }, { emoji: '😠', name: 'Angry' }, { emoji: '😴', name: 'Tired' }], answer: 1 },
  { question: 'What is the opposite of TIRED? 😴', emoji: '😴🔄', options: [{ emoji: '⚡', name: 'Energetic' }, { emoji: '😢', name: 'Sad' }, { emoji: '😨', name: 'Scared' }, { emoji: '😑', name: 'Bored' }], answer: 0 },
  { question: 'How does a smile show? 😊', emoji: '😊', options: [{ emoji: '😢', name: 'Sad' }, { emoji: '😠', name: 'Angry' }, { emoji: '😊', name: 'Happy' }, { emoji: '😨', name: 'Scared' }], answer: 2 },
]
