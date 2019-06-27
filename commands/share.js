module.exports = {
  name: 'share',
  category: 'courses',
  description: 'Queues your level to be posted in #coursebot',
  aliases: ['sh'],
  usage: '[code] "[title]" "(description)" "(gameStyle)"\nEverything in () is optional. Everything in [] is mandatory',
  args: '[code] => The course ID you wish to share, dashes included. Ex. XXX-XXX-XXX\n"[title]" => The title of the course\n"(description)" => The description of the course\n"(gameStyle)" => The game style of the course. Ex. SMW, NSM3DW, etc.\n\nThe quotation marks are very important!',
  async run(client, message, args) {
    client.insertLevel(message, args, 'share', 'Levels');
  },
};
