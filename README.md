# CodeGrid Falcor DEMO

[CodeGrid](https://app.codegrid.net/)の「[Falcorで実現する効率的なfetch](https://app.codegrid.net/series/2016-falcor)」シリーズに関連したサンプルコードです。

## 使い方

記事内の案内にブランチをチェックアウトして、`npm install`と`npm start`を実行します。  
ローカルでWebサーバーが立ち上がるのでこれをChromeなどのブラウザで開いてください。

```sh
git checkout <branch>
npm install
npm start
# and open http://localhost:3000
```

ポート指定をすることもできます。

```sh
env PORT=3333 npm start
```

## 各ブランチについて

### jsongraphブランチ

[第2回 JSON Graph](https://app.codegrid.net/entry/falcor-2)の内容に対応したブランチです。

このブランチをチェックアウトして`npm install`（まだしていなければ）、`npm start`でローカルのWebサーバーが立ち上がります。

```sh
git checkout jsongraph
npm install
npm start
```

`client.js`に、キャッシュを持った状態で初期化したFalcor Modelインスタンスと、コメントアウトした状態の`model.get(...)`のサンプルコードが置いてあります。

これらのコメントを外してブラウザのコンソールで結果を確認したり、自分でコードを書き換えて動かしてみてください。

### falcor-clientブランチ

[第3回](https://app.codegrid.net/entry/falcor-3)の内容に対応したブランチです。

このブランチをチェックアウトして`npm install`（まだしていなければ）、`npm start`でローカルのWebサーバーが立ち上がります。

```sh
git checkout falcor-client
npm install
npm start
```
