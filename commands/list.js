module.exports = {
  name: 'list',
  category: 'courses',
  description: 'Lists courses stored in the database',
  aliases: ['lvl'],
  usage: '[comp|play]',
  args: '[comp|play] => List either the comp. levels collection or the collection made by staff for users to play',
  // eslint-disable-next-line consistent-return
  async run(client, message, args) {
    if (args[0] === 'comp') {
      client.collectionFind(message, 'Comp');
    } else if (args[0] === 'play') {
      client.collectionFind(message, 'Staff-Levels-(Play)');
    } else {
      // eslint-disable-next-line no-useless-escape
      return message.reply('Please specify which collection you would like to list!\nOptions are: \`comp, play\`');
    }
  },
};
