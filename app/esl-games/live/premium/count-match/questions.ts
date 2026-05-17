export type CountQuestion = {
  objects: string
  count: number
  options: number[]
}

export const countQuestions: CountQuestion[] = [
  // Very easy — 1 to 5
  { objects: '🍎', count: 1, options: [1, 2, 3, 4] },
  { objects: '🌟🌟', count: 2, options: [1, 2, 3, 4] },
  { objects: '🐶🐶🐶', count: 3, options: [2, 3, 4, 5] },
  { objects: '🍌🍌🍌🍌', count: 4, options: [2, 3, 4, 5] },
  { objects: '⭐⭐⭐⭐⭐', count: 5, options: [3, 4, 5, 6] },

  // Easy — 1 to 8
  { objects: '🌸🌸', count: 2, options: [1, 2, 3, 4] },
  { objects: '🐱🐱🐱🐱', count: 4, options: [3, 4, 5, 6] },
  { objects: '🎈🎈🎈🎈🎈🎈', count: 6, options: [4, 5, 6, 7] },
  { objects: '🍭🍭🍭', count: 3, options: [2, 3, 4, 5] },
  { objects: '🐸🐸🐸🐸🐸🐸🐸', count: 7, options: [5, 6, 7, 8] },

  // Medium — 5 to 12
  { objects: '🦋🦋🦋🦋🦋', count: 5, options: [3, 4, 5, 6] },
  { objects: '🍩🍩🍩🍩🍩🍩🍩🍩', count: 8, options: [6, 7, 8, 9] },
  { objects: '🌈🌈🌈🌈🌈🌈🌈🌈🌈', count: 9, options: [7, 8, 9, 10] },
  { objects: '🐝🐝🐝🐝🐝🐝', count: 6, options: [4, 5, 6, 7] },
  { objects: '🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀', count: 10, options: [8, 9, 10, 11] },

  // Harder — 8 to 15
  { objects: '🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺', count: 11, options: [9, 10, 11, 12] },
  { objects: '🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵🎵', count: 12, options: [10, 11, 12, 13] },
  { objects: '🐠🐠🐠🐠🐠🐠🐠🐠🐠🐠🐠🐠🐠', count: 13, options: [11, 12, 13, 14] },
  { objects: '🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻', count: 14, options: [12, 13, 14, 15] },
  { objects: '🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦🍦', count: 15, options: [13, 14, 15, 16] },
]
