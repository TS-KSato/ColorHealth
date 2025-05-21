// 企業特性の5段階表示を行うモジュール

// 特性の色相マッピング
const dimensionHues = {
  innovation: 0,    // 赤
  stability: 240,   // 青
  social: 120,      // 緑
  autonomy: 60,     // 黄
  tradition: 285,   // 紫
  global: 30        // 橙
};

// 特性の日本語名
const dimensionNames = {
  innovation: '変革性',
  stability: '安定性',
  social: '社会性',
  autonomy: '自律性',
  tradition: '伝統性',
  global: '国際性',
  soundness: '健全性'
};

// 連続値から5段階のインデックスを計算
function getActiveIndex(value) {
  return Math.min(Math.floor(value * 5), 4);
}

// 5段階の四角形表示を構築
function createDimensionSquares(dimensionId, value, isSoundness = false) {
  const container = document.querySelector(`#${dimensionId}-row .dimension-squares`);
  if (!container) return;
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // アクティブなインデックスを計算
  const activeIndex = getActiveIndex(value);
  
  // 5つの四角形を作成
  for (let i = 0; i < 5; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    
    if (isSoundness) {
      // 健全性は白から黒へのグレースケール
      if (i === activeIndex) {
        // アクティブな四角のグレースケール
        const colors = ['#FFFFFF', '#d3d3d5', '#a0a0a0', '#666465', '#000000'];
        square.style.backgroundColor = colors[i];
        square.style.borderColor = (i === 0) ? '#cccccc' : (i === 4 ? '#333333' : '#bbb');
      } else {
        // 非アクティブな四角
        square.style.backgroundColor = '#f0f0f0';
        square.style.borderColor = '#e0e0e0';
      }
    } else {
      // 特性はそれぞれの色相で表現
      const hue = dimensionHues[dimensionId];
      if (i === activeIndex) {
        // アクティブな四角
        square.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
        square.style.borderColor = `hsl(${hue}, 60%, 50%)`;
      } else {
        // 非アクティブな四角
        square.style.backgroundColor = `hsl(${hue}, 50%, 85%)`;
        square.style.borderColor = `hsl(${hue}, 40%, 75%)`;
      }
    }
    
    container.appendChild(square);
  }
}

// 企業の全特性データを表示
function renderDimensionData(dimensions, soundness) {
  // 各特性を5段階表示
  Object.keys(dimensions).forEach(dimension => {
    createDimensionSquares(dimension, dimensions[dimension]);
  });
  
  // 健全性を5段階表示
  createDimensionSquares('soundness', soundness, true);
  
  // 健全性のスコア表示
  const soundnessValueEl = document.getElementById('soundnessValue');
  if (soundnessValueEl) {
    soundnessValueEl.textContent = `健全度スコア：${(soundness * 100).toFixed(1)} / 100`;
  }
}
