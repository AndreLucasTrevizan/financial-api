import { Router } from 'express';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { handleBills, handleGettingTotals, handleListReport, handleWalletDetails } from './controller';

const router = Router();

router.route('/billing').post(isAuthenticated, handleBills);
router.route('/wallet').get(isAuthenticated, handleWalletDetails);
router.route('/reports/daily').get(isAuthenticated, handleListReport);
router.route('/report').get(isAuthenticated, handleGettingTotals);

export {router as WalletsRouter};
