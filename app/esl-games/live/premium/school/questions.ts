export type SchoolQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const schoolQuestions: SchoolQuestion[] = [
  // Round 1 — find the school item
  { question: 'Find the PENCIL! ✏️', emoji: '✏️', options: [{ emoji: '📏', name: 'Ruler' }, { emoji: '✏️', name: 'Pencil' }, { emoji: '📚', name: 'Book' }, { emoji: '🖊️', name: 'Pen' }], answer: 1 },
  { question: 'Find the BOOK! 📚', emoji: '📚', options: [{ emoji: '📚', name: 'Book' }, { emoji: '📓', name: 'Notebook' }, { emoji: '📋', name: 'Clipboard' }, { emoji: '📰', name: 'Newspaper' }], answer: 0 },
  { question: 'Find the BAG! 🎒', emoji: '🎒', options: [{ emoji: '👜', name: 'Handbag' }, { emoji: '💼', name: 'Briefcase' }, { emoji: '🎒', name: 'School Bag' }, { emoji: '🛍️', name: 'Shopping Bag' }], answer: 2 },
  { question: 'Find the RULER! 📏', emoji: '📏', options: [{ emoji: '✏️', name: 'Pencil' }, { emoji: '🖊️', name: 'Pen' }, { emoji: '📐', name: 'Set Square' }, { emoji: '📏', name: 'Ruler' }], answer: 3 },
  { question: 'Find the SCISSORS! ✂️', emoji: '✂️', options: [{ emoji: '✂️', name: 'Scissors' }, { emoji: '🖊️', name: 'Pen' }, { emoji: '📏', name: 'Ruler' }, { emoji: '🗂️', name: 'Folder' }], answer: 0 },

  // Round 2 — more school items
  { question: 'Find the RUBBER! 🧹', emoji: '🩹', options: [{ emoji: '📏', name: 'Ruler' }, { emoji: '🩹', name: 'Eraser' }, { emoji: '✏️', name: 'Pencil' }, { emoji: '📌', name: 'Pin' }], answer: 1 },
  { question: 'Find the GLUE! 🖇️', emoji: '🫧', options: [{ emoji: '✏️', name: 'Pencil' }, { emoji: '✂️', name: 'Scissors' }, { emoji: '🫧', name: 'Glue' }, { emoji: '📏', name: 'Ruler' }], answer: 2 },
  { question: 'Find the CRAYON! 🖍️', emoji: '🖍️', options: [{ emoji: '✏️', name: 'Pencil' }, { emoji: '🖊️', name: 'Pen' }, { emoji: '📏', name: 'Ruler' }, { emoji: '🖍️', name: 'Crayon' }], answer: 3 },
  { question: 'Find the NOTEBOOK! 📓', emoji: '📓', options: [{ emoji: '📓', name: 'Notebook' }, { emoji: '📚', name: 'Book' }, { emoji: '📋', name: 'Clipboard' }, { emoji: '🗂️', name: 'Folder' }], answer: 0 },
  { question: 'Find the CALCULATOR! 🖩', emoji: '🖩', options: [{ emoji: '💻', name: 'Laptop' }, { emoji: '🖩', name: 'Calculator' }, { emoji: '📱', name: 'Phone' }, { emoji: '⌨️', name: 'Keyboard' }], answer: 1 },

  // Round 3 — school places and people
  { question: 'Find the TEACHER! 👩‍🏫', emoji: '👩‍🏫', options: [{ emoji: '👩‍🏫', name: 'Teacher' }, { emoji: '👨‍⚕️', name: 'Doctor' }, { emoji: '👮', name: 'Police' }, { emoji: '👷', name: 'Builder' }], answer: 0 },
  { question: 'Find the CLASSROOM! 🏫', emoji: '🏫', options: [{ emoji: '🏥', name: 'Hospital' }, { emoji: '🏫', name: 'Classroom' }, { emoji: '🏪', name: 'Shop' }, { emoji: '🏠', name: 'House' }], answer: 1 },
  { question: 'Find the BLACKBOARD! 🖥️', emoji: '📋', options: [{ emoji: '🪟', name: 'Window' }, { emoji: '🚪', name: 'Door' }, { emoji: '📋', name: 'Blackboard' }, { emoji: '🖼️', name: 'Picture' }], answer: 2 },
  { question: 'Find the DESK! 🪑', emoji: '🪑', options: [{ emoji: '🛏️', name: 'Bed' }, { emoji: '🛋️', name: 'Sofa' }, { emoji: '🪑', name: 'Chair' }, { emoji: '🪑', name: 'Desk' }], answer: 3 },
  { question: 'Find the STUDENT! 👨‍🎓', emoji: '👨‍🎓', options: [{ emoji: '👨‍🎓', name: 'Student' }, { emoji: '👨‍⚕️', name: 'Doctor' }, { emoji: '👮', name: 'Police' }, { emoji: '👩‍🍳', name: 'Chef' }], answer: 0 },

  // Round 4 — what do you use it for?
  { question: 'You write with a...? ✍️', emoji: '✍️', options: [{ emoji: '📏', name: 'Ruler' }, { emoji: '✏️', name: 'Pencil' }, { emoji: '✂️', name: 'Scissors' }, { emoji: '🎒', name: 'Bag' }], answer: 1 },
  { question: 'You cut paper with...? ✂️', emoji: '📄', options: [{ emoji: '✂️', name: 'Scissors' }, { emoji: '📏', name: 'Ruler' }, { emoji: '✏️', name: 'Pencil' }, { emoji: '🖍️', name: 'Crayon' }], answer: 0 },
  { question: 'You carry your books in a...? 📚', emoji: '📚', options: [{ emoji: '👜', name: 'Handbag' }, { emoji: '🛍️', name: 'Shopping Bag' }, { emoji: '🎒', name: 'School Bag' }, { emoji: '💼', name: 'Briefcase' }], answer: 2 },
  { question: 'You measure with a...? 📐', emoji: '📐', options: [{ emoji: '✏️', name: 'Pencil' }, { emoji: '✂️', name: 'Scissors' }, { emoji: '🖍️', name: 'Crayon' }, { emoji: '📏', name: 'Ruler' }], answer: 3 },
  { question: 'You draw with a...? 🎨', emoji: '🎨', options: [{ emoji: '🖍️', name: 'Crayon' }, { emoji: '📏', name: 'Ruler' }, { emoji: '✂️', name: 'Scissors' }, { emoji: '🎒', name: 'Bag' }], answer: 0 },
]
