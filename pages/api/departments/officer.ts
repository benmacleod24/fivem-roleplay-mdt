import { Prisma, PrismaClient } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const MemberGET = z.object({
  characterId: z.string().transform(stringToNumber),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof MemberGET>;

const Member = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      throw 'your a fucking moron';
  }
};

export default Member;

export type tDeptMember = Prisma.PromiseReturnType<typeof GET>;
const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId } = MemberGET.parse(req.query);

  if (!characterId) {
    throw 'No char id';
  }

  const _member = await prisma.mdt_department_members.findMany({
    include: {
      fivem_characters: true,
    },
  });

  res.json(_member);
  return _member;
};
