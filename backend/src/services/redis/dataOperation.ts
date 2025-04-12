import redis from "../../config/redis";

export const storeData = async (key: string, value: any, expiry?: number) => {
    if (expiry) {
        await redis.set(key, JSON.stringify(value), "EX", expiry);
    } else {
        await redis.set(key, JSON.stringify(value));
    }
};

export const getData = async (key: string) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};
