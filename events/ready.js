module.exports = (client) => {
  client.user.setActivity(`SMM2 with ${client.users.size} makers`);

  // Logging a ready message on first boot
  console.log(`Ready to follow orders sir, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
};
