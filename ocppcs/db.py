import asyncpg
import logging

async def db_start_transaction(charger_id, connector_id: int, id_tag, meter_start, reservation_id, timestamp):
    connect = await connect_db()
    user_id = await get_user_id(id_tag)

    id = await connect.fetchrow('''INSERT INTO "SessionHistory" ("chargePointHardwareId", "connectorHardwareId", "userId", "meterStart", "reservationId", "chargepoint_start_timestamp") 
                                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id''', 
                                    charger_id, connector_id, user_id, meter_start, reservation_id, timestamp)

    await connect.close()
    logging.info("TRANSACTION ID is: %s" % (id))
    return id[0]

async def db_stop_transaction(charger_id, transaction_id, meter_stop, timestamp_end):
    connect = await connect_db()
    res = await connect.fetchrow('''UPDATE "SessionHistory" SET "meterStop" = $1, "chargepoint_end_timestamp" = $2 WHERE "chargePointHardwareId"=$3 AND id=$4 RETURNING id''', 
                                    meter_stop, timestamp_end, charger_id, transaction_id)
    await connect.close()
    logging.info("TRANSACTION ID is: %s" % (res))
    return res

async def get_user_id(id_tag):
    try:
        splittag = id_tag.split('#')
        user_id = int(splittag[1])
    except IndexError:
        user_id = 0
    return user_id

async def connect_db():
    connect = await asyncpg.connect(
            user='ev-database-user', 
            password='ev-database-password',
            database='ev-database', 
            host='34.94.253.188',
            port=5440
            ) 
    return connect
