import { Request, Response } from 'express';
import { prismaClient } from '../../prisma';

export const handleWalletDetails = async (req: Request, res: Response) => {
  const wallet = await prismaClient.wallet.findFirst({ where: { user_id: req.user.id } });

  return res.json(wallet);
};

export const handleBills = async (req: Request, res: Response) => {
  const { amount, day, description, nature_id } = req.body;

  const nature = await prismaClient.nature.findFirst({ where: { id: nature_id } });

  const report = await prismaClient.report.create({
    data: {
      amount,
      description,
      day,
      nature_id,
      user_id: req.user.id,
    },
    select: {
      id: true,
      amount: true,
      description: true,
      day: true,
      nature: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  const wallet = await prismaClient.wallet.findFirst({ where: { user_id: req.user.id } });

  const total = nature?.name === 'receipt' ? Number(wallet?.total) + amount : Number(wallet?.total) - amount;

  await prismaClient.wallet.update({
    where: { id: wallet?.id },
    data: {
      total,
    }
  });

  return res.json(report);
};

export const handleListReport = async (req: Request, res: Response) => {
  const reports = await prismaClient.report.findMany({
    where: {
      user_id: req.user.id,
      day: new Date().toLocaleDateString('pt-br'),
    },
    orderBy: {
      created_at:'desc'
    },
    include: {
      nature: {
        select: {
          id: true,
          name: true
        }
      },
    }
  });

  console.log(new Date().toLocaleTimeString('pt-br'));

  return res.json(reports);
};

export const handleGettingTotals = async (req: Request, res: Response) => {
  const { day } = req.query;
  
  const reports = await prismaClient.report.findMany({
    where: {
      user_id: req.user.id,
      day: String(day)
    }
  });

  const wallet = await prismaClient.wallet.findFirst({ where: { user_id: req.user.id }});

  const receipt = await prismaClient.nature.findFirst({ where: { name: 'receipt' } });
  const expense = await prismaClient.nature.findFirst({ where: { name: 'expense' } });

  const receipts_total = reports
    .filter(item => item.nature_id === receipt?.id)
    .reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

  const expenses_total = reports
    .filter(item => item.nature_id === expense?.id)
    .reduce((acc, item) => {
      return acc + item.amount
    }, 0);

  return res.json({
    day,
    wallet_total: wallet.total,
    receipts_total,
    expenses_total
  });
};
