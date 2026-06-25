// utils/cache.js
import redis from "../config/redis.js";
export const setCache = async (key, value, ttl = 3600) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const delCache = async (key) => {
  await redis.del(key);
};
