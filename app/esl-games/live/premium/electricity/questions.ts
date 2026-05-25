export type ElectricityQuestion = {
  question: string
  options: string[]
  answer: number
}

export const electricityQuestions: ElectricityQuestion[] = [
  // Round 1 — definitions
  { question: 'The flow of electric charge through a conductor is called...', options: ['Static electricity', 'Electric current', 'Voltage', 'Resistance'], answer: 1 },
  { question: 'A material that allows electricity to pass through it easily is called a...', options: ['Insulator', 'Resistor', 'Conductor', 'Generator'], answer: 2 },
  { question: 'A circuit where all components are connected in a single loop is called a...', options: ['Parallel circuit', 'Open circuit', 'Series circuit', 'Short circuit'], answer: 2 },
  { question: 'A circuit where components are connected across multiple paths is called a...', options: ['Series circuit', 'Parallel circuit', 'Closed circuit', 'Static circuit'], answer: 1 },
  { question: 'A magnet created by passing electric current through a coil of wire is called an...', options: ['Electromagnet', 'Permanent magnet', 'Bar magnet', 'Static magnet'], answer: 0 },

  // Round 2 — definitions
  { question: 'A buildup of electric charge on the surface of an object is called...', options: ['Electric current', 'Conductivity', 'Static electricity', 'Voltage'], answer: 2 },
  { question: 'The amount of electrical energy used by a device is called its...', options: ['Brightness', 'Consumption', 'Current', 'Resistance'], answer: 1 },
  { question: 'Being injured or killed by electric shock is known as...', options: ['Conduction', 'Electrocution', 'Static discharge', 'Overloading'], answer: 1 },
  { question: 'A safety measure taken to avoid danger from electricity is called a...', options: ['Precaution', 'Conductor', 'Circuit breaker', 'Resistor'], answer: 0 },
  { question: 'The type of electric charge that is opposite to positive charge is called...', options: ['Static charge', 'Zero charge', 'Negative charge', 'Neutral charge'], answer: 2 },

  // Round 3 — applied knowledge
  { question: 'In a series circuit, if one bulb breaks, what happens to the others?', options: ['They get brighter', 'They stay the same', 'They all go out', 'They flicker'], answer: 2 },
  { question: 'In a parallel circuit, if one bulb breaks, what happens to the others?', options: ['They all go out', 'They keep working', 'They get dimmer', 'They stop briefly'], answer: 1 },
  { question: 'Which of these is a good conductor of electricity?', options: ['Rubber', 'Plastic', 'Copper wire', 'Wood'], answer: 2 },
  { question: 'What happens to brightness when more bulbs are added to a series circuit?', options: ['It increases', 'It stays the same', 'It decreases', 'It doubles'], answer: 2 },
  { question: 'Static electricity is caused by a buildup of...', options: ['Heat', 'Electric charge', 'Magnetic force', 'Water'], answer: 1 },

  // Round 4 — higher order
  { question: 'An electromagnet works by passing electric current through...', options: ['A battery', 'A coil of wire', 'A light bulb', 'A conductor plate'], answer: 1 },
  { question: 'Which precaution should you take near electrical appliances?', options: ['Use wet hands', 'Stand in water', 'Keep away from water', 'Touch wires directly'], answer: 2 },
  { question: 'Which circuit type do homes usually use for lights and sockets?', options: ['Series circuit', 'Static circuit', 'Open circuit', 'Parallel circuit'], answer: 3 },
  { question: 'Reducing electrical consumption means...', options: ['Using more electricity', 'Using less electricity', 'Generating electricity', 'Storing electricity'], answer: 1 },
  { question: 'A negative charge is attracted to...', options: ['Another negative charge', 'A neutral object', 'A positive charge', 'An insulator'], answer: 2 },
]
