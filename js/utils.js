// ユーティリティ関数

// 企業基本情報表示
function showCompanyInfo(info) {
  const html = `
    <b>${info.name}</b> <span style="font-size:0.98em; color:#7ba5e0">[${info.code}]</span><br>
    業種: ${info.sector} ／ 市場: ${info.market} ／ 設立: ${info.established}<br>
    従業員数: ${info.employees.toLocaleString()}名<br>
    <a href="${info.url}" target="_blank" rel="noopener" style="color:#3c7ddb">公式サイト</a>
  `;
  document.getElementById('basicInfo').innerHTML = html;
}

// メタ情報・出典表示
function showMetaAndSource(qdata) {
  document.getElementById('metaInfo').innerHTML =
    `データ期: <b>${qdata.quarter}</b> ／ <span>更新: ${qdata.date_updated}</span>`;
  document.getElementById('sourceInfo').innerHTML =
    `<b>出典:</b> ${qdata.source} <br>
     <b>確信度:</b> <span style="color:#488;">${qdata.confidence_levels.soundness}</span>
     ／ <a href="methodology.html" style="color:#5e90fc; text-decoration:underline; font-size:0.95em;">計算方法</a>`;
}

// 確信度リスト表示
function showConfidenceList(levels) {
  const disp = {
    high: '高',
    medium: '中',
    low: '低'
  };
  const html = Object.entries(levels).map(([k, v]) =>
    `<span>${k}：${disp[v]||v}</span>`).join('');
  document.getElementById('confidenceList').innerHTML =
    `<b>各指標のデータ信頼度:</b> ${html}`;
}

// 数値を指定桁数でフォーマット
function formatNumber(num, digits = 1) {
  return num.toFixed(digits);
}

// 日付フォーマット (YYYY-MM-DD → YYYY年MM月DD日)
function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
}

// データの信頼度レベルを日本語に変換
function confidenceLevelToJa(level) {
  const levels = {
    high: '高',
    medium: '中',
    low: '低'
  };
  return levels[level] || level;
}
