import { PrismaClient, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const Reports = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      throw new Error('Not it chief');
  }
};

export default Reports;

export type tCop = Prisma.PromiseReturnType<typeof GET>;

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const cops = await prisma.fivem_characters.findMany({
    where: {
      fivem_whitelist_characters_jobs: {
        some: { job_id: 1 },
      },
    },
    select: {
      first_name: true,
      last_name: true,
      id: true,
    },
  });

  res.json(cops);
  return cops;
};
