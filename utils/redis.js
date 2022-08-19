import { createClient, GeoReplyWith } from 'redis';
import config from '../config/config.js';

const KEY = 'location:car'
class Redis {

    static instance = null;
    client = null;

    static getObject() {
        if (!this.instance) {
            this.instance = new Redis();
        }
        return this.instance
    }

    constructor() {
        this.initRedis();
    }

    async initRedis() {
        this.client = createClient({
            url: config.REDIS_URL
        });
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.on('connect', () => console.log('Redis Client Connected'));
        await this.client.connect();
    }

    async addLocation(longitude, latitude, member) {
        await this.client.geoAdd(KEY, {
            longitude,
            latitude,
            member
        })
    }

    async queryLocation(longitude, latitude, distance) {
        const coordinates = {
            longitude,
            latitude
        }
        const distanceMeasure = {
            radius: distance,
            unit: 'm'
        }
        const replyWith = [
            GeoReplyWith.COORDINATES,
            GeoReplyWith.DISTANCE
        ]
        const result = await this.client.geoSearchWith(
            KEY,
            coordinates,
            distanceMeasure,
            replyWith
        )
        return result
    }

    async deleteLocation(member) {
        await this.client.ZREM(KEY, member)
    }
}

export default Redis;