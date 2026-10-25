// config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const isTLS = process.env.REDIS_URL?.startsWith("rediss://");

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  ...(isTLS && {
    tls: {
      rejectUnauthorized: false, // Needed for Upstash / cloud Redis
    },
  }),
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;