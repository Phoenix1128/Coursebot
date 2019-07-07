module.exports = {
  name: 'clear',
  category: 'courses',
  description: 'Clears the specified collection of all its data',
  usage: '[comp|play]',
  args: '[comp|play] => Clear either the comp. levels collection or the collection made by staff for users to play',
  modonly: true,
  // eslint-disable-next-line consistent-return
  async run(client, message, args) {
    if (args[0] === 'comp') {
      client.collectionClear(message, 'Comp');
    } else if (args[0] === 'play') {
      client.collectionClear(message, 'Staff-Levels-(Play)');
    } else {
      // eslint-disable-next-line no-useless-escape
      return message.reply('Please specify which collection you would like to clear!\nOptions are: \`comp, play\`');
    }
  },
};
