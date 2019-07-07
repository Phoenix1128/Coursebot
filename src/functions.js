/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const moment = require('moment-timezone');
const emoji = require('./emoji');

module.exports = (client) => {
  client.insertLevel = (message, args, cmd) => {
    setTimeout(() => {
      if (message.deleted) {
        return;
      }

      if (!args[0] || !args[1]) {
        return message.channel.send(`${emoji.redX} **Invalid Arguments!** Please check to see if the provided aruments are correct!\nProper Usage: \`${client.config.prefix}${cmd} [code] "[title]" "(description)" "(gameStyle)"\`\nEverything in () is optional but everything in [] is mandatory!\n**The quotes are very important so don't forget them!**`);
      }

      const code = args[0].toUpperCase();
      let title;
      let desc = ' ';
      let info = ' ';

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
        [title, desc, info] = newArgs;
      } else if (newArgs[0] && newArgs[1]) {
        [title, desc] = newArgs;
      } else if (newArgs[0]) {
        [title] = newArgs;
      } else {
        return message.channel.send(`${emoji.redX} **Invalid Arguments!** Please check to see if the provided aruments are correct!\nProper Usage: \`${client.config.prefix}${cmd} [code] "[title]" "(description)" "(gameStyle)"\`\nEverything in () is optional but everything in [] is mandatory! Remember to remove the brackets!\n**The quotes are very important so don't forget them!**`);
      }

      if (desc.length > 75) {
        desc = desc.slice(0, 75).concat('', '...');
      }
      if (title.length > 32) {
        title = title.slice(0, 32).concat('', '...');
      }

      if (code.length !== 11 || code.charAt(3) !== '-' || code.charAt(7) !== '-') {
        return message.channel.send(`${emoji.redX} **Invalid Code!** Please check to see if the code was typed correctly!`);
      }

      const timeSubmitted = moment().tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z');

      const data = {
        tag: message.author.tag,
        pfp: message.author.avatarURL,
        messageID: null,
        timestamp: timeSubmitted,
        course: {
          ID: code,
          title,
          description: desc,
          info,
          stars: 0,
        },
      };

      if (cmd === 'share') {
        client.levels.ensure('queue', []);
        client.levels.push('queue', data);

        client.levels.ensure('levelsDB', []);
        client.levels.push('levelsDB', data);

        const channel = client.channels.find(ch => ch.name === 'coursebot');
        return message.channel.send(`**${message.member.displayName},** I've added your level to the queue! You should see it posted in <#${channel.id}> shortly! (There is a 10 minute delay between levels)`);
      }

      if (cmd === 'submit') {
        client.levels.ensure('comp', []);
        client.levels.push('comp', data);

        return message.channel.send(`**${message.member.displayName},** you've successfully submitted your level for the current competition! Good luck!`);
      }
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
          pfp: 0,
          messageID: 0,
          course: {
            stars: 0,
          },
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

        if (collection === 'Comp') {
          const shorp = client.emojis.find(e => e.name === 'shorp');
          return message.channel.send(`Here are the submiited levels for the current competition!\n__**Please Note:**__ This may not be an updated list of the Competition collection as it's updated every hour. This ensures minimal connections to the database, helping to reduce the amount of emails I get from MongoDB telling me that I've exceeded the maximum connections they allow ${shorp}\n\n${result}`, { split: true });
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
