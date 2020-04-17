export function create(load) {
  return {
    storage: Object.create(null),
    load,
    lastFetch: Object.create(null),
  }
}

const msToLive = 5 * 60 * 1000

export async function get(cache, key, args) {
  const now = Date.now()
  if (now - (cache.lastFetch[key] || 0) > msToLive) {
    const update = cache.load(key, args).then((v) => {cache.storage[key] = v})
    if (cache.storage[key] === undefined) await update
    cache.lastFetch[key] = now
  }
  return cache.storage[key]
}
