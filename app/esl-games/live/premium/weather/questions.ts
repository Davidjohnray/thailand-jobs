export type WeatherQuestion = {
  question: string
  emoji: string
  options: { emoji: string; name: string }[]
  answer: number
}

export const weatherQuestions: WeatherQuestion[] = [
  // Round 1 — basic weather
  { question: 'What is the weather? ☀️', emoji: '☀️', options: [{ emoji: '🌧️', name: 'Rainy' }, { emoji: '☀️', name: 'Sunny' }, { emoji: '❄️', name: 'Snowy' }, { emoji: '⛅', name: 'Cloudy' }], answer: 1 },
  { question: 'What is the weather? 🌧️', emoji: '🌧️', options: [{ emoji: '☀️', name: 'Sunny' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '❄️', name: 'Snowy' }], answer: 1 },
  { question: 'What is the weather? ⛅', emoji: '⛅', options: [{ emoji: '☀️', name: 'Sunny' }, { emoji: '❄️', name: 'Snowy' }, { emoji: '⛅', name: 'Cloudy' }, { emoji: '🌧️', name: 'Rainy' }], answer: 2 },
  { question: 'What is the weather? ❄️', emoji: '❄️', options: [{ emoji: '☀️', name: 'Sunny' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '💨', name: 'Windy' }, { emoji: '❄️', name: 'Snowy' }], answer: 3 },
  { question: 'What is the weather? 💨', emoji: '💨', options: [{ emoji: '💨', name: 'Windy' }, { emoji: '☀️', name: 'Sunny' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '⛅', name: 'Cloudy' }], answer: 0 },

  // Round 2 — more weather
  { question: 'What is the weather? ⛈️', emoji: '⛈️', options: [{ emoji: '🌧️', name: 'Rainy' }, { emoji: '⛈️', name: 'Stormy' }, { emoji: '💨', name: 'Windy' }, { emoji: '❄️', name: 'Snowy' }], answer: 1 },
  { question: 'What is the weather? 🌈', emoji: '🌈', options: [{ emoji: '☀️', name: 'Sunny' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '🌈', name: 'Rainbow' }, { emoji: '⛅', name: 'Cloudy' }], answer: 2 },
  { question: 'What is the weather? 🌫️', emoji: '🌫️', options: [{ emoji: '⛅', name: 'Cloudy' }, { emoji: '💨', name: 'Windy' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '🌫️', name: 'Foggy' }], answer: 3 },
  { question: 'What is the weather? 🌩️', emoji: '🌩️', options: [{ emoji: '🌩️', name: 'Lightning' }, { emoji: '🌧️', name: 'Rainy' }, { emoji: '❄️', name: 'Snowy' }, { emoji: '☀️', name: 'Sunny' }], answer: 0 },
  { question: 'What is the weather? 🌪️', emoji: '🌪️', options: [{ emoji: '💨', name: 'Windy' }, { emoji: '⛈️', name: 'Stormy' }, { emoji: '🌪️', name: 'Tornado' }, { emoji: '🌫️', name: 'Foggy' }], answer: 2 },

  // Round 3 — what do you wear/do?
  { question: 'It is rainy! What do you need? 🌧️', emoji: '🌂', options: [{ emoji: '🕶️', name: 'Sunglasses' }, { emoji: '🧣', name: 'Scarf' }, { emoji: '🌂', name: 'Umbrella' }, { emoji: '🧤', name: 'Gloves' }], answer: 2 },
  { question: 'It is sunny! What do you wear? ☀️', emoji: '🕶️', options: [{ emoji: '🕶️', name: 'Sunglasses' }, { emoji: '🧥', name: 'Coat' }, { emoji: '🧤', name: 'Gloves' }, { emoji: '🌂', name: 'Umbrella' }], answer: 0 },
  { question: 'It is snowy! What do you wear? ❄️', emoji: '🧥', options: [{ emoji: '👙', name: 'Swimsuit' }, { emoji: '🕶️', name: 'Sunglasses' }, { emoji: '🧥', name: 'Coat' }, { emoji: '🌂', name: 'Umbrella' }], answer: 2 },
  { question: 'It is hot! Where do you go? 🔥', emoji: '🏖️', options: [{ emoji: '⛷️', name: 'Skiing' }, { emoji: '🏖️', name: 'Beach' }, { emoji: '🏠', name: 'Home' }, { emoji: '🎿', name: 'Snow sports' }], answer: 1 },
  { question: 'It is cold! What do you drink? 🥶', emoji: '☕', options: [{ emoji: '🧃', name: 'Juice' }, { emoji: '🧊', name: 'Ice drink' }, { emoji: '☕', name: 'Hot drink' }, { emoji: '🥤', name: 'Cold drink' }], answer: 2 },

  // Round 4 — seasons
  { question: 'Which season is hot and sunny? ☀️', emoji: '🏖️', options: [{ emoji: '🍂', name: 'Autumn' }, { emoji: '🌸', name: 'Spring' }, { emoji: '❄️', name: 'Winter' }, { emoji: '🏖️', name: 'Summer' }], answer: 3 },
  { question: 'Which season has snow? ❄️', emoji: '⛄', options: [{ emoji: '⛄', name: 'Winter' }, { emoji: '🌸', name: 'Spring' }, { emoji: '🏖️', name: 'Summer' }, { emoji: '🍂', name: 'Autumn' }], answer: 0 },
  { question: 'Which season has flowers? 🌸', emoji: '🌸', options: [{ emoji: '❄️', name: 'Winter' }, { emoji: '🌸', name: 'Spring' }, { emoji: '🍂', name: 'Autumn' }, { emoji: '🏖️', name: 'Summer' }], answer: 1 },
  { question: 'Which season has falling leaves? 🍂', emoji: '🍂', options: [{ emoji: '🌸', name: 'Spring' }, { emoji: '🏖️', name: 'Summer' }, { emoji: '🍂', name: 'Autumn' }, { emoji: '⛄', name: 'Winter' }], answer: 2 },
  { question: 'What comes after the rain? 🌧️', emoji: '🌈', options: [{ emoji: '❄️', name: 'Snow' }, { emoji: '🌩️', name: 'Lightning' }, { emoji: '🌪️', name: 'Tornado' }, { emoji: '🌈', name: 'Rainbow' }], answer: 3 },
]
