const redis = require("redis");
const redisConfig = require("../config/redis.config.js");
const redisClient = redis.createClient({
  port: redisConfig.port,
  host: redisConfig.host,
  auth_pass: redisConfig.auth_pass,
  no_ready_check: true,
});

function setEntity(redis_key, redis_field, redis_value) {
  return new Promise((resolve, reject) => {
    try {
      redisClient.hset(redis_key, redis_field, redis_value);
      resolve(true); //success
    } catch (e) {
      reject(e);
      throw new Error(e);
    }
  });
}

function getEntity(redis_key, redis_field) {
  return new Promise((resolve, reject) => {
    try {
      redisClient.hget(redis_key, redis_field, async (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } catch (e) {
      reject(e);
      throw new Error(e);
    }
  });
}

function getAllEntity(redis_key) {
  return new Promise((resolve, reject) => {
    try {
      redisClient.hgetall(redis_key, async (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } catch (e) {
      reject(e);
      throw new Error(e);
    }
  });
}

function checkKeyFieldExists(redis_key, redis_field) {
  return new Promise((resolve, reject) => {
    try {
      let exists = redisClient.hexists(redis_key, redis_field);
      resolve(exists);
    } catch (e) {
      reject(e);
      throw new Error(e);
    }
  });
}

function deleteEntity(redis_key, redis_field) {
  return new Promise((resolve, reject) => {
    try {
      let del = redisClient.hdel(redis_key, redis_field);
      resolve(del);
    } catch (e) {
      reject(e);
      throw new Error(e);
    }
  });
}

module.exports = {
  setEntity,
  getEntity,
  getAllEntity,
  checkKeyFieldExists,
  deleteEntity,
};
