export type NatureQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const natureQuestions: NatureQuestion[] = [
  // Round 1 — plants
  { question: 'Find the Tree! 🌳', emoji: '🌳', options: [{ emoji: '🌲', name: 'Pine Tree' }, { emoji: '🌳', name: 'Tree' }, { emoji: '🌴', name: 'Palm Tree' }, { emoji: '🌵', name: 'Cactus' }], answer: 1 },
  { question: 'Find the Flower! 🌸', emoji: '🌸', options: [{ emoji: '🌸', name: 'Flower' }, { emoji: '🍀', name: 'Clover' }, { emoji: '🌿', name: 'Leaf' }, { emoji: '🍁', name: 'Maple Leaf' }], answer: 0 },
  { question: 'Find the Leaf! 🍃', emoji: '🍃', options: [{ emoji: '🌸', name: 'Flower' }, { emoji: '🍀', name: 'Clover' }, { emoji: '🍃', name: 'Leaf' }, { emoji: '🌵', name: 'Cactus' }], answer: 2 },
  { question: 'Find the Grass! 🌿', emoji: '🌿', options: [{ emoji: '🌵', name: 'Cactus' }, { emoji: '🌳', name: 'Tree' }, { emoji: '🌸', name: 'Flower' }, { emoji: '🌿', name: 'Grass' }], answer: 3 },
  { question: 'Find the Mushroom! 🍄', emoji: '🍄', options: [{ emoji: '🍄', name: 'Mushroom' }, { emoji: '🌸', name: 'Flower' }, { emoji: '🍀', name: 'Clover' }, { emoji: '🌿', name: 'Grass' }], answer: 0 },

  // Round 2 — sky and weather nature
  { question: 'Find the Sun! ☀️', emoji: '☀️', options: [{ emoji: '🌙', name: 'Moon' }, { emoji: '⭐', name: 'Star' }, { emoji: '☀️', name: 'Sun' }, { emoji: '⛅', name: 'Cloud' }], answer: 2 },
  { question: 'Find the Moon! 🌙', emoji: '🌙', options: [{ emoji: '☀️', name: 'Sun' }, { emoji: '🌙', name: 'Moon' }, { emoji: '⭐', name: 'Star' }, { emoji: '🌈', name: 'Rainbow' }], answer: 1 },
  { question: 'Find the Star! ⭐', emoji: '⭐', options: [{ emoji: '⭐', name: 'Star' }, { emoji: '☀️', name: 'Sun' }, { emoji: '🌙', name: 'Moon' }, { emoji: '⛅', name: 'Cloud' }], answer: 0 },
  { question: 'Find the Rainbow! 🌈', emoji: '🌈', options: [{ emoji: '⭐', name: 'Star' }, { emoji: '⛅', name: 'Cloud' }, { emoji: '🌙', name: 'Moon' }, { emoji: '🌈', name: 'Rainbow' }], answer: 3 },
  { question: 'Find the Cloud! ⛅', emoji: '⛅', options: [{ emoji: '☀️', name: 'Sun' }, { emoji: '⛅', name: 'Cloud' }, { emoji: '🌙', name: 'Moon' }, { emoji: '🌈', name: 'Rainbow' }], answer: 1 },

  // Round 3 — water and land
  { question: 'Find the Mountain! ⛰️', emoji: '⛰️', options: [{ emoji: '🏖️', name: 'Beach' }, { emoji: '🌊', name: 'Wave' }, { emoji: '⛰️', name: 'Mountain' }, { emoji: '🌳', name: 'Forest' }], answer: 2 },
  { question: 'Find the Sea! 🌊', emoji: '🌊', options: [{ emoji: '🌊', name: 'Sea' }, { emoji: '🏔️', name: 'Mountain' }, { emoji: '🌳', name: 'Tree' }, { emoji: '🌸', name: 'Flower' }], answer: 0 },
  { question: 'Find the River! 🏞️', emoji: '🏞️', options: [{ emoji: '🏖️', name: 'Beach' }, { emoji: '🏞️', name: 'River' }, { emoji: '⛰️', name: 'Mountain' }, { emoji: '🌵', name: 'Desert' }], answer: 1 },
  { question: 'Find the Volcano! 🌋', emoji: '🌋', options: [{ emoji: '⛰️', name: 'Mountain' }, { emoji: '🏔️', name: 'Snowy Peak' }, { emoji: '🗻', name: 'Hill' }, { emoji: '🌋', name: 'Volcano' }], answer: 3 },
  { question: 'Find the Island! 🏝️', emoji: '🏝️', options: [{ emoji: '🏝️', name: 'Island' }, { emoji: '🌊', name: 'Sea' }, { emoji: '🏖️', name: 'Beach' }, { emoji: '⛰️', name: 'Mountain' }], answer: 0 },

  // Round 4 — nature at night and seasons
  { question: 'What do you see at night? 🌙', emoji: '🌃', options: [{ emoji: '☀️', name: 'Sun' }, { emoji: '🌸', name: 'Flowers' }, { emoji: '⭐', name: 'Stars' }, { emoji: '🌈', name: 'Rainbow' }], answer: 2 },
  { question: 'Which falls from the sky in winter? ❄️', emoji: '❄️', options: [{ emoji: '🌸', name: 'Flowers' }, { emoji: '❄️', name: 'Snow' }, { emoji: '🍃', name: 'Leaves' }, { emoji: '🌊', name: 'Waves' }], answer: 1 },
  { question: 'Which grows in spring? 🌱', emoji: '🌱', options: [{ emoji: '❄️', name: 'Snow' }, { emoji: '🍂', name: 'Falling Leaves' }, { emoji: '🌸', name: 'Flowers' }, { emoji: '⛈️', name: 'Storm' }], answer: 2 },
  { question: 'Where do fish live? 🐟', emoji: '🐟', options: [{ emoji: '🌳', name: 'Forest' }, { emoji: '⛰️', name: 'Mountain' }, { emoji: '🌊', name: 'Water' }, { emoji: '🌸', name: 'Garden' }], answer: 2 },
  { question: 'What do trees give us? 🌬️', emoji: '🌬️', options: [{ emoji: '💧', name: 'Water' }, { emoji: '🔥', name: 'Fire' }, { emoji: '💨', name: 'Air / Oxygen' }, { emoji: '⚡', name: 'Lightning' }], answer: 2 },
]
