export function create(load) {
  return {
    storage: Object.create(null),
    load,
  }
}

export async function get(cache, key, args) {
  const update = cache.load(key, args).then((v) => {cache.storage[key] = v})
  if (cache.storage[key] === undefined) await update
  return cache.storage[key]
}
