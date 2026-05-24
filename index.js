const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const url = process.env.RENDER_EXTERNAL_URL;

const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// فلترة الرسائل
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    try {
        // حذف forwarded
        if (msg.forward_date) {
            return bot.deleteMessage(chatId, msg.message_id);
        }

        // حذف inline buttons
        if (msg.reply_markup) {
            return bot.deleteMessage(chatId, msg.message_id);
        }

        let text = (msg.text || "") + (msg.caption || "");

        // حذف روابط
        if (/https?:\/\/|t\.me|www\./i.test(text)) {
            return bot.deleteMessage(chatId, msg.message_id);
        }

        // حذف كلمات
        if (/f[\W_]*u[\W_]*l[\W_]*l|🔞|xxx|porn|sex/i.test(text)) {
            return bot.deleteMessage(chatId, msg.message_id);
        }

    } catch (e) {
        console.log(e);
    }
});

app.listen(3000, () => {
    console.log("Bot is running...");
});