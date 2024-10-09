const axios = require('axios');

const UPoLPrefix = [
  'Nexus',
  'ask',
  'Nex',
  'nexus',
];

module.exports = {
  config: {
    name: 'ai',
    version: '1.2.1',
    role: 0,
    category: 'AI',
    author: 'Sman',
    shortDescription: 'Get response from Kora',
    longDescription: '',
  },

  onStart: async function () {},

  onChat: async function ({ message, event, args, api, threadID, messageID }) {
    try {
      // Check if the message starts with any of the prefixes
      const ahprefix = UPoLPrefix.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!ahprefix) {
        return;
      }

      // Extract the message content after the prefix
      const upol = event.body.substring(ahprefix.length).trim();

      // If the message is empty after the prefix, send a default reply
      if (!upol) {
        await message.reply('Hey buddy! How can I help you today 😎');
        return;
      }

      // Random responses for greetings
      const apply = ['Hey! Nexus is here to help', 'How can I help you today?', 'How can Nexus assist you today?', '👌'];

      // Check for specific command like "hi"
      if (args[0] && args[0].toLowerCase() === 'hi') {
        const randomApply = apply[Math.floor(Math.random() * apply.length)];
        await message.reply(`${randomApply}`);
        return;
      }

      // Encode the user input for the API request
      const encodedPrompt = encodeURIComponent(upol);

      // Send a loading message and save the message ID
      const awaitingMessage = await message.reply('❣️🥀hold let me get your answer cutie 🥀🥺🧠 ⏳');

      // API request in a try-catch block to handle potential errors
      const response = await axios.get(`https://nexus-ai-30oy.onrender.com/Nex?query=${encodedPrompt}`);

      // Delete the "awaiting" message
      await api.unsendMessage(awaitingMessage.messageID);

      // Check for possible structures of the Flask API response
      if (response.data) {
        const UPoL = response.data.answer || response.data.result || response.data.response || "Sorry, I couldn't understand the response from the API.";

        // Send the API's response back to the user
        await message.reply(UPoL);
      } else {
        // Handle case where API doesn't return valid data
        await message.reply('Nexus could not provide a response at the moment. Please try again later.');
      }

    } catch (error) {
      // Handle errors from the API request
      console.error('Error in AI command:', error);
      await message.reply('An error occurred while trying to contact Kora AI. Please try again later.');
    }
  }
};
