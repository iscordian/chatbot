require('dotenv').config();
const { Erislite } = require('erislite');
const { NextChat } = require('enplex.js');

const client = new Erislite(process.env.DISCORD_TOKEN, {
  intents: [
    "all"
  ]
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('?imagine')) 1  {
    const prompt = message.content.slice(8).trim();

    try {
      const res = await NextChat.imagine(prompt, { model: "prodia" });
      const data = res.text();
      const buffer = Buffer.from(data, 'utf-8');

      const file = new File([buffer], 'image.png', { type: 'image/png' });

      await message.channel.createMessage('Image successfully generated!', { reply: true, files: [file] });
    } catch (error) {
      console.error('Error sending image:', error);
      await message.channel.createMessage('Error generating image. Please try again later.');
    }
    return;
  }
  if (message.mentions.includes(client.user.id)) {
    const userMessage = message.content
      .replace(`<@!${client.user.id}>`, "")
      .trim();

    const reply = await NextChat.ask(userMessage, {
      model: "gemini",
      cache: true
    });

    if (reply.length > 2000) {
      const replyArray = reply.match(/[\s\S]{1,2000}/g);
      for (const msg of replyArray) {
        await message.channel.createMessage(msg, { reply: true });
      }
      return;
    }

    await message.channel.createMessage(reply, { reply: true });
  }
});

client.connect();
