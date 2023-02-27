import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

export const credentials = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_DEV_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DEV_DB,
};

const client = new Pool(credentials);

export default client;
