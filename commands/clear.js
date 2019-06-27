module.exports = {
  name: 'clear',
  category: 'courses',
  description: 'Clears the specified collection of all its data',
  usage: '[weekly|play]',
  args: '[weekly|play] => Clear either the weekly comp. levels collection or the collection made by staff for users to play',
  modonly: true,
  // eslint-disable-next-line consistent-return
  async run(client, message, args) {
    if (args[0] === 'weekly') {
      client.collectionClear(message, 'Weekly-Comp');
    } else if (args[0] === 'play') {
      client.collectionClear(message, 'Staff-Levels-(Play)');
    } else {
      // eslint-disable-next-line no-useless-escape
      return message.reply('Please specify which collection you would like to clear!\nOptions are: \`weekly, play\`');
    }
  },
};
