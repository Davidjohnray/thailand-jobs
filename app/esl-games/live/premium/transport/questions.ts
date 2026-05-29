export type TransportQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const transportQuestions: TransportQuestion[] = [
  // Round 1 — basic transport
  { question: 'Find the car!', emoji: '🚗', options: [{ emoji: '🚌', name: 'bus' }, { emoji: '🚗', name: 'car' }, { emoji: '🚲', name: 'bike' }, { emoji: '🚢', name: 'ship' }], answer: 1 },
  { question: 'Find the bus!', emoji: '🚌', options: [{ emoji: '🚗', name: 'car' }, { emoji: '🚌', name: 'bus' }, { emoji: '🚂', name: 'train' }, { emoji: '✈️', name: 'plane' }], answer: 1 },
  { question: 'Find the plane!', emoji: '✈️', options: [{ emoji: '🚀', name: 'rocket' }, { emoji: '🚁', name: 'helicopter' }, { emoji: '✈️', name: 'plane' }, { emoji: '🪂', name: 'parachute' }], answer: 2 },
  { question: 'Find the bike!', emoji: '🚲', options: [{ emoji: '🛵', name: 'scooter' }, { emoji: '🏍️', name: 'motorbike' }, { emoji: '🚗', name: 'car' }, { emoji: '🚲', name: 'bike' }], answer: 3 },
  { question: 'Find the train!', emoji: '🚂', options: [{ emoji: '🚂', name: 'train' }, { emoji: '🚌', name: 'bus' }, { emoji: '🚗', name: 'car' }, { emoji: '🚢', name: 'ship' }], answer: 0 },

  // Round 2 — water and air
  { question: 'Find the boat!', emoji: '⛵', options: [{ emoji: '🚢', name: 'ship' }, { emoji: '⛵', name: 'boat' }, { emoji: '🛥️', name: 'speedboat' }, { emoji: '🚤', name: 'motorboat' }], answer: 1 },
  { question: 'Find the ship!', emoji: '🚢', options: [{ emoji: '⛵', name: 'boat' }, { emoji: '🚤', name: 'motorboat' }, { emoji: '🚢', name: 'ship' }, { emoji: '🛥️', name: 'speedboat' }], answer: 2 },
  { question: 'Find the helicopter!', emoji: '🚁', options: [{ emoji: '✈️', name: 'plane' }, { emoji: '🚀', name: 'rocket' }, { emoji: '🛸', name: 'ufo' }, { emoji: '🚁', name: 'helicopter' }], answer: 3 },
  { question: 'Find the rocket!', emoji: '🚀', options: [{ emoji: '🚀', name: 'rocket' }, { emoji: '✈️', name: 'plane' }, { emoji: '🚁', name: 'helicopter' }, { emoji: '🛸', name: 'ufo' }], answer: 0 },
  { question: 'Find the scooter!', emoji: '🛵', options: [{ emoji: '🚲', name: 'bike' }, { emoji: '🏍️', name: 'motorbike' }, { emoji: '🛵', name: 'scooter' }, { emoji: '🚗', name: 'car' }], answer: 2 },

  // Round 3 — emergency and special
  { question: 'Find the ambulance!', emoji: '🚑', options: [{ emoji: '🚒', name: 'fire truck' }, { emoji: '🚓', name: 'police car' }, { emoji: '🚑', name: 'ambulance' }, { emoji: '🚗', name: 'car' }], answer: 2 },
  { question: 'Find the fire truck!', emoji: '🚒', options: [{ emoji: '🚒', name: 'fire truck' }, { emoji: '🚑', name: 'ambulance' }, { emoji: '🚌', name: 'bus' }, { emoji: '🚓', name: 'police car' }], answer: 0 },
  { question: 'Find the police car!', emoji: '🚓', options: [{ emoji: '🚑', name: 'ambulance' }, { emoji: '🚓', name: 'police car' }, { emoji: '🚒', name: 'fire truck' }, { emoji: '🚗', name: 'car' }], answer: 1 },
  { question: 'Find the tractor!', emoji: '🚜', options: [{ emoji: '🚗', name: 'car' }, { emoji: '🚌', name: 'bus' }, { emoji: '🏎️', name: 'race car' }, { emoji: '🚜', name: 'tractor' }], answer: 3 },
  { question: 'Find the taxi!', emoji: '🚕', options: [{ emoji: '🚕', name: 'taxi' }, { emoji: '🚗', name: 'car' }, { emoji: '🚙', name: 'suv' }, { emoji: '🏎️', name: 'race car' }], answer: 0 },

  // Round 4 — where does it go?
  { question: 'Which goes on water?', emoji: '🌊', options: [{ emoji: '🚗', name: 'car' }, { emoji: '✈️', name: 'plane' }, { emoji: '⛵', name: 'boat' }, { emoji: '🚂', name: 'train' }], answer: 2 },
  { question: 'Which flies in the sky?', emoji: '☁️', options: [{ emoji: '🚌', name: 'bus' }, { emoji: '✈️', name: 'plane' }, { emoji: '🚗', name: 'car' }, { emoji: '🚲', name: 'bike' }], answer: 1 },
  { question: 'Which goes on a road?', emoji: '🛣️', options: [{ emoji: '⛵', name: 'boat' }, { emoji: '✈️', name: 'plane' }, { emoji: '🚗', name: 'car' }, { emoji: '🚀', name: 'rocket' }], answer: 2 },
  { question: 'Which goes on train tracks?', emoji: '🛤️', options: [{ emoji: '🚗', name: 'car' }, { emoji: '🚂', name: 'train' }, { emoji: '🚌', name: 'bus' }, { emoji: '🚲', name: 'bike' }], answer: 1 },
  { question: 'Which is the fastest?', emoji: '🏎️', options: [{ emoji: '🚲', name: 'bike' }, { emoji: '🐢', name: 'turtle' }, { emoji: '🚶', name: 'walking' }, { emoji: '🏎️', name: 'race car' }], answer: 3 },
]
