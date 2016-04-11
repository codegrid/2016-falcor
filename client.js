'use strict';

function jLog(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

var model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});

// model.get('greeting').then(function(res) {
//   console.log(res);
// });
//
// model.get(['sample', 0, 'name']).then(function(res) {
//   console.log(res);
// });

model.get(
  ['entries', {length: 2}, ['title']],
  ['entries', {length: 2}, 'authors', 0, ['name']]
).then(res => {
  jLog(res);
  model.get(['entries', 0, ['title', 'body']]).then(res => {
    jLog(res);
    jLog(model.getCache());
  });
});
