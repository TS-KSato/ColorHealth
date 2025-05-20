// js/search.js
export function filterCompanies(companies, { name, sector, market }) {
  return companies.filter(c =>
    (!name || c.name.includes(name) || c.code.includes(name)) &&
    (!sector || c.sector === sector) &&
    (!market || c.market === market)
  );
}
