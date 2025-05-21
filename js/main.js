// 企業情報レンダリング関数の修正
function renderCompany(companyKey, quarterIdx=0) {
  const company = companies[companyKey] || companies.ntt;
  document.getElementById('companyName').textContent = company.company_info.name + " の特性分析";
  showCompanyInfo(company.company_info);
  
  // 四半期リスト
  const sel = document.getElementById('quarterSelect');
  sel.innerHTML = company.quarterly_data.map((q, i) =>
    `<option value="${i}">${q.quarter}</option>`).join('');
  sel.value = quarterIdx;
  
  const qdata = company.quarterly_data[quarterIdx];
  
  // 色相環キャンバス描画を5段階表示に置き換え
  renderDimensionData(qdata.dimensions, qdata.soundness);
  
  // メタ情報と信頼度表示
  showMetaAndSource(qdata);
  showConfidenceList(qdata.confidence_levels);
}
