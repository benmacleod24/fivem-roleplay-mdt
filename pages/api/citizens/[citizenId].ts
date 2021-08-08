import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  citizenid: z.ostring(),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;

const Citizen = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'PATCH':
      return PATCH(req, res);
    default:
      throw new Error('Not it chief');
  }
};

export default Citizen;

const ImagePost = z.object({
  image: z.string(),
});
const ImagePostQuery = z.object({
  citizenId: z.string().transform(Number),
});

const PATCH = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const session = await getSession({ req });
  const copId = session?.user.copId;
  if (!copId) {
    throw 'Not a cop/not logged in';
  }
  const { citizenId } = ImagePostQuery.parse(req.query);
  const { image } = ImagePost.parse(JSON.parse(req.body));

  const citizen = await prisma.fivem_characters.update({
    where: {
      id: citizenId,
    },
    data: {
      image,
    },
  });

  res.json(citizen);
};
