export type ColoursQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const coloursQuestions: ColoursQuestion[] = [
  // Round 1 — basic colours
  { question: 'Find the RED! 🔴', emoji: '🔴', options: [{ emoji: '🟡', name: 'Yellow' }, { emoji: '🔴', name: 'Red' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟢', name: 'Green' }], answer: 1 },
  { question: 'Find the BLUE! 🔵', emoji: '🔵', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🟡', name: 'Yellow' }], answer: 0 },
  { question: 'Find the GREEN! 🟢', emoji: '🟢', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }, { emoji: '🔴', name: 'Red' }], answer: 2 },
  { question: 'Find the YELLOW! 🟡', emoji: '🟡', options: [{ emoji: '🟢', name: 'Green' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }], answer: 3 },
  { question: 'Find the ORANGE! 🟠', emoji: '🟠', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }], answer: 0 },
  // Round 2 — more colours
  { question: 'Find the PURPLE! 🟣', emoji: '🟣', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟤', name: 'Brown' }], answer: 1 },
  { question: 'Find the PINK! 🩷', emoji: '🩷', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🩷', name: 'Pink' }, { emoji: '⬜', name: 'White' }], answer: 2 },
  { question: 'Find the WHITE! ⬜', emoji: '⬜', options: [{ emoji: '⬛', name: 'Black' }, { emoji: '🟤', name: 'Brown' }, { emoji: '🩶', name: 'Grey' }, { emoji: '⬜', name: 'White' }], answer: 3 },
  { question: 'Find the BLACK! ⬛', emoji: '⬛', options: [{ emoji: '⬛', name: 'Black' }, { emoji: '⬜', name: 'White' }, { emoji: '🩶', name: 'Grey' }, { emoji: '🟤', name: 'Brown' }], answer: 0 },
  { question: 'Find the BROWN! 🟤', emoji: '🟤', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🟤', name: 'Brown' }, { emoji: '⬛', name: 'Black' }, { emoji: '🔴', name: 'Red' }], answer: 1 },
  // Round 3 — colours in real life
  { question: 'What colour is the sun? ☀️', emoji: '☀️', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟢', name: 'Green' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔴', name: 'Red' }], answer: 2 },
  { question: 'What colour is the sky? 🌤️', emoji: '🌤️', options: [{ emoji: '🟢', name: 'Green' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟠', name: 'Orange' }], answer: 1 },
  { question: 'What colour is grass? 🌿', emoji: '🌿', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟢', name: 'Green' }], answer: 3 },
  { question: 'What colour is a strawberry? 🍓', emoji: '🍓', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🟡', name: 'Yellow' }], answer: 1 },
  { question: 'What colour is a banana? 🍌', emoji: '🍌', options: [{ emoji: '🟢', name: 'Green' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔴', name: 'Red' }], answer: 2 },
  // Round 4 — mix it up
  { question: 'What colour is an elephant? 🐘', emoji: '🐘', options: [{ emoji: '🟤', name: 'Brown' }, { emoji: '🩶', name: 'Grey' }, { emoji: '⬛', name: 'Black' }, { emoji: '⬜', name: 'White' }], answer: 1 },
  { question: 'What colour is a carrot? 🥕', emoji: '🥕', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🟢', name: 'Green' }], answer: 2 },
  { question: 'What colour is a grape? 🍇', emoji: '🍇', options: [{ emoji: '🟣', name: 'Purple' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟢', name: 'Green' }], answer: 0 },
  { question: 'What colour is snow? ❄️', emoji: '❄️', options: [{ emoji: '🩶', name: 'Grey' }, { emoji: '🔵', name: 'Blue' }, { emoji: '⬜', name: 'White' }, { emoji: '🟡', name: 'Yellow' }], answer: 2 },
  { question: 'What colour is a flamingo? 🦩', emoji: '🦩', options: [{ emoji: '🟣', name: 'Purple' }, { emoji: '🩷', name: 'Pink' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟠', name: 'Orange' }], answer: 1 },
]
