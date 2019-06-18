/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable consistent-return */

// Bot Version 0.1.0

// Standard importing modules and crap
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Defining client and config
const client = new Discord.Client();
client.config = require('./config.json');

// Defining and attaching the db to the client
const db = new MongoClient(client.config.dbUrl, { useNewUrlParser: true });
client.db = db;

// Attaching the bot version to the client so it can be used anywhere
const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
client.version = `v${version}`;

// Reading and doing stuff to make events work
fs.readdir('./events/', (err, files) => {
  if (err) {
    return console.error(err);
  }
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

// Setting up an Enmap for commands
client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
  if (err) {
    return console.error(err);
  }
  files.forEach((file) => {
    if (!file.endsWith('.js')) {
      return;
    }
    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

// Intializing the Settings Enmap
client.settings = new Enmap({
  name: 'settings',
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep',
});

// Setting up default configurations
client.defaultSettings = {
  prefix: 'c!',
  modrole: 'Moderator',
};

// Creating the queue for levels
client.queue = new Enmap({ name: 'queue' });

// Handling errors
client.on('error', console.error);

// Logging into the client with the token hidden in config.json
client.login(client.config.token);
