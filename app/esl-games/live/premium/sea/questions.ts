export type SeaQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const seaQuestions: SeaQuestion[] = [
  // Round 1 — basic sea creatures
  { question: 'Find the FISH! 🐟', emoji: '🐟', options: [{ emoji: '🦈', name: 'Shark' }, { emoji: '🐟', name: 'Fish' }, { emoji: '🐙', name: 'Octopus' }, { emoji: '🦀', name: 'Crab' }], answer: 1 },
  { question: 'Find the SHARK! 🦈', emoji: '🦈', options: [{ emoji: '🐬', name: 'Dolphin' }, { emoji: '🐟', name: 'Fish' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐋', name: 'Whale' }], answer: 2 },
  { question: 'Find the CRAB! 🦀', emoji: '🦀', options: [{ emoji: '🦀', name: 'Crab' }, { emoji: '🦞', name: 'Lobster' }, { emoji: '🦐', name: 'Shrimp' }, { emoji: '🐚', name: 'Shell' }], answer: 0 },
  { question: 'Find the DOLPHIN! 🐬', emoji: '🐬', options: [{ emoji: '🐋', name: 'Whale' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐟', name: 'Fish' }, { emoji: '🐬', name: 'Dolphin' }], answer: 3 },
  { question: 'Find the OCTOPUS! 🐙', emoji: '🐙', options: [{ emoji: '🐙', name: 'Octopus' }, { emoji: '🦑', name: 'Squid' }, { emoji: '🦀', name: 'Crab' }, { emoji: '🐚', name: 'Shell' }], answer: 0 },

  // Round 2 — more sea creatures
  { question: 'Find the WHALE! 🐋', emoji: '🐋', options: [{ emoji: '🦈', name: 'Shark' }, { emoji: '🐋', name: 'Whale' }, { emoji: '🐬', name: 'Dolphin' }, { emoji: '🐟', name: 'Fish' }], answer: 1 },
  { question: 'Find the JELLYFISH! 🪼', emoji: '🪼', options: [{ emoji: '🐙', name: 'Octopus' }, { emoji: '🦑', name: 'Squid' }, { emoji: '🪼', name: 'Jellyfish' }, { emoji: '🦀', name: 'Crab' }], answer: 2 },
  { question: 'Find the SEAHORSE! 🦄', emoji: '🐠', options: [{ emoji: '🐟', name: 'Fish' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐡', name: 'Pufferfish' }, { emoji: '🐠', name: 'Clownfish' }], answer: 3 },
  { question: 'Find the LOBSTER! 🦞', emoji: '🦞', options: [{ emoji: '🦞', name: 'Lobster' }, { emoji: '🦀', name: 'Crab' }, { emoji: '🦐', name: 'Shrimp' }, { emoji: '🐚', name: 'Shell' }], answer: 0 },
  { question: 'Find the SQUID! 🦑', emoji: '🦑', options: [{ emoji: '🐙', name: 'Octopus' }, { emoji: '🦑', name: 'Squid' }, { emoji: '🪼', name: 'Jellyfish' }, { emoji: '🐟', name: 'Fish' }], answer: 1 },

  // Round 3 — where do they live?
  { question: 'Which lives in the DEEP sea? 🌊', emoji: '🌊', options: [{ emoji: '🐬', name: 'Dolphin' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐠', name: 'Clownfish' }, { emoji: '🐋', name: 'Whale' }], answer: 3 },
  { question: 'Which lives on the BEACH? 🏖️', emoji: '🏖️', options: [{ emoji: '🦈', name: 'Shark' }, { emoji: '🦀', name: 'Crab' }, { emoji: '🐋', name: 'Whale' }, { emoji: '🐙', name: 'Octopus' }], answer: 1 },
  { question: 'Which can jump out of the water? 🌊', emoji: '💦', options: [{ emoji: '🦀', name: 'Crab' }, { emoji: '🐚', name: 'Shell' }, { emoji: '🐬', name: 'Dolphin' }, { emoji: '🦐', name: 'Shrimp' }], answer: 2 },
  { question: 'Which has 8 arms? 🦾', emoji: '🦾', options: [{ emoji: '🦀', name: 'Crab' }, { emoji: '🐟', name: 'Fish' }, { emoji: '🦞', name: 'Lobster' }, { emoji: '🐙', name: 'Octopus' }], answer: 3 },
  { question: 'Which is the BIGGEST sea animal? 🏆', emoji: '🏆', options: [{ emoji: '🐟', name: 'Fish' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐋', name: 'Whale' }, { emoji: '🐬', name: 'Dolphin' }], answer: 2 },

  // Round 4 — fun facts
  { question: 'How many legs does a CRAB have? 🦀', emoji: '🦀', options: [{ emoji: '4️⃣', name: 'Four' }, { emoji: '6️⃣', name: 'Six' }, { emoji: '8️⃣', name: 'Eight' }, { emoji: '🔟', name: 'Ten' }], answer: 3 },
  { question: 'What colour is a LOBSTER? 🦞', emoji: '🦞', options: [{ emoji: '🔵', name: 'Blue' }, { emoji: '🟢', name: 'Green' }, { emoji: '🔴', name: 'Red' }, { emoji: '🟡', name: 'Yellow' }], answer: 2 },
  { question: 'Which animal makes ink? 🖊️', emoji: '🖊️', options: [{ emoji: '🦀', name: 'Crab' }, { emoji: '🐙', name: 'Octopus' }, { emoji: '🐬', name: 'Dolphin' }, { emoji: '🐚', name: 'Shell' }], answer: 1 },
  { question: 'Which can sting you? ⚡', emoji: '⚡', options: [{ emoji: '🐟', name: 'Fish' }, { emoji: '🐋', name: 'Whale' }, { emoji: '🪼', name: 'Jellyfish' }, { emoji: '🐬', name: 'Dolphin' }], answer: 2 },
  { question: 'Which animal is the SMARTEST? 🧠', emoji: '🧠', options: [{ emoji: '🦀', name: 'Crab' }, { emoji: '🐬', name: 'Dolphin' }, { emoji: '🦐', name: 'Shrimp' }, { emoji: '🐚', name: 'Shell' }], answer: 1 },
]
