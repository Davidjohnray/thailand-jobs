export type NumbersQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const numbersQuestions: NumbersQuestion[] = [
  // Round 1 — count the objects
  { question: 'How many? 🍎', emoji: '🍎🍎🍎', options: [{ emoji: '2️⃣', name: 'Two' }, { emoji: '3️⃣', name: 'Three' }, { emoji: '4️⃣', name: 'Four' }, { emoji: '5️⃣', name: 'Five' }], answer: 1 },
  { question: 'How many? ⭐', emoji: '⭐⭐', options: [{ emoji: '1️⃣', name: 'One' }, { emoji: '2️⃣', name: 'Two' }, { emoji: '3️⃣', name: 'Three' }, { emoji: '4️⃣', name: 'Four' }], answer: 1 },
  { question: 'How many? 🐱', emoji: '🐱🐱🐱🐱', options: [{ emoji: '3️⃣', name: 'Three' }, { emoji: '4️⃣', name: 'Four' }, { emoji: '5️⃣', name: 'Five' }, { emoji: '6️⃣', name: 'Six' }], answer: 1 },
  { question: 'How many? 🌸', emoji: '🌸🌸🌸🌸🌸', options: [{ emoji: '4️⃣', name: 'Four' }, { emoji: '5️⃣', name: 'Five' }, { emoji: '6️⃣', name: 'Six' }, { emoji: '7️⃣', name: 'Seven' }], answer: 1 },
  { question: 'How many? 🐸', emoji: '🐸', options: [{ emoji: '1️⃣', name: 'One' }, { emoji: '2️⃣', name: 'Two' }, { emoji: '3️⃣', name: 'Three' }, { emoji: '0️⃣', name: 'Zero' }], answer: 0 },
  // Round 2 — find the number
  { question: 'Find the number ONE! 1️⃣', emoji: '1️⃣', options: [{ emoji: '3️⃣', name: 'Three' }, { emoji: '1️⃣', name: 'One' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '4️⃣', name: 'Four' }], answer: 1 },
  { question: 'Find the number FIVE! 5️⃣', emoji: '5️⃣', options: [{ emoji: '5️⃣', name: 'Five' }, { emoji: '6️⃣', name: 'Six' }, { emoji: '2️⃣', name: 'Two' }, { emoji: '9️⃣', name: 'Nine' }], answer: 0 },
  { question: 'Find the number TEN! 🔟', emoji: '🔟', options: [{ emoji: '7️⃣', name: 'Seven' }, { emoji: '8️⃣', name: 'Eight' }, { emoji: '9️⃣', name: 'Nine' }, { emoji: '🔟', name: 'Ten' }], answer: 3 },
  { question: 'Find the number SEVEN! 7️⃣', emoji: '7️⃣', options: [{ emoji: '1️⃣', name: 'One' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '4️⃣', name: 'Four' }, { emoji: '9️⃣', name: 'Nine' }], answer: 1 },
  { question: 'Find the number THREE! 3️⃣', emoji: '3️⃣', options: [{ emoji: '8️⃣', name: 'Eight' }, { emoji: '5️⃣', name: 'Five' }, { emoji: '3️⃣', name: 'Three' }, { emoji: '6️⃣', name: 'Six' }], answer: 2 },
  // Round 3 — more or less
  { question: 'Which is MORE? 🍭', emoji: '🍭', options: [{ emoji: '2️⃣', name: 'Two' }, { emoji: '8️⃣', name: 'Eight' }, { emoji: '3️⃣', name: 'Three' }, { emoji: '1️⃣', name: 'One' }], answer: 1 },
  { question: 'Which is LESS? 🐟', emoji: '🐟', options: [{ emoji: '9️⃣', name: 'Nine' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '2️⃣', name: 'Two' }, { emoji: '8️⃣', name: 'Eight' }], answer: 2 },
  { question: 'What comes AFTER 4? ➡️', emoji: '4️⃣➡️', options: [{ emoji: '3️⃣', name: 'Three' }, { emoji: '6️⃣', name: 'Six' }, { emoji: '5️⃣', name: 'Five' }, { emoji: '7️⃣', name: 'Seven' }], answer: 2 },
  { question: 'What comes BEFORE 3? ⬅️', emoji: '⬅️3️⃣', options: [{ emoji: '4️⃣', name: 'Four' }, { emoji: '2️⃣', name: 'Two' }, { emoji: '5️⃣', name: 'Five' }, { emoji: '1️⃣', name: 'One' }], answer: 1 },
  { question: 'What comes AFTER 9? ➡️', emoji: '9️⃣➡️', options: [{ emoji: '8️⃣', name: 'Eight' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '🔟', name: 'Ten' }, { emoji: '6️⃣', name: 'Six' }], answer: 2 },
  // Round 4 — counting objects
  { question: 'How many fingers? 🖐️🖐️', emoji: '🖐️🖐️', options: [{ emoji: '8️⃣', name: 'Eight' }, { emoji: '9️⃣', name: 'Nine' }, { emoji: '🔟', name: 'Ten' }, { emoji: '7️⃣', name: 'Seven' }], answer: 2 },
  { question: 'How many? 🎈🎈🎈🎈🎈🎈', emoji: '🎈🎈🎈🎈🎈🎈', options: [{ emoji: '5️⃣', name: 'Five' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '6️⃣', name: 'Six' }, { emoji: '8️⃣', name: 'Eight' }], answer: 2 },
  { question: 'How many? 🦆🦆🦆🦆🦆🦆🦆', emoji: '🦆🦆🦆🦆🦆🦆🦆', options: [{ emoji: '6️⃣', name: 'Six' }, { emoji: '7️⃣', name: 'Seven' }, { emoji: '8️⃣', name: 'Eight' }, { emoji: '9️⃣', name: 'Nine' }], answer: 1 },
  { question: 'How many? 🌟🌟🌟🌟🌟🌟🌟🌟', emoji: '🌟🌟🌟🌟🌟🌟🌟🌟', options: [{ emoji: '7️⃣', name: 'Seven' }, { emoji: '9️⃣', name: 'Nine' }, { emoji: '8️⃣', name: 'Eight' }, { emoji: '🔟', name: 'Ten' }], answer: 2 },
  { question: 'ZERO means...? 0️⃣', emoji: '0️⃣', options: [{ emoji: '🔟', name: 'Ten things' }, { emoji: '5️⃣', name: 'Five things' }, { emoji: '0️⃣', name: 'Nothing!' }, { emoji: '1️⃣', name: 'One thing' }], answer: 2 },
]
