const moment = require('moment-timezone');

module.exports = {
  name: 'level',
  category: 'course',
  description: 'Everything that has to do with levels in CourseBot',
  aliases: ['lvl'],
  usage: '[option] [code]',
  args: '[option] => share - queues your level to be posted in #coursebot\n[code] => The course ID you wish to share, dashes included. Ex. XXXX-XXXX-XXXX',
  async run(client, message, args) {
    if (args[0] === 'share') {
      const code = args[1];
      const channel = client.channels.find(ch => ch.name === 'coursebot');
      const timeSubmitted = moment(Date.now()).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z');
      const data = {
        name: message.member.displayName,
        tag: message.author.tag,
        pfp: message.author.avatarURL,
        timestamp: timeSubmitted,
        courseID: code,
      };

      client.queue.ensure(message.guild.id, []);
      client.queue.push(message.guild.id, data);

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
      });
    }
  },
};
