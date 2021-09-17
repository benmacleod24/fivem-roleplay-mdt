import { Prisma, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const NewMemberRequest = z.object({
  characterId: z.number(),
  departmentId: z.number(),
  rankId: z.number(),
});

const GetMembersRequest = z.object({
  departmentId: z.string().transform(stringToNumber),
});

const prisma = new PrismaClient();
type NextApiRequestWithQuery = NextApiRequest &
  (z.infer<typeof NewMemberRequest> | z.infer<typeof GetMembersRequest>);

const Members = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case 'POST':
      return POST(req, res);
    case 'GET':
      return GET(req, res);
    default:
      return 'no clue how you got here.';
  }
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { characterId, departmentId, rankId } = NewMemberRequest.parse(JSON.parse(req.body));
  const session = await getSession({ req });
  const isCop = session?.user.isCop;
  const isJudge = session?.user.isJudge;

  if (!isJudge && !isCop) {
    throw 'Not Cop or Judge';
  }

  const newMember = await prisma.mdt_department_members.create({
    data: {
      characterId,
      departmentId,
      rankId,
      callSign: '',
    },
  });

  res.json(newMember);
};

export type tDeptMembers = Prisma.PromiseReturnType<typeof GET>;
const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { departmentId } = GetMembersRequest.parse(req.query);
  const session = await getSession({ req });
  const isCop = session?.user.isCop;
  const isJudge = session?.user.isJudge;

  if (!isJudge && !isCop) {
    throw 'Not Cop or Judge';
  }

  if (!departmentId) {
    throw 'Not a department';
  }

  const members = await prisma.mdt_department_members.findMany({
    where: {
      departmentId: departmentId,
    },
    include: {
      fivem_characters: true,
    },
  });

  res.json(members);
  return members;
};

export default Members;
