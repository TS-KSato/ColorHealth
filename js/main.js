// メインJavaScriptファイル
document.addEventListener('DOMContentLoaded', function() {
  // URLからkey取得
  const companyKey = getCompanyKey();
  
  // 企業データを取得してレンダリングを開始
  fetchCompanyData(companyKey)
    .then(companyData => {
      renderCompany(companyData, 0);
      
      // 四半期切り替えイベントリスナー
      document.getElementById('quarterSelect').addEventListener('change', function(e) {
        renderCompany(companyData, parseInt(this.value, 10) || 0);
      });
    })
    .catch(error => {
      console.error('データ読み込みエラー:', error);
      document.getElementById('container').innerHTML = 
        `<div class="error-message">企業データの読み込みに失敗しました。</div>`;
    });
});

// URLからkey取得
function getCompanyKey() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get("key") || "ntt";
}

// 企業データ読み込み
async function fetchCompanyData(companyKey) {
  try {
    // 企業一覧から基本情報を取得
    const companiesResponse = await fetch('../data/companies.json');
    const companiesData = await companiesResponse.json();
    
    // 企業が存在するか確認
    if (!companiesData[companyKey]) {
      throw new Error('企業データが見つかりません: ' + companyKey);
    }
    
    // 個別企業データを取得
    const companyResponse = await fetch(`../data/companies/${companyKey}.json`);
    const companyDetails = await companyResponse.json();
    
    // 次元定義データを取得
    const dimensionsResponse = await fetch('../data/dimensions.json');
    const dimensionsData = await dimensionsResponse.json();
    
    return {
      company_info: companiesData[companyKey],
      quarterly_data: companyDetails.quarterly_data,
      dimensions: dimensionsData
    };
  } catch (error) {
    console.error('データ取得エラー:', error);
    throw error;
  }
}

// 企業情報レンダリング
function renderCompany(companyData, quarterIdx = 0) {
  // ページタイトル設定
  document.getElementById('companyName').textContent = 
    companyData.company_info.name + " の企業特徴";
  
  // 基本情報表示
  showCompanyInfo(companyData.company_info);
  
  // 四半期リストを更新
  updateQuarterSelector(companyData.quarterly_data, quarterIdx);
  
  // 四半期データ取得
  const qdata = companyData.quarterly_data[quarterIdx];
  
  // 各表示要素を更新
  createProgressBars(qdata.dimensions, qdata.dimension_details || {}, companyData.dimensions);
  updateSoundnessBar(qdata.soundness);
  showMetaAndSource(qdata);
  showConfidenceList(qdata.confidence_levels);
}

// 四半期選択リスト更新
function updateQuarterSelector(quarterlyData, selectedIdx) {
  const sel = document.getElementById('quarterSelect');
  sel.innerHTML = quarterlyData.map((q, i) =>
    `<option value="${i}">${q.quarter}</option>`).join('');
  sel.value = selectedIdx;
}
