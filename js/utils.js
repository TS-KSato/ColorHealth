// js/utils.js
export async function loadCompanies() {
  const res = await fetch('data/companies.json');
  return await res.json();
}
export async function getCompanyDetail(key) {
  // 例: nttなら company1.json、sonyはcompany2.json…というマッピングでもOK
  const idx = { ntt: 1, sony: 2, toyota: 3, mitsui: 4, hitachi: 5 }[key] || 1;
  const res = await fetch(`data/companies/company${idx}.json`);
  return await res.json();
}
