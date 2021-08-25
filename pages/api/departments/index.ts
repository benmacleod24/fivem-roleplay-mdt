import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const Departments = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const departments = await prisma.mdt_departments.findMany({
    include: {
      mdt_department_ranks: true,
    },
  });
  res.json(departments);
};

export default Departments;
