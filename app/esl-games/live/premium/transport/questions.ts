export type TransportQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const transportQuestions: TransportQuestion[] = [
  // Round 1 — basic transport
  { question: 'Find the Car! 🚗', emoji: '🚗', options: [{ emoji: '🚌', name: 'Bus' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚲', name: 'Bike' }, { emoji: '🚢', name: 'Ship' }], answer: 1 },
  { question: 'Find the Bus! 🚌', emoji: '🚌', options: [{ emoji: '🚗', name: 'Car' }, { emoji: '🚌', name: 'Bus' }, { emoji: '🚂', name: 'Train' }, { emoji: '✈️', name: 'Plane' }], answer: 1 },
  { question: 'Find the Plane! ✈️', emoji: '✈️', options: [{ emoji: '🚀', name: 'Rocket' }, { emoji: '🚁', name: 'Helicopter' }, { emoji: '✈️', name: 'Plane' }, { emoji: '🪂', name: 'Parachute' }], answer: 2 },
  { question: 'Find the Bike! 🚲', emoji: '🚲', options: [{ emoji: '🛵', name: 'Scooter' }, { emoji: '🏍️', name: 'Motorbike' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚲', name: 'Bike' }], answer: 3 },
  { question: 'Find the Train! 🚂', emoji: '🚂', options: [{ emoji: '🚂', name: 'Train' }, { emoji: '🚌', name: 'Bus' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚢', name: 'Ship' }], answer: 0 },

  // Round 2 — water and air
  { question: 'Find the Boat! ⛵', emoji: '⛵', options: [{ emoji: '🚢', name: 'Ship' }, { emoji: '⛵', name: 'Boat' }, { emoji: '🛥️', name: 'Speedboat' }, { emoji: '🚤', name: 'Motorboat' }], answer: 1 },
  { question: 'Find the Ship! 🚢', emoji: '🚢', options: [{ emoji: '⛵', name: 'Boat' }, { emoji: '🚤', name: 'Motorboat' }, { emoji: '🚢', name: 'Ship' }, { emoji: '🛥️', name: 'Speedboat' }], answer: 2 },
  { question: 'Find the Helicopter! 🚁', emoji: '🚁', options: [{ emoji: '✈️', name: 'Plane' }, { emoji: '🚀', name: 'Rocket' }, { emoji: '🛸', name: 'UFO' }, { emoji: '🚁', name: 'Helicopter' }], answer: 3 },
  { question: 'Find the Rocket! 🚀', emoji: '🚀', options: [{ emoji: '🚀', name: 'Rocket' }, { emoji: '✈️', name: 'Plane' }, { emoji: '🚁', name: 'Helicopter' }, { emoji: '🛸', name: 'UFO' }], answer: 0 },
  { question: 'Find the Scooter! 🛵', emoji: '🛵', options: [{ emoji: '🚲', name: 'Bike' }, { emoji: '🏍️', name: 'Motorbike' }, { emoji: '🛵', name: 'Scooter' }, { emoji: '🚗', name: 'Car' }], answer: 2 },

  // Round 3 — emergency and special
  { question: 'Find the Ambulance! 🚑', emoji: '🚑', options: [{ emoji: '🚒', name: 'Fire Truck' }, { emoji: '🚓', name: 'Police Car' }, { emoji: '🚑', name: 'Ambulance' }, { emoji: '🚗', name: 'Car' }], answer: 2 },
  { question: 'Find the Fire Truck! 🚒', emoji: '🚒', options: [{ emoji: '🚒', name: 'Fire Truck' }, { emoji: '🚑', name: 'Ambulance' }, { emoji: '🚌', name: 'Bus' }, { emoji: '🚓', name: 'Police Car' }], answer: 0 },
  { question: 'Find the Police Car! 🚓', emoji: '🚓', options: [{ emoji: '🚑', name: 'Ambulance' }, { emoji: '🚓', name: 'Police Car' }, { emoji: '🚒', name: 'Fire Truck' }, { emoji: '🚗', name: 'Car' }], answer: 1 },
  { question: 'Find the Tractor! 🚜', emoji: '🚜', options: [{ emoji: '🚗', name: 'Car' }, { emoji: '🚌', name: 'Bus' }, { emoji: '🏎️', name: 'Race Car' }, { emoji: '🚜', name: 'Tractor' }], answer: 3 },
  { question: 'Find the Taxi! 🚕', emoji: '🚕', options: [{ emoji: '🚕', name: 'Taxi' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚙', name: 'SUV' }, { emoji: '🏎️', name: 'Race Car' }], answer: 0 },

  // Round 4 — where does it go?
  { question: 'Which goes on water? 🌊', emoji: '🌊', options: [{ emoji: '🚗', name: 'Car' }, { emoji: '✈️', name: 'Plane' }, { emoji: '⛵', name: 'Boat' }, { emoji: '🚂', name: 'Train' }], answer: 2 },
  { question: 'Which flies in the sky? ☁️', emoji: '☁️', options: [{ emoji: '🚌', name: 'Bus' }, { emoji: '✈️', name: 'Plane' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚲', name: 'Bike' }], answer: 1 },
  { question: 'Which goes on a road? 🛣️', emoji: '🛣️', options: [{ emoji: '⛵', name: 'Boat' }, { emoji: '✈️', name: 'Plane' }, { emoji: '🚗', name: 'Car' }, { emoji: '🚀', name: 'Rocket' }], answer: 2 },
  { question: 'Which goes on train tracks? 🛤️', emoji: '🛤️', options: [{ emoji: '🚗', name: 'Car' }, { emoji: '🚂', name: 'Train' }, { emoji: '🚌', name: 'Bus' }, { emoji: '🚲', name: 'Bike' }], answer: 1 },
  { question: 'Which is the fastest? 🏁', emoji: '🏎️', options: [{ emoji: '🚲', name: 'Bike' }, { emoji: '🐢', name: 'Turtle' }, { emoji: '🚶', name: 'Walking' }, { emoji: '🏎️', name: 'Race Car' }], answer: 3 },
]
