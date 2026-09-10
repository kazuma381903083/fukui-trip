# ふくい、余白の三日間。

2026年9月21日〜23日の福井旅行のデジタルしおり。GitHub Pages用の静的サイトです。

公開先：https://kazuma381903083.github.io/fukui-trip/

## 内容

- スマートフォン対応の3日間の旅程と、日本時間に基づく次の予定
- 15か所の施設・交通案内、Google マップの経路、電話リンク
- 予約済み・未予約・調整中の区別、原稿に基づく費用・混雑時の対応
- 端末内に保存する準備チェックとメモ、テキスト書き出し
- ホーム画面への追加と、初回保存完了後のオフライン閲覧
- 印刷表示、キーボード操作、動きを減らす設定への対応

## 原稿と更新

`shiorimemo.md` が正本です。原稿を変更した後にビルドすると、時間割・施設詳細・準備リスト・予算が更新されます。見出し名とMarkdown表の構造は維持してください。施設の予約状況などの短い表示は `scripts/build.py` の `place_defs` も更新してください。新しい場所を追加する場合は同じファイルの対応表を修正します。

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-build.txt
.venv/bin/python scripts/build.py
.venv/bin/python scripts/check.py
python3 -m http.server 4173
```

`http://localhost:4173` で表示できます。実行時のライブラリや外部フォントへの依存はありません。チェック・メモはlocalStorageに保存され、端末間で同期しません。

## 公開

GitHubリポジトリの Settings → Pages → Source を **GitHub Actions** にします。`main` へのpushで `.github/workflows/pages.yml` が原稿から再生成・検証し、配信用ファイルだけを公開します。

`shiorimemo.md`、制作スクリプト、READMEはPagesの配信対象外です。ただしこのリポジトリ自体が公開設定のため、ここに予約番号、チケットQRコード、認証情報をコミットしないでください。`noindex` は閲覧制限ではありません。

ビルド時に配信ファイルのハッシュでService Workerのバージョンが変わります。更新版はオンラインで開いた際に保存され、次の再読み込みで表示されます。キャッシュ削除の対象はこの旅行の名前で始まるものに限定し、前回の旅行ページの保存領域には触れません。

## 写真

東尋坊・永平寺の実景写真：雷太 / Wikimedia Commons / CC BY 2.0。画像は縮小・WebP変換済み。原典・ライセンス・変更内容は `credits.html` に記載しています。

## 検証

`python scripts/check.py` はリンク先ID、ローカル画像、日程の固定時刻、未予約の表示、予算、オフライン対象ファイルを確認します。公開前にはChromiumでスマホ・PC表示、日程切り替え、保存、オフライン再読み込みを検証しています。
