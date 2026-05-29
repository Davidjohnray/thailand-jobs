export type NumbersQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const numbersQuestions: NumbersQuestion[] = [
  // Round 1 — count the objects
  { question: 'How many? 🍎', emoji: '🍎🍎🍎', options: [{ emoji: '2️⃣', name: 'two' }, { emoji: '3️⃣', name: 'three' }, { emoji: '4️⃣', name: 'four' }, { emoji: '5️⃣', name: 'five' }], answer: 1 },
  { question: 'How many? ⭐', emoji: '⭐⭐', options: [{ emoji: '1️⃣', name: 'one' }, { emoji: '2️⃣', name: 'two' }, { emoji: '3️⃣', name: 'three' }, { emoji: '4️⃣', name: 'four' }], answer: 1 },
  { question: 'How many? 🐱', emoji: '🐱🐱🐱🐱', options: [{ emoji: '3️⃣', name: 'three' }, { emoji: '4️⃣', name: 'four' }, { emoji: '5️⃣', name: 'five' }, { emoji: '6️⃣', name: 'six' }], answer: 1 },
  { question: 'How many? 🌸', emoji: '🌸🌸🌸🌸🌸', options: [{ emoji: '4️⃣', name: 'four' }, { emoji: '5️⃣', name: 'five' }, { emoji: '6️⃣', name: 'six' }, { emoji: '7️⃣', name: 'seven' }], answer: 1 },
  { question: 'How many? 🐸', emoji: '🐸', options: [{ emoji: '1️⃣', name: 'one' }, { emoji: '2️⃣', name: 'two' }, { emoji: '3️⃣', name: 'three' }, { emoji: '0️⃣', name: 'zero' }], answer: 0 },
  // Round 2 — find the number
  { question: 'Find the number one! 1️⃣', emoji: '1️⃣', options: [{ emoji: '3️⃣', name: 'three' }, { emoji: '1️⃣', name: 'one' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '4️⃣', name: 'four' }], answer: 1 },
  { question: 'Find the number five! 5️⃣', emoji: '5️⃣', options: [{ emoji: '5️⃣', name: 'five' }, { emoji: '6️⃣', name: 'six' }, { emoji: '2️⃣', name: 'two' }, { emoji: '9️⃣', name: 'nine' }], answer: 0 },
  { question: 'Find the number ten! 🔟', emoji: '🔟', options: [{ emoji: '7️⃣', name: 'seven' }, { emoji: '8️⃣', name: 'eight' }, { emoji: '9️⃣', name: 'nine' }, { emoji: '🔟', name: 'ten' }], answer: 3 },
  { question: 'Find the number seven! 7️⃣', emoji: '7️⃣', options: [{ emoji: '1️⃣', name: 'one' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '4️⃣', name: 'four' }, { emoji: '9️⃣', name: 'nine' }], answer: 1 },
  { question: 'Find the number three! 3️⃣', emoji: '3️⃣', options: [{ emoji: '8️⃣', name: 'eight' }, { emoji: '5️⃣', name: 'five' }, { emoji: '3️⃣', name: 'three' }, { emoji: '6️⃣', name: 'six' }], answer: 2 },
  // Round 3 — more or less
  { question: 'Which is more? 🍭', emoji: '🍭', options: [{ emoji: '2️⃣', name: 'two' }, { emoji: '8️⃣', name: 'eight' }, { emoji: '3️⃣', name: 'three' }, { emoji: '1️⃣', name: 'one' }], answer: 1 },
  { question: 'Which is less? 🐟', emoji: '🐟', options: [{ emoji: '9️⃣', name: 'nine' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '2️⃣', name: 'two' }, { emoji: '8️⃣', name: 'eight' }], answer: 2 },
  { question: 'What comes after 4? ➡️', emoji: '4️⃣➡️', options: [{ emoji: '3️⃣', name: 'three' }, { emoji: '6️⃣', name: 'six' }, { emoji: '5️⃣', name: 'five' }, { emoji: '7️⃣', name: 'seven' }], answer: 2 },
  { question: 'What comes before 3? ⬅️', emoji: '⬅️3️⃣', options: [{ emoji: '4️⃣', name: 'four' }, { emoji: '2️⃣', name: 'two' }, { emoji: '5️⃣', name: 'five' }, { emoji: '1️⃣', name: 'one' }], answer: 1 },
  { question: 'What comes after 9? ➡️', emoji: '9️⃣➡️', options: [{ emoji: '8️⃣', name: 'eight' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '🔟', name: 'ten' }, { emoji: '6️⃣', name: 'six' }], answer: 2 },
  // Round 4 — counting objects
  { question: 'How many fingers? 🖐️🖐️', emoji: '🖐️🖐️', options: [{ emoji: '8️⃣', name: 'eight' }, { emoji: '9️⃣', name: 'nine' }, { emoji: '🔟', name: 'ten' }, { emoji: '7️⃣', name: 'seven' }], answer: 2 },
  { question: 'How many? 🎈🎈🎈🎈🎈🎈', emoji: '🎈🎈🎈🎈🎈🎈', options: [{ emoji: '5️⃣', name: 'five' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '6️⃣', name: 'six' }, { emoji: '8️⃣', name: 'eight' }], answer: 2 },
  { question: 'How many? 🦆🦆🦆🦆🦆🦆🦆', emoji: '🦆🦆🦆🦆🦆🦆🦆', options: [{ emoji: '6️⃣', name: 'six' }, { emoji: '7️⃣', name: 'seven' }, { emoji: '8️⃣', name: 'eight' }, { emoji: '9️⃣', name: 'nine' }], answer: 1 },
  { question: 'How many? 🌟🌟🌟🌟🌟🌟🌟🌟', emoji: '🌟🌟🌟🌟🌟🌟🌟🌟', options: [{ emoji: '7️⃣', name: 'seven' }, { emoji: '9️⃣', name: 'nine' }, { emoji: '8️⃣', name: 'eight' }, { emoji: '🔟', name: 'ten' }], answer: 2 },
  { question: 'zero means...?', emoji: '0️⃣', options: [{ emoji: '🔟', name: 'ten things' }, { emoji: '5️⃣', name: 'five things' }, { emoji: '0️⃣', name: 'nothing!' }, { emoji: '1️⃣', name: 'one thing' }], answer: 2 },
]
