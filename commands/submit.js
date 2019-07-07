module.exports = {
  name: 'submit',
  category: 'courses',
  description: 'Submits your level for the current competition',
  aliases: ['sub'],
  usage: '[code] "[title]" "(description)" "(misc. info)"\nEverything in () is optional. Everything in [] is mandatory',
  args: '[code] => The course ID you wish to share, dashes included. Ex. XXX-XXX-XXX\n"[title]" => The title of the course\n"(description)" => The description of the course\n"(misc. info)" => Any other infomation you would like t include such as the game style of the course, the theme, or any tags. Please keep this field to a character minimum to visually improve the embeds.\n\nThe quotation marks are very important!',
  async run(client, message, args) {
    client.insertLevel(message, args, 'submit');
  },
};
