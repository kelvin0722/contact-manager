const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert');
mongoose.Promise = global.Promise;

//connect to a single MongoDB instance
const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
const uris = 'mongodb://localhost:27017/contact-manager';
const db = mongoose.connect(uris, options);

const toLower = v => v.toLowerCase();

// define a contact Schema
const contactSchema = mongoose.Schema({
  firstname: { type: String, set: toLower },
  lastname: { type: String, set: toLower },
  phone: { type: String, set: toLower },
  email: { type: String, set: toLower }
});

// Define model as interface with the database
const Contact = mongoose.model('Contact', contactSchema);

/**
 * @function [addContact]
 * @param {Object} contact - The contact object to be inserted in the database
 * @returns {String}
 */
const addContact = contact => {
  Contact.create(contact, err => {
    assert.equal(null, err);
    console.info('New contact added');
    db.disconnect()
  });
};

/**
 * @function [getContact]
 * @param {String} name
 * @returns {Json} contacts - Return contact as Json
 */
const getContact = name => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  Contact.find({ $or: [{ firstname: search }, { lastname: search }] }).exec(
    (err, contact) => {
      assert.equal(null, err);
      console.info(contact);
      console.info(`${contact.length} matches`);
      db.disconnect();
    }
  );
};

module.exports = { addContact, getContact };
