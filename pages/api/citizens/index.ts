import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  page: z.ostring().transform(stringToNumber),
  firstName: z.ostring(),
  lastName: z.ostring(),
  stateId: z.ostring().transform(stringToNumber),
  cuid: z.ostring(),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;

export default async function Citizen(
  req: NextApiRequestWithQuery,
  res: NextApiResponse,
): Promise<void> {
  const { page, firstName, lastName, stateId, cuid } = CitizenRequest.parse(req.query);
  let where = {};

  const select = {
    id: true,
    uId: true,
    cuid: true,
    dob: true,
    first_name: true,
    last_name: true,
    gender: true,
  };
  if (firstName) {
    where = { ...where, first_name: { contains: firstName } };
  }
  if (lastName) {
    where = { ...where, last_name: { contains: lastName } };
  }

  if (stateId) {
    where = { ...where, id: stateId };
  }
  const posts = await prisma.fivem_characters.findMany({
    where,
    take: 5,
    skip: page !== undefined && page !== null ? 20 * 5 : 0,
    orderBy: { id: 'asc' },
    include: {
      mdt_criminals: {
        where,
        select: {
          image: true
        }
      }
    }
  });
  res.json(posts);
}
