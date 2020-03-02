const Discord = require('discord.js')
const config = require('./config.js')
const api = require('./4chan')
const client = new Discord.Client()

// Get Board List on Startup
boardList = []
api.getBoardList().then(bL=> boardList= bL).catch(e=> console.log(e))

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', message => {
  if (!message.content.startsWith('4') || message.author.bot) return;
  //const args = message.content.slice('/').split(/ +/);
  const content= message.content.split('/')
  if (content.length < 3 || content[0]!='4') return; // Syntax is 4/[board]/(query)
  args = content.filter(x=>{ return x != '' }) // Filter out empty args
  board = args[1]
  if (!boardList.includes(board)) return // Don't do anything on invalid Board
  query = args.slice(2).join(' ')
  api.queryRandom(board, query)
  .then( img =>{
    message.reply(img)
  }).catch( err => {
    message.reply(err)
  })
})

client.login(config.token)

