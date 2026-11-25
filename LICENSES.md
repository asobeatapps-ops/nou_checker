# 素材・ライブラリのライセンス

## Three.js 0.180.0

- 取得元：https://github.com/mrdoob/three.js/tree/r180
- npm：`three@0.180.0`（package-lock.jsonで固定）
- ライセンス：MIT。商用利用・配布・改変が可能です。
- 同梱：`vendor/three.module.min.js`、`vendor/three.core.min.js`
- ライセンス全文：`vendor/THREE-LICENSE.txt`
- 著作権表示：Copyright © 2010–2025 three.js authors

CDNから読み込まず、公開用静的ファイルに同梱しています。

## 本プロジェクトのオリジナル素材

脳のメッシュ形状・脳溝、ホログラム用シェーダー、HUDリング、Canvasフォールバック、UI、アイコン、VFX、Web AudioのBGM／効果音、結果画像レイアウト、OGP画像は、このゲーム用に制作したオリジナル実装です。第三者の3Dモデル、ストック画像、既存ゲームの音源は使用していません。OGP画像も本ゲームで生成した3D脳から制作しています。

日本語フォントは端末に搭載されたシステムフォントを利用し、フォントデータは再配布しません。名前や結果を外部の画像生成APIへ送信しません。

## 開発・テスト専用

Playwright 1.62.1（Apache-2.0）を開発依存に使用します。`node_modules`、ブラウザバイナリ、テスト専用の取得例・スクリーンショットは公開実行に必要ありません。公開用ZIPにこれらの依存ディレクトリは含めません。
