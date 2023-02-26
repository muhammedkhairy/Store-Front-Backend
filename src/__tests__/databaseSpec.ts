import { Pool } from 'pg';
import { credentials } from '../database';

describe('database client', () => {
  it('should create a new client', () => {
    const client = new Pool(credentials);
    expect(client).toBeDefined();
  });
});
