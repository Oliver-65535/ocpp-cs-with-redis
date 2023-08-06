import aioredis

redis_url = 'redis://localhost:6379/0'
channel = 'test'

redis = aioredis.from_url(redis_url)
