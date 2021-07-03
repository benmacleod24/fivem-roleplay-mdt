import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { string, z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  page: z.ostring().transform(stringToNumber),
  firstName: z.ostring(),
  lastName: z.ostring(),
  stateId: z.ostring().transform(stringToNumber),
  criminalid: z.ostring().transform(stringToNumber),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;

export default async function Criminals(
  req: NextApiRequestWithQuery,
  res: NextApiResponse,
): Promise<void> {
  const session = await getSession({ req });
  // throw new Error('test shit');
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      throw new Error('howd you get here?');
  }
}

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { page, firstName, lastName, stateId, criminalid } = CitizenRequest.parse(req.query);
  let where = {};
  if (firstName) {
    where = { ...where, first_name: { contains: firstName } };
  }
  if (lastName) {
    where = { ...where, last_name: { contains: lastName } };
  }

  if (stateId) {
    where = { ...where, id: stateId };
  }
  if (criminalid) {
    const criminal = await prisma.mdt_criminals.findFirst({
      where: { criminalid },
    });
    res.json(criminal);
  } else {
    const criminals = await prisma.mdt_criminals.findMany({
      where,
      take: 5,
      skip: page !== undefined && page !== null ? 20 * page : 0,
      orderBy: { criminalid: 'asc' },
    });
    res.json(criminals);
  }
};
