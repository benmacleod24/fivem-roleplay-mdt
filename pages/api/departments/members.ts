import { Prisma, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const NewMemberRequest = z.object({
  characterId: z.onumber(),
  departmentId: z.onumber(),
  rankId: z.onumber(),
});

const GetMembersRequest = z.object({
  departmentId: z.ostring().transform(stringToNumber),
  characterId: z.ostring().transform(stringToNumber),
});

const MembersPatch = z.object({
  memberId: z.onumber(),
  rankId: z.onumber(),
  departmentId: z.onumber(),
  callSign: z.ostring(),
  email: z.ostring(),
});

const prisma = new PrismaClient();
type NextApiRequestWithQuery = NextApiRequest &
  (
    | z.infer<typeof NewMemberRequest>
    | z.infer<typeof GetMembersRequest>
    | z.infer<typeof MembersPatch>
  );

const Members = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case 'POST':
      return POST(req, res);
    case 'GET':
      return GET(req, res);
    case 'PATCH':
      return PATCH(req, res);
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

  if (!characterId || !departmentId || !rankId) {
    throw 'Empty Values';
  }

  const findMember = await prisma.mdt_department_members.findFirst({ where: { characterId } });
  if (findMember) {
    throw 'Member Found';
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
  const { departmentId, characterId } = GetMembersRequest.parse(req.query);
  const session = await getSession({ req });
  const isCop = session?.user.isCop;
  const isJudge = session?.user.isJudge;

  // if (!isJudge && !isCop) {
  //   throw 'Not Cop or Judge';
  // }

  const select = {
    id: true,
    uId: true,
    cuid: true,
    dob: true,
    first_name: true,
    last_name: true,
    gender: true,
    mdt_member_subdepartments: {
      include: {
        mdt_department_subdepartments: true,
      },
    },
  };

  if (characterId) {
    const members = await prisma.mdt_department_members.findFirst({
      where: {
        characterId: characterId,
      },
      include: {
        fivem_characters: {
          select,
        },
        mdt_department_ranks: true,
      },
    });

    res.json(members);
    return members;
  }

  if (departmentId) {
    const members = await prisma.mdt_department_members.findMany({
      where: {
        departmentId: departmentId,
      },
      include: {
        fivem_characters: {
          select,
        },
        mdt_department_ranks: true,
      },
    });

    res.json(members);
    return members;
  }

  res.json([]);
  return [];
};

const PATCH = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { memberId, rankId, callSign, departmentId, email } = MembersPatch.parse(
    JSON.parse(req.body),
  );
  const session = await getSession({ req });
  const isCop = session?.user.isCop;
  const isJudge = session?.user.isJudge;

  if (!isJudge && !isCop) {
    throw 'Not Cop or Judge';
  }

  console.log({ memberId, rankId, callSign, departmentId });

  if (!memberId || !callSign || !rankId || !departmentId) {
    throw 'Empty Values';
  }

  const newMember = await prisma.mdt_department_members.update({
    where: {
      memberId,
    },
    data: {
      callSign,
      rankId,
      departmentId,
      email,
    },
  });

  res.json(newMember);
};

export default Members;
