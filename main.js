require('dotenv').config();

const {Translate} = require(`@google-cloud/translate`).v2;
const {TranslationServiceClient} = require('@google-cloud/translate');


var ComfyJS = require("comfy.js");
var addedso = [];
var addee = "";
var rmaddee = "";
var remove = ""
let checkuser = ""
let win;
let stopMod = false;
let stopVip = false;
let stopList = false;
let added =  "";
var solist = { "users": []};

ComfyJS.Init(process.env.BOTNAME,process.env.OAUTH, "chrispcowboy");


// on connect
ComfyJS.onConnected = ( address, port, isFirstConnect )  => {
if (isFirstConnect === true)
ComfyJS.Say("Hello I have joined the chat!");
}

// Logs errors to console
ComfyJS.onError = ( error )  => {
console.log(error);
}

                    /// 
ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if( command === "help" && (flags.broadcaster || flags.mod) ) {
    ComfyJS.Say( "Hello, I am chrispcowbot a bot made by ChrisPCowboy. I currently automatically shout out Mods, VIPS, and users from a list once they chat for the first time! To add a user type !add 'user' and to remove them type !remove 'user'." );
  } // !help triggers this message

  // add a user to the list
  if (command === "add"  && (flags.broadcaster || flags.mod) ) {
    addee = message.toLowerCase();
      if (solist.includes(` ${addee} `) === true) {
        ComfyJS.Say(`Sorry, ${message} has already been added to the list.`);
        console.log(solist);
      }
      else if (message.includes('@')){
        addee = addee.slice(1);

        if (solist.includes(`${addee} `) === true) {
          ComfyJS.Say(`Sorry, ${message} has already been added to the list.`);
          console.log(solist);
        }
        else {solist = `${solist}\n ${addee} \n`; 
        ComfyJS.Say(`${user}, I have now added ${addee}.`);
        console.log(solist);
        }
      }
      else {
        solist = `${solist}\n ${addee} \n`; 
        ComfyJS.Say(`${user}, I have now added ${addee}.`);
        console.log(solist);
        console.log(solist.includes(` ${addee} `))
        }
        }

  // removes a user from the list
  if (command === "remove" && (flags.broadcaster || flags.mod) ) {
    solist;
      rmaddee = message.toLowerCase();
    if (message.includes('@')){
        rmaddee = rmaddee.slice(1)

        if (solist.includes(` ${rmaddee} `)) {
          added = solist;
          remove = added.replace(new RegExp(` ${rmaddee} \n`, "gim"), "");
          solist = remove;
          ComfyJS.Say(`${user}, I have now removed ${rmaddee}.`);
          }
        else {
          ComfyJS.Say(`${rmaddee} is not on the list.`)
        }
    }
    else {    
      if (solist.includes(` ${rmaddee} `)) {
            added = solist;
            remove = added.replace(new RegExp(` ${rmaddee} \n`, "gim"), "");
            solist = remove;
            ComfyJS.Say(`${user}, I have now removed ${rmaddee}.`);
            }
      else {
        ComfyJS.Say(`${rmaddee} is not on the list.`);
      }
       
    }
  }  
}
// SO if mod or VIP    
ComfyJS.onChat = ( user, message, flags, self, extra ) => {
  detectLanguage(text = message);
  if (!stopMod && !self) {
        checkuser = user.toLowerCase();

      if( flags.mod && !addedso.includes(checkuser) && !self) {
        ComfyJS.Say(`Welcome on in MOD! Go follow the legend themselves at twitch.tv/${user}`);
        addedso.push(checkuser);
        console.log(`SO session list includes ${addedso}`);
      }
    }
  if (!stopVip && !self) {
      if( flags.vip && !addedso.includes(checkuser) && !self) {
        ComfyJS.Say(`Welcome on in VIP! Go follow the legend themselves at twitch.tv/${user}`);
        addedso.push(checkuser);
        console.log(`SO session list includes ${addedso}`);
      }
    }
}

//not tested
ComfyJS.onRaid = ( user, viewers, extra) => {
  checkuser = user.toLowerCase();
  if (!added.hasOwnProperty(` ${checkuser}`) && !addedso.includes(` ${checkuser}`)) {
      ComfyJS.Say(`Welcome on in ${user} and thank you for the raid of ${viewers}. You're the best!`);
  }
}

// Translate
/* const fs = require( 'fs' );
const naughtylist = fs.readFileSync( "bad-words.txt", "utf8" )
  .split( ", " ).filter( Boolean );
const CENSORED = "[censored]"

const naughtyRegexList = naughtylist
  .map( word => new RegExp( `\\b${ word }\\b`, "gi" ) )

function naughtyToNice( text ) {
    return naughtyRegexList.reduce(
      ( string, regex ) => string.replace( regex, CENSORED ),
      text
    )
  } */

const TOKEN_ARG = 2;
const tokenPath = "token.json";
process.env.GOOGLE_APPLICATION_CREDENTIALS = tokenPath;

const translate = new Translate();
const translationClient = new TranslationServiceClient();
const target = "en";

const projectId = process.env.projectId;
const location = 'global';

async function detectLanguage() {
    // Construct request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      content: text,
    };
  
    // Run request
    const [response] = await translationClient.detectLanguage(request);
  
    console.log('Detected Languages:');
    for (const language of response.languages) {
      console.log(`Language Code: ${language.languageCode}`);
      console.log(`Confidence: ${language.confidence}`);
      if (language.languageCode != 'en' && language.confidence >= '.95')
        translateText(text = text);
    }
  }

async function translateText() {
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log("Translations:");
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
        ComfyJS.Say(`**Translating message...** : ${translation}`);
    });
}