export type ClothesQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const clothesQuestions: ClothesQuestion[] = [
  // Round 1 — basic clothes
  { question: 'Find the T-Shirt! 👕', emoji: '👕', options: [{ emoji: '👗', name: 'Dress' }, { emoji: '👕', name: 'T-Shirt' }, { emoji: '👖', name: 'Trousers' }, { emoji: '🧥', name: 'Coat' }], answer: 1 },
  { question: 'Find the Dress! 👗', emoji: '👗', options: [{ emoji: '👕', name: 'T-Shirt' }, { emoji: '👗', name: 'Dress' }, { emoji: '👚', name: 'Jacket' }, { emoji: '👖', name: 'Trousers' }], answer: 1 },
  { question: 'Find the Trousers! 👖', emoji: '👖', options: [{ emoji: '👗', name: 'Dress' }, { emoji: '🩳', name: 'Shorts' }, { emoji: '👖', name: 'Trousers' }, { emoji: '👕', name: 'T-Shirt' }], answer: 2 },
  { question: 'Find the Hat! 🎩', emoji: '🎩', options: [{ emoji: '🎩', name: 'Hat' }, { emoji: '👒', name: 'Sun Hat' }, { emoji: '🧢', name: 'Cap' }, { emoji: '⛑️', name: 'Helmet' }], answer: 0 },
  { question: 'Find the Shoes! 👟', emoji: '👟', options: [{ emoji: '🥾', name: 'Boots' }, { emoji: '👡', name: 'Heels' }, { emoji: '🩴', name: 'Sandals' }, { emoji: '👟', name: 'Shoes' }], answer: 3 },

  // Round 2 — more clothes
  { question: 'Find the Socks! 🧦', emoji: '🧦', options: [{ emoji: '🧦', name: 'Socks' }, { emoji: '👟', name: 'Shoes' }, { emoji: '🥾', name: 'Boots' }, { emoji: '🩴', name: 'Sandals' }], answer: 0 },
  { question: 'Find the Coat! 🧥', emoji: '🧥', options: [{ emoji: '👕', name: 'T-Shirt' }, { emoji: '🧥', name: 'Coat' }, { emoji: '👗', name: 'Dress' }, { emoji: '👖', name: 'Trousers' }], answer: 1 },
  { question: 'Find the Cap! 🧢', emoji: '🧢', options: [{ emoji: '🎩', name: 'Hat' }, { emoji: '👒', name: 'Sun Hat' }, { emoji: '🧢', name: 'Cap' }, { emoji: '⛑️', name: 'Helmet' }], answer: 2 },
  { question: 'Find the Shorts! 🩳', emoji: '🩳', options: [{ emoji: '👖', name: 'Trousers' }, { emoji: '👗', name: 'Dress' }, { emoji: '👕', name: 'T-Shirt' }, { emoji: '🩳', name: 'Shorts' }], answer: 3 },
  { question: 'Find the Scarf! 🧣', emoji: '🧣', options: [{ emoji: '🧣', name: 'Scarf' }, { emoji: '🧤', name: 'Gloves' }, { emoji: '🧢', name: 'Cap' }, { emoji: '🧥', name: 'Coat' }], answer: 0 },

  // Round 3 — what do you wear when...
  { question: 'It is cold! What do you wear? 🥶', emoji: '🥶', options: [{ emoji: '👙', name: 'Swimsuit' }, { emoji: '🩳', name: 'Shorts' }, { emoji: '🧥', name: 'Coat' }, { emoji: '👕', name: 'T-Shirt' }], answer: 2 },
  { question: 'It is sunny! What do you wear on your head? ☀️', emoji: '☀️', options: [{ emoji: '⛑️', name: 'Helmet' }, { emoji: '🎩', name: 'Top Hat' }, { emoji: '👒', name: 'Sun Hat' }, { emoji: '🧢', name: 'Cap' }], answer: 2 },
  { question: 'It is raining! What do you wear? 🌧️', emoji: '🌧️', options: [{ emoji: '👙', name: 'Swimsuit' }, { emoji: '🧥', name: 'Raincoat' }, { emoji: '🩳', name: 'Shorts' }, { emoji: '👕', name: 'T-Shirt' }], answer: 1 },
  { question: 'You go swimming! What do you wear? 🏊', emoji: '🏊', options: [{ emoji: '🧥', name: 'Coat' }, { emoji: '👖', name: 'Trousers' }, { emoji: '👙', name: 'Swimsuit' }, { emoji: '🎩', name: 'Hat' }], answer: 2 },
  { question: 'You go to bed! What do you wear? 😴', emoji: '😴', options: [{ emoji: '🧥', name: 'Coat' }, { emoji: '🩱', name: 'Pyjamas' }, { emoji: '👗', name: 'Dress' }, { emoji: '👟', name: 'Shoes' }], answer: 1 },

  // Round 4 — colours and clothes
  { question: 'What colour is this T-shirt? 👕', emoji: '🔵', options: [{ emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }, { emoji: '🔵', name: 'Blue' }, { emoji: '🟢', name: 'Green' }], answer: 2 },
  { question: 'What do you put on your feet? 🦶', emoji: '🦶', options: [{ emoji: '🎩', name: 'Hat' }, { emoji: '🧤', name: 'Gloves' }, { emoji: '🧣', name: 'Scarf' }, { emoji: '👟', name: 'Shoes' }], answer: 3 },
  { question: 'What do you put on your hands? 🤲', emoji: '🤲', options: [{ emoji: '🧤', name: 'Gloves' }, { emoji: '🧦', name: 'Socks' }, { emoji: '👟', name: 'Shoes' }, { emoji: '🧢', name: 'Cap' }], answer: 0 },
  { question: 'What do you put on your head? 🧠', emoji: '🧠', options: [{ emoji: '🧦', name: 'Socks' }, { emoji: '🧤', name: 'Gloves' }, { emoji: '🧢', name: 'Cap' }, { emoji: '👟', name: 'Shoes' }], answer: 2 },
  { question: 'What do you put around your neck? 🫱', emoji: '🫱', options: [{ emoji: '🧦', name: 'Socks' }, { emoji: '🧥', name: 'Coat' }, { emoji: '🧤', name: 'Gloves' }, { emoji: '🧣', name: 'Scarf' }], answer: 3 },
]
