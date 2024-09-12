const axios = require('axios');

module.exports = {
  config: {
    name: "createApi",
    aliases: ["ca"],
    version: "1.0.0",
    author: "Luka", 
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Create a new API endpoint",
      vi: "Tạo một điểm cuối API mới"
    },
    longDescription: {
      en: "Create and register a new API endpoint with predefined details.",
      vi: "Tạo và đăng ký một điểm cuối API mới với các chi tiết đã được định nghĩa."
    },
    category: "Custom",
    guide: {
      en: "Use this command to create a new API endpoint by providing necessary details.",
      vi: "Sử dụng lệnh này để tạo một điểm cuối API mới bằng cách cung cấp các chi tiết cần thiết."
    }
  },

  onStart: async function({ message, args, api }) {
    // URL de l'API pour créer de nouveaux endpoints
    const apiEndpoint = "https://jsonplaceholder.typicode.com/posts"; // Exemple d'URL d'API

    // Extraction des arguments
    const [title, body] = args; // Arguments attendus: titre et corps de l'API

    if (!title || !body) {
      return api.sendMessage("Please provide both a title and a body for the new API endpoint.", message.threadID);
    }

    try {
      // Envoi de la requête pour créer un nouvel endpoint API
      const response = await axios.post(apiEndpoint, {
        title,
        body
      });

      // Vérification de la réponse
      if (response.status === 201) {
        api.sendMessage(`The API endpoint with title "${title}" has been successfully created.`, message.threadID);
      } else {
        api.sendMessage("There was an error creating the API endpoint. Please try again later.", message.threadID);
      }
    } catch (error) {
      console.error("Error creating API endpoint:", error);
      api.sendMessage("There was an error connecting to the server. Please try again later.", message.threadID);
    }
  }
}
