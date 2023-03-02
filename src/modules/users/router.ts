import { Router } from 'express';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import {
  handleCreateAccount,
  handleUserDetails,
  handleUserSignIn
} from './controller';

const router = Router();

router.route('/users').post(handleCreateAccount);

router.route('/sign_in').post(handleUserSignIn);

router.route('/users/me').get(isAuthenticated, handleUserDetails);

export {router as UsersRouter};
