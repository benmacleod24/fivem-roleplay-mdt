import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const DispatchRequest = z.object({
  characterId: z.string().transform(stringToNumber),
});
type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof DispatchRequest>;

const Dispatch = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    case 'PATCH':
      return PATCH(req, res);
    default:
      throw 'no clue how you got here.';
  }
};

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId } = DispatchRequest.parse(req.query);
  const getAll = await prisma.mdt_dispatch_new.findMany({
    where: { clockOut: null },
    include: {
      fivem_characters: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!characterId) return res.json(getAll);
  res.json(
    await prisma.mdt_dispatch_new.findMany({
      where: { characterId: Number(characterId), clockOut: null },
    }),
  );
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId } = DispatchRequest.parse(req.query);
  const clockIn = await prisma.mdt_dispatch_new.create({
    data: {
      characterId: Number(characterId),
      clockIn: new Date(),
    },
  });

  res.json(clockIn);
};

const PATCH = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId } = DispatchRequest.parse(req.query);
  const clockOut = await prisma.mdt_dispatch_new.updateMany({
    where: {
      characterId: Number(characterId),
      clockOut: null,
    },
    data: {
      clockOut: new Date(),
    },
  });

  res.json(clockOut);
};

export default Dispatch;
