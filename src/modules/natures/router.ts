import { Router } from 'express';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { handleListNatures } from './controller';

const router = Router();

router.route('/natures').get(isAuthenticated, handleListNatures);

export {router as NaturesRouter};
