import Redis from "ioredis";
import env from "./env";

const redisConfig =
    env.NODE_ENV === "online_development"
        ? {
              host: env.REDIS_HOST_ONLINE || "127.0.0.1",
              port: Number(env.REDIS_PORT_ONLINE) || 6379,
              password: env.REDIS_PASSWORD_ONLINE || undefined,
          }
        : {
              host: env.REDIS_HOST || "127.0.0.1",
              port: Number(env.REDIS_PORT) || 6379,
              password: env.REDIS_PASSWORD || undefined,
          };

const redis = new Redis(redisConfig);

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error: ", err));

export default redis;
