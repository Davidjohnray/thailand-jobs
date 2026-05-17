export type BodyQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const bodyQuestions: BodyQuestion[] = [
  // Round 1 — face parts
  { question: 'Point to the Eyes! 👁️', emoji: '👀', options: [{ emoji: '👃', name: 'Nose' }, { emoji: '👂', name: 'Ear' }, { emoji: '👀', name: 'Eyes' }, { emoji: '👄', name: 'Mouth' }], answer: 2 },
  { question: 'Point to the Nose! 👃', emoji: '👃', options: [{ emoji: '👀', name: 'Eyes' }, { emoji: '👃', name: 'Nose' }, { emoji: '👄', name: 'Mouth' }, { emoji: '👂', name: 'Ear' }], answer: 1 },
  { question: 'Point to the Mouth! 👄', emoji: '👄', options: [{ emoji: '👄', name: 'Mouth' }, { emoji: '👃', name: 'Nose' }, { emoji: '👀', name: 'Eyes' }, { emoji: '🦷', name: 'Teeth' }], answer: 0 },
  { question: 'Point to the Ear! 👂', emoji: '👂', options: [{ emoji: '👃', name: 'Nose' }, { emoji: '👄', name: 'Mouth' }, { emoji: '🦷', name: 'Teeth' }, { emoji: '👂', name: 'Ear' }], answer: 3 },
  { question: 'Point to the Teeth! 🦷', emoji: '🦷', options: [{ emoji: '👅', name: 'Tongue' }, { emoji: '🦷', name: 'Teeth' }, { emoji: '👀', name: 'Eyes' }, { emoji: '👃', name: 'Nose' }], answer: 1 },

  // Round 2 — head and hair
  { question: 'Touch your Head! 🧠', emoji: '🧑', options: [{ emoji: '🦵', name: 'Leg' }, { emoji: '✋', name: 'Hand' }, { emoji: '🧑', name: 'Head' }, { emoji: '👣', name: 'Foot' }], answer: 2 },
  { question: 'Touch your Hair! 💇', emoji: '💇', options: [{ emoji: '💇', name: 'Hair' }, { emoji: '🧑', name: 'Head' }, { emoji: '👂', name: 'Ear' }, { emoji: '👃', name: 'Nose' }], answer: 0 },
  { question: 'Show me your Hand! ✋', emoji: '✋', options: [{ emoji: '👣', name: 'Foot' }, { emoji: '🦵', name: 'Leg' }, { emoji: '💪', name: 'Arm' }, { emoji: '✋', name: 'Hand' }], answer: 3 },
  { question: 'Show me your Fingers! 🖐️', emoji: '🖐️', options: [{ emoji: '🖐️', name: 'Fingers' }, { emoji: '👣', name: 'Toes' }, { emoji: '✋', name: 'Hand' }, { emoji: '💪', name: 'Arm' }], answer: 0 },
  { question: 'Show me your Arm! 💪', emoji: '💪', options: [{ emoji: '🦵', name: 'Leg' }, { emoji: '💪', name: 'Arm' }, { emoji: '✋', name: 'Hand' }, { emoji: '👣', name: 'Foot' }], answer: 1 },

  // Round 3 — body
  { question: 'Touch your Shoulder! 🤷', emoji: '🤷', options: [{ emoji: '🤷', name: 'Shoulder' }, { emoji: '🦵', name: 'Knee' }, { emoji: '💪', name: 'Elbow' }, { emoji: '👣', name: 'Foot' }], answer: 0 },
  { question: 'Touch your Tummy! 🫃', emoji: '🫃', options: [{ emoji: '💪', name: 'Chest' }, { emoji: '🦵', name: 'Leg' }, { emoji: '🫃', name: 'Tummy' }, { emoji: '🤷', name: 'Back' }], answer: 2 },
  { question: 'Touch your Knee! 🦵', emoji: '🦵', options: [{ emoji: '👣', name: 'Foot' }, { emoji: '🤷', name: 'Hip' }, { emoji: '💪', name: 'Elbow' }, { emoji: '🦵', name: 'Knee' }], answer: 3 },
  { question: 'Show me your Foot! 👣', emoji: '👣', options: [{ emoji: '✋', name: 'Hand' }, { emoji: '👣', name: 'Foot' }, { emoji: '🦵', name: 'Leg' }, { emoji: '💪', name: 'Arm' }], answer: 1 },
  { question: 'Touch your Toes! 🦶', emoji: '🦶', options: [{ emoji: '🦶', name: 'Toes' }, { emoji: '👣', name: 'Foot' }, { emoji: '🖐️', name: 'Fingers' }, { emoji: '✋', name: 'Hand' }], answer: 0 },

  // Round 4 — actions
  { question: 'Which do we use to see? 👁️', emoji: '👁️', options: [{ emoji: '👂', name: 'Ears' }, { emoji: '👃', name: 'Nose' }, { emoji: '👄', name: 'Mouth' }, { emoji: '👁️', name: 'Eyes' }], answer: 3 },
  { question: 'Which do we use to hear? 🎵', emoji: '👂', options: [{ emoji: '👁️', name: 'Eyes' }, { emoji: '👂', name: 'Ears' }, { emoji: '👃', name: 'Nose' }, { emoji: '👄', name: 'Mouth' }], answer: 1 },
  { question: 'Which do we use to smell? 🌸', emoji: '👃', options: [{ emoji: '👄', name: 'Mouth' }, { emoji: '👁️', name: 'Eyes' }, { emoji: '👃', name: 'Nose' }, { emoji: '👂', name: 'Ears' }], answer: 2 },
  { question: 'Which do we use to eat? 🍎', emoji: '👄', options: [{ emoji: '👄', name: 'Mouth' }, { emoji: '👁️', name: 'Eyes' }, { emoji: '👂', name: 'Ears' }, { emoji: '👃', name: 'Nose' }], answer: 0 },
  { question: 'Which do we use to kick a ball? ⚽', emoji: '🦵', options: [{ emoji: '✋', name: 'Hand' }, { emoji: '💪', name: 'Arm' }, { emoji: '🦶', name: 'Toes' }, { emoji: '🦵', name: 'Leg' }], answer: 3 },
]
