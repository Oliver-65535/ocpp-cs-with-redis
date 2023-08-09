import aioredis

redis_url = 'redis://localhost:6379/0'
channel = 'python-ocpp-cs-channel'

redis = aioredis.from_url(redis_url)
