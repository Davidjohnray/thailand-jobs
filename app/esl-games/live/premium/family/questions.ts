export type FamilyQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const familyQuestions: FamilyQuestion[] = [
  // Round 1 — core family members
  { question: 'Who is this? 👩', emoji: '👩', options: [{ emoji: '👨', name: 'Dad' }, { emoji: '👩', name: 'Mum' }, { emoji: '👧', name: 'Sister' }, { emoji: '👶', name: 'Baby' }], answer: 1 },
  { question: 'Who is this? 👨', emoji: '👨', options: [{ emoji: '👩', name: 'Mum' }, { emoji: '👴', name: 'Grandpa' }, { emoji: '👨', name: 'Dad' }, { emoji: '👦', name: 'Brother' }], answer: 2 },
  { question: 'Who is this? 👧', emoji: '👧', options: [{ emoji: '👧', name: 'Sister' }, { emoji: '👩', name: 'Mum' }, { emoji: '👶', name: 'Baby' }, { emoji: '👵', name: 'Grandma' }], answer: 0 },
  { question: 'Who is this? 👦', emoji: '👦', options: [{ emoji: '👨', name: 'Dad' }, { emoji: '👦', name: 'Brother' }, { emoji: '👴', name: 'Grandpa' }, { emoji: '👶', name: 'Baby' }], answer: 1 },
  { question: 'Who is this? 👵', emoji: '👵', options: [{ emoji: '👩', name: 'Mum' }, { emoji: '👧', name: 'Sister' }, { emoji: '👵', name: 'Grandma' }, { emoji: '👶', name: 'Baby' }], answer: 2 },

  // Round 2 — grandparents and baby
  { question: 'Who is this? 👴', emoji: '👴', options: [{ emoji: '👴', name: 'Grandpa' }, { emoji: '👨', name: 'Dad' }, { emoji: '👦', name: 'Brother' }, { emoji: '👶', name: 'Baby' }], answer: 0 },
  { question: 'Who is this? 👶', emoji: '👶', options: [{ emoji: '👧', name: 'Sister' }, { emoji: '👦', name: 'Brother' }, { emoji: '👵', name: 'Grandma' }, { emoji: '👶', name: 'Baby' }], answer: 3 },
  { question: 'Who is this? 👨‍👩‍👧', emoji: '👨‍👩‍👧', options: [{ emoji: '👫', name: 'Couple' }, { emoji: '👨‍👩‍👧', name: 'Family' }, { emoji: '👯', name: 'Friends' }, { emoji: '👬', name: 'Brothers' }], answer: 1 },
  { question: 'Who has white hair and is old? 👴', emoji: '🧓', options: [{ emoji: '👨', name: 'Dad' }, { emoji: '👶', name: 'Baby' }, { emoji: '🧓', name: 'Grandparent' }, { emoji: '👦', name: 'Brother' }], answer: 2 },
  { question: 'Who is the youngest in the family? 👶', emoji: '👶', options: [{ emoji: '👧', name: 'Sister' }, { emoji: '👶', name: 'Baby' }, { emoji: '👦', name: 'Brother' }, { emoji: '👩', name: 'Mum' }], answer: 1 },

  // Round 3 — who does what
  { question: 'Who cooks dinner at home? 🍳', emoji: '👩‍🍳', options: [{ emoji: '👦', name: 'Brother' }, { emoji: '👶', name: 'Baby' }, { emoji: '👩‍🍳', name: 'Mum or Dad' }, { emoji: '🐶', name: 'Dog' }], answer: 2 },
  { question: 'Who takes you to school? 🏫', emoji: '🚗', options: [{ emoji: '👶', name: 'Baby' }, { emoji: '👨', name: 'Dad' }, { emoji: '🐱', name: 'Cat' }, { emoji: '👦', name: 'Brother' }], answer: 1 },
  { question: 'Who gives you a hug when you are sad? 🤗', emoji: '🤗', options: [{ emoji: '👨‍👩‍👧', name: 'Family' }, { emoji: '📱', name: 'Phone' }, { emoji: '📚', name: 'Books' }, { emoji: '🎮', name: 'Games' }], answer: 0 },
  { question: 'Mum\'s mum is your... 👵', emoji: '👵', options: [{ emoji: '👩', name: 'Mum' }, { emoji: '👧', name: 'Sister' }, { emoji: '👵', name: 'Grandma' }, { emoji: '👨', name: 'Dad' }], answer: 2 },
  { question: 'Dad\'s dad is your... 👴', emoji: '👴', options: [{ emoji: '👨', name: 'Dad' }, { emoji: '👴', name: 'Grandpa' }, { emoji: '👦', name: 'Brother' }, { emoji: '🧓', name: 'Uncle' }], answer: 1 },

  // Round 4 — family actions and love
  { question: 'A boy in your family is your... 👦', emoji: '👦', options: [{ emoji: '👧', name: 'Sister' }, { emoji: '👩', name: 'Mum' }, { emoji: '👶', name: 'Baby' }, { emoji: '👦', name: 'Brother' }], answer: 3 },
  { question: 'A girl in your family is your... 👧', emoji: '👧', options: [{ emoji: '👧', name: 'Sister' }, { emoji: '👨', name: 'Dad' }, { emoji: '👴', name: 'Grandpa' }, { emoji: '👦', name: 'Brother' }], answer: 0 },
  { question: 'Who reads you a bedtime story? 📖', emoji: '📖', options: [{ emoji: '🐶', name: 'Dog' }, { emoji: '👵', name: 'Grandma' }, { emoji: '🎮', name: 'Games' }, { emoji: '🚗', name: 'Car' }], answer: 1 },
  { question: 'How many people in this family? 👨‍👩‍👧‍👦', emoji: '👨‍👩‍👧‍👦', options: [{ emoji: '2️⃣', name: '2' }, { emoji: '3️⃣', name: '3' }, { emoji: '4️⃣', name: '4' }, { emoji: '5️⃣', name: '5' }], answer: 2 },
  { question: 'We love our... ❤️', emoji: '❤️', options: [{ emoji: '🏠', name: 'House' }, { emoji: '📱', name: 'Phone' }, { emoji: '👨‍👩‍👧', name: 'Family' }, { emoji: '🎮', name: 'Games' }], answer: 2 },
]
