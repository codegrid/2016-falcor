'use strict';
const falcor = require('falcor');
const Router = require('falcor-router');
const entryDB = require('./db/entry');
const authorDB = require('./db/author');

const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;

function wait(ms) {
  return new Promise(done => setTimeout(done, ms));
}

const BaseRouter = Router.createClass([
  {
    route: 'entries.length',
    get() {
      return Promise.resolve()
        .then(() => entryDB.init())
        .then(db => db.allDocs({include_docs: true}))
        .then(res => ({
          path: ['entries', 'length'],
          value: res.rows.length
        }));
    }
  },
  {
    route: 'entries[{integers:indices}]',
    get(pathSet) {
      return Promise.resolve()
        .then(() => entryDB.init())
        .then(db => db.allDocs({include_docs: true}))
        .then(res => {
          const results = [];
          const indices = pathSet.indices;
          indices.forEach(index => {
            results.push({
              path: ['entries', index],
              value: $ref(['entriesById', res.rows[index].id])
            });
          });
          return results;
        });
    }
  },
  {
    route: 'entriesById[{keys:ids}]["_id", "title", "body", "tags"]',
    get(pathSet) {
      const results = [];
      return Promise.all(pathSet.ids.map(id => {
        return Promise.resolve()
          .then(() => wait(200))
          .then(() => entryDB.init())
          .then(db => db.get(id))
          .then(doc => {
            const fields = pathSet[2];
            let value;
            return fields.map(field => {
              value = doc[field];
              if (field === 'tags') {
                value = $atom(value);
              }
              results.push({
                path: ['entriesById', id, field],
                value: value
              });
            });
          });
      })).then(() => results);
    }
  },
  {
    route: 'entriesById[{keys:ids}]["authors"][{integers:indices}]',
    get(pathSet) {
      const results = [];
      return Promise.all(pathSet.ids.map(id => {
        return Promise.resolve()
          .then(() => entryDB.init())
          .then(db => db.get(id))
          .then(doc => {
            const indices = pathSet.indices;
            return indices.map(index => {
              results.push({
                path: ['entriesById', id, 'authors', index],
                value: $ref(['authorsById', doc.authors[index]])
              });
            });
          });
      })).then(() => results);
    }
  },
  {
    route: 'authorsById[{keys:ids}]["_id", "name"]',
    get(pathSet) {
      const results = [];
      return Promise.all(pathSet.ids.map(id => {
        return Promise.resolve()
          .then(() => wait(200))
          .then(() => authorDB.init())
          .then(db => db.get(id))
          .then(doc => {
            const fields = pathSet[2];
            return fields.map(field => {
              results.push({
                path: ['authorsById', id, field],
                value: doc[field]
              });
            });
          });
      })).then(() => results);
    }
  },
  {
    route: 'entriesById[{keys:ids}]["_id", "title", "body", "tags"]',
    set(jsonGraph) {
      const results = [];
      const ids = Object.keys(jsonGraph.entriesById);
      return Promise.resolve()
        .then(() => entryDB.init())
        .then(db => Promise.all(ids.map(id => {
          const newValues = jsonGraph.entriesById[id];
          return db.get(id)
            .then(doc => {
              Object.keys(newValues).forEach(field => {
                doc[field] = newValues[field];
              });
              return db.put(doc);
            })
            .then(() => {
              Object.keys(newValues).forEach(field => {
                results.push({
                  path: ['entriesById', id, field],
                  value: newValues[field]
                });
              });
            });
        }))).then(() => results);
    }
  },
  {
    route: 'authorsById[{keys:ids}]["_id", "name"]',
    set(jsonGraph) {
      const results = [];
      const ids = Object.keys(jsonGraph.authorsById);
      return Promise.resolve()
        .then(() => authorDB.init())
        .then(db => Promise.all(ids.map(id => {
          const newValues = jsonGraph.authorsById[id];
          return db.get(id)
            .then(doc => {
              Object.keys(newValues).forEach(field => {
                doc[field] = newValues[field];
              });
              return db.put(doc);
            })
            .then(() => {
              Object.keys(newValues).forEach(field => {
                results.push({
                  path: ['authorsById', id, field],
                  value: newValues[field]
                });
              });
            });
        }))).then(() => results);
    }
  },
  {
    route: 'entries.add',
    call(callPath, args) {
      const fetchDB = entryDB.init();
      const fetchLength = fetchDB.then(db => db.allDocs())
                                 .then(res => res.total_rows);
      const createEntries = fetchDB.then(db => db.bulkDocs(args));

      return Promise.all([fetchLength, createEntries]).then(values => {
        const beforeLength = values[0];
        const results = values[1];
        return results.map((result, index) => {
          return {
            path: ['entries', beforeLength + index],
            value: $ref(['entriesById', result.id])
          };
        });
      })
      .then(results => {
        results.push({
          path: ['entries'],
          invalidated: true
        });
        return results;
      })
      .catch(err => console.log(err.stack));
    }
  },
  {
    route: 'entriesById[{keys:ids}].remove',
    call(callPath) {
      const results = [];
      const ids = callPath.ids;
      const fetchDB = entryDB.init();
      const removingEntries = fetchDB.then(db => Promise.all(ids.map(id => {
        return db.get(id)
          .then(doc => db.remove(doc))
          .then(() => {
            results.push({
              path: ['entriesById', id],
              invalidated: true
            });
          });
      })))
      .catch(err => console.log(err.stack));

      return removingEntries.then(() => {
        results.push({
          path: ['entries'],
          invalidated: true
        });
        return results;
      })
      .catch(err => console.log(err.stack));
    }
  }
]);

class AppRouter extends BaseRouter {
  constructor() {
    super();
  }
}

module.exports = AppRouter;
