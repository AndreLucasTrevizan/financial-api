import { Request, Response } from 'express';
import { prismaClient } from '../../prisma';

export const handleListNatures = async (req: Request, res: Response) => {
  const natures = await prismaClient.nature.findMany({ select: { id: true, name: true } });

  return res.json(natures);
};
