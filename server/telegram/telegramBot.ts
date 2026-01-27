import TelegramBot from "node-telegram-bot-api";
import { invokeLLM } from "../_core/llm";

let bot: TelegramBot | null = null;

export function initTelegramBot(token: string) {
  if (bot) {
    return bot;
  }

  bot = new TelegramBot(token, { polling: true });

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot?.sendMessage(
      chatId,
      `🎉 Velkommen til Innlegg Bot!

Send meg en idé eller et tema, så genererer jeg et profesjonelt innlegg for deg.

Eksempel:
"Skriv om viktigheten av AI i moderne business"

Jeg lager automatisk:
✅ Engasjerende innhold
✅ Tilpasset LinkedIn/Twitter/Instagram
✅ Profesjonell tone

Bare send meg din idé! 💡`
    );
  });

  // Handle /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot?.sendMessage(
      chatId,
      `📚 Slik bruker du Innlegg Bot:

1️⃣ Send meg et tema eller en idé
2️⃣ Velg plattform (LinkedIn/Twitter/Instagram/Facebook)
3️⃣ Få ferdig innlegg på sekunder!

Kommandoer:
/start - Start bot
/help - Vis denne hjelpemeldingen

Tips: Jo mer detaljer du gir, jo bedre blir innlegget! 🚀`
    );
  });

  // Handle text messages
  bot.on("message", async (msg) => {
    // Skip commands
    if (msg.text?.startsWith("/")) {
      return;
    }

    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (!userMessage) {
      return;
    }

    try {
      // Send "typing" action
      await bot?.sendChatAction(chatId, "typing");

      // Ask user to select platform
      await bot?.sendMessage(
        chatId,
        "Hvilken plattform vil du lage innlegg for?",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "LinkedIn", callback_data: `generate_linkedin_${userMessage}` },
                { text: "Twitter", callback_data: `generate_twitter_${userMessage}` },
              ],
              [
                { text: "Instagram", callback_data: `generate_instagram_${userMessage}` },
                { text: "Facebook", callback_data: `generate_facebook_${userMessage}` },
              ],
            ],
          },
        }
      );
    } catch (error) {
      console.error("Telegram bot error:", error);
      await bot?.sendMessage(
        chatId,
        "❌ Beklager, noe gikk galt. Prøv igjen senere."
      );
    }
  });

  // Handle callback queries (platform selection)
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId) return;

    const data = query.data;
    if (!data?.startsWith("generate_")) return;

    const [, platform, ...topicParts] = data.split("_");
    const topic = topicParts.join("_");

    try {
      await bot?.sendChatAction(chatId, "typing");
      await bot?.answerCallbackQuery(query.id, {
        text: `Genererer innlegg for ${platform}...`,
      });

      // Generate content using LLM
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Du er en ekspert på å skrive engasjerende innlegg for sosiale medier. Skriv et profesjonelt innlegg for ${platform} på norsk. Tilpass lengde og tone til plattformen.`,
          },
          {
            role: "user",
            content: `Tema: ${topic}`,
          },
        ],
      });

      const generatedContent = response.choices[0]?.message?.content;
      if (typeof generatedContent !== "string") {
        throw new Error("Kunne ikke generere innhold");
      }

      // Send generated content
      await bot?.sendMessage(
        chatId,
        `✅ Her er ditt ${platform}-innlegg:\n\n${generatedContent}\n\n💡 Tips: Kopier og lim inn i ${platform}, eller gjør små justeringer etter behov!`
      );
    } catch (error) {
      console.error("Content generation error:", error);
      await bot?.sendMessage(
        chatId,
        "❌ Kunne ikke generere innlegg. Prøv igjen eller kontakt support."
      );
    }
  });

  console.log("[Telegram Bot] Initialized and polling");
  return bot;
}

export function stopTelegramBot() {
  if (bot) {
    bot.stopPolling();
    bot = null;
    console.log("[Telegram Bot] Stopped");
  }
}
