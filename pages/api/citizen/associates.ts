import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const CitizenAssociateRequest = z.object({
  id: z.ostring().transform(stringToNumber),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenAssociateRequest>;

const CitizenAssociates = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    default:
      throw new Error('Some how got here?');
  }
};

export default CitizenAssociates;

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { id } = CitizenAssociateRequest.parse(req.query);

  if (!id) {
    return res.status(300).json({
      status: 300,
      message: 'Could not find citizen uid.',
    });
  }

  const associates = await prisma.mdt_associates.findMany({
    where: {
      characterId: id,
    },
    include: {
      fivem_characters: true,
    },
  });

  res.json(associates);
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { id } = CitizenAssociateRequest.parse(req.query);

  if (!id) {
    return res.status(300).json({
      status: 300,
      message: 'Could not find citizen uid.',
    });
  }

  const associates = await prisma.mdt_associates.create({
    data: {
      characterId: id,
      associatedId: JSON.parse(req.body).id,
    },
  });

  res.json(associates);
};
