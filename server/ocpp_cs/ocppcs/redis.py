import aioredis

redis_url = 'redis://34.94.253.188:6379/0'
channel = 'python-ocpp-cs-channel'

redis = aioredis.from_url(redis_url)
