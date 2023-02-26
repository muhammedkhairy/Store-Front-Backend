import validate from 'uuid-validate';
import { customError } from '../middleware/errorHandler';

const validateUUID = (id: string): void => {
  if (!validate(id)) {
    const error: customError = new Error(`Invalid UUID format for user ID`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_UUID';
    throw error;
  }
};

export default validateUUID;
