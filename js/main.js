// js/main.js
import { drawColorWheel } from './colorwheel.js';
import { loadCompanies, getCompanyDetail } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 企業リスト読み込み
  const companies = await loadCompanies();
  // ...UI初期化（index.html/companies.html/等で呼び出し）
});
