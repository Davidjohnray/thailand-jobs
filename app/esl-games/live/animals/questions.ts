export type AnimalQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const animalQuestions: AnimalQuestion[] = [
  // Round 1 — very common animals
  { question: 'Find the Dog!', emoji: '🐶', options: [{ emoji: '🐱', name: 'Cat' }, { emoji: '🐶', name: 'Dog' }, { emoji: '🐭', name: 'Mouse' }, { emoji: '🐹', name: 'Hamster' }], answer: 1 },
  { question: 'Find the Cat!', emoji: '🐱', options: [{ emoji: '🐶', name: 'Dog' }, { emoji: '🐰', name: 'Rabbit' }, { emoji: '🐱', name: 'Cat' }, { emoji: '🐻', name: 'Bear' }], answer: 2 },
  { question: 'Find the Fish!', emoji: '🐟', options: [{ emoji: '🐸', name: 'Frog' }, { emoji: '🐢', name: 'Turtle' }, { emoji: '🦀', name: 'Crab' }, { emoji: '🐟', name: 'Fish' }], answer: 3 },
  { question: 'Find the Bird!', emoji: '🐦', options: [{ emoji: '🐦', name: 'Bird' }, { emoji: '🦋', name: 'Butterfly' }, { emoji: '🐝', name: 'Bee' }, { emoji: '🐛', name: 'Caterpillar' }], answer: 0 },
  { question: 'Find the Rabbit!', emoji: '🐰', options: [{ emoji: '🐹', name: 'Hamster' }, { emoji: '🐭', name: 'Mouse' }, { emoji: '🐮', name: 'Cow' }, { emoji: '🐰', name: 'Rabbit' }], answer: 3 },

  // Round 2 — farm animals
  { question: 'Find the Cow!', emoji: '🐮', options: [{ emoji: '🐮', name: 'Cow' }, { emoji: '🐷', name: 'Pig' }, { emoji: '🐑', name: 'Sheep' }, { emoji: '🐴', name: 'Horse' }], answer: 0 },
  { question: 'Find the Pig!', emoji: '🐷', options: [{ emoji: '🐮', name: 'Cow' }, { emoji: '🐑', name: 'Sheep' }, { emoji: '🐷', name: 'Pig' }, { emoji: '🐔', name: 'Chicken' }], answer: 2 },
  { question: 'Find the Horse!', emoji: '🐴', options: [{ emoji: '🐴', name: 'Horse' }, { emoji: '🐮', name: 'Cow' }, { emoji: '🦒', name: 'Giraffe' }, { emoji: '🦓', name: 'Zebra' }], answer: 0 },
  { question: 'Find the Chicken!', emoji: '🐔', options: [{ emoji: '🦆', name: 'Duck' }, { emoji: '🐦', name: 'Bird' }, { emoji: '🦅', name: 'Eagle' }, { emoji: '🐔', name: 'Chicken' }], answer: 3 },
  { question: 'Find the Duck!', emoji: '🦆', options: [{ emoji: '🐔', name: 'Chicken' }, { emoji: '🦆', name: 'Duck' }, { emoji: '🐦', name: 'Bird' }, { emoji: '🦢', name: 'Swan' }], answer: 1 },

  // Round 3 — jungle & safari
  { question: 'Find the Lion!', emoji: '🦁', options: [{ emoji: '🐯', name: 'Tiger' }, { emoji: '🐆', name: 'Leopard' }, { emoji: '🦁', name: 'Lion' }, { emoji: '🐻', name: 'Bear' }], answer: 2 },
  { question: 'Find the Elephant!', emoji: '🐘', options: [{ emoji: '🦛', name: 'Rhino' }, { emoji: '🐘', name: 'Elephant' }, { emoji: '🦏', name: 'Hippo' }, { emoji: '🐪', name: 'Camel' }], answer: 1 },
  { question: 'Find the Monkey!', emoji: '🐒', options: [{ emoji: '🐒', name: 'Monkey' }, { emoji: '🦧', name: 'Orangutan' }, { emoji: '🐻', name: 'Bear' }, { emoji: '🦊', name: 'Fox' }], answer: 0 },
  { question: 'Find the Giraffe!', emoji: '🦒', options: [{ emoji: '🦓', name: 'Zebra' }, { emoji: '🐘', name: 'Elephant' }, { emoji: '🦒', name: 'Giraffe' }, { emoji: '🐴', name: 'Horse' }], answer: 2 },
  { question: 'Find the Zebra!', emoji: '🦓', options: [{ emoji: '🐴', name: 'Horse' }, { emoji: '🦓', name: 'Zebra' }, { emoji: '🦒', name: 'Giraffe' }, { emoji: '🦌', name: 'Deer' }], answer: 1 },

  // Round 4 — sea & sky
  { question: 'Find the Dolphin!', emoji: '🐬', options: [{ emoji: '🐟', name: 'Fish' }, { emoji: '🐳', name: 'Whale' }, { emoji: '🦈', name: 'Shark' }, { emoji: '🐬', name: 'Dolphin' }], answer: 3 },
  { question: 'Find the Frog!', emoji: '🐸', options: [{ emoji: '🐢', name: 'Turtle' }, { emoji: '🦎', name: 'Lizard' }, { emoji: '🐸', name: 'Frog' }, { emoji: '🐊', name: 'Crocodile' }], answer: 2 },
  { question: 'Find the Penguin!', emoji: '🐧', options: [{ emoji: '🐧', name: 'Penguin' }, { emoji: '🦆', name: 'Duck' }, { emoji: '🦢', name: 'Swan' }, { emoji: '🐦', name: 'Bird' }], answer: 0 },
  { question: 'Find the Butterfly!', emoji: '🦋', options: [{ emoji: '🐝', name: 'Bee' }, { emoji: '🐛', name: 'Caterpillar' }, { emoji: '🦋', name: 'Butterfly' }, { emoji: '🐞', name: 'Ladybug' }], answer: 2 },
  { question: 'Find the Turtle!', emoji: '🐢', options: [{ emoji: '🦎', name: 'Lizard' }, { emoji: '🐊', name: 'Crocodile' }, { emoji: '🐸', name: 'Frog' }, { emoji: '🐢', name: 'Turtle' }], answer: 3 },
]
