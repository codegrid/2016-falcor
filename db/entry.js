'use strict';
const PouchDB = require('pouchdb');
const fs = require('fs');
const path = require('path');

const db = new PouchDB('entry', {db: require('memdown')});
let initialized = false;

module.exports = {
  init() {
    if (initialized) {
      return Promise.resolve(db);
    }
    const fixturePath = path.resolve(path.join(__dirname, '..', 'fixture', 'entries.json'));
    const entriesJSON = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    return db.bulkDocs(entriesJSON).then(() => {
      initialized = true;
      return db;
    });
  }
};
