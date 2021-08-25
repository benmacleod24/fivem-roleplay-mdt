import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

export default async function Citizen(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const METHOD = req.method;

  switch (METHOD) {
    case 'GET':
      return GET(req, res);
    default:
      throw 'No clue how you got here buddy :).';
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = await prisma.mdt_charges_categories.findMany({
    include: {
      mdt_charges: true,
    },
  });
  res.json(posts);
};
