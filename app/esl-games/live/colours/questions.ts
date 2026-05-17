export type ColourQuestion = {
  question: string
  emoji: string
  hint: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const colourQuestions: ColourQuestion[] = [
  // COLOURS — Round 1
  { question: 'What colour is this?', emoji: '🔴', hint: 'Red', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟢', name: 'Green' }], answer: 2 },
  { question: 'What colour is this?', emoji: '🔵', hint: 'Blue', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🔴', name: 'Red' }], answer: 0 },
  { question: 'What colour is this?', emoji: '🟡', hint: 'Yellow', options: [{ emoji: '🟢', name: 'Green' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟠', name: 'Orange' }, { emoji: '⚪', name: 'White' }], answer: 1 },
  { question: 'What colour is this?', emoji: '🟢', hint: 'Green', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }], answer: 3 },
  { question: 'What colour is this?', emoji: '🟠', hint: 'Orange', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟣', name: 'Purple' }], answer: 0 },

  // COLOURS — Round 2
  { question: 'What colour is this?', emoji: '🟣', hint: 'Purple', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🔴', name: 'Red' }, { emoji: '⚫', name: 'Black' }], answer: 1 },
  { question: 'What colour is this?', emoji: '⚫', hint: 'Black', options: [{ emoji: '🟤', name: 'Brown' }, { emoji: '⚪', name: 'White' }, { emoji: '🟢', name: 'Green' }, { emoji: '⚫', name: 'Black' }], answer: 3 },
  { question: 'What colour is this?', emoji: '⚪', hint: 'White', options: [{ emoji: '⚪', name: 'White' }, { emoji: '⚫', name: 'Black' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟤', name: 'Brown' }], answer: 0 },
  { question: 'What colour is this?', emoji: '🟤', hint: 'Brown', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟤', name: 'Brown' }, { emoji: '⚫', name: 'Black' }], answer: 2 },
  { question: 'What colour is this?', emoji: '🩷', hint: 'Pink', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🟠', name: 'Orange' }, { emoji: '🩷', name: 'Pink' }], answer: 3 },

  // SHAPES — Round 3
  { question: 'What shape is this?', emoji: '⭕', hint: 'Circle', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }], answer: 0 },
  { question: 'What shape is this?', emoji: '⬛', hint: 'Square', options: [{ emoji: '🔺', name: 'Triangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔷', name: 'Diamond' }], answer: 2 },
  { question: 'What shape is this?', emoji: '🔺', hint: 'Triangle', options: [{ emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '⬜', name: 'Rectangle' }], answer: 1 },
  { question: 'What shape is this?', emoji: '🔷', hint: 'Diamond', options: [{ emoji: '⭕', name: 'Circle' }, { emoji: '⬛', name: 'Square' }, { emoji: '🔺', name: 'Triangle' }, { emoji: '🔷', name: 'Diamond' }], answer: 3 },
  { question: 'What shape is this?', emoji: '⬜', hint: 'Rectangle', options: [{ emoji: '⬜', name: 'Rectangle' }, { emoji: '⭕', name: 'Circle' }, { emoji: '🔷', name: 'Diamond' }, { emoji: '🔺', name: 'Triangle' }], answer: 0 },

  // COLOURS IN NATURE — Round 4
  { question: 'What colour is the sun? ☀️', emoji: '☀️', hint: 'Yellow!', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }, { emoji: '🔴', name: 'Red' }], answer: 1 },
  { question: 'What colour is the sky? 🌤️', emoji: '🌤️', hint: 'Blue!', options: [{ emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟠', name: 'Orange' }], answer: 2 },
  { question: 'What colour is grass? 🌱', emoji: '🌱', hint: 'Green!', options: [{ emoji: '🟢', name: 'Green' }, { emoji: '🔴', name: 'Red' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟡', name: 'Yellow' }], answer: 0 },
  { question: 'What colour is a strawberry? 🍓', emoji: '🍓', hint: 'Red!', options: [{ emoji: '🟠', name: 'Orange' }, { emoji: '🟣', name: 'Purple' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔴', name: 'Red' }], answer: 3 },
  { question: 'What colour is a banana? 🍌', emoji: '🍌', hint: 'Yellow!', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🟢', name: 'Green' }, { emoji: '🟠', name: 'Orange' }], answer: 1 },
]
