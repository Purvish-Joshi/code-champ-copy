import { createClient } from "redis";

const redisClient = createClient({
	url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default redisClient;
