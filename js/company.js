document.addEventListener('DOMContentLoaded', async function () {
  // 1. パラメータ取得
  const params = new URLSearchParams(location.search);
  const exchange = params.get('exchange');
  const code = params.get('code');
  const key = `${exchange}-${code}`.toLowerCase();


  // 2. データパス（必要に応じてパスを調整）
  const basePath = 'data/';
  const companyDataPath = `${basePath}companies.json`;
  const companyDetailPath = `${basePath}companies/${key}.json`;
  const dimensionsPath = `${basePath}dimensions.json`;

  // 3. 企業基本データ取得
  let companies = {}, company = null, detail = null, dimensionsDef = {};
  try {
    // 企業リスト
    companies = await fetch(companyDataPath).then(r => r.json());
    company = companies[key];
    if (!company) throw new Error('該当企業がありません');
  } catch (e) {
    document.getElementById('companyName').textContent = '企業データ取得エラー';
    document.getElementById('basicInfo').innerHTML = e.message;
    return;
  }

  // 4. 企業詳細データ・次元定義データ取得
  try {
    detail = await fetch(companyDetailPath).then(r => r.json());
    dimensionsDef = await fetch(dimensionsPath).then(r => r.json());
  } catch (e) {
    document.getElementById('companyName').textContent = '詳細データ取得エラー';
    document.getElementById('basicInfo').innerHTML = e.message;
    return;
  }

  // 5. 基本情報描画
  document.getElementById('companyName').textContent = company.name || '';
  document.getElementById('basicInfo').innerHTML = `
    <div>【証券コード】${company.code}</div>
    <div>【市場】${company.market}</div>
    <div>【業種】${company.sector}</div>
    <div>【設立】${company.established || '―'}</div>
    <div>【従業員数】${company.employees ? company.employees + '人' : '―'}</div>
    <div>【公式サイト】<a href="${company.url}" target="_blank">${company.url}</a></div>
  `;

  // 6. 四半期データセットアップ
  const quarterSelect = document.getElementById('quarterSelect');
  const quarters = detail.quarterly_data.map(q => q.quarter);
  quarterSelect.innerHTML = quarters.map((q, i) =>
    `<option value="${i}">${q}</option>`
  ).join('');
  
  // 7. 選択四半期のデータ描画
  function renderQuarter(idx) {
    const q = detail.quarterly_data[idx];
    if (!q) return;
    // 進捗バー
    renderProgressBars(q.dimensions, q.dimension_details, dimensionsDef);
    // 健全度
    updateSoundnessBar(q.soundness);
    // 日付・情報源
    document.getElementById('metaInfo').innerHTML =
      `<div>データ更新日：${q.date_updated}</div>`;
    document.getElementById('sourceInfo').innerHTML =
      `<div>情報源：${q.source}</div>`;
    // 信頼度リスト
    document.getElementById('confidenceList').innerHTML =
      makeConfidenceHTML(q.confidence_levels, dimensionsDef);
  }

  // 8. 四半期セレクト切り替え
  quarterSelect.addEventListener('change', function () {
    renderQuarter(this.value);
  });

  // 9. 初期描画（最新四半期）
  renderQuarter(0);

  // ------ 以下、描画関数群 ------

  // 6つの次元進捗バー描画
  function renderProgressBars(dimensions, details, defs) {
  const container = document.getElementById('progressContainer');
  // dimensions.jsonの定義順でループ（安定・拡張性重視）
  container.innerHTML = Object.keys(defs).map(key => {
    const def = defs[key];
    const val = dimensions[key] ?? 0;
    const percent = Math.round(val * 100);
    const detail = details[key] || '';
    return `
      <div class="progress-item" style="border-color: ${def.color}">
        <div class="progress-header">
          <span class="progress-icon">${def.icon}</span>
          <span class="progress-label">${def.name}</span>
          <span class="progress-value">${percent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress" style="background: ${def.color}; width: ${percent}%;"></div>
        </div>
        <div class="detail">${detail}</div>
      </div>
    `;
  }).join('');
}

  // 健全度バー描画
  function updateSoundnessBar(val) {
    const soundnessBar = document.getElementById('soundnessBar');
    const soundnessValue = document.getElementById('soundnessValue');
    const percent = Math.round(val * 100);
    soundnessBar.style.width = `${percent}%`;
    soundnessValue.textContent = `${percent}%`;
  }

  // 信頼度HTML生成
  function makeConfidenceHTML(levels, defs) {
    if (!levels) return '';
    const map = { high: '◎', medium: '○', low: '△' };
    const label = {
      innovation: '変革性', stability: '安定性', social: '社会性',
      autonomy: '自律性', tradition: '伝統性', global: '国際性', soundness: '健全度'
    };
    return `<div class="confidence-title">指標の信頼度：</div>
      <ul class="confidence-ul">
      ${Object.entries(levels).map(([k, v]) =>
        `<li>${label[k] || k}：${map[v] || v}</li>`
      ).join('')}
      </ul>`;
  }
});
