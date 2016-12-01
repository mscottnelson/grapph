# Simple App for Grapphing Changes over Time

Use instructions:

1. Install PostgreSQL for your OS
https://www.postgresql.org/download/

2. Package script should create and migrate database for you. You may need to modify the username in config.json. This probably goes without saying but you must be running your PostgreSQL server for the database to operate.

3. Use your favorite PostgreSQL manager to track changes to the database. I use pgAdmin3: https://www.pgadmin.org/

4. Install and run Redis as a temporary, in-memory datastore for session information: https://redis.io/download OR redis-cli
