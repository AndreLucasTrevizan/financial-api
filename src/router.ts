import { Request, Response, Router } from 'express';
import { NaturesRouter } from './modules/natures/router';
import { UsersRouter } from './modules/users/router';
import { WalletsRouter } from './modules/wallet/router';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
  return res.json({ msg: 'API Running' });
});

router.use(
  UsersRouter,
  NaturesRouter,
  WalletsRouter
);

export default router;
