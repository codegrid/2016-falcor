'use strict';

function log(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

const model = new falcor.Model({
  cache: {
    "dummyError": {
      "$type": "error",
      "value": "エラーデス！！"
    },
    "recentEntries": {
      "0": { "$type": "ref", "value": ["entriesById", "display-grid-1"] },
      "1": { "$type": "ref", "value": ["entriesById", "devfest-asia-1"] },
      "2": { "$type": "ref", "value": ["entriesById", "2015-dev-camp-yomotsu"] },
      "length": 3
    },
    "suggestEntries": {
      "0": { "$type": "ref", "value": ["entriesById", "2015-dev-camp-yomotsu"] },
      "1": { "$type": "ref", "value": ["entriesById", "display-grid-1"] },
      "2": { "$type": "ref", "value": ["entriesById", "devfest-asia-1"] },
      "length": 3
    },
    "authors": {
      "0": { "$type": "ref", "value": ["authorsById", "geckotang"] },
      "1": { "$type": "ref", "value": ["authorsById", "nakajmg"] },
      "2": { "$type": "ref", "value": ["authorsById", "yomotsu"] },
      "length": 3
    },
    "entriesById": {
      "display-grid-1": {
        "title": "Grid Layout Moduleの概要",
        "body": "筆者とdisplay:grid;の出会いは、この記事が書かれる4年前の2012年3月頃になります。...",
        "authors": {
          "0": {
            "$type": "ref",
            "value": ["authorsById", "geckotang"]
          },
          "length": 1
        },
        "tags": {
          "$type": "atom",
          "value": ["css"]
        }
      },
      "devfest-asia-1": {
        "title": "DevFest.Asiaとは",
        "body": "DevFest.Asiaは、シンガポールで開催された、開発者のお祭りです。...",
        "authors": {
          "0": {
            "$type": "ref",
            "value": ["authorsById", "nakajmg"]
          },
          "length": 1
        },
        "tags": {
          "$type": "atom",
          "value": ["css", "javascript", "conference"]
        }
      },
      "2015-dev-camp-yomotsu": {
        "title": "MMOゲームを作る",
        "body": "10月初旬にピクセルグリッドの開発合宿*が、参加者8名で行われました。...",
        "authors": {
          "0": {
            "$type": "ref",
            "value": ["authorsById", "yomotsu"]
          },
          "length": 1
        },
        "tags": {
          "$type": "atom",
          "value": ["javascript", "webgl"]
        }
      }
    },
    "authorsById": {
      "geckotang": {
        "name": "坂巻 翔大郎",
        "kana": "さかまき しょうたろう"
      },
      "nakajmg": {
        "name": "中島 直博",
        "kana": "なかじま なおひろ"
      },
      "yomotsu": {
        "name": "小山田 晃浩",
        "kana": "おやまだ あきひろ"
      }
    }
  }
});

/*
  Reference型の値を取得する例
*/

// recentEntries.0.titleを取得。
// Reference型を使った参照を読み取って、entriesById['display-grid-1']の値を返します。
//
// model.get(['recentEntries', 0, 'title']).then(log);

// recentEntries.0.authors.0のnameとkanaを取得。
//
// Reference型で参照される先でさらにReferenceを使って別のパスを参照することもできます。
// recentEntriesからentriesByIdへ、その中のauthorsからさらにauthorsByIdへ参照が続いています。
//
// model.get(['recentEntries', 0, 'authors', 0, ['name', 'kana']]).then(log);

/*
  Atom型の値を取得する例
*/

// recentEntries.1.tagsを取得。
// Atom型を使用することで配列やオブジェクトを返すこともできます。
//
// model.get(['recentEntries', 1, 'tags']).then(log);

/*
  Error型の値が返ってくる例
*/

// model.get(['dummyError'])
//   .then()
//   .catch(log);
