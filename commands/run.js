const emoji = require('../src/emoji');

module.exports = {
  name: 'run',
  category: 'courses',
  description: 'Running intervals',
  usage: '[option]',
  args: '[option] => level - runs the levels interval',
  modonly: true,
  async run(client, message, args, Discord) {
    if (args[0] === 'level') {
      const images = ['https://i.imgur.com/gtKlt8Z.jpg', 'https://i.imgur.com/zy93hBh.png', 'https://i.imgur.com/IMMfhc6.jpg'];
      const channel = client.channels.find(ch => ch.name === 'coursebot');
      client.queue.ensure(message.guild.id, []);

      message.channel.send('Started the levels interval!');

      setInterval(() => {
        if (client.queue.get(message.guild.id)[0]) {
          const num = Math.floor(Math.random() * images.length);

          const queueGet = client.queue.get(message.guild.id)[0];
          const { tag } = queueGet;
          const { pfp } = queueGet;
          const { timestamp } = queueGet;
          const { ID } = queueGet.course;
          const { title } = queueGet.course;
          const { description } = queueGet.course;
          const { gameStyle } = queueGet.course;

          const embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(tag, pfp)
            .setFooter(`Submitted ${timestamp}`)
            .setThumbnail(images[num]);

          if (gameStyle !== ' ') {
            embed.setTitle(`**${title}** [${gameStyle}]`);
          } else {
            embed.setTitle(`**${title}**`);
          }
          if (description !== ' ') {
            embed.setDescription(`*${description}*\nCourse ID: **${ID}**`);
          } else {
            embed.setDescription(`Course ID: **${ID}**`);
          }

          channel.send(embed).then((msg) => {
            msg.react(emoji.star);
            client.db.connect((error, db) => {
              if (error) {
                return console.error(error);
              }

              const collection = db.db('MM2').collection('Levels');
              const find = { course: { ID } };
              const newValue = { $set: { messageID: msg.id } };

              return collection.updateOne(find, newValue, (err, res) => {
                if (err) {
                  return console.error(err);
                }

                return console.log(`Successfully updated a message id! ${res.result}`);
              });
            });
          });

          client.queue.deleteProp(message.guild.id, queueGet);
        }
      }, 10000);
    } /* else if (args[0] === 'pins') {
      message.channel.send('Started the pins interval!');

      setInterval(() => {
        client.db.connect((error, db) => {
          if (error) {
            return console.error(error);
          }

          const collection = db.db('MM2').collection('Levels');
        });
      }, 10000);
    }
    */
  },
};
