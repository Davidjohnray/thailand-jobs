export type ShapeQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const shapeQuestions: ShapeQuestion[] = [
  // Round 1 — basic shapes
  { question: 'Find the circle! ⭕', emoji: '⭕', options: [{ emoji: '⬛', name: 'square' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '🔷', name: 'diamond' }], answer: 1 },
  { question: 'Find the square! ⬛', emoji: '⬛', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '⬛', name: 'square' }, { emoji: '⬜', name: 'rectangle' }], answer: 2 },
  { question: 'Find the triangle! 🔺', emoji: '🔺', options: [{ emoji: '🔺', name: 'triangle' }, { emoji: '⭕', name: 'circle' }, { emoji: '⬛', name: 'square' }, { emoji: '🔷', name: 'diamond' }], answer: 0 },
  { question: 'Find the diamond! 🔷', emoji: '🔷', options: [{ emoji: '⬛', name: 'square' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '🔷', name: 'diamond' }], answer: 3 },
  { question: 'Find the rectangle! ⬜', emoji: '⬜', options: [{ emoji: '⬜', name: 'rectangle' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔷', name: 'diamond' }, { emoji: '🔺', name: 'triangle' }], answer: 0 },

  // Round 2 — more shapes
  { question: 'Find the star! ⭐', emoji: '⭐', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '⭐', name: 'star' }, { emoji: '❤️', name: 'heart' }, { emoji: '🔷', name: 'diamond' }], answer: 1 },
  { question: 'Find the heart! ❤️', emoji: '❤️', options: [{ emoji: '⭐', name: 'star' }, { emoji: '⭕', name: 'circle' }, { emoji: '❤️', name: 'heart' }, { emoji: '🔺', name: 'triangle' }], answer: 2 },
  { question: 'Find the oval! 🥚', emoji: '🥚', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '🔷', name: 'diamond' }, { emoji: '⬛', name: 'square' }, { emoji: '🥚', name: 'oval' }], answer: 3 },
  { question: 'Find the pentagon! ⬠', emoji: '⬠', options: [{ emoji: '⬠', name: 'pentagon' }, { emoji: '⭕', name: 'circle' }, { emoji: '⬛', name: 'square' }, { emoji: '🔺', name: 'triangle' }], answer: 0 },
  { question: 'Find the arrow! ➡️', emoji: '➡️', options: [{ emoji: '⬛', name: 'square' }, { emoji: '➡️', name: 'arrow' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }], answer: 1 },

  // Round 3 — shapes in real life
  { question: 'A pizza is shaped like a...', emoji: '🍕', options: [{ emoji: '⬛', name: 'square' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '⬜', name: 'rectangle' }], answer: 1 },
  { question: 'A slice of pizza is shaped like a...', emoji: '🍕', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '⬛', name: 'square' }, { emoji: '🔺', name: 'triangle' }, { emoji: '🔷', name: 'diamond' }], answer: 2 },
  { question: 'A door is shaped like a...', emoji: '🚪', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '⬜', name: 'rectangle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '⭐', name: 'star' }], answer: 1 },
  { question: 'The sun looks like a...', emoji: '☀️', options: [{ emoji: '⭐', name: 'star' }, { emoji: '⬛', name: 'square' }, { emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }], answer: 2 },
  { question: 'A book is shaped like a...', emoji: '📚', options: [{ emoji: '⭕', name: 'circle' }, { emoji: '🔺', name: 'triangle' }, { emoji: '🔷', name: 'diamond' }, { emoji: '⬜', name: 'rectangle' }], answer: 3 },

  // Round 4 — how many sides?
  { question: 'A circle has... sides', emoji: '⭕', options: [{ emoji: '0️⃣', name: '0 — no sides' }, { emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }], answer: 0 },
  { question: 'A triangle has... sides', emoji: '🔺', options: [{ emoji: '2️⃣', name: '2 sides' }, { emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }], answer: 1 },
  { question: 'A square has... sides', emoji: '⬛', options: [{ emoji: '3️⃣', name: '3 sides' }, { emoji: '4️⃣', name: '4 sides' }, { emoji: '5️⃣', name: '5 sides' }, { emoji: '6️⃣', name: '6 sides' }], answer: 1 },
  { question: 'Which shape has no corners?', emoji: '🤔', options: [{ emoji: '⬛', name: 'square' }, { emoji: '🔺', name: 'triangle' }, { emoji: '⭕', name: 'circle' }, { emoji: '⬜', name: 'rectangle' }], answer: 2 },
  { question: 'Which shape is round?', emoji: '🌀', options: [{ emoji: '🔺', name: 'triangle' }, { emoji: '⬛', name: 'square' }, { emoji: '🔷', name: 'diamond' }, { emoji: '⭕', name: 'circle' }], answer: 3 },
]
