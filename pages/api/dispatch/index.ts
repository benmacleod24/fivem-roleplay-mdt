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
    case 'POST':
      return POST(req, res);
    default:
      throw 'no clue how you got here.';
  }
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId } = DispatchRequest.parse(req.query);
  const clockIn = await prisma.mdt_dispatch_new.create({
    data: {
      characterId: Number(characterId),
      clockIn: new Date(),
    },
  });
};

export default Dispatch;
