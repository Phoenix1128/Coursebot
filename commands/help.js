/* eslint-disable no-useless-escape */
module.exports = {
  name: 'help',
  category: 'help',
  description: "Gives information on the bot's commands!",
  aliases: ['h'],
  usage: '[command name / category]',
  args: '[command name / category] => Any of the command names or categories listed in the help command',
  // eslint-disable-next-line consistent-return
  async run(client, message, args) {
    // Setting up stuff for dynamic help
    const data = [];
    const { commands } = client;
    const specify = args[0];
    const command = commands.get(specify)
      || commands.find(c => c.aliases && c.aliases.includes(specify));
    const { prefix } = client.guildConfig;

    function cmdCall(categ) {
      const filter = commands.filter(cmd => cmd.category === categ && cmd.enabled !== false && cmd.owneronly !== true).map(cmd => cmd.name).join('\`, \`');
      return filter;
    }

    const helpCmds = cmdCall('help');
    const systemCmds = cmdCall('system');

    const allCmds = `**Help:**\n\`${helpCmds}\`\n\n**System:**\n\`${systemCmds}\``;

    if (!specify) {
      message.channel.send(`**${client.user} Help:**\n\nUse \`${prefix}help [command name]\` to get more information on a command!\n\n${allCmds}\n\n*Be sure to ping or DM Phoenix#0408 for any questions, comments, or feedback!\nBot Version: ${client.version}*`);
    } else {
      // If above doesn't match args, display this
      if (!command) {
        return message.reply('Please specify a proper command!');
      }

      // Pushing the name of the command to the data array to be displayed later
      data.push(`**Command Name:** \n\`${command.name}\`\n`);

      // If the cmd has aliases, description, usage, or anything else push that to the data array
      if (command.aliases) {
        data.push(`**Aliases:** \n\`${command.aliases.join(', ')}\`\n`);
      }
      if (command.description) {
        data.push(`**Description:** \n\`${command.description}\`\n`);
      }
      if (command.usage) {
        data.push(`**Usage:** \n\`${prefix}${command.name} ${command.usage}\`\n`);
      }
      if (command.args) {
        data.push(`**Accepted Arguments:** \n\`${command.args}\`\n`);
      }
      if (command.modonly === true) {
        data.push('**Only Executable By Those With The Moderator Role!**\n');
      }
      if (command.enabled === false) {
        data.push('**This Command is Currently Disabled! Sorry for the Inconvenience!**');
      }

      return message.channel.send(data, { split: true });
    }
  },
};
