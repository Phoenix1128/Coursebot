const Discord = require('discord.js');
const emoji = require('../src/emoji');

module.exports = (client) => {
  client.user.setActivity(`SMM2 with ${client.users.size} makers`);

  const images = ['https://i.imgur.com/gtKlt8Z.jpg', 'https://i.imgur.com/zy93hBh.png', 'https://i.imgur.com/IMMfhc6.jpg'];
  const channel = client.channels.find(ch => ch.name === 'coursebot');
  client.levels.ensure('queue', []);

  console.log('Started the queue interval!');
  setInterval(async () => {
    if (client.levels.get('queue')[0]) {
      const num = Math.floor(Math.random() * images.length);

      const queueGet = client.levels.get('queue')[0];
      const { tag } = queueGet;
      const { pfp } = queueGet;
      const { timestamp } = queueGet;
      const { ID } = queueGet.course;
      const { title } = queueGet.course;
      const { description } = queueGet.course;
      const { info } = queueGet.course;

      const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setAuthor(tag, pfp)
        .setFooter(`Submitted ${timestamp}`)
        .setThumbnail(images[num]);

      if (info !== ' ') {
        embed.setTitle(`**${title}** [${info}]`);
      } else {
        embed.setTitle(`**${title}**`);
      }
      if (description !== ' ') {
        embed.setDescription(`*${description}*\n\nCourse ID: **${ID}**`);
      } else {
        embed.setDescription(`Course ID: **${ID}**`);
      }

      const msg = await channel.send(embed);
      await msg.react(emoji.star);

      client.levels.deleteProp('queue', queueGet);
    }
  }, 600000);

  console.log('Started the db interval!');
  // eslint-disable-next-line consistent-return
  client.db.connect((error, db) => {
    if (error) {
      return console.error(error);
    }

    setInterval(() => {
      client.levels.ensure('levelsDB', []);
      client.levels.ensure('comp', []);

      const levelsQGet = client.levels.get('levelsDB');
      const levelsCGet = client.levels.get('comp');

      const courseDB = db.db('MM2').collection('Levels');
      const compDB = db.db('MM2').collection('Comp');

      if (levelsQGet[0]) {
        courseDB.insertMany(levelsQGet, (err, res) => {
          if (err) {
            return console.error(err);
          }

          client.levels.delete('levelsDB');

          return console.log(`Added ${res.insertedCount} levels and data from to the db!`);
        });
      }

      if (levelsCGet[0]) {
        compDB.insertMany(levelsCGet, (err, res) => {
          if (err) {
            return console.error(err);
          }

          client.levels.delete('comp');

          return console.log(`Added ${res.insertedCount} levels to the comp db`);
        });
      }
    }, 3600000);
  });

  // Logging a ready message on first boot
  console.log(`Ready to follow orders sir, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
};
