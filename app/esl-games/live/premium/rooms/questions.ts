export type RoomsQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const roomsQuestions: RoomsQuestion[] = [
  // Round 1 — find the room
  { question: 'Find the BEDROOM! 🛏️', emoji: '🛏️', options: [{ emoji: '🚿', name: 'Bathroom' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }], answer: 1 },
  { question: 'Find the KITCHEN! 🍳', emoji: '🍳', options: [{ emoji: '🍳', name: 'Kitchen' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🌿', name: 'Garden' }], answer: 0 },
  { question: 'Find the BATHROOM! 🚿', emoji: '🚿', options: [{ emoji: '🛋️', name: 'Living Room' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🛏️', name: 'Bedroom' }], answer: 2 },
  { question: 'Find the LIVING ROOM! 🛋️', emoji: '🛋️', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }], answer: 3 },
  { question: 'Find the GARDEN! 🌿', emoji: '🌿', options: [{ emoji: '🌿', name: 'Garden' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🍳', name: 'Kitchen' }], answer: 0 },

  // Round 2 — more rooms
  { question: 'Find the DINING ROOM! 🍽️', emoji: '🍽️', options: [{ emoji: '🛋️', name: 'Living Room' }, { emoji: '🍽️', name: 'Dining Room' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🚿', name: 'Bathroom' }], answer: 1 },
  { question: 'Find the GARAGE! 🚗', emoji: '🚗', options: [{ emoji: '🍳', name: 'Kitchen' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚗', name: 'Garage' }, { emoji: '🛋️', name: 'Living Room' }], answer: 2 },
  { question: 'Find the TOILET! 🚽', emoji: '🚽', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🚽', name: 'Toilet' }], answer: 3 },
  { question: 'Find the BALCONY! 🌅', emoji: '🌅', options: [{ emoji: '🌅', name: 'Balcony' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🍳', name: 'Kitchen' }], answer: 0 },
  { question: 'Find the STUDY ROOM! 📚', emoji: '📚', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '📚', name: 'Study Room' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🌿', name: 'Garden' }], answer: 1 },

  // Round 3 — where do you do things?
  { question: 'Where do you SLEEP? 😴', emoji: '😴', options: [{ emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🌿', name: 'Garden' }], answer: 2 },
  { question: 'Where do you COOK? 👨‍🍳', emoji: '👨‍🍳', options: [{ emoji: '🍳', name: 'Kitchen' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🛋️', name: 'Living Room' }], answer: 0 },
  { question: 'Where do you SHOWER? 🚿', emoji: '🧼', options: [{ emoji: '🛋️', name: 'Living Room' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🌿', name: 'Garden' }], answer: 1 },
  { question: 'Where do you watch TV? 📺', emoji: '📺', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }], answer: 3 },
  { question: 'Where do plants grow? 🌱', emoji: '🌱', options: [{ emoji: '🌿', name: 'Garden' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🍳', name: 'Kitchen' }], answer: 0 },

  // Round 4 — what belongs where?
  { question: 'A BED belongs in the...? 🛏️', emoji: '🛏️', options: [{ emoji: '🍳', name: 'Kitchen' }, { emoji: '🛏️', name: 'Bedroom' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🚿', name: 'Bathroom' }], answer: 1 },
  { question: 'A SOFA belongs in the...? 🛋️', emoji: '🛋️', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🚿', name: 'Bathroom' }], answer: 2 },
  { question: 'A FRIDGE belongs in the...? ❄️', emoji: '❄️', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🍳', name: 'Kitchen' }], answer: 3 },
  { question: 'A TOOTHBRUSH belongs in the...? 🪥', emoji: '🪥', options: [{ emoji: '🚿', name: 'Bathroom' }, { emoji: '🍳', name: 'Kitchen' }, { emoji: '🛋️', name: 'Living Room' }, { emoji: '🌿', name: 'Garden' }], answer: 0 },
  { question: 'FLOWERS belong in the...? 🌸', emoji: '🌸', options: [{ emoji: '🛏️', name: 'Bedroom' }, { emoji: '🚿', name: 'Bathroom' }, { emoji: '🌿', name: 'Garden' }, { emoji: '🍳', name: 'Kitchen' }], answer: 2 },
]
