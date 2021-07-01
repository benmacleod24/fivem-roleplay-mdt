import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  per_page: z.string().transform(Number),
  page: z.string().transform(Number),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;

export default async function Citizen(
  req: NextApiRequestWithQuery,
  res: NextApiResponse,
): Promise<void> {
  const { per_page, page } = CitizenRequest.parse(req.query);

  const posts = await prisma.mdt_annoucments.findMany({
    take: per_page,
    skip: (page - 1) * per_page ?? 0,
    orderBy: { annoucmentid: 'desc' },
  });
  res.json(posts);
}
