module.exports = {
  name: 'submit',
  category: 'courses',
  description: 'Submits your level for the weekly competition',
  aliases: ['sub'],
  usage: '[code] "[title]" "[description]" "[gameStyle]"',
  args: '[code] => The course ID you wish to share, dashes included. Ex. XXX-XXX-XXX\n"[title]" => The title of the course\n"[description]" => The description of the course\n"[gameStyle]" => The game style of the course. Ex. SMW, NSM3DW, etc.\n\nThe quotation marks are very important!',
  enabled: false,
  async run(client, message, args) {
    client.insertLevel(message, args, 'submit', 'Weekly-Comp');
  },
};
