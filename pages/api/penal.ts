import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

export default async function Citizen(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const posts = await prisma.mdt_charges_categories.findMany({
    include: {
      mdt_charges: true,
    },
  });
  res.json(posts);
}
