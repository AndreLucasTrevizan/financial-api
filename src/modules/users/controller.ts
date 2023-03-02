import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prismaClient } from '../../prisma';

export const handleCreateAccount = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (name === '' || email === '' || password === '')
    throw new Error('Preencha todos os campos');

  const is_valid_email = await prismaClient.user.findFirst({ where: { email } });

  if (is_valid_email) throw new Error('Email já está em uso');

  const password_hash = await hash(password, 8);

  const user = await prismaClient.user.create({
    data: {
      avatar: `https://robohash.org/${Math.floor(Math.random() * 10000)}`,
      name,
      email,
      password: password_hash,
    },
    select: {
      id: true,
      avatar: true,
      name: true,
      email: true
    }
  });

  await prismaClient.wallet.create({
    data: {
      total: 0,
      user_id: user.id
    }
  });

  return res.json(user);
};

export const handleUserSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const has_account = await prismaClient.user.findFirst({ where: { email } });

  if (!has_account) throw new Error('Email ou senha invalidos');

  const password_match = await compare(password, has_account.password);

  if (!password_match) throw new Error('Email ou senha invalidos');

  let payload = {
    id: has_account.id,
    avatar: has_account.avatar,
    name: has_account.name,
    email: has_account.email
  };

  const token = sign(payload, String(process.env.JWT_SECRET));

  return res.json({ ...payload, token });
};

export const handleUserDetails = async (req: Request, res: Response) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: req.user.id
    },
    select: {
      id: true,
      avatar: true,
      name: true,
      email: true
    }
  });

  return res.json(user);
};
