export type ColoursQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const coloursQuestions: ColoursQuestion[] = [
  // Round 1 — basic colours
  { question: 'Find the red! 🔴', emoji: '🔴', options: [{ emoji: '🟡', name: 'yellow' }, { emoji: '🔴', name: 'red' }, { emoji: '🔵', name: 'blue' }, { emoji: '🟢', name: 'green' }], answer: 1 },
  { question: 'Find the blue! 🔵', emoji: '🔵', options: [{ emoji: '🔵', name: 'blue' }, { emoji: '🟠', name: 'orange' }, { emoji: '🟣', name: 'purple' }, { emoji: '🟡', name: 'yellow' }], answer: 0 },
  { question: 'Find the green! 🟢', emoji: '🟢', options: [{ emoji: '🔵', name: 'blue' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🟢', name: 'green' }, { emoji: '🔴', name: 'red' }], answer: 2 },
  { question: 'Find the yellow! 🟡', emoji: '🟡', options: [{ emoji: '🟢', name: 'green' }, { emoji: '🟠', name: 'orange' }, { emoji: '🔴', name: 'red' }, { emoji: '🟡', name: 'yellow' }], answer: 3 },
  { question: 'Find the orange! 🟠', emoji: '🟠', options: [{ emoji: '🟠', name: 'orange' }, { emoji: '🔴', name: 'red' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🟢', name: 'green' }], answer: 0 },
  // Round 2 — more colours
  { question: 'Find the purple! 🟣', emoji: '🟣', options: [{ emoji: '🔵', name: 'blue' }, { emoji: '🟣', name: 'purple' }, { emoji: '🔴', name: 'red' }, { emoji: '🟤', name: 'brown' }], answer: 1 },
  { question: 'Find the pink! 🩷', emoji: '🩷', options: [{ emoji: '🔴', name: 'red' }, { emoji: '🟣', name: 'purple' }, { emoji: '🩷', name: 'pink' }, { emoji: '⬜', name: 'white' }], answer: 2 },
  { question: 'Find the white! ⬜', emoji: '⬜', options: [{ emoji: '⬛', name: 'black' }, { emoji: '🟤', name: 'brown' }, { emoji: '🩶', name: 'grey' }, { emoji: '⬜', name: 'white' }], answer: 3 },
  { question: 'Find the black! ⬛', emoji: '⬛', options: [{ emoji: '⬛', name: 'black' }, { emoji: '⬜', name: 'white' }, { emoji: '🩶', name: 'grey' }, { emoji: '🟤', name: 'brown' }], answer: 0 },
  { question: 'Find the brown! 🟤', emoji: '🟤', options: [{ emoji: '🟠', name: 'orange' }, { emoji: '🟤', name: 'brown' }, { emoji: '⬛', name: 'black' }, { emoji: '🔴', name: 'red' }], answer: 1 },
  // Round 3 — colours in real life
  { question: 'What colour is the sun? ☀️', emoji: '☀️', options: [{ emoji: '🔵', name: 'blue' }, { emoji: '🟢', name: 'green' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🔴', name: 'red' }], answer: 2 },
  { question: 'What colour is the sky? 🌤️', emoji: '🌤️', options: [{ emoji: '🟢', name: 'green' }, { emoji: '🔵', name: 'blue' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🟠', name: 'orange' }], answer: 1 },
  { question: 'What colour is grass? 🌿', emoji: '🌿', options: [{ emoji: '🔴', name: 'red' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🔵', name: 'blue' }, { emoji: '🟢', name: 'green' }], answer: 3 },
  { question: 'What colour is a strawberry? 🍓', emoji: '🍓', options: [{ emoji: '🟠', name: 'orange' }, { emoji: '🔴', name: 'red' }, { emoji: '🟣', name: 'purple' }, { emoji: '🟡', name: 'yellow' }], answer: 1 },
  { question: 'What colour is a banana? 🍌', emoji: '🍌', options: [{ emoji: '🟢', name: 'green' }, { emoji: '🟠', name: 'orange' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🔴', name: 'red' }], answer: 2 },
  // Round 4 — mix it up
  { question: 'What colour is an elephant? 🐘', emoji: '🐘', options: [{ emoji: '🟤', name: 'brown' }, { emoji: '🩶', name: 'grey' }, { emoji: '⬛', name: 'black' }, { emoji: '⬜', name: 'white' }], answer: 1 },
  { question: 'What colour is a carrot? 🥕', emoji: '🥕', options: [{ emoji: '🔴', name: 'red' }, { emoji: '🟡', name: 'yellow' }, { emoji: '🟠', name: 'orange' }, { emoji: '🟢', name: 'green' }], answer: 2 },
  { question: 'What colour is a grape? 🍇', emoji: '🍇', options: [{ emoji: '🟣', name: 'purple' }, { emoji: '🔵', name: 'blue' }, { emoji: '🔴', name: 'red' }, { emoji: '🟢', name: 'green' }], answer: 0 },
  { question: 'What colour is snow? ❄️', emoji: '❄️', options: [{ emoji: '🩶', name: 'grey' }, { emoji: '🔵', name: 'blue' }, { emoji: '⬜', name: 'white' }, { emoji: '🟡', name: 'yellow' }], answer: 2 },
  { question: 'What colour is a flamingo? 🦩', emoji: '🦩', options: [{ emoji: '🟣', name: 'purple' }, { emoji: '🩷', name: 'pink' }, { emoji: '🔴', name: 'red' }, { emoji: '🟠', name: 'orange' }], answer: 1 },
]
