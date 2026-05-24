const { Telegraf } = require("telegraf");

const bot = new Telegraf("YOUR_BOT_TOKEN");

// 🔒 ID حقك فقط
const OWNER_ID = 5441032728;

// حالة التشغيل
let isActive = true;

// ===== أوامر التحكم =====
bot.on("text", async (ctx, next) => {
const text = ctx.message.text.toLowerCase();

// لازم يكون فيه تاغ للبوت
if (!text.includes("@astascuritybot")) return next();

// تحقق من صاحب الأمر
if (ctx.from.id !== OWNER_ID) return;

if (text.includes("/start")) {
isActive = true;
return ctx.reply("✅ Bot Activated");
}

if (text.includes("/stop")) {
isActive = false;
return ctx.reply("⛔ Bot Stopped");
}

return next();
});

// ===== الفلترة =====
bot.on("message", async (ctx) => {
try {
if (!isActive) return;

const msg = ctx.message;

// تجاهل الأدمن
const member = await ctx.getChatMember(msg.from.id);
if (member.status === "administrator" || member.status === "creator") return;

// ===== حذف inline buttons =====
if (msg.reply_markup && msg.reply_markup.inline_keyboard) {
  return ctx.deleteMessage();
}

// ===== حذف forwarded =====
if (msg.forward_date || msg.forward_from || msg.forward_from_chat) {
  return ctx.deleteMessage();
}

// ===== حذف رسائل البوت =====
if (msg.from.is_bot) {
  return ctx.deleteMessage();
}

let text = (msg.text || "") + " " + (msg.caption || "");
text = text.toLowerCase();

// ===== كلمات سيئة =====
const badPattern = /(f[\W_]*u[\W_]*l[\W_]*l|🔞|xxx|porn|sex)/i;

// ===== روابط =====
const linkPattern = /(https?:\/\/|www\.|t\.me\/)/i;

if (badPattern.test(text) || linkPattern.test(text)) {
  return ctx.deleteMessage();
}

} catch (err) {
console.log(err);
}
});

// تشغيل البوت
bot.launch();

console.log("🔥 Bot is running...");