/**
 * 企業一覧ページの機能
 */
document.addEventListener('DOMContentLoaded', function() {
  // 初期データ読み込み
  fetchCompaniesData()
    .then(companies => {
      // URLから検索パラメータを取得
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');
      
      // 検索パラメータがある場合は検索ボックスに設定
      if (searchQuery) {
        document.getElementById('filterName').value = searchQuery;
      }
      
      // 企業一覧を表示
      renderCompanies(companies);
      
      // イベントリスナーを設定
      setupEventListeners(companies);
    })
    .catch(error => {
      console.error('企業データの読み込みに失敗しました:', error);
      document.getElementById('companyList').innerHTML = 
        `<div class="no-results">企業データの読み込みに失敗しました。</div>`;
    });
});

/**
 * 企業データを取得する
 */
async function fetchCompaniesData() {
  try {
    // APIが利用可能ならそちらを使用
    // return await fetch('api/companies').then(res => res.json());
    
    // 本実装までは静的データを使用
    return [
      {
        code: "9432",
        exchange: "TSE",
        name: "NTT（日本電信電話）",
        sector: "情報・通信",
        market: "東証プライム",
        soundness: 0.85
      },
      {
        code: "6758",
        exchange: "TSE",
        name: "ソニーグループ",
        sector: "電気機器",
        market: "東証プライム",
        soundness: 0.83
      },
      {
        code: "7203",
        exchange: "TSE",
        name: "トヨタ自動車",
        sector: "輸送用機器",
        market: "東証プライム",
        soundness: 0.90
      },
      {
        code: "8031",
        exchange: "TSE",
        name: "三井物産",
        sector: "卸売業",
        market: "東証プライム",
        soundness: 0.80
      },
      {
        code: "6501",
        exchange: "TSE",
        name: "日立製作所",
        sector: "電気機器",
        market: "東証プライム",
        soundness: 0.78
      }
    ];
  } catch (error) {
    console.error('データ取得エラー:', error);
    throw error;
  }
}

/**
 * イベントリスナーを設定
 */
function setupEventListeners(companies) {
  // 検索ボタンのイベントリスナー
  document.getElementById('filterBtn').addEventListener('click', function() {
    renderCompanies(companies);
  });
  
  // リセットボタンのイベントリスナー
  document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('filterName').value = "";
    document.getElementById('filterSector').value = "";
    document.getElementById('filterMarket').value = "";
    renderCompanies(companies);
  });
  
  // フォーム内でEnterキーを押したときの処理
  document.getElementById('filterName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      renderCompanies(companies);
    }
  });
}

/**
 * 企業一覧を表示
 */
function renderCompanies(companies) {
  const name = document.getElementById('filterName').value.trim();
  const sector = document.getElementById('filterSector').value;
  const market = document.getElementById('filterMarket').value;
  const list = document.getElementById('companyList');
  
  // フィルタリング処理
  let filtered = companies.filter(c => 
    (!name || c.name.includes(name) || c.code.includes(name))
    && (!sector || c.sector === sector)
    && (!market || c.market === market)
  );
  
  // 検索結果がない場合
  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-results">該当する企業が見つかりません。</div>`;
    return;
  }
  
  // 企業カード生成
  list.innerHTML = filtered.map(c => `
    <div class="company-card">
      <div>
        <a class="company-link" href="company.html?exchange=${c.exchange}&code=${c.code}">${c.name}</a>
        <div class="company-meta">${c.sector}・${c.market}・[${c.code}]</div>
      </div>
      <div class="mini-bar" title="健全度スコア: ${Math.round(c.soundness * 100)}%">
        <div class="mini-marker" style="left:${Math.round((c.soundness || 0) * 73)}px;"></div>
      </div>
    </div>
  `).join('');
}