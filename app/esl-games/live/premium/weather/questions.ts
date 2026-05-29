export type WeatherQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const weatherQuestions: WeatherQuestion[] = [
  // Round 1 — basic weather
  { question: 'What is the weather?', emoji: '☀️', options: [{ emoji: '🌧️', name: 'rainy' }, { emoji: '☀️', name: 'sunny' }, { emoji: '❄️', name: 'snowy' }, { emoji: '⛅', name: 'cloudy' }], answer: 1 },
  { question: 'What is the weather?', emoji: '🌧️', options: [{ emoji: '☀️', name: 'sunny' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '🌈', name: 'rainbow' }, { emoji: '❄️', name: 'snowy' }], answer: 1 },
  { question: 'What is the weather?', emoji: '⛅', options: [{ emoji: '☀️', name: 'sunny' }, { emoji: '❄️', name: 'snowy' }, { emoji: '⛅', name: 'cloudy' }, { emoji: '🌧️', name: 'rainy' }], answer: 2 },
  { question: 'What is the weather?', emoji: '❄️', options: [{ emoji: '☀️', name: 'sunny' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '💨', name: 'windy' }, { emoji: '❄️', name: 'snowy' }], answer: 3 },
  { question: 'What is the weather?', emoji: '💨', options: [{ emoji: '💨', name: 'windy' }, { emoji: '☀️', name: 'sunny' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '⛅', name: 'cloudy' }], answer: 0 },

  // Round 2 — more weather
  { question: 'What is the weather?', emoji: '⛈️', options: [{ emoji: '🌧️', name: 'rainy' }, { emoji: '⛈️', name: 'stormy' }, { emoji: '💨', name: 'windy' }, { emoji: '❄️', name: 'snowy' }], answer: 1 },
  { question: 'What is the weather?', emoji: '🌈', options: [{ emoji: '☀️', name: 'sunny' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '🌈', name: 'rainbow' }, { emoji: '⛅', name: 'cloudy' }], answer: 2 },
  { question: 'What is the weather?', emoji: '🌫️', options: [{ emoji: '⛅', name: 'cloudy' }, { emoji: '💨', name: 'windy' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '🌫️', name: 'foggy' }], answer: 3 },
  { question: 'What is the weather?', emoji: '🌩️', options: [{ emoji: '🌩️', name: 'lightning' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '❄️', name: 'snowy' }, { emoji: '☀️', name: 'sunny' }], answer: 0 },
  { question: 'What is the weather?', emoji: '🌪️', options: [{ emoji: '💨', name: 'windy' }, { emoji: '⛈️', name: 'stormy' }, { emoji: '🌪️', name: 'tornado' }, { emoji: '🌫️', name: 'foggy' }], answer: 2 },

  // Round 3 — what do you wear/do?
  { question: 'It is rainy! What do you need?', emoji: '🌂', options: [{ emoji: '🕶️', name: 'sunglasses' }, { emoji: '🧣', name: 'scarf' }, { emoji: '🌂', name: 'umbrella' }, { emoji: '🧤', name: 'gloves' }], answer: 2 },
  { question: 'It is sunny! What do you wear?', emoji: '🕶️', options: [{ emoji: '🕶️', name: 'sunglasses' }, { emoji: '🧥', name: 'coat' }, { emoji: '🧤', name: 'gloves' }, { emoji: '🌂', name: 'umbrella' }], answer: 0 },
  { question: 'It is snowy! What do you wear?', emoji: '🧥', options: [{ emoji: '👙', name: 'swimsuit' }, { emoji: '🕶️', name: 'sunglasses' }, { emoji: '🧥', name: 'coat' }, { emoji: '🌂', name: 'umbrella' }], answer: 2 },
  { question: 'It is hot! Where do you go?', emoji: '🏖️', options: [{ emoji: '⛷️', name: 'skiing' }, { emoji: '🏖️', name: 'beach' }, { emoji: '🏠', name: 'home' }, { emoji: '🎿', name: 'snow sports' }], answer: 1 },
  { question: 'It is cold! What do you drink?', emoji: '☕', options: [{ emoji: '🧃', name: 'juice' }, { emoji: '🧊', name: 'ice drink' }, { emoji: '☕', name: 'hot drink' }, { emoji: '🥤', name: 'cold drink' }], answer: 2 },

  // Round 4 — seasons
  { question: 'Which season is hot and sunny?', emoji: '🏖️', options: [{ emoji: '🍂', name: 'autumn' }, { emoji: '🌸', name: 'spring' }, { emoji: '❄️', name: 'winter' }, { emoji: '🏖️', name: 'summer' }], answer: 3 },
  { question: 'Which season has snow?', emoji: '⛄', options: [{ emoji: '⛄', name: 'winter' }, { emoji: '🌸', name: 'spring' }, { emoji: '🏖️', name: 'summer' }, { emoji: '🍂', name: 'autumn' }], answer: 0 },
  { question: 'Which season has flowers?', emoji: '🌸', options: [{ emoji: '❄️', name: 'winter' }, { emoji: '🌸', name: 'spring' }, { emoji: '🍂', name: 'autumn' }, { emoji: '🏖️', name: 'summer' }], answer: 1 },
  { question: 'Which season has falling leaves?', emoji: '🍂', options: [{ emoji: '🌸', name: 'spring' }, { emoji: '🏖️', name: 'summer' }, { emoji: '🍂', name: 'autumn' }, { emoji: '⛄', name: 'winter' }], answer: 2 },
  { question: 'What comes after the rain?', emoji: '🌈', options: [{ emoji: '❄️', name: 'snow' }, { emoji: '🌩️', name: 'lightning' }, { emoji: '🌪️', name: 'tornado' }, { emoji: '🌈', name: 'rainbow' }], answer: 3 },
]
