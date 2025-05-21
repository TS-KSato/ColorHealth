// 進捗バーモジュール - 企業特徴の視覚化

// 進捗バーの生成
function createProgressBars(dimensions, details, dimensionDefinitions) {
  const container = document.getElementById('progressContainer');
  container.innerHTML = '';
  
  // 各次元の設定
  const dimensionConfigs = [
    { key: 'innovation', name: '変革性', colorClass: 'red', icon: '💡' },
    { key: 'stability', name: '安定性', colorClass: 'blue', icon: '🔒' },
    { key: 'social', name: '社会性', colorClass: 'green', icon: '🌍' },
    { key: 'autonomy', name: '自律性', colorClass: 'yellow', icon: '🚀' },
    { key: 'tradition', name: '伝統性', colorClass: 'purple', icon: '🏛️' },
    { key: 'global', name: '国際性', colorClass: 'orange', icon: '🌐' }
  ];
  
  // 各次元の説明文を取得
  dimensionConfigs.forEach(config => {
    if (dimensionDefinitions && dimensionDefinitions[config.key]) {
      config.desc = dimensionDefinitions[config.key].description || '';
    }
  });
  
  // 進捗バーを生成
  dimensionConfigs.forEach(config => {
    const value = dimensions[config.key] || 0;
    const percent = Math.round(value * 100);
    const detail = details[config.key] || '';
    
    const progressItem = document.createElement('div');
    progressItem.className = `progress-item ${config.colorClass}`;
    progressItem.innerHTML = `
      <div class="progress-header">
        <div class="icon">${config.icon}</div>
        <div class="label-container">
          <div class="label">${config.name}</div>
          <div class="sub-label">${config.desc || ''}</div>
        </div>
        <div class="value">${percent}%</div>
      </div>
      <div class="progress-bar">
        <div class="progress" style="--value: ${percent}%;"></div>
      </div>
      <div class="detail">
        ${detail}
      </div>
    `;
    
    container.appendChild(progressItem);
  });
}

// 健全度バー更新
function updateSoundnessBar(value) {
  const soundnessBar = document.getElementById('soundnessBar');
  const soundnessValue = document.getElementById('soundnessValue');
  const percent = Math.round(value * 100);
  
  soundnessBar.style.width = `${percent}%`;
  soundnessValue.textContent = `${percent}%`;
}