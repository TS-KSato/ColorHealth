# 企業色相環（Corporate Color Wheel）

<div align="center">
  <img src="assets/images/logo-placeholder.png" alt="企業色相環ロゴ" width="200"/>
  <p>企業を多次元で理解するための新しい視覚化ツール</p>
</div>

## 📊 プロジェクト概要

「企業色相環」は、企業の複雑な特性を直感的に理解するための新しい視覚化アプローチを提供する静的ウェブサイトです。従来の単一軸（良い・悪い）や財務指標に偏った企業評価を超え、企業の多面的な特性を「色相環」として、健全経営度を「白黒グラデーション」として表現します。

個人投資家、特に初心者から中級者の方々が、数値だけでは見えない企業の特性を把握できるように設計されています。

### 🔍 [デモサイトはこちら](https://yourusername.github.io/corporate-color-wheel/)

![サイトプレビュー](assets/images/preview-placeholder.png)

## ✨ 主な特徴

- **色相環表示**: 6つの次元（変革性、安定性、社会性、自律性、伝統性、国際性）を色相環で視覚化
- **健全度評価**: 企業の健全経営度を白（健全）〜黒（不健全）のグラデーションで表現
- **時系列表示**: 四半期ごとの変化を追跡可能
- **透明性重視**: すべての計算方法と情報源を明記
- **モバイル対応**: スマートフォンでも快適に利用可能

## 🎨 色相環の6つの次元

| 色相 | 次元 | 内容 |
|------|------|------|
| 🔴 赤 | **変革性** | 革新への投資、チャレンジ精神、変化への適応力 |
| 🔵 青 | **安定性** | 財務健全性、持続可能な経営、リスク管理能力 |
| 🟢 緑 | **社会性** | 環境配慮、社会貢献、ステークホルダーとの関係 |
| 🟡 黄 | **自律性** | 個の尊重、創造性、柔軟な組織文化 |
| 🟣 紫 | **伝統性** | 歴史・伝統の尊重、専門性の深さ、ブランド力 |
| 🟠 橙 | **国際性** | グローバル展開、多様性受容、異文化適応力 |

## 🛠️ 使用技術

- HTML5
- CSS3 (Flexbox/Grid)
- JavaScript (ES6+)
- Canvas API
- 静的JSON

**外部依存性**: なし（純粋なバニラJavaScriptで実装）

## 🚀 セットアップ方法

このプロジェクトは静的HTMLサイトなので、特別なビルドプロセスは必要ありません。

1. リポジトリをクローン
   ```
   git clone https://github.com/yourusername/corporate-color-wheel.git
   ```

2. お好みのウェブサーバーでホスティング
   - ローカル開発: VSCodeのLive Serverなど
   - 本番環境: GitHub Pages（推奨）

3. GitHub Pagesへのデプロイ
   ```
   git push origin main
   ```
   ※ リポジトリ設定でGitHub Pagesを有効にしてください

## 📁 プロジェクト構造

```
corporate-color-wheel/
├── index.html              # トップページ
├── about.html              # サイト説明ページ
├── methodology.html        # 計算方法解説ページ
├── companies.html          # 企業一覧ページ
├── company.html            # 個別企業表示ページ
├── css/
│   ├── styles.css          # メインスタイル
│   └── responsive.css      # レスポンシブ対応
├── js/
│   ├── main.js             # メイン機能
│   ├── colorwheel.js       # 色相環描画モジュール
│   ├── search.js           # 検索・フィルター機能
│   └── utils.js            # 共通ユーティリティ
├── data/
│   ├── companies.json      # 企業一覧データ
│   ├── dimensions.json     # 色相次元定義
│   ├── sectors.json        # 業種区分データ
│   └── companies/          # 企業別データ
│       ├── company1.json   # 個別企業データ
│       └── ...
└── assets/
    ├── images/             # 画像素材
    └── icons/              # アイコン素材
```

## 🧩 主要コンポーネント

### 色相環

色相環は企業の6つの次元をCanvas APIを使って描画します。各次元は0〜1の値で、その大きさに応じてセクターサイズが変化します。

```javascript
// 色相環の基本的な描画例
function drawColorWheel(canvasId, dimensionData) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  // ...詳細は colorwheel.js を参照
}
```

### 健全度バー

健全経営度を白（健全）から黒（不健全）のグラデーションで表現します。

```javascript
// 健全度バーの描画例
function drawSoundnessBar(containerId, soundness) {
  const container = document.getElementById(containerId);
  // ...詳細は main.js を参照
}
```

## 📊 データ構造

企業データは以下のようなJSON形式で管理されています：

```json
{
  "company_info": {
    "code": "9432",
    "name": "NTT",
    "sector": "情報・通信",
    "market": "東証プライム",
    "established": 1985,
    "employees": 303550,
    "url": "https://www.ntt.co.jp/"
  },
  "quarterly_data": [
    {
      "quarter": "2023Q3",
      "date_updated": "2023-11-30",
      "source": "2023年第2四半期決算短信, 2023年有価証券報告書",
      "dimensions": {
        "innovation": 0.75,
        "stability": 0.68,
        "social": 0.45,
        "autonomy": 0.62,
        "tradition": 0.58,
        "global": 0.70
      },
      "soundness": 0.85,
      "confidence_levels": {
        "innovation": "medium",
        "stability": "high",
        "social": "medium",
        "autonomy": "medium", 
        "tradition": "high",
        "global": "high",
        "soundness": "high"
      }
    }
  ]
}
```

## 📝 情報源と透明性

このプロジェクトでは以下の情報源から企業データを集計しています：

- 有価証券報告書、四半期報告書（EDINET）
- 企業のIR資料（決算短信、統合報告書等）
- コーポレートガバナンス報告書
- 各種特許情報データベース

すべての指標の計算方法は [methodology.html](https://yourusername.github.io/corporate-color-wheel/methodology.html) で詳細に公開しています。

## 🤝 貢献方法

このプロジェクトへの貢献を歓迎します！以下の方法で参加できます：

1. **Issue報告**: バグや機能リクエストを[Issueページ](https://github.com/yourusername/corporate-color-wheel/issues)で報告
2. **Pull Request**: 改善案や新機能の実装をPull Requestで提案
3. **データ追加**: 新しい企業データの提供や既存データの改善提案

貢献の際は[CONTRIBUTING.md](CONTRIBUTING.md)のガイドラインをご確認ください。

## 📈 今後の展望

- より多くの企業データのカバレッジ拡大
- 高度な分析機能の追加
- ユーザーフィードバックに基づく改良
- 潜在的なAPI提供の検討

## 📄 ライセンス

このプロジェクトは[MITライセンス](LICENSE)のもとで公開されています。

## 🙏 謝辞

- すべてのコントリビューター
- データソースとして活用させていただいている各企業
- フィードバックを提供してくださったユーザーの皆様

---

<div align="center">
  <p>© 2023 企業色相環プロジェクト</p>
  <p>
    <a href="https://twitter.com/yourusername">Twitter</a> •
    <a href="mailto:your-email@example.com">Contact</a>
  </p>
</div>
