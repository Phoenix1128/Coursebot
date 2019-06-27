// eslint-disable-next-line no-unused-vars
module.exports = (client, reaction, user) => {
  if (reaction.message.channel.name === 'coursebot') {
    client.db.connect((error, db) => {
      if (error) {
        return console.error(error);
      }

      const collection = db.db('MM2').collection('Levels');
      const find = { messageID: reaction.message.id };
      const newValue = { $inc: { stars: 1 } };

      return collection.updateOne(find, newValue, (err, res) => {
        if (err) {
          return console.error(err);
        }

        return console.log(`Updated a document's star count! ${res.result}`);
      });
    });
  }
};
