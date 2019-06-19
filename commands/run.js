const emoji = require('../src/emoji');

module.exports = {
  name: 'run',
  category: 'course',
  description: 'Running the interval to post courses',
  usage: '[option]',
  args: '[option] => levels - runs the levels interval',
  async run(client, message, args, Discord) {
    if (args[0] === 'levels') {
      const images = ['https://i.imgur.com/gtKlt8Z.jpg', 'https://i.imgur.com/zy93hBh.png', 'https://i.imgur.com/IMMfhc6.jpg'];
      const channel = client.channels.find(ch => ch.name === 'coursebot');
      client.queue.ensure(message.guild.id, []);

      message.channel.send('Started to run the levels interval!');

      setInterval(async () => {
        if (client.queue.get(message.guild.id)[0]) {
          const num = Math.floor(Math.random() * images.length);

          const queueGet = client.queue.get(message.guild.id)[0];
          const { name } = queueGet;
          const { tag } = queueGet;
          const { pfp } = queueGet;
          const { timestamp } = queueGet;
          const { courseID } = queueGet;

          const embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(tag, pfp)
            .setTitle(`New course submitted by ${name}!`)
            .setDescription(`Course ID: **${courseID}**`)
            .setFooter(`Submitted ${timestamp}`)
            .setThumbnail(images[num]);

          const msg = await channel.send(embed);
          await msg.react(emoji.star);

          client.queue.deleteProp(message.guild.id, queueGet);
        }
      }, 10000);
    }
  },
};
