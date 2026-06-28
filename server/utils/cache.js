import redis from "../config/redis.js";

export const setCache = async (key, value, ttl = 3600) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const delCache = async (pattern) => {
  if (pattern.includes("*")) {
    // Wildcard delete
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } else {
    await redis.del(pattern);
  }
};