export interface JeopardyQ {
  question: string
  answer: string
  options: string[]
  points: 100 | 200 | 300 | 400 | 500
  category: string
}

export interface BoardState {
  categories: string[]
  board: JeopardyQ[][]
  used: string[]
  currentTile: { cat: number; row: number } | null
  buzzPhase: boolean
  dailyDouble: string
}

export const CATEGORIES = ['Animals', 'Food', 'English', 'Numbers', 'World']
export const POINT_VALUES = [100, 200, 300, 400, 500]

const questionPool: JeopardyQ[] = [
  // ── ANIMALS ──────────────────────────────────────────
  { question: 'This animal says "meow"', answer: 'Cat', options: ['Dog', 'Cat', 'Bird', 'Cow'], points: 100, category: 'Animals' },
  { question: 'This farm animal gives us milk', answer: 'Cow', options: ['Pig', 'Sheep', 'Cow', 'Horse'], points: 100, category: 'Animals' },
  { question: 'This tiny insect makes honey', answer: 'Bee', options: ['Ant', 'Fly', 'Bee', 'Spider'], points: 100, category: 'Animals' },

  { question: 'The tallest animal in the world', answer: 'Giraffe', options: ['Elephant', 'Giraffe', 'Camel', 'Horse'], points: 200, category: 'Animals' },
  { question: 'This black and white bear from China eats bamboo', answer: 'Panda', options: ['Zebra', 'Panda', 'Penguin', 'Badger'], points: 200, category: 'Animals' },
  { question: 'This animal has eight legs', answer: 'Spider', options: ['Crab', 'Spider', 'Ant', 'Beetle'], points: 200, category: 'Animals' },

  { question: 'The fastest land animal on Earth', answer: 'Cheetah', options: ['Lion', 'Tiger', 'Cheetah', 'Leopard'], points: 300, category: 'Animals' },
  { question: 'This bird cannot fly and lives in very cold places', answer: 'Penguin', options: ['Ostrich', 'Penguin', 'Kiwi', 'Emu'], points: 300, category: 'Animals' },
  { question: 'This sea creature squirts ink to escape predators', answer: 'Octopus', options: ['Squid', 'Octopus', 'Jellyfish', 'Crab'], points: 300, category: 'Animals' },

  { question: 'This Australian animal carries its baby in a pouch', answer: 'Kangaroo', options: ['Koala', 'Wombat', 'Kangaroo', 'Possum'], points: 400, category: 'Animals' },
  { question: 'The only mammal that can truly fly', answer: 'Bat', options: ['Flying squirrel', 'Bat', 'Flying lemur', 'Sugar glider'], points: 400, category: 'Animals' },
  { question: 'This lizard can change its colour to match its surroundings', answer: 'Chameleon', options: ['Gecko', 'Iguana', 'Chameleon', 'Salamander'], points: 400, category: 'Animals' },

  { question: 'This animal actually has the most teeth of any animal on Earth', answer: 'Snail', options: ['Shark', 'Crocodile', 'Snail', 'Piranha'], points: 500, category: 'Animals' },
  { question: 'A group of flamingos is called this', answer: 'A flamboyance', options: ['A flock', 'A colony', 'A flamboyance', 'A gathering'], points: 500, category: 'Animals' },
  { question: 'The largest animal ever to have lived on Earth', answer: 'Blue whale', options: ['Sperm whale', 'Blue whale', 'Megalodon', 'Fin whale'], points: 500, category: 'Animals' },

  // ── FOOD ─────────────────────────────────────────────
  { question: 'This yellow curved fruit is a popular healthy snack', answer: 'Banana', options: ['Mango', 'Banana', 'Lemon', 'Pear'], points: 100, category: 'Food' },
  { question: 'This white drink comes from a cow', answer: 'Milk', options: ['Water', 'Juice', 'Milk', 'Cream'], points: 100, category: 'Food' },
  { question: 'This food is baked in an oven and sliced for sandwiches', answer: 'Bread', options: ['Cake', 'Bread', 'Pizza', 'Cookie'], points: 100, category: 'Food' },

  { question: 'Long thin Italian pasta', answer: 'Spaghetti', options: ['Noodles', 'Spaghetti', 'Lasagne', 'Penne'], points: 200, category: 'Food' },
  { question: 'This green vegetable looks like a tiny tree', answer: 'Broccoli', options: ['Spinach', 'Broccoli', 'Celery', 'Kale'], points: 200, category: 'Food' },
  { question: 'This tropical fruit is known as the king of fruits in Thailand', answer: 'Durian', options: ['Mango', 'Papaya', 'Durian', 'Jackfruit'], points: 200, category: 'Food' },

  { question: 'This Japanese dish is made with raw fish and rice', answer: 'Sushi', options: ['Ramen', 'Tempura', 'Sushi', 'Udon'], points: 300, category: 'Food' },
  { question: 'This spice is the most expensive in the world', answer: 'Saffron', options: ['Vanilla', 'Truffle', 'Saffron', 'Cardamom'], points: 300, category: 'Food' },
  { question: 'Although we call it a vegetable, a tomato is technically this', answer: 'A fruit', options: ['A root', 'A berry', 'A fruit', 'A legume'], points: 300, category: 'Food' },

  { question: 'This bread made through natural fermentation has a sour taste', answer: 'Sourdough', options: ['Rye bread', 'Sourdough', 'Brioche', 'Focaccia'], points: 400, category: 'Food' },
  { question: 'Carrots were originally this colour before they became orange', answer: 'Purple', options: ['White', 'Yellow', 'Purple', 'Red'], points: 400, category: 'Food' },
  { question: 'This nut actually grows underground and is related to peas', answer: 'Peanut', options: ['Cashew', 'Almond', 'Peanut', 'Pistachio'], points: 400, category: 'Food' },

  { question: 'Vanilla flavouring naturally comes from this type of plant', answer: 'An orchid', options: ['A lily', 'A rose', 'An orchid', 'A tulip'], points: 500, category: 'Food' },
  { question: 'This condiment was originally sold as a stomach medicine in the 1800s', answer: 'Ketchup', options: ['Mustard', 'Vinegar', 'Ketchup', 'Pickle'], points: 500, category: 'Food' },
  { question: 'This sweet food was found in Egyptian tombs still perfectly edible after 3000 years', answer: 'Honey', options: ['Dates', 'Salt', 'Honey', 'Grain'], points: 500, category: 'Food' },

  // ── ENGLISH ───────────────────────────────────────────
  { question: '"Cat", "dog" and "school" are all this type of word', answer: 'Nouns', options: ['Verbs', 'Adjectives', 'Nouns', 'Adverbs'], points: 100, category: 'English' },
  { question: '"Run", "jump" and "swim" are all this type of word', answer: 'Verbs', options: ['Nouns', 'Verbs', 'Adjectives', 'Pronouns'], points: 100, category: 'English' },
  { question: 'A sentence must always start with this', answer: 'A capital letter', options: ['A comma', 'A capital letter', 'A full stop', 'A number'], points: 100, category: 'English' },

  { question: '"Happy" and "joyful" have similar meanings — they are called this', answer: 'Synonyms', options: ['Antonyms', 'Synonyms', 'Homophones', 'Adjectives'], points: 200, category: 'English' },
  { question: '"Hot" and "cold" have opposite meanings — they are called this', answer: 'Antonyms', options: ['Synonyms', 'Antonyms', 'Homophones', 'Verbs'], points: 200, category: 'English' },
  { question: '"Their", "there" and "they\'re" sound the same but have different meanings — they are called this', answer: 'Homophones', options: ['Synonyms', 'Antonyms', 'Homophones', 'Homonyms'], points: 200, category: 'English' },

  { question: 'In "She runs quickly", the word "quickly" is this type of word', answer: 'An adverb', options: ['A noun', 'A verb', 'An adjective', 'An adverb'], points: 300, category: 'English' },
  { question: 'A comparison using "like" or "as" — e.g. "as brave as a lion" — is called this', answer: 'A simile', options: ['A metaphor', 'A simile', 'Alliteration', 'Personification'], points: 300, category: 'English' },
  { question: 'When an object is given human qualities — "the wind whispered" — this is called this', answer: 'Personification', options: ['A simile', 'A metaphor', 'Personification', 'Alliteration'], points: 300, category: 'English' },

  { question: '"Buzz", "crash" and "sizzle" are words that sound like what they describe — this is called this', answer: 'Onomatopoeia', options: ['Alliteration', 'Onomatopoeia', 'Assonance', 'Hyperbole'], points: 400, category: 'English' },
  { question: 'Deliberate exaggeration for effect — "I told you a million times!" — is called this', answer: 'Hyperbole', options: ['Simile', 'Metaphor', 'Hyperbole', 'Irony'], points: 400, category: 'English' },
  { question: '"And", "but", "because" and "although" are all this type of word', answer: 'Conjunctions', options: ['Prepositions', 'Pronouns', 'Conjunctions', 'Determiners'], points: 400, category: 'English' },

  { question: 'A verb used as a noun — like "swimming" in "Swimming is fun" — is called this', answer: 'A gerund', options: ['An infinitive', 'A participle', 'A gerund', 'A clause'], points: 500, category: 'English' },
  { question: '"The ball was kicked by John" uses this type of sentence structure', answer: 'Passive voice', options: ['Active voice', 'Passive voice', 'Direct speech', 'Indirect speech'], points: 500, category: 'English' },
  { question: 'A short story with a moral lesson often featuring animals — like Aesop\'s stories — is called this', answer: 'A fable', options: ['A myth', 'A legend', 'A fable', 'A parable'], points: 500, category: 'English' },

  // ── NUMBERS ───────────────────────────────────────────
  { question: 'How many days are in one week?', answer: '7', options: ['5', '6', '7', '8'], points: 100, category: 'Numbers' },
  { question: 'What is 5 plus 3?', answer: '8', options: ['6', '7', '8', '9'], points: 100, category: 'Numbers' },
  { question: 'How many fingers are on two hands?', answer: '10', options: ['8', '9', '10', '12'], points: 100, category: 'Numbers' },

  { question: 'What is 7 multiplied by 8?', answer: '56', options: ['48', '54', '56', '63'], points: 200, category: 'Numbers' },
  { question: 'How many seconds are in one minute?', answer: '60', options: ['30', '45', '60', '100'], points: 200, category: 'Numbers' },
  { question: 'What is half of 144?', answer: '72', options: ['62', '68', '72', '76'], points: 200, category: 'Numbers' },

  { question: 'What percentage is equal to one quarter?', answer: '25%', options: ['10%', '20%', '25%', '33%'], points: 300, category: 'Numbers' },
  { question: 'What is the square root of 81?', answer: '9', options: ['7', '8', '9', '11'], points: 300, category: 'Numbers' },
  { question: 'How many sides does a hexagon have?', answer: '6', options: ['5', '6', '7', '8'], points: 300, category: 'Numbers' },

  { question: 'What is 15% of 200?', answer: '30', options: ['20', '25', '30', '35'], points: 400, category: 'Numbers' },
  { question: 'A rectangle is 12cm long and 8cm wide. What is the area?', answer: '96cm²', options: ['80cm²', '88cm²', '96cm²', '104cm²'], points: 400, category: 'Numbers' },
  { question: 'What is 2 to the power of 8?', answer: '256', options: ['128', '192', '256', '512'], points: 400, category: 'Numbers' },

  { question: 'What is the value of pi to two decimal places?', answer: '3.14', options: ['3.12', '3.14', '3.16', '3.18'], points: 500, category: 'Numbers' },
  { question: 'In a class of 30 students, 40% are boys. How many girls are there?', answer: '18', options: ['12', '15', '18', '20'], points: 500, category: 'Numbers' },
  { question: 'What is the next prime number after 23?', answer: '29', options: ['25', '27', '29', '31'], points: 500, category: 'Numbers' },

  // ── WORLD ─────────────────────────────────────────────
  { question: 'The capital city of Thailand', answer: 'Bangkok', options: ['Chiang Mai', 'Phuket', 'Bangkok', 'Pattaya'], points: 100, category: 'World' },
  { question: 'The largest ocean in the world', answer: 'The Pacific Ocean', options: ['The Atlantic Ocean', 'The Indian Ocean', 'The Pacific Ocean', 'The Arctic Ocean'], points: 100, category: 'World' },
  { question: 'The tallest mountain in the world', answer: 'Mount Everest', options: ['Mont Blanc', 'K2', 'Mount Everest', 'Kilimanjaro'], points: 100, category: 'World' },

  { question: 'This country is both a continent and a nation', answer: 'Australia', options: ['Greenland', 'Antarctica', 'Australia', 'New Zealand'], points: 200, category: 'World' },
  { question: 'The capital city of Japan', answer: 'Tokyo', options: ['Osaka', 'Kyoto', 'Tokyo', 'Hiroshima'], points: 200, category: 'World' },
  { question: 'The largest country in the world by land area', answer: 'Russia', options: ['Canada', 'China', 'Russia', 'USA'], points: 200, category: 'World' },

  { question: 'The famous ancient structure in Egypt with a pointed top', answer: 'The Great Pyramid', options: ['The Sphinx', 'The Great Pyramid', 'The Colosseum', 'Stonehenge'], points: 300, category: 'World' },
  { question: 'The smallest country in the world', answer: 'Vatican City', options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], points: 300, category: 'World' },
  { question: 'This South American river is the largest in the world by water volume', answer: 'The Amazon', options: ['The Nile', 'The Amazon', 'The Congo', 'The Yangtze'], points: 300, category: 'World' },

  { question: 'The deepest point in all of the world\'s oceans is found here', answer: 'The Mariana Trench', options: ['The Puerto Rico Trench', 'The Mariana Trench', 'The Java Trench', 'The Tonga Trench'], points: 400, category: 'World' },
  { question: 'This city is located on two continents — Europe and Asia', answer: 'Istanbul', options: ['Cairo', 'Moscow', 'Istanbul', 'Athens'], points: 400, category: 'World' },
  { question: 'This country has more natural lakes than any other country in the world', answer: 'Canada', options: ['Russia', 'USA', 'Canada', 'Finland'], points: 400, category: 'World' },

  { question: 'The Caspian Sea is technically not a sea — it is actually this', answer: 'A lake', options: ['A bay', 'A lake', 'A lagoon', 'A gulf'], points: 500, category: 'World' },
  { question: 'This country has two official capital cities — Pretoria and Cape Town', answer: 'South Africa', options: ['Nigeria', 'Kenya', 'South Africa', 'Bolivia'], points: 500, category: 'World' },
  { question: 'The island of Greenland belongs to this European country', answer: 'Denmark', options: ['Norway', 'Iceland', 'Denmark', 'Sweden'], points: 500, category: 'World' },
]

export function buildBoard(): BoardState {
  const board: JeopardyQ[][] = CATEGORIES.map(cat =>
    POINT_VALUES.map(points => {
      const pool = questionPool.filter(q => q.category === cat && q.points === points)
      return pool[Math.floor(Math.random() * pool.length)]
    })
  )
  const ddCat = Math.floor(Math.random() * 5)
  const ddRow = 2 + Math.floor(Math.random() * 3) // daily double only on 300-500
  return {
    categories: CATEGORIES,
    board,
    used: [],
    currentTile: null,
    buzzPhase: false,
    dailyDouble: `${ddCat}-${ddRow}`,
  }
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}