# nextjs-blog

## 概要
- フレームワークとしてNext.jsを使用し、  
typescriptを使ってコーディングした初めての個人製作ブログです。
- 記事の管理にはCMSは使用せず、  
別リポジトリ([blog-api](https://github.com/Kazoo1122/blog-api))にて作成したAPIサーバーから記事を取得し表示させています。

## デモ(実際のページ)
- [レジ打ちからエンジニアになりました 〜中途エンジニアの開発日誌〜](https://dev-learning.net/)


## 使用ライブラリ  
- `next` `react` `react-dom`: Next.jsのために使用。
- `prismjs` `react-icons` `github-markdown-css`  
  `@mui/material` `@mui/styles`  
  `@emotion/react` `@emotion/styled`: 装飾用。
- `next-auth`: 管理画面の認証用。
- `axios`: HTTPクライアント。
- `react-hook-form`: お問い合わせフォームおよび記事投稿フォームで使用。
- `react-dropzone`: 記事投稿フォームで使用(管理画面のみ)  
- `swr`: 無限記事読み込みのために使用。(useSWRInfinite)

## 作者
Kazoo1122  
Email: [kazoo1122@interest-tree.com](kazoo1122@interest-tree.com)
