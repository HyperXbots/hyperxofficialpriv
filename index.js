// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const colors = require("./colors.json")

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildMemberAdd", (member) => { // Check out previous chapter for information about this event
  let guild = member.guild; 
  let memberTag = member.user.tag; 
  if(guild.systemChannel ){
    guild.systemChannel.send(new Discord.RichEmbed() // Creating instance of Discord.RichEmbed
    .setTitle("A new user joined") // Calling method setTitle on constructor. 
    .setDescription(memberTag + " Has joined the server!🎉") // Setting embed description
    .setThumbnail(member.user.displayAvatarURL) // The image on the top right; method requires an url, not a path to file!
    .addField("⚡Members now", member.guild.memberCount) // Adds a field; First parameter is the title and the second is the value.
    .setTimestamp() // Sets a timestamp at the end of the embed
    );
  }
  
});

client.on('message', message => {
	if (message.content === '_server') {
		message.channel.send('```Guild name:``` ' + message.guild.name + '```\nTotal members:``` ' + message.guild.memberCount);
  }
})

client.on('message', message => {
	if (message.content === '_user-info') {
		message.channel.send('```Your username:``` ' + message.author.username + '```\nYour ID:``` ' + message.author.id);
  }
})

client.on("message", msg => {
  if (msg.content === "_rip") {
    msg.reply("https://i.imgur.com/w3duR07.png")
  }
})

client.on("message", msg => {
  if (msg.content === "_Hey") {
    msg.reply("```Hello!```")
  }
})

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("```Pong!```")
  }
})

client.on("message", msg => {
  if (msg.content === "_YouTube") {
    msg.reply("https://www.youtube.com/channel/UCxy8UduPwpyEZqqofF5VUuA?view_as=subscriber%27")
  }
})

client.on("message", msg => {
  if (msg.content === "_Twitch") {
    msg.reply("https://www.twitch.tv/ghostzoom49%27")
  }
})

client.on("message", msg => {
  if (msg.content === "_Link") {
    msg.reply("https://discord.gg/ZNVKduC%27")
  }
})

client.on("message", msg => {
  if (msg.content === "_Owners") {
    msg.reply("```Owner: @Handurov#7269```")
  }
})

client.on('messageDelete', async message => {
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;


	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	}	else {
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
	}
});

client.on('guildMemberRemove', async member => {
	const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const kickLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);

	// We now grab the user object of the person who kicked our member
	// Let us also grab the target of this action to double check things
	const { executor, target } = kickLog;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same kicked member
	if (target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
	} else {
		console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
	}
});

client.on('guildBanAdd', async (guild, user) => {
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const banLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!banLog) return console.log(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

	// We now grab the user object of the person who banned the user
	// Let us also grab the target of this action to double check things
	const { executor, target } = banLog;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same kicked member
	if (target.id === user.id) {
		console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty ${executor.tag}`);
	} else {
		console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
	}
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (message.content === '_react') {
    message.react('😄');
  }  

  if (message.content === '_fruits') {
    message.react('🍎');
    message.react('🍊');
    message.react('🍇');
  }

  const bannedWords = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
  try {
      if (bannedWords.some(word => message.content.toLowerCase().includes(word))) {
          if (message.author.id === message.guild.ownerID) return;
          await message.delete();
          await message.channel.send(`You cannot send invites to other Discord servers`);
      }
  } catch (e) {
      console.log(e);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  if (message.content === `_delete`) {
		try {
			const sentMessage = await message.channel.send('```This message will be deleted in 10 seconds.```');
			await sentMessage.delete({ timeout: 10000 });
		} catch (error) {
			// handle error
		}
	}
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Main Owner 👑", "Server Owners 👑", "", "Administrator 🔰", "Moderators 🔰", "Trainee Moderators 🔰", "Operators 🔨", "Trainee Operators 🔨"].includes(r.name)) )
      return message.reply("💣Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("```Please mention a valid member of this server```");
    if(!member.kickable) 
      return message.reply("```I cannot kick this user! Do they have a higher role? Do I have kick permissions?```");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "```No reason provided```";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`*** +${member.user.tag} HAS BEEN KICKED | +BY:${message.author.tag} |  +REASON: ${reason}  🆗***`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Main Owner 👑", "Server Owners 👑", "Co-Owner 💠", "Administrator 🔰"].includes(r.name)) )
      return message.reply("💣Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("```Please mention a valid member of this server```");
    if(!member.bannable) 
      return message.reply("```I cannot ban this user! Do they have a higher role? Do I have ban permissions?```");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "```No reason provided```";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`*** +${member.user.tag} HAS BEEN BANNED | +BY ${message.author.tag} | +REASON: ${reason}  🆗***`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("```Please provide a number between 2 and 100 for the number of messages to delete```");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply("```Couldn't delete messages because of: ${error}```"));
  }
});

client.login(config.token);