/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const moment = require('moment-timezone');
const emoji = require('./emoji');

module.exports = (client) => {
  client.insertLevel = (message, args, cmd, collection) => {
    setTimeout(() => {
      if (message.deleted) {
        return;
      }

      let code;
      let title;
      let desc = ' ';
      let gameStyle = ' ';

      if (!args[0] || !args[1]) {
        return message.channel.send(`${emoji.redX} **Invalid Arguments!** Please check to see if the provided aruments are correct!\nProper Usage: \`${client.config.prefix}${cmd} [code] "[title]" "(description)" "(gameStyle)"\`\nEverything in () is optional but everything in [] is mandatory!\n**The quotes are very important so don't forget them!**`);
      }

      let levelArgs = args.slice(1).join(' ');
      if (message.content.includes('“') || message.content.includes('”')) {
        levelArgs = levelArgs.replace(/“/gi, '"');
        levelArgs = levelArgs.replace(/”/gi, '"');
      }
      const regex = levelArgs.match(/[^\s"]+|"([^"]*)"/g).join('').split('"');

      const newArgs = [];

      for (let i = 0; i < regex.length; i++) {
        if (regex[i] !== '') {
          newArgs.push(regex[i]);
        }
      }

      if (newArgs[0] && newArgs[1] && newArgs[2]) {
        [title, desc] = newArgs;
        gameStyle = newArgs[2].toUpperCase();

        if (desc.length > 99 || title.length > 29) {
          return message.channel.send(`${emoji.redX} **A value is too long!** Please shorten one of the values provided!\n**Titles** can be **up to 30 characters!**\n**Descriptions** can be **up to 100 characters!**`);
        }
      } else if (newArgs[0] && newArgs[1]) {
        [title, desc] = newArgs;
      } else if (!newArgs[0]) {
        return message.channel.send(`${emoji.redX} **Invalid Arguments!** Please check to see if the provided aruments are correct!\nProper Usage: \`${client.config.prefix}${cmd} [code] "[title]" "(description)" "(gameStyle)"\`\nEverything in () is optional but everything in [] is mandatory!\n**The quotes are very important so don't forget them!**`);
      } else {
        [title] = newArgs;
      }

      if (args[0]) {
        code = args[0].toUpperCase();

        if (code.length !== 11 || code.charAt(3) !== '-' || code.charAt(7) !== '-') {
          return message.channel.send(`${emoji.redX} **Invalid Code!** Please check to see if the code was typed correctly!`);
        }
      } else {
        // eslint-disable-next-line no-useless-escape
        return message.reply('You did not supply any arguments! Please refer to \`c!help\` for more information!');
      }

      const timeSubmitted = moment(Date.now()).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z');

      const data = {
        tag: message.author.tag,
        pfp: message.author.avatarURL,
        messageID: null,
        timestamp: timeSubmitted,
        course: {
          ID: code,
          title,
          description: desc,
          gameStyle,
          stars: 0,
        },
      };

      if (cmd === 'share') {
        client.queue.ensure(message.guild.id, []);
        client.queue.push(message.guild.id, data);
      }

      client.db.connect((error, db) => {
        if (error) {
          return console.error(error);
        }

        const courseDB = db.db('MM2').collection(collection);

        courseDB.insertOne(data, (err, res) => {
          if (err) {
            return console.error(err);
          }

          if (cmd === 'share') {
            const channel = client.channels.find(ch => ch.name === 'coursebot');
            message.channel.send(`**${message.member.displayName},** I've added your level to the queue! You should see it posted in <#${channel.id}> shortly! (There is a 10 minute delay between levels)`);
          }
          if (cmd === 'submit') {
            message.channel.send(`**${message.member.displayName},** you've successfully submitted your level for the current competition! Good luck!`);
          }
          return console.log(`Added a level and data from **${message.author.tag}** to the db! Data: ${res}`);
        });
      });
    }, 2000);
  };

  client.collectionFind = (message, collection) => {
    client.db.connect((error, db) => {
      if (error) {
        return console.error(error);
      }

      const courseDB = db.db('MM2').collection(collection);

      courseDB.find({}, {
        projection: {
          _id: 0,
          name: 0,
          pfp: 0,
          messageID: 0,
        },
      }).toArray((err, res) => {
        if (err) {
          return console.error(err);
        }

        let result = [];
        for (let i = 0; i < res.length; i++) {
          const mappedKeys = Object.keys(res[i]).map(props => `**${props}** : ${res[i][props]}`).join('\n').split('[')[0];

          const mappedCourse = Object.keys(res[i].course).map(prop => `       **${prop}** : ${res[i].course[prop]}`).join('\n');
          result.push(`${mappedKeys}\n${mappedCourse}`);
        }

        if (!result[0]) {
          return message.channel.send(`${emoji.redX} **No Levels!** No levels have been submitted yet!`);
        }

        result = result.join('\n\n');

        if (collection === 'Weekly-Comp') {
          return message.channel.send(`Here are the submiited levels for the current competition!\n\n${result}`, { split: true });
        }
        if (collection === 'Staff-Levels-(Play)') {
          return message.channel.send(`Here are the submiited levels from the staff!\n\n${result}`, { split: true });
        }
      });
    });
  };

  client.collectionClear = (message, collection) => {
    client.db.connect((error, db) => {
      if (error) {
        return console.error(error);
      }

      const courseDB = db.db('MM2').collection(collection);

      courseDB.deleteMany({}).then(res => message.channel.send(`${emoji.checkMark} **Success!** I've successfully cleared the **${collection} collection** of all it's data! (${res.deletedCount} documents deleted)`));
    });
  };
};
