/**
 * 企業検索機能
 * 
 * ユーザーが入力した企業名や証券コードを元に検索を実行
 */

document.addEventListener('DOMContentLoaded', function() {
  // 検索関連の要素を取得
  const searchInput = document.getElementById('companySearch');
  const searchButton = document.getElementById('searchButton');
  
  // 検索ボタンクリックイベント
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      searchCompany();
    });
  }
  
  // 検索フォームでのEnterキー押下イベント
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchCompany();
      }
    });
    
    // ページロード時に検索ボックスにフォーカス
    setTimeout(() => {
      searchInput.focus();
    }, 500);
  }
  
  /**
   * 企業検索を実行する関数
   */
  function searchCompany() {
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    // 検索クエリをURLエンコード
    const encodedQuery = encodeURIComponent(query);
    
    // 数字のみの場合は証券コードと判断
    const isStockCode = /^\d+$/.test(query);
    
    if (isStockCode) {
      // 証券コードの場合は直接企業ページへ
      window.location.href = `company.html?exchange=TSE&code=${query}`;
    } else {
      // 企業名の場合は検索結果ページへ
      window.location.href = `companies.html?search=${encodedQuery}`;
    }
  }
  
  /**
   * 企業カードのホバーエフェクトを強化
   */
  const companyCards = document.querySelectorAll('.company-card');
  
  companyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
});
