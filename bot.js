const Eris = require('eris')
const client = new Eris(require('./json/config.json').token)

const util = require('util')
const fs = require('fs')

var guilds_list = require('./json/guilds.json')
var commands = {}

function Helper(prefix) {
  this.prefix = prefix
  this.log = (message, text) => {
    require('util').log(`${message.guild.id}/${message.guild.name}: ${text}`)
  }
  this.error = text => {
    return `:octagonal_sign: ${text}`
  }
}

var write_obj = function(object_to, callback) {
  fs.writeFile('./json/guilds.json', JSON.stringify(object_to), err => {
    if (err) util.log(err)
    callback();
  })
}

client.on('ready', () => {
  fs.readdir('./commands/', (err, files) => {
    if (err) util.log(err)
    for (file of files) {
      commands[file.slice(0, -3)] = require(`./commands/${file}`)
    }
    util.log('commands loaded.')
  })
  util.log('listen-bot ready.')
})

client.on('guildCreate', guild => {
  util.log(`${guild.id}/${guild.name}: joined guild`)

  util.log('  creating guild object')
  guilds_list[guild.id] = {
    "name": guild.name,
    "prefix": "L!",
    "starboard": 'none',
    "starboard_emoji": "⭐"
  }

  write_obj(guilds_list, () => {
    util.log('  wrote new guild config successfully')
  })
})

client.on('guildUpdate', guild => {
  util.log(`${guild.id}/${guild.name}: guild updated, modifying name`)
  guilds_list[guild.id].name = guild.name
  write_obj(guilds_list, () => {
    util.log('  wrote new guild config successfully')
  })
})

client.on('guildDelete', guild => {
  util.log(`${guild.id}/${guild.name}: left guild`)
  delete guilds_list[guild.id]
  
  write_obj(guilds_list, () => {
    util.log('  removed guild successfully')
  })
})

client.on('messageCreate', message => {
  _prefix = guilds_list[message.guild.id].prefix

  if (message.author.id == client.user.id) return
  if (!message.content.startsWith(_prefix)) return

  message.content = message.content.replace(_prefix, "").trim();

  const command = message.content.split(' ').shift().toLowerCase()
  if (command in commands) {
    commands[command](message, client, new Helper(_prefix))
  } else {
    util.log(`${message.guild.id}/${message.guild.name}: malformed command used`)
  }
})

client.connect()