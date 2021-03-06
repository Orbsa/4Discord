const Discord = require('discord.js')
const config = require('./conf/config.js')
const userHash= require('./modules/userHash')
const api = require('./modules/4chan')
const client = new Discord.Client()

// Get Board List on Startup
boardList = []
api.getBoardList().then(bL=> boardList= bL).catch(e=> console.log(e))
// Setup hash table for history
qHash= new userHash.queryHash();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.id
})

client.on('message', message => {
  if (!message.content.startsWith('4/') || message.author.bot) return;
  //const args = message.content.slice('/').split(/ +/);
  const content= message.content.split('/')
  if (content.length <3 ) { // If possible command (e.g. 4/help || 4/reroll)
    if(content[1] == '' || content[1] == '?') printHelp(message)
    if(content[1] == 'reroll') reroll(message)
    return;
  }

  args = content.filter(x=>{ return x != '' }) // Filter out empty args from split
  boardCode = args[1].toLowerCase()
  board = null
  boardList.forEach(b => {
    if(b.board === boardCode) board=b
  })
  if (!board) return // Don't do anything on invalid Board
  spoiler = false
  if (message.channel.nsfw && !board.ws_board) spoiler = true // Spoiler nsfw content on sfw channel
  query = args.slice(2).join(' ')
  if (query == '') query = null
  api.queryRandom(boardCode, query)
  .then( img =>{
    message.reply(img).then( rep => {
      // Add reply to qHash
      qHash.put(message.author.id, [boardCode , query], rep) // TODO: Add source here
      console.log(message.author.username + ' - ' + message.content)
      console.log(img)
    })
  }).catch( err => {
    message.reply(err)
  })
})

// Reaction Handler to check for reroll reactions
client.on('messageReactionAdd', (messageReaction, user) =>{
  if(messageReaction.message.content != '4/reroll') return
  if(user.id != messageReaction.message.author.id) return
  reroll(messageReaction.message)
})

function printHelp(message){
  message.channel.send("\n__Usage__:\n \
    **4/*[board]*/*(query)*** - If a query is not included, grab random image from board\n \
    **4/reroll** - Rerolls the last query you made \
    ")
}

function reroll(message){
  let lastRep = qHash.get(message.author.id)
  if (lastRep === null){
    console.log(`User: ${message.author.username} Attempted to grab empty item from qHash`)
    return
  }
  api.queryRandom(lastRep.query[0], lastRep.query[1]).then( img => {
    lastRep.message.edit(img)
  }).catch( err =>
    message.reply(err)
  )
}

console.log('Connecting...');
client.login(config.token)
