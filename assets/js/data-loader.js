const DATA_FILES = {
  services: "../../data/services.json",
  portfolio: "../../data/portfolio.json",
  clients: "../../data/clients.json",
  testimonials: "../../data/testimonials.json",
  site: "../../data/site.json"
};

const cache = new Map();

function resolveDataUrl(relativePath) {
  return new URL(relativePath, import.meta.url).href;
}

export async function loadData(key) {
  if (!DATA_FILES[key]) {
    throw new Error(`Unknown data key: ${key}`);
  }

  if (cache.has(key)) {
    return cache.get(key);
  }

  const dataUrl = resolveDataUrl(DATA_FILES[key]);
  const response = await fetch(dataUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${dataUrl}`);
  }

  const json = await response.json();
  cache.set(key, json);
  return json;
}

export async function loadAllData() {
  const [services, portfolio, clients, testimonials, site] = await Promise.all([
    loadData("services"),
    loadData("portfolio"),
    loadData("clients"),
    loadData("testimonials"),
    loadData("site")
  ]);

  return { services, portfolio, clients, testimonials, site };
}
