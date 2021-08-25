import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const NewMemberRequest = z.object({
  characterId: z.number(),
  departmentId: z.number(),
  rankId: z.number(),
});

const prisma = new PrismaClient();
type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof NewMemberRequest>;

const Members = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case 'POST':
      return POST(req, res);
    default:
      return 'no clue how you got here.';
  }
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId, departmentId, rankId } = NewMemberRequest.parse(JSON.parse(req.body));
  const session = await getSession({ req });
  const isCop = session?.user.isCop;

  if (!isCop) {
    throw 'You are not a cop';
  }

  const newMember = await prisma.mdt_department_members.create({
    data: {
      characterId,
      departmentId,
      rankId,
    },
  });

  res.json(newMember);
};

export default Members;
