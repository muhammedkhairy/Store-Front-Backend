import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const credentials = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

const dbConnect = async () => {
  try {
    const client = new Pool(credentials);
    await client.connect();
    console.log(`🛢️ ${credentials.database} database is connected successfully`);
    return client;
  } catch (error) {
    console.log('There is an error while trying to connect the database:', error);
  }
};

export default dbConnect;
