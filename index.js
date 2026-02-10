import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

if (!token || !openaiKey) {
  throw new Error("Missing TELEGRAM_TOKEN or OPENAI_API_KEY env vars");
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ?? "";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${openaiKey},
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No reply.";

    await bot.sendMessage(chatId, reply);
  } catch (err) {
    await bot.sendMessage(chatId, "Error talking to AI.");
  }
});
