import { userModel, User } from '../userModel';
import axios from 'axios';
import client from '../../database';
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.NODE_PORT || 3000;

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYWY0NDg4NS1mNmE4LTQ4NGItYTQ0Yi1iOTVhYWM0ZWU4MWMiLCJlbWFpbCI6ImFkbWludGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY3NzcwNzIxOSwiZXhwIjoxNjc3ODgwMDE5fQ.5NaO2rSFpO97KnDHricu24BCKeZWU-gJE7bR_5aTTSY';

describe('User model tests: ', () => {
  const testUser: User = {
    first_name: 'John',
    last_name: 'Doe',
    user_name: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password',
    shipping_address: '123 Main St, Anytown USA',
  };

  // Create new user
  describe('createNewUser', () => {
    it('should create a new user', async () => {
      const conn = await client.connect();
      await conn.query(`DELETE FROM users WHERE user_name = '${testUser.user_name}' AND email = '${testUser.email}';`);
      conn.release();
      const response = await axios.post(`http://localhost:${port}/api/users`, testUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.newUser.id);

      expect(response.status).toBe(201);
      expect(response.data.newUser.first_name).toBe(testUser.first_name);
      expect(response.data.newUser.last_name).toBe('Doe');
      expect(response.data.newUser.user_name).toBe('johndoe');
      expect(response.data.newUser.email).toBe('johndoe@example.com');
      expect(response.data.newUser.shipping_address).toBe('123 Main St, Anytown USA');
    });
  });
});
