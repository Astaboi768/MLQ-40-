const axios = require('axios');

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const zodiacEmojis = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

const days = ['today', 'tomorrow', 'yesterday'];

module.exports = {
  config: {
    name: "horoscope",
    version: "2.1",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Get daily horoscope for zodiac signs",
    longDescription: {
      en: "Get daily, tomorrow's, or yesterday's horoscope for a specified zodiac sign. You can also get a random horoscope or view all zodiac signs."
    },
    category: "Fun",
    guide: {
      en: "{prefix}horoscope <zodiac sign | random | list> [today | tomorrow | yesterday]"
    }
  },

  onStart: async function({ api, event, args }) {
    const input = args.join(' ').toLowerCase();
    const [signInput, dayInput] = input.split(/\s+/);

    if (!signInput) {
      return api.sendMessage("Please provide a zodiac sign, 'random', or 'list'.", event.threadID, event.messageID);
    }

    if (signInput === 'list') {
      const signList = zodiacSigns.map(sign => `${zodiacEmojis[sign]} ${sign.charAt(0).toUpperCase() + sign.slice(1)}`).join('\n');
      return api.sendMessage(`Available zodiac signs:\n\n${signList}`, event.threadID, event.messageID);
    }

    let sign = signInput === 'random' ? zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)] : signInput;
    if (!zodiacSigns.includes(sign)) {
      return api.sendMessage(`Invalid zodiac sign. Type '${this.config.name} list' to see all available signs.`, event.threadID, event.messageID);
    }

    const day = days.includes(dayInput) ? dayInput : 'today';

    try {
      const response = await axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, null, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { description, current_date, compatibility, mood, color, lucky_number, lucky_time, date_range } = response.data;

      const horoscopeMessage = `
${zodiacEmojis[sign]} Horoscope for ${sign.charAt(0).toUpperCase() + sign.slice(1)} (${current_date}):

📅 Date Range: ${date_range}

🔮 Prediction:
${description}

❤️ Compatibility: ${compatibility}
😊 Mood: ${mood}
🎨 Color: ${color}
🔢 Lucky Number: ${lucky_number}
⏰ Lucky Time: ${lucky_time}
      `.trim();

      api.sendMessage(horoscopeMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error(`Error fetching horoscope for ${sign} (${day}):`, error.message);
      
      let errorMessage = "An error occurred while fetching the horoscope. ";
      
      if (error.response) {
        errorMessage += `Server responded with status ${error.response.status}. `;
      } else if (error.request) {
        errorMessage += "No response received from the server. ";
      } else {
        errorMessage += `Error details: ${error.message}. `;
      }
      
      errorMessage += "Please try again later or contact the bot administrator if the problem persists.";
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
}
