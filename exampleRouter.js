'use strict';
const falcor = require('falcor');
const Router = require('falcor-router');
const entryDB = require('./db/entry');
const authorDB = require('./db/author');

const $ref = falcor.Model.ref;

const BaseRouter = Router.createClass([
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
    route: 'entriesById[{keys:ids}]["_id", "title", "body"]',
    get(pathSet) {
      const results = [];
      return Promise.all(pathSet.ids.map(id => {
        return Promise.resolve()
          .then(() => entryDB.init())
          .then(db => db.get(id))
          .then(doc => {
            const fields = pathSet[2];
            return fields.map(field => {
              results.push({
                path: ['entriesById', id, field],
                value: doc[field]
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
  }
]);

class AppRouter extends BaseRouter {
  constructor() {
    super();
  }
}

module.exports = AppRouter;
