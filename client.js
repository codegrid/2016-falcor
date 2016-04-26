'use strict';

/*
Falcor Modelを経由して次のJSONGraph構造を操作できます。

{
  "entries": {
    "0": {
      "_id": <記事ID>,
      "title": <記事タイトル>,
      "body": <記事本文>,
      "authors": [
        ...
        {
          "_id": <著者ID>,
          "name" <著者名>
        }
      ]
      "tags": [...<タグ>],
      "remove": function() {}
    },
    ...,
    "legth": 6,
    "add": function() {}
  },
  "entriesById": {
    <記事ID>: {
      "_id": <記事ID>,
      "title": <記事タイトル>,
      "body": <記事本文>,
      "authors": [
        ...
        {
          "_id": <著者ID>,
          "name" <著者名>
        }
      ]
      "tags": [...<タグ>]
    },
    ...
  },
  "authorsById": {
    <著者ID>: {
      "_id": <著者ID>,
      "name": <著者名>
    }
  }
}
*/

const model = new falcor.Model({
  source: new falcor.HttpDataSource('/model.json')
});
