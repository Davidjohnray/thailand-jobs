export type ShapeQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const shapeQuestions: ShapeQuestion[] = [
  // Round 1 — basic shapes
  { question: 'Find the Circle! ⭕', emoji: '⭕', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '🔷', name: 'Diamond' }], answer: 1 },
  { question: 'Find the Square! ⬛', emoji: '⬛', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '⬛', name: 'Square' }, { emoji: '⬜', name: 'Rectangle' }], answer: 2 },
  { question: 'Find the Triangle! 🔺', emoji: '🔺', options: [{ emoji: '🔺', name: 'Triangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔷', name: 'Diamond' }], answer: 0 },
  { question: 'Find the Diamond! 🔷', emoji: '🔷', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '🔷', name: 'Diamond' }], answer: 3 },
  { question: 'Find the Rectangle! ⬜', emoji: '⬜', options: [{ emoji: '⬜', name: 'Rectangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '🔺', name: 'Triangle' }], answer: 0 },

  // Round 2 — more shapes
  { question: 'Find the Star! ⭐', emoji: '⭐', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '⭐', name: 'Star' }, { emoji: '❤️', name: 'Heart' }, { emoji: '🔷', name: 'Diamond' }], answer: 1 },
  { question: 'Find the Heart! ❤️', emoji: '❤️', options: [{ emoji: '⭐', name: 'Star' }, { emoji: '⭕', name: 'Circle' }, { emoji: '❤️', name: 'Heart' }, { emoji: '🔺', name: 'Triangle' }], answer: 2 },
  { question: 'Find the Oval! 🥚', emoji: '🥚', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '⬛', name: 'Square' }, { emoji: '🥚', name: 'Oval' }], answer: 3 },
  { question: 'Find the Pentagon! ⬠', emoji: '⬠', options: [{ emoji: '⬠', name: 'Pentagon' }, { emoji: '⭕', name: 'Circle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }], answer: 0 },
  { question: 'Find the Arrow! ➡️', emoji: '➡️', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '➡️', name: 'Arrow' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }], answer: 1 },

  // Round 3 — shapes in real life
  { question: 'A pizza is shaped like a... 🍕', emoji: '🍕', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '⬜', name: 'Rectangle' }], answer: 1 },
  { question: 'A slice of pizza is shaped like a... 🍕', emoji: '🍕', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '🔷', name: 'Diamond' }], answer: 2 },
  { question: 'A door is shaped like a... 🚪', emoji: '🚪', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '⬜', name: 'Rectangle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '⭐', name: 'Star' }], answer: 1 },
  { question: 'The sun looks like a... ☀️', emoji: '☀️', options: [{ emoji: '⭐', name: 'Star' }, { emoji: '⬛', name: 'Square' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }], answer: 2 },
  { question: 'A book is shaped like a... 📚', emoji: '📚', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '⬜', name: 'Rectangle' }], answer: 3 },

  // Round 4 — how many sides?
  { question: 'A circle has... sides', emoji: '⭕', options: [{ emoji: '0️⃣', name: '0 — no sides' }, { emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }], answer: 0 },
  { question: 'A triangle has... sides', emoji: '🔺', options: [{ emoji: '2️⃣', name: '2 sides' }, { emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }], answer: 1 },
  { question: 'A square has... sides', emoji: '⬛', options: [{ emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }, { emoji: '6️⃣', name: '6 sides' }], answer: 1 },
  { question: 'Which shape has NO corners? 🤔', emoji: '🤔', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '⬜', name: 'Rectangle' }], answer: 2 },
  { question: 'Which shape is round? 🌀', emoji: '🌀', options: [{ emoji: '🔺', name: 'Triangle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '⭕', name: 'Circle' }], answer: 3 },
]
