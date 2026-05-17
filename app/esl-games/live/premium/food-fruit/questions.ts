export type FoodQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const foodQuestions: FoodQuestion[] = [
  // Round 1 — basic fruits
  { question: 'Find the Apple! 🍎', emoji: '🍎', options: [{ emoji: '🍊', name: 'Orange' }, { emoji: '🍎', name: 'Apple' }, { emoji: '🍋', name: 'Lemon' }, { emoji: '🍇', name: 'Grapes' }], answer: 1 },
  { question: 'Find the Banana! 🍌', emoji: '🍌', options: [{ emoji: '🍌', name: 'Banana' }, { emoji: '🍍', name: 'Pineapple' }, { emoji: '🥭', name: 'Mango' }, { emoji: '🍈', name: 'Melon' }], answer: 0 },
  { question: 'Find the Orange! 🍊', emoji: '🍊', options: [{ emoji: '🍋', name: 'Lemon' }, { emoji: '🍎', name: 'Apple' }, { emoji: '🍊', name: 'Orange' }, { emoji: '🍑', name: 'Peach' }], answer: 2 },
  { question: 'Find the Grapes! 🍇', emoji: '🍇', options: [{ emoji: '🍓', name: 'Strawberry' }, { emoji: '🍒', name: 'Cherry' }, { emoji: '🫐', name: 'Blueberry' }, { emoji: '🍇', name: 'Grapes' }], answer: 3 },
  { question: 'Find the Strawberry! 🍓', emoji: '🍓', options: [{ emoji: '🍓', name: 'Strawberry' }, { emoji: '🍒', name: 'Cherry' }, { emoji: '🍎', name: 'Apple' }, { emoji: '🍊', name: 'Orange' }], answer: 0 },

  // Round 2 — more fruits
  { question: 'Find the Watermelon! 🍉', emoji: '🍉', options: [{ emoji: '🍈', name: 'Melon' }, { emoji: '🍉', name: 'Watermelon' }, { emoji: '🥝', name: 'Kiwi' }, { emoji: '🍍', name: 'Pineapple' }], answer: 1 },
  { question: 'Find the Pineapple! 🍍', emoji: '🍍', options: [{ emoji: '🥭', name: 'Mango' }, { emoji: '🍌', name: 'Banana' }, { emoji: '🍍', name: 'Pineapple' }, { emoji: '🍈', name: 'Melon' }], answer: 2 },
  { question: 'Find the Mango! 🥭', emoji: '🥭', options: [{ emoji: '🍊', name: 'Orange' }, { emoji: '🍑', name: 'Peach' }, { emoji: '🍋', name: 'Lemon' }, { emoji: '🥭', name: 'Mango' }], answer: 3 },
  { question: 'Find the Lemon! 🍋', emoji: '🍋', options: [{ emoji: '🍋', name: 'Lemon' }, { emoji: '🍊', name: 'Orange' }, { emoji: '🍈', name: 'Melon' }, { emoji: '🍍', name: 'Pineapple' }], answer: 0 },
  { question: 'Find the Cherry! 🍒', emoji: '🍒', options: [{ emoji: '🍓', name: 'Strawberry' }, { emoji: '🍒', name: 'Cherry' }, { emoji: '🍇', name: 'Grapes' }, { emoji: '🫐', name: 'Blueberry' }], answer: 1 },

  // Round 3 — vegetables
  { question: 'Find the Carrot! 🥕', emoji: '🥕', options: [{ emoji: '🌽', name: 'Corn' }, { emoji: '🥕', name: 'Carrot' }, { emoji: '🥦', name: 'Broccoli' }, { emoji: '🧅', name: 'Onion' }], answer: 1 },
  { question: 'Find the Corn! 🌽', emoji: '🌽', options: [{ emoji: '🌽', name: 'Corn' }, { emoji: '🥕', name: 'Carrot' }, { emoji: '🥒', name: 'Cucumber' }, { emoji: '🫑', name: 'Pepper' }], answer: 0 },
  { question: 'Find the Broccoli! 🥦', emoji: '🥦', options: [{ emoji: '🥬', name: 'Lettuce' }, { emoji: '🥕', name: 'Carrot' }, { emoji: '🌽', name: 'Corn' }, { emoji: '🥦', name: 'Broccoli' }], answer: 3 },
  { question: 'Find the Tomato! 🍅', emoji: '🍅', options: [{ emoji: '🍎', name: 'Apple' }, { emoji: '🍅', name: 'Tomato' }, { emoji: '🫑', name: 'Pepper' }, { emoji: '🥕', name: 'Carrot' }], answer: 1 },
  { question: 'Find the Cucumber! 🥒', emoji: '🥒', options: [{ emoji: '🥒', name: 'Cucumber' }, { emoji: '🥦', name: 'Broccoli' }, { emoji: '🌽', name: 'Corn' }, { emoji: '🥬', name: 'Lettuce' }], answer: 0 },

  // Round 4 — food and meals
  { question: 'Find the Pizza! 🍕', emoji: '🍕', options: [{ emoji: '🍔', name: 'Burger' }, { emoji: '🌮', name: 'Taco' }, { emoji: '🍕', name: 'Pizza' }, { emoji: '🥪', name: 'Sandwich' }], answer: 2 },
  { question: 'Find the Rice! 🍚', emoji: '🍚', options: [{ emoji: '🍜', name: 'Noodles' }, { emoji: '🍚', name: 'Rice' }, { emoji: '🍞', name: 'Bread' }, { emoji: '🥣', name: 'Cereal' }], answer: 1 },
  { question: 'Find the Bread! 🍞', emoji: '🍞', options: [{ emoji: '🍞', name: 'Bread' }, { emoji: '🥐', name: 'Croissant' }, { emoji: '🥞', name: 'Pancakes' }, { emoji: '🧇', name: 'Waffle' }], answer: 0 },
  { question: 'Find the Burger! 🍔', emoji: '🍔', options: [{ emoji: '🍕', name: 'Pizza' }, { emoji: '🌮', name: 'Taco' }, { emoji: '🥪', name: 'Sandwich' }, { emoji: '🍔', name: 'Burger' }], answer: 3 },
  { question: 'Find the Ice Cream! 🍦', emoji: '🍦', options: [{ emoji: '🎂', name: 'Cake' }, { emoji: '🍦', name: 'Ice Cream' }, { emoji: '🍩', name: 'Donut' }, { emoji: '🍪', name: 'Cookie' }], answer: 1 },
]
