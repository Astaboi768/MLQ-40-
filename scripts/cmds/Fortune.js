const axios = require('axios');

const fortunes = [
  "A surprising journey awaits you",
  "Your creativity will lead you to great success",
  "An unexpected friendship will blossom soon",
  "A long-lost opportunity will present itself again",
  "Your kindness will be rewarded tenfold",
  "A secret admirer will reveal themselves",
  "Financial prosperity is on the horizon",
  "Your hard work will finally pay off",
  "A dream you've long forgotten will come true",
  "An important decision will shape your future"
];

const timeframes = ["this week", "this month", "this year", "very soon", "when you least expect it"];

const emojis = ["🔮", "🌟", "🍀", "🎭", "🌈", "🦋", "🌺", "🌙", "✨", "🏆"];

function generateLuckyNumbers(seed) {
  const numbers = new Set();
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  while (numbers.size < 5) {
    const num = (hash * numbers.size) % 100 + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

async function getFortuneCookie() {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    return response.data.content;
  } catch (error) {
    return "Your fortune is what you make of it.";
  }
}

module.exports = {
  config: {
    name: "fortune",
    version: "1.0",
    author: "Raphael Ilom",
    countDown: 10,
    role: 0,
    shortDescription: "Get a personalized fortune",
    longDescription: {
      en: "Receive a unique, personalized fortune based on your name or a question. Includes lucky numbers and a fortune cookie message!"
    },
    category: "Fun",
    guide: {
      en: "{prefix}fortune <your name or a question>"
    }
  },

  onStart: async function({ api, event, args }) {
    const input = args.join(' ');

    if (!input) {
      return api.sendMessage("Please provide your name or ask a question to receive your fortune!", event.threadID, event.messageID);
    }

    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const luckyNumbers = generateLuckyNumbers(input);
    const fortuneCookie = await getFortuneCookie();

    const personalizedFortune = `${emoji} Fortune for "${input}":

🔮 Prediction: ${fortune} ${timeframe}.

🎱 Lucky Numbers: ${luckyNumbers.join(', ')}

🥠 Fortune Cookie says: "${fortuneCookie}"

Remember, the future is yours to shape! Make the most of every opportunity.`;

    api.sendMessage(personalizedFortune, event.threadID, event.messageID);
  }
}
