import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  citizenId: z.ostring().transform(stringToNumber),
});

const LicPatch = z.object({
  citizenId: z.ostring().transform(stringToNumber),
  value: z.ostring(),
  level: z.ostring().transform(stringToNumber),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;
type NextApiRequestWithQueryPatch = NextApiRequest & z.infer<typeof LicPatch>;

const Licenses = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'PATCH':
      return PATCH(req, res);
    default:
      throw new Error('Not it loser');
  }
};

export default Licenses;

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { citizenId } = CitizenRequest.parse(req.query);

  const licenses = await prisma.fivem_licenses.findFirst({
    where: {
      cid: citizenId,
    },
  });

  res.json(licenses);
};

const PATCH = async (req: NextApiRequestWithQueryPatch, res: NextApiResponse) => {
  const { citizenId, level, value } = LicPatch.parse(req.query);
  let data;

  if (value === 'drivers') {
    data = {
      drivers: level,
    };
  }

  if (value === 'pilots') {
    data = {
      pilots: level,
    };
  }

  if (value === 'weapons') {
    data = {
      weapons: level,
    };
  }

  if (value === 'hunting') {
    data = {
      hunting: level,
    };
  }

  if (value === 'fishing') {
    data = {
      fishing: level,
    };
  }

  const update = await prisma.fivem_licenses.updateMany({
    where: {
      cid: citizenId,
    },
    data: {
      ...data,
    },
  });

  res.json(update);
};
