const Discord = require('discord.js')
const config = require('./config.js')
const api = require('./4chan')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // the rest of your code
  if (command === 'webm') {
    if (!args.length) {
      return message.reply(`You didn't provide any arguments`)
    } else {
      api.queryRandom('gif', args.join(' '))
      .then( img =>{
        message.reply(img)
      }).catch( err => {
        message.reply(err)
      })
}}})

client.login(config.token)

/*
async function sendWebm(subject= 'ylyl', callback){
    findThreads(subject).then( async matches =>{
        if (!matches){return callback(`Can't find any threads with the filter: ***${subject}***`)}
        images =  await getAllImages(matches)
        var image = images[Math.floor(Math.random() * images.length)]
        console.log(matches)
        return callback(image)
    })
}
*/

