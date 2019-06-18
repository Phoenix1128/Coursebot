const emoji = require('../src/emoji');

module.exports = {
  name: 'level',
  category: 'course',
  description: 'Everything that has to do with levels in CourseBot',
  aliases: ['lvl'],
  usage: '[option] [code]',
  args: '[option] => share - queues your level to be posted in #coursebot\n[code] => The course ID you wish to share, dashes included. Ex. XXXX-XXXX-XXXX',
  async run(client, message, args, Discord) {
    if (args[0] === 'share') {
      const code = args[1];
      const channel = client.channels.find(ch => ch.name === 'coursebot-dev');
      const images = ['https://i.imgur.com/gtKlt8Z.jpg', 'https://i.imgur.com/zy93hBh.png', 'https://i.imgur.com/IMMfhc6.jpg'];
      const queue = client.queue.ensure(message.guild.id, []);
      const data = {
        name: message.member.displayName,
        tag: message.author.tag,
        pfp: message.author.avatarURL,
        courseID: code,
      };

      queue.push(message.guild.id, data);
      console.log(queue);
      message.channel.send(`**${message.member.displayName},** I've added your level, \`${code}\`, to the queue! You should see it posted in <#${channel.id}> shortly! (There is a 10 minute delay between levels)`);

      client.db.connect((error) => {
        if (error) {
          console.error(`Could not connect to the db! Error: ${error}`);
        }

        const collection = client.db.db('MM2').collection('Levels');

        // eslint-disable-next-line no-unused-vars
        collection.insertOne(data, (err, res) => {
          if (err) {
            return console.error(err);
          }

          return console.log(`Added a level and data from **${message.author.tag}** to the db!`);
        });

        client.db.close();
      });

      setInterval(async () => {
        if (queue[0]) {
          const num = Math.floor(Math.random() * images.length);

          const embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(queue[0].tag, queue[0].pfp)
            .setTitle(`New course submitted by ${queue[0].name}!`)
            .setDescription(`Course ID: **${queue[0].courseID}**`)
            .setThumbnail(images[num]);

          const msg = await channel.send(embed);
          await msg.react(emoji.star);
        }
      }, 5000);
    }
  },
};
