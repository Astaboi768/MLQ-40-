const k = require('axios');

const c = {};
c["config"] = {
    name: "flux",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: String.fromCharCode(99, 108, 105, 102, 102),
    description: "fal.ai Image generation",
    usages: "[prompt]",
    cooldown: 5,
    aliases: ["fluxpro"]
};

c["run"] = async ({ api, event, args }) => {
    const p = args.join(" ");
    if (!p) {
        return api.sendMessage('Provide a prompt first!', event.threadID);
    }

    const v = await new Promise(done => {
        api.sendMessage(`𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎 𝚏𝚘𝚛 "${p}"...`, event.threadID, (err, msgInfo) => {
            done(msgInfo);
        }, event.messageID);
    });

    try {
        const d = `https://hxmtxr-key-syugg.${b}/flux?prompt=${p}`;
        const r = await k.get(d);
        const f = r.data.imageUrl;
        const b = String.fromCharCode(111, 110, 114, 101, 110, 100, 101, 114, 46, 99, 111, 109);
        const h = await k.get(f, { responseType: 'stream' });
        api.unsendMessage(v.messageID);
        api.sendMessage({ body: ``, attachment: h.data }, event.threadID, event.messageID);
    } catch (error) {
        api.sendMessage(`Error: ${error.message || 'API failed to fetch the image.'}`, event.threadID);
    }
};

module.exports = c;