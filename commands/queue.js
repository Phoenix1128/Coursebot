/* eslint-disable no-loop-func */
const emoji = require('../src/emoji');

module.exports = {
  name: 'queue',
  category: 'course',
  description: 'Shows the queue',
  usage: ' ',
  enabled: false,
  // eslint-disable-next-line no-unused-vars
  async run(client, message, args) {
    client.queue.ensure(message.guild.id, []);
    const queue = client.queue.get(message.guild.id);

    let result = [];
    for (let i = 0; i < queue.length; i++) {
      const mappedKeys = Object.keys(queue[i]).map(props => `**${props}** : ${queue[i][props]}`).join('\n')
        .split('[')[0];

      const mappedCourse = Object.keys(queue[i].course).map(prop => `       **${prop}** : ${queue[i].course[prop]}`).join('\n');
      result.push(`${mappedKeys}\n${mappedCourse}`);
    }

    if (!result[0]) {
      return message.channel.send(`${emoji.redX} **No Levels!** No levels were found in the queue!`);
    }

    result = result.join('\n\n');
    return message.channel.send(`Here is the current queue!\n\n${result}`, { split: true });
  },
};
