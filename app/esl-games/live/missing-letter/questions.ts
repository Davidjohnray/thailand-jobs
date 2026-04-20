export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MLQuestion {
  word: string
  hint: string
  missingIndexes: number[]
  options: string[]
  difficulty: Difficulty
  category: string
}

export const mlBank: Record<string, MLQuestion[]> = {
  Animals: [
    // Easy — one missing letter, short words
    { word: 'CAT', hint: 'A furry pet that purrs', missingIndexes: [1], options: ['A', 'O', 'U', 'E'], difficulty: 'easy', category: 'Animals' },
    { word: 'DOG', hint: 'A loyal pet that barks', missingIndexes: [1], options: ['O', 'A', 'I', 'U'], difficulty: 'easy', category: 'Animals' },
    { word: 'BEE', hint: 'A flying insect that makes honey', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Animals' },
    { word: 'COW', hint: 'A farm animal that gives milk', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Animals' },
    { word: 'PIG', hint: 'A pink farm animal that oinks', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Animals' },
    { word: 'HEN', hint: 'A female chicken', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Animals' },
    { word: 'FOX', hint: 'A clever orange wild animal', missingIndexes: [1], options: ['O', 'A', 'E', 'U'], difficulty: 'easy', category: 'Animals' },
    { word: 'OWL', hint: 'A bird that is awake at night', missingIndexes: [1], options: ['W', 'N', 'L', 'S'], difficulty: 'easy', category: 'Animals' },
    { word: 'RAT', hint: 'A small rodent with a long tail', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Animals' },
    { word: 'ANT', hint: 'A tiny insect that lives in a colony', missingIndexes: [1], options: ['N', 'M', 'R', 'S'], difficulty: 'easy', category: 'Animals' },
    // Medium — one missing letter, longer words
    { word: 'TIGER', hint: 'A large striped wild cat', missingIndexes: [2], options: ['G', 'K', 'D', 'B'], difficulty: 'medium', category: 'Animals' },
    { word: 'HORSE', hint: 'A large animal people ride', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'medium', category: 'Animals' },
    { word: 'SHARK', hint: 'A large dangerous fish', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Animals' },
    { word: 'PANDA', hint: 'A black and white bear from China', missingIndexes: [3], options: ['D', 'T', 'S', 'N'], difficulty: 'medium', category: 'Animals' },
    { word: 'EAGLE', hint: 'A large powerful bird', missingIndexes: [2], options: ['G', 'D', 'K', 'B'], difficulty: 'medium', category: 'Animals' },
    { word: 'SNAKE', hint: 'A reptile with no legs', missingIndexes: [3], options: ['K', 'T', 'D', 'G'], difficulty: 'medium', category: 'Animals' },
    { word: 'CAMEL', hint: 'A desert animal with humps', missingIndexes: [1], options: ['A', 'O', 'E', 'U'], difficulty: 'medium', category: 'Animals' },
    { word: 'ZEBRA', hint: 'A black and white striped animal', missingIndexes: [3], options: ['R', 'T', 'N', 'S'], difficulty: 'medium', category: 'Animals' },
    { word: 'KOALA', hint: 'A fluffy Australian animal', missingIndexes: [2], options: ['A', 'O', 'E', 'U'], difficulty: 'medium', category: 'Animals' },
    { word: 'SHEEP', hint: 'A farm animal that gives wool', missingIndexes: [3], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Animals' },
    // Hard — two missing letters
    { word: 'ELEPHANT', hint: 'A large grey animal with a trunk', missingIndexes: [2, 6], options: ['E', 'N', 'I', 'O'], difficulty: 'hard', category: 'Animals' },
{ word: 'GIRAFFE', hint: 'The tallest animal in the world', missingIndexes: [1, 5], options: ['I', 'F', 'A', 'E'], difficulty: 'hard', category: 'Animals' },
{ word: 'PENGUIN', hint: 'A bird that cannot fly', missingIndexes: [1, 4], options: ['E', 'G', 'A', 'I'], difficulty: 'hard', category: 'Animals' },
{ word: 'DOLPHIN', hint: 'A smart sea mammal', missingIndexes: [1, 5], options: ['O', 'H', 'A', 'E'], difficulty: 'hard', category: 'Animals' },
{ word: 'CHEETAH', hint: 'The fastest land animal', missingIndexes: [2, 5], options: ['E', 'T', 'A', 'I'], difficulty: 'hard', category: 'Animals' },
{ word: 'GORILLA', hint: 'A large powerful ape', missingIndexes: [1, 5], options: ['O', 'L', 'A', 'E'], difficulty: 'hard', category: 'Animals' },
{ word: 'LEOPARD', hint: 'A spotted big cat', missingIndexes: [1, 4], options: ['E', 'P', 'A', 'I'], difficulty: 'hard', category: 'Animals' },
{ word: 'HAMSTER', hint: 'A small furry pet that runs on a wheel', missingIndexes: [1, 4], options: ['A', 'T', 'E', 'I'], difficulty: 'hard', category: 'Animals' },
{ word: 'OSTRICH', hint: 'The biggest bird in the world', missingIndexes: [1, 4], options: ['S', 'R', 'T', 'N'], difficulty: 'hard', category: 'Animals' },
{ word: 'CROCODILE', hint: 'A large reptile with sharp teeth', missingIndexes: [2, 6], options: ['O', 'D', 'A', 'E'], difficulty: 'hard', category: 'Animals' },
  ],
  Food: [
    // Easy
    { word: 'EGG', hint: 'A food that comes from a chicken', missingIndexes: [1], options: ['G', 'D', 'B', 'N'], difficulty: 'easy', category: 'Food' },
    { word: 'PIE', hint: 'A baked dish with pastry on top', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Food' },
    { word: 'JAM', hint: 'A sweet spread made from fruit', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Food' },
    { word: 'HAM', hint: 'A pink meat from a pig', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Food' },
    { word: 'RICE', hint: 'White grains eaten as a staple food', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Food' },
    { word: 'CAKE', hint: 'A sweet baked food eaten at birthdays', missingIndexes: [2], options: ['K', 'T', 'D', 'G'], difficulty: 'easy', category: 'Food' },
    { word: 'MILK', hint: 'A white drink from cows', missingIndexes: [1], options: ['I', 'A', 'O', 'U'], difficulty: 'easy', category: 'Food' },
    { word: 'SOUP', hint: 'A hot liquid food eaten with a spoon', missingIndexes: [2], options: ['U', 'O', 'A', 'E'], difficulty: 'easy', category: 'Food' },
    { word: 'CORN', hint: 'A yellow vegetable that grows on a cob', missingIndexes: [1], options: ['O', 'A', 'E', 'U'], difficulty: 'easy', category: 'Food' },
    { word: 'PLUM', hint: 'A small round purple fruit', missingIndexes: [2], options: ['U', 'O', 'A', 'E'], difficulty: 'easy', category: 'Food' },
    // Medium
    { word: 'BREAD', hint: 'A baked food made from flour', missingIndexes: [2], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Food' },
    { word: 'GRAPE', hint: 'A small round fruit that grows in bunches', missingIndexes: [3], options: ['P', 'B', 'T', 'D'], difficulty: 'medium', category: 'Food' },
    { word: 'LEMON', hint: 'A sour yellow citrus fruit', missingIndexes: [2], options: ['M', 'N', 'S', 'T'], difficulty: 'medium', category: 'Food' },
    { word: 'MANGO', hint: 'A sweet tropical fruit', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Food' },
    { word: 'PASTA', hint: 'An Italian food made from flour and water', missingIndexes: [3], options: ['T', 'S', 'D', 'N'], difficulty: 'medium', category: 'Food' },
    { word: 'SUGAR', hint: 'A sweet white substance', missingIndexes: [2], options: ['G', 'D', 'K', 'T'], difficulty: 'medium', category: 'Food' },
    { word: 'HONEY', hint: 'A sweet liquid made by bees', missingIndexes: [1], options: ['O', 'A', 'E', 'U'], difficulty: 'medium', category: 'Food' },
    { word: 'STEAK', hint: 'A thick slice of grilled meat', missingIndexes: [3], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Food' },
    { word: 'ONION', hint: 'A vegetable that makes your eyes water', missingIndexes: [2], options: ['I', 'A', 'E', 'O'], difficulty: 'medium', category: 'Food' },
    { word: 'TOAST', hint: 'Bread heated until brown and crispy', missingIndexes: [2], options: ['A', 'O', 'E', 'U'], difficulty: 'medium', category: 'Food' },
    // Hard
    { word: 'SPAGHETTI', hint: 'Long thin Italian pasta', missingIndexes: [1, 6], options: ['P', 'T', 'S', 'N'], difficulty: 'hard', category: 'Food' },
{ word: 'BROCCOLI', hint: 'A green vegetable that looks like a tree', missingIndexes: [1, 5], options: ['R', 'O', 'A', 'E'], difficulty: 'hard', category: 'Food' },
{ word: 'CHOCOLATE', hint: 'A sweet brown treat made from cocoa', missingIndexes: [2, 7], options: ['O', 'L', 'A', 'E'], difficulty: 'hard', category: 'Food' },
{ word: 'PINEAPPLE', hint: 'A tropical fruit with spiky skin', missingIndexes: [1, 6], options: ['I', 'P', 'O', 'E'], difficulty: 'hard', category: 'Food' },
{ word: 'AVOCADO', hint: 'A green creamy fruit', missingIndexes: [1, 4], options: ['V', 'C', 'A', 'E'], difficulty: 'hard', category: 'Food' },
{ word: 'CUCUMBER', hint: 'A long green vegetable eaten in salads', missingIndexes: [2, 5], options: ['C', 'B', 'A', 'O'], difficulty: 'hard', category: 'Food' },
{ word: 'BLUEBERRY', hint: 'A small round dark blue fruit', missingIndexes: [1, 6], options: ['L', 'R', 'B', 'D'], difficulty: 'hard', category: 'Food' },
{ word: 'MUSHROOM', hint: 'A fungus that grows in damp places', missingIndexes: [2, 5], options: ['S', 'O', 'H', 'R'], difficulty: 'hard', category: 'Food' },
{ word: 'SMOOTHIE', hint: 'A blended drink made from fruit', missingIndexes: [1, 5], options: ['M', 'T', 'S', 'H'], difficulty: 'hard', category: 'Food' },
{ word: 'CROISSANT', hint: 'A flaky crescent-shaped pastry', missingIndexes: [2, 6], options: ['O', 'S', 'A', 'E'], difficulty: 'hard', category: 'Food' },
  ],
  School: [
    // Easy
    { word: 'PEN', hint: 'A tool used to write with ink', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'School' },
    { word: 'BAG', hint: 'You carry your books in this', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'School' },
    { word: 'MAP', hint: 'A drawing that shows where places are', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'School' },
    { word: 'BOOK', hint: 'Something you read with pages inside', missingIndexes: [2], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'School' },
    { word: 'DESK', hint: 'A table where you sit and work', missingIndexes: [2], options: ['S', 'T', 'N', 'R'], difficulty: 'easy', category: 'School' },
    { word: 'BELL', hint: 'It rings to tell you class started', missingIndexes: [2], options: ['L', 'R', 'N', 'S'], difficulty: 'easy', category: 'School' },
    { word: 'EXAM', hint: 'A test you take at school', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'School' },
    { word: 'GLUE', hint: 'A sticky substance used to join things', missingIndexes: [1], options: ['L', 'R', 'N', 'S'], difficulty: 'easy', category: 'School' },
    { word: 'QUIZ', hint: 'A fun test with questions', missingIndexes: [1], options: ['U', 'O', 'A', 'E'], difficulty: 'easy', category: 'School' },
    { word: 'CLASS', hint: 'A group of students who learn together', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'School' },
    // Medium
    { word: 'RULER', hint: 'A flat stick used for measuring', missingIndexes: [2], options: ['L', 'N', 'R', 'S'], difficulty: 'medium', category: 'School' },
    { word: 'PENCIL', hint: 'A writing tool with graphite inside', missingIndexes: [3], options: ['C', 'S', 'T', 'D'], difficulty: 'medium', category: 'School' },
    { word: 'ERASER', hint: 'A tool used to remove pencil marks', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'School' },
    { word: 'FOLDER', hint: 'A cardboard cover to store papers', missingIndexes: [2], options: ['L', 'N', 'R', 'S'], difficulty: 'medium', category: 'School' },
    { word: 'LESSON', hint: 'A period of time when you are taught', missingIndexes: [3], options: ['S', 'T', 'N', 'D'], difficulty: 'medium', category: 'School' },
    { word: 'MARKER', hint: 'A thick pen for whiteboards', missingIndexes: [2], options: ['R', 'N', 'L', 'S'], difficulty: 'medium', category: 'School' },
    { word: 'GRADES', hint: 'Marks given to show how well you did', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'School' },
    { word: 'SCIENCE', hint: 'A school subject about how the world works', missingIndexes: [3], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'School' },
    { word: 'HISTORY', hint: 'A school subject about past events', missingIndexes: [3], options: ['T', 'S', 'N', 'D'], difficulty: 'medium', category: 'School' },
    { word: 'ENGLISH', hint: 'A school subject about language', missingIndexes: [3], options: ['G', 'D', 'K', 'T'], difficulty: 'medium', category: 'School' },
    // Hard
    { word: 'LIBRARY', hint: 'A place full of books to borrow', missingIndexes: [1, 5], options: ['I', 'R', 'A', 'E'], difficulty: 'hard', category: 'School' },
{ word: 'HOMEWORK', hint: 'Work you do at home for school', missingIndexes: [2, 6], options: ['M', 'W', 'R', 'K'], difficulty: 'hard', category: 'School' },
{ word: 'TEXTBOOK', hint: 'A book used for studying a subject', missingIndexes: [1, 5], options: ['E', 'O', 'A', 'U'], difficulty: 'hard', category: 'School' },
{ word: 'SCISSORS', hint: 'A tool used for cutting paper', missingIndexes: [1, 5], options: ['C', 'S', 'T', 'R'], difficulty: 'hard', category: 'School' },
{ word: 'CLASSROOM', hint: 'The room where you learn', missingIndexes: [2, 7], options: ['A', 'O', 'E', 'U'], difficulty: 'hard', category: 'School' },
{ word: 'CALCULATOR', hint: 'A device used to do maths', missingIndexes: [1, 6], options: ['A', 'L', 'O', 'E'], difficulty: 'hard', category: 'School' },
{ word: 'TIMETABLE', hint: 'A schedule showing when classes happen', missingIndexes: [2, 7], options: ['M', 'B', 'T', 'E'], difficulty: 'hard', category: 'School' },
{ word: 'PRINCIPAL', hint: 'The head teacher of a school', missingIndexes: [1, 6], options: ['R', 'P', 'A', 'O'], difficulty: 'hard', category: 'School' },
{ word: 'GYMNASIUM', hint: 'A large room for physical education', missingIndexes: [2, 6], options: ['M', 'N', 'A', 'S'], difficulty: 'hard', category: 'School' },
{ word: 'GRADUATION', hint: 'A ceremony where you receive your qualification', missingIndexes: [1, 6], options: ['R', 'T', 'A', 'O'], difficulty: 'hard', category: 'School' },
  ],
  Nature: [
    // Easy
    { word: 'SUN', hint: 'The bright star that gives us light', missingIndexes: [1], options: ['U', 'A', 'O', 'E'], difficulty: 'easy', category: 'Nature' },
    { word: 'ICE', hint: 'Frozen water', missingIndexes: [1], options: ['C', 'S', 'T', 'D'], difficulty: 'easy', category: 'Nature' },
    { word: 'SKY', hint: 'The blue space above us', missingIndexes: [1], options: ['K', 'T', 'N', 'R'], difficulty: 'easy', category: 'Nature' },
    { word: 'RAIN', hint: 'Water that falls from clouds', missingIndexes: [2], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Nature' },
    { word: 'ROCK', hint: 'A hard solid piece of the earth', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Nature' },
    { word: 'LEAF', hint: 'The flat green part of a plant', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Nature' },
    { word: 'SEED', hint: 'A tiny thing that grows into a plant', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Nature' },
    { word: 'POND', hint: 'A small body of still water', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Nature' },
    { word: 'CAVE', hint: 'A hollow space inside a rock', missingIndexes: [2], options: ['V', 'T', 'D', 'N'], difficulty: 'easy', category: 'Nature' },
    { word: 'TREE', hint: 'A tall plant with a trunk and branches', missingIndexes: [1], options: ['R', 'N', 'S', 'D'], difficulty: 'easy', category: 'Nature' },
    // Medium
    { word: 'CLOUD', hint: 'A fluffy white shape in the sky', missingIndexes: [3], options: ['U', 'O', 'A', 'E'], difficulty: 'medium', category: 'Nature' },
    { word: 'RIVER', hint: 'A long moving body of water', missingIndexes: [2], options: ['V', 'B', 'D', 'N'], difficulty: 'medium', category: 'Nature' },
    { word: 'BEACH', hint: 'A sandy area beside the sea', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Nature' },
    { word: 'FROST', hint: 'A thin layer of ice on cold surfaces', missingIndexes: [3], options: ['S', 'T', 'N', 'D'], difficulty: 'medium', category: 'Nature' },
    { word: 'CORAL', hint: 'Colourful underwater structure', missingIndexes: [2], options: ['R', 'N', 'L', 'S'], difficulty: 'medium', category: 'Nature' },
    { word: 'OCEAN', hint: 'A vast area of salt water', missingIndexes: [2], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Nature' },
    { word: 'STORM', hint: 'A very strong wind with rain', missingIndexes: [2], options: ['O', 'A', 'U', 'E'], difficulty: 'medium', category: 'Nature' },
    { word: 'FOREST', hint: 'A large area covered with trees', missingIndexes: [3], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Nature' },
    { word: 'ISLAND', hint: 'A piece of land surrounded by water', missingIndexes: [2], options: ['L', 'N', 'R', 'S'], difficulty: 'medium', category: 'Nature' },
    { word: 'FLOWER', hint: 'A colourful part of a plant', missingIndexes: [2], options: ['O', 'A', 'U', 'E'], difficulty: 'medium', category: 'Nature' },
    // Hard
    { word: 'VOLCANO', hint: 'A mountain that can erupt with lava', missingIndexes: [1, 5], options: ['O', 'N', 'A', 'E'], difficulty: 'hard', category: 'Nature' },
{ word: 'RAINBOW', hint: 'Coloured arc in the sky after rain', missingIndexes: [1, 5], options: ['A', 'B', 'O', 'E'], difficulty: 'hard', category: 'Nature' },
{ word: 'TORNADO', hint: 'A spinning column of destructive wind', missingIndexes: [2, 5], options: ['R', 'N', 'D', 'S'], difficulty: 'hard', category: 'Nature' },
{ word: 'GLACIER', hint: 'A slow moving river of ice', missingIndexes: [1, 5], options: ['L', 'I', 'A', 'E'], difficulty: 'hard', category: 'Nature' },
{ word: 'MOUNTAIN', hint: 'A very high piece of land', missingIndexes: [2, 6], options: ['U', 'A', 'T', 'I'], difficulty: 'hard', category: 'Nature' },
{ word: 'WATERFALL', hint: 'Water flowing over the edge of a cliff', missingIndexes: [1, 6], options: ['A', 'L', 'E', 'R'], difficulty: 'hard', category: 'Nature' },
{ word: 'THUNDERSTORM', hint: 'A storm with lightning and loud noise', missingIndexes: [2, 8], options: ['H', 'S', 'U', 'E'], difficulty: 'hard', category: 'Nature' },
{ word: 'PENINSULA', hint: 'A piece of land almost surrounded by water', missingIndexes: [2, 7], options: ['N', 'L', 'A', 'E'], difficulty: 'hard', category: 'Nature' },
{ word: 'AVALANCHE', hint: 'A mass of snow sliding down a mountain', missingIndexes: [1, 6], options: ['V', 'C', 'A', 'N'], difficulty: 'hard', category: 'Nature' },
{ word: 'EARTHQUAKE', hint: 'Shaking of the ground', missingIndexes: [1, 7], options: ['A', 'H', 'R', 'T'], difficulty: 'hard', category: 'Nature' },
  ],
  Sports: [
    // Easy
    { word: 'RUN', hint: 'Moving fast on your feet', missingIndexes: [1], options: ['U', 'A', 'O', 'E'], difficulty: 'easy', category: 'Sports' },
    { word: 'SWIM', hint: 'Moving through water', missingIndexes: [1], options: ['W', 'N', 'R', 'S'], difficulty: 'easy', category: 'Sports' },
    { word: 'JUMP', hint: 'Leaping off the ground', missingIndexes: [1], options: ['U', 'A', 'O', 'E'], difficulty: 'easy', category: 'Sports' },
    { word: 'KICK', hint: 'Hitting a ball with your foot', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Sports' },
    { word: 'GOLF', hint: 'A sport where you hit a ball into a hole', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Sports' },
    { word: 'RACE', hint: 'A competition to see who is fastest', missingIndexes: [2], options: ['C', 'S', 'T', 'D'], difficulty: 'easy', category: 'Sports' },
    { word: 'BALL', hint: 'A round object used in many sports', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Sports' },
    { word: 'DIVE', hint: 'Jumping headfirst into water', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Sports' },
    { word: 'TEAM', hint: 'A group of players who play together', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Sports' },
    { word: 'GOAL', hint: 'Scoring in football', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Sports' },
    // Medium
    { word: 'RUGBY', hint: 'A contact sport with an oval ball', missingIndexes: [2], options: ['G', 'D', 'B', 'K'], difficulty: 'medium', category: 'Sports' },
    { word: 'TENNIS', hint: 'Hitting a ball over a net with a racket', missingIndexes: [3], options: ['N', 'S', 'T', 'D'], difficulty: 'medium', category: 'Sports' },
    { word: 'HOCKEY', hint: 'A sport played with a stick and puck', missingIndexes: [2], options: ['C', 'S', 'T', 'D'], difficulty: 'medium', category: 'Sports' },
    { word: 'BOXING', hint: 'A sport where you fight with gloves', missingIndexes: [3], options: ['I', 'A', 'O', 'E'], difficulty: 'medium', category: 'Sports' },
    { word: 'KARATE', hint: 'A Japanese martial art', missingIndexes: [2], options: ['R', 'N', 'L', 'S'], difficulty: 'medium', category: 'Sports' },
    { word: 'SPRINT', hint: 'Running as fast as you can', missingIndexes: [3], options: ['I', 'A', 'O', 'E'], difficulty: 'medium', category: 'Sports' },
    { word: 'SKIING', hint: 'Sliding down snowy slopes', missingIndexes: [1], options: ['K', 'N', 'T', 'D'], difficulty: 'medium', category: 'Sports' },
    { word: 'TROPHY', hint: 'A cup given to the winner', missingIndexes: [2], options: ['O', 'A', 'U', 'E'], difficulty: 'medium', category: 'Sports' },
    { word: 'MEDALS', hint: 'Metal discs given to winners', missingIndexes: [3], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Sports' },
    { word: 'REFEREE', hint: 'The official who makes sure rules are followed', missingIndexes: [3], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Sports' },
    // Hard
    { word: 'FOOTBALL', hint: 'The most popular sport in the world', missingIndexes: [2, 6], options: ['O', 'B', 'A', 'E'], difficulty: 'hard', category: 'Sports' },
{ word: 'SWIMMING', hint: 'A competitive sport done in a pool', missingIndexes: [1, 5], options: ['W', 'M', 'I', 'N'], difficulty: 'hard', category: 'Sports' },
{ word: 'MARATHON', hint: 'A very long running race of 42 kilometres', missingIndexes: [1, 5], options: ['A', 'T', 'O', 'H'], difficulty: 'hard', category: 'Sports' },
{ word: 'BASKETBALL', hint: 'Throwing a ball through a hoop', missingIndexes: [1, 7], options: ['A', 'T', 'E', 'B'], difficulty: 'hard', category: 'Sports' },
{ word: 'BADMINTON', hint: 'Hitting a shuttlecock over a net', missingIndexes: [1, 6], options: ['A', 'T', 'D', 'I'], difficulty: 'hard', category: 'Sports' },
{ word: 'VOLLEYBALL', hint: 'Hitting a ball over a high net', missingIndexes: [1, 7], options: ['O', 'B', 'L', 'E'], difficulty: 'hard', category: 'Sports' },
{ word: 'GYMNASTICS', hint: 'Performing flips and balances', missingIndexes: [1, 6], options: ['Y', 'T', 'S', 'A'], difficulty: 'hard', category: 'Sports' },
{ word: 'TRIATHLON', hint: 'A race combining swimming cycling and running', missingIndexes: [2, 6], options: ['I', 'L', 'T', 'H'], difficulty: 'hard', category: 'Sports' },
{ word: 'ARCHERY', hint: 'Shooting arrows at a target', missingIndexes: [1, 4], options: ['R', 'H', 'C', 'E'], difficulty: 'hard', category: 'Sports' },
{ word: 'WRESTLING', hint: 'A combat sport where you grapple', missingIndexes: [1, 5], options: ['R', 'T', 'E', 'S'], difficulty: 'hard', category: 'Sports' },
  ],
  Travel: [
    // Easy
    { word: 'BUS', hint: 'A large vehicle that carries many passengers', missingIndexes: [1], options: ['U', 'A', 'O', 'E'], difficulty: 'easy', category: 'Travel' },
    { word: 'MAP', hint: 'Shows you where places are', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Travel' },
    { word: 'CAR', hint: 'A vehicle with four wheels', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Travel' },
    { word: 'SHIP', hint: 'A large boat that travels on the sea', missingIndexes: [1], options: ['H', 'N', 'R', 'T'], difficulty: 'easy', category: 'Travel' },
    { word: 'ROAD', hint: 'A path that vehicles travel on', missingIndexes: [2], options: ['A', 'O', 'E', 'U'], difficulty: 'easy', category: 'Travel' },
    { word: 'TENT', hint: 'A temporary shelter used when camping', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Travel' },
    { word: 'TOUR', hint: 'A journey visiting different places', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Travel' },
    { word: 'TRIP', hint: 'A short journey to somewhere', missingIndexes: [2], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Travel' },
    { word: 'HIKE', hint: 'A long walk through nature', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Travel' },
    { word: 'CAMP', hint: 'Staying overnight outdoors in a tent', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Travel' },
    // Medium
    { word: 'HOTEL', hint: 'A building where travellers pay to sleep', missingIndexes: [2], options: ['T', 'S', 'N', 'D'], difficulty: 'medium', category: 'Travel' },
    { word: 'PLANE', hint: 'A vehicle that flies through the sky', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Travel' },
    { word: 'TRAIN', hint: 'A vehicle that travels on rails', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Travel' },
    { word: 'BEACH', hint: 'A sandy area next to the sea', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Travel' },
    { word: 'FERRY', hint: 'A boat that carries passengers across water', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'medium', category: 'Travel' },
    { word: 'GUIDE', hint: 'A person who shows tourists around', missingIndexes: [2], options: ['I', 'A', 'O', 'E'], difficulty: 'medium', category: 'Travel' },
    { word: 'TICKET', hint: 'A piece of paper that lets you travel', missingIndexes: [3], options: ['K', 'T', 'D', 'G'], difficulty: 'medium', category: 'Travel' },
    { word: 'BRIDGE', hint: 'A structure built over water', missingIndexes: [3], options: ['D', 'T', 'G', 'S'], difficulty: 'medium', category: 'Travel' },
    { word: 'CASTLE', hint: 'A large old stone building with towers', missingIndexes: [2], options: ['S', 'T', 'N', 'D'], difficulty: 'medium', category: 'Travel' },
    { word: 'MARKET', hint: 'An outdoor place to buy and sell goods', missingIndexes: [3], options: ['K', 'T', 'D', 'G'], difficulty: 'medium', category: 'Travel' },
    // Hard
    { word: 'PASSPORT', hint: 'The document you need to travel abroad', missingIndexes: [1, 5], options: ['A', 'P', 'S', 'O'], difficulty: 'hard', category: 'Travel' },
{ word: 'LUGGAGE', hint: 'Your bags and suitcases when travelling', missingIndexes: [1, 5], options: ['U', 'G', 'A', 'E'], difficulty: 'hard', category: 'Travel' },
{ word: 'CUSTOMS', hint: 'The checkpoint when entering a country', missingIndexes: [1, 4], options: ['U', 'T', 'S', 'O'], difficulty: 'hard', category: 'Travel' },
{ word: 'SOUVENIR', hint: 'A gift bought to remember a place', missingIndexes: [1, 5], options: ['O', 'N', 'U', 'E'], difficulty: 'hard', category: 'Travel' },
{ word: 'CURRENCY', hint: 'The money used in a country', missingIndexes: [1, 5], options: ['U', 'N', 'R', 'E'], difficulty: 'hard', category: 'Travel' },
{ word: 'ITINERARY', hint: 'A planned schedule for a trip', missingIndexes: [1, 6], options: ['T', 'R', 'I', 'A'], difficulty: 'hard', category: 'Travel' },
{ word: 'DEPARTURE', hint: 'Leaving a place on a journey', missingIndexes: [1, 6], options: ['E', 'T', 'A', 'P'], difficulty: 'hard', category: 'Travel' },
{ word: 'BOARDING', hint: 'Getting onto a plane or ship', missingIndexes: [2, 5], options: ['A', 'D', 'O', 'R'], difficulty: 'hard', category: 'Travel' },
{ word: 'BACKPACK', hint: 'A bag you carry on your back', missingIndexes: [1, 5], options: ['A', 'P', 'C', 'K'], difficulty: 'hard', category: 'Travel' },
{ word: 'ADVENTURE', hint: 'An exciting journey or experience', missingIndexes: [1, 6], options: ['D', 'T', 'A', 'E'], difficulty: 'hard', category: 'Travel' },
  ],
  Technology: [
    // Easy
    { word: 'APP', hint: 'A program on your phone', missingIndexes: [1], options: ['P', 'S', 'T', 'N'], difficulty: 'easy', category: 'Technology' },
    { word: 'BUG', hint: 'An error in a computer program', missingIndexes: [1], options: ['U', 'A', 'O', 'E'], difficulty: 'easy', category: 'Technology' },
    { word: 'CODE', hint: 'Instructions written for a computer', missingIndexes: [2], options: ['D', 'T', 'S', 'N'], difficulty: 'easy', category: 'Technology' },
    { word: 'FILE', hint: 'A document saved on a computer', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Technology' },
    { word: 'LINK', hint: 'Something you click to go to a webpage', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Technology' },
    { word: 'GAME', hint: 'An activity you play on a screen', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Technology' },
    { word: 'WIFI', hint: 'Wireless connection to the internet', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Technology' },
    { word: 'CHIP', hint: 'A tiny electronic component inside a device', missingIndexes: [1], options: ['H', 'N', 'R', 'S'], difficulty: 'easy', category: 'Technology' },
    { word: 'SPAM', hint: 'Unwanted junk emails', missingIndexes: [1], options: ['P', 'T', 'N', 'D'], difficulty: 'easy', category: 'Technology' },
    { word: 'ICON', hint: 'A small picture on a screen', missingIndexes: [1], options: ['C', 'N', 'S', 'T'], difficulty: 'easy', category: 'Technology' },
    // Medium
    { word: 'MOUSE', hint: 'A small device to control a computer', missingIndexes: [2], options: ['U', 'O', 'A', 'E'], difficulty: 'medium', category: 'Technology' },
    { word: 'ROBOT', hint: 'A machine that can do jobs automatically', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'medium', category: 'Technology' },
    { word: 'CLOUD', hint: 'Online storage where you save files', missingIndexes: [3], options: ['U', 'O', 'A', 'E'], difficulty: 'medium', category: 'Technology' },
    { word: 'TABLET', hint: 'A flat touchscreen device', missingIndexes: [2], options: ['B', 'D', 'N', 'S'], difficulty: 'medium', category: 'Technology' },
    { word: 'LAPTOP', hint: 'A portable computer', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Technology' },
    { word: 'SIGNAL', hint: 'Information sent wirelessly', missingIndexes: [3], options: ['G', 'D', 'K', 'T'], difficulty: 'medium', category: 'Technology' },
    { word: 'SCREEN', hint: 'The flat display on a device', missingIndexes: [2], options: ['R', 'N', 'L', 'S'], difficulty: 'medium', category: 'Technology' },
    { word: 'CAMERA', hint: 'A device used to take photos', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Technology' },
    { word: 'SEARCH', hint: 'Looking for information online', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Technology' },
    { word: 'UPLOAD', hint: 'Sending a file to the internet', missingIndexes: [1], options: ['P', 'T', 'N', 'D'], difficulty: 'medium', category: 'Technology' },
    // Hard
    { word: 'KEYBOARD', hint: 'You type on this to use a computer', missingIndexes: [1, 5], options: ['E', 'O', 'B', 'A'], difficulty: 'hard', category: 'Technology' },
{ word: 'INTERNET', hint: 'A global network connecting computers', missingIndexes: [1, 6], options: ['N', 'E', 'T', 'R'], difficulty: 'hard', category: 'Technology' },
{ word: 'SOFTWARE', hint: 'Programs that run on a computer', missingIndexes: [1, 6], options: ['O', 'W', 'A', 'E'], difficulty: 'hard', category: 'Technology' },
{ word: 'DOWNLOAD', hint: 'To copy a file from the internet', missingIndexes: [1, 6], options: ['O', 'L', 'W', 'A'], difficulty: 'hard', category: 'Technology' },
{ word: 'PASSWORD', hint: 'A secret word used to log in', missingIndexes: [1, 6], options: ['A', 'W', 'S', 'O'], difficulty: 'hard', category: 'Technology' },
{ word: 'BLUETOOTH', hint: 'Wireless technology for connecting devices', missingIndexes: [1, 6], options: ['L', 'T', 'O', 'U'], difficulty: 'hard', category: 'Technology' },
{ word: 'PROCESSOR', hint: 'The brain of a computer', missingIndexes: [1, 6], options: ['R', 'S', 'C', 'O'], difficulty: 'hard', category: 'Technology' },
{ word: 'STREAMING', hint: 'Watching media directly from the internet', missingIndexes: [1, 6], options: ['T', 'M', 'S', 'R'], difficulty: 'hard', category: 'Technology' },
{ word: 'MICROPHONE', hint: 'A device that picks up sound', missingIndexes: [1, 7], options: ['I', 'H', 'M', 'C'], difficulty: 'hard', category: 'Technology' },
{ word: 'ALGORITHM', hint: 'A set of rules a computer follows', missingIndexes: [1, 6], options: ['L', 'T', 'A', 'I'], difficulty: 'hard', category: 'Technology' },
  ],
  Countries: [
    // Easy
    { word: 'USA', hint: 'The country with the Statue of Liberty', missingIndexes: [1], options: ['S', 'T', 'N', 'D'], difficulty: 'easy', category: 'Countries' },
    { word: 'IRAN', hint: 'A large Middle Eastern country', missingIndexes: [1], options: ['R', 'N', 'S', 'T'], difficulty: 'easy', category: 'Countries' },
    { word: 'PERU', hint: 'Home to Machu Picchu', missingIndexes: [1], options: ['E', 'A', 'I', 'O'], difficulty: 'easy', category: 'Countries' },
    { word: 'CUBA', hint: 'A Caribbean island country', missingIndexes: [1], options: ['U', 'O', 'A', 'E'], difficulty: 'easy', category: 'Countries' },
    { word: 'LAOS', hint: 'A country next to Thailand', missingIndexes: [1], options: ['A', 'E', 'O', 'I'], difficulty: 'easy', category: 'Countries' },
    { word: 'CHAD', hint: 'A landlocked country in central Africa', missingIndexes: [1], options: ['H', 'N', 'R', 'S'], difficulty: 'easy', category: 'Countries' },
    { word: 'FIJI', hint: 'A tropical island nation in the Pacific', missingIndexes: [1], options: ['I', 'A', 'O', 'E'], difficulty: 'easy', category: 'Countries' },
    { word: 'MALI', hint: 'A landlocked country in West Africa', missingIndexes: [1], options: ['A', 'E', 'I', 'O'], difficulty: 'easy', category: 'Countries' },
    { word: 'TOGO', hint: 'A small West African country', missingIndexes: [1], options: ['O', 'A', 'U', 'E'], difficulty: 'easy', category: 'Countries' },
    { word: 'OMAN', hint: 'A Middle Eastern country', missingIndexes: [1], options: ['M', 'N', 'S', 'T'], difficulty: 'easy', category: 'Countries' },
    // Medium
    { word: 'SPAIN', hint: 'A sunny European country', missingIndexes: [2], options: ['A', 'E', 'I', 'O'], difficulty: 'medium', category: 'Countries' },
    { word: 'INDIA', hint: 'A large Asian country', missingIndexes: [1], options: ['N', 'S', 'T', 'D'], difficulty: 'medium', category: 'Countries' },
    { word: 'JAPAN', hint: 'An island nation in East Asia', missingIndexes: [2], options: ['P', 'T', 'N', 'D'], difficulty: 'medium', category: 'Countries' },
    { word: 'CHINA', hint: 'The most populous country in the world', missingIndexes: [2], options: ['I', 'A', 'O', 'E'], difficulty: 'medium', category: 'Countries' },
    { word: 'EGYPT', hint: 'A country famous for pyramids', missingIndexes: [1], options: ['G', 'D', 'K', 'T'], difficulty: 'medium', category: 'Countries' },
    { word: 'ITALY', hint: 'A European country shaped like a boot', missingIndexes: [1], options: ['T', 'N', 'S', 'D'], difficulty: 'medium', category: 'Countries' },
    { word: 'KENYA', hint: 'An African country famous for safaris', missingIndexes: [2], options: ['N', 'S', 'T', 'D'], difficulty: 'medium', category: 'Countries' },
    { word: 'NEPAL', hint: 'A small country home to Mount Everest', missingIndexes: [2], options: ['P', 'T', 'D', 'N'], difficulty: 'medium', category: 'Countries' },
    { word: 'WALES', hint: 'A country in the UK with a dragon on its flag', missingIndexes: [2], options: ['L', 'N', 'R', 'S'], difficulty: 'medium', category: 'Countries' },
    { word: 'GHANA', hint: 'A West African country', missingIndexes: [2], options: ['H', 'N', 'S', 'T'], difficulty: 'medium', category: 'Countries' },
    // Hard
    { word: 'THAILAND', hint: 'A country in Southeast Asia famous for temples', missingIndexes: [2, 6], options: ['A', 'L', 'I', 'N'], difficulty: 'hard', category: 'Countries' },
{ word: 'AUSTRALIA', hint: 'A country and continent', missingIndexes: [1, 6], options: ['U', 'L', 'T', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'GERMANY', hint: 'A European country famous for cars', missingIndexes: [1, 5], options: ['E', 'N', 'R', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'COLOMBIA', hint: 'A South American country famous for coffee', missingIndexes: [1, 5], options: ['O', 'B', 'L', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'MALAYSIA', hint: 'A Southeast Asian country', missingIndexes: [1, 5], options: ['A', 'S', 'L', 'Y'], difficulty: 'hard', category: 'Countries' },
{ word: 'PORTUGAL', hint: 'A country in southwestern Europe', missingIndexes: [1, 6], options: ['O', 'G', 'R', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'ARGENTINA', hint: 'A South American country famous for tango', missingIndexes: [1, 6], options: ['R', 'I', 'N', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'INDONESIA', hint: 'The worlds largest archipelago nation', missingIndexes: [1, 6], options: ['N', 'S', 'O', 'E'], difficulty: 'hard', category: 'Countries' },
{ word: 'SINGAPORE', hint: 'A tiny wealthy city state in Southeast Asia', missingIndexes: [1, 6], options: ['I', 'P', 'N', 'A'], difficulty: 'hard', category: 'Countries' },
{ word: 'VENEZUELA', hint: 'A South American country famous for Angel Falls', missingIndexes: [1, 7], options: ['E', 'L', 'N', 'A'], difficulty: 'hard', category: 'Countries' },
  ],
}

export function getMLQuestions(category: string, difficulty: Difficulty): MLQuestion[] {
  const bank = mlBank[category] || mlBank['Animals']
  return bank.filter(q => q.difficulty === difficulty)
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function buildDisplayWord(word: string, missingIndexes: number[], revealed: boolean): string[] {
  return word.split('').map((letter, i) => {
    if (revealed || !missingIndexes.includes(i)) return letter
    return '_'
  })
}