const DATA_FILES = {
  services: "data/services.json",
  portfolio: "data/portfolio.json",
  clients: "data/clients.json",
  testimonials: "data/testimonials.json",
  site: "data/site.json"
};

const cache = new Map();

export async function loadData(key) {
  if (!DATA_FILES[key]) {
    throw new Error(`Unknown data key: ${key}`);
  }

  if (cache.has(key)) {
    return cache.get(key);
  }

  const response = await fetch(DATA_FILES[key], { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${DATA_FILES[key]}`);
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
