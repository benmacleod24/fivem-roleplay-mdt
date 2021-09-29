import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const Sub = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'DELETE':
      return DELETE(req, res);
    case 'POST':
      return POST(req, res);
    default:
      throw 'Not a clue how you got here buddy!';
  }
};

export default Sub;

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const subdepartments = await prisma.mdt_department_subdepartments.findMany({});
  res.json(subdepartments);
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, characterId } = JSON.parse(req.body);

  const _delete = await prisma.mdt_member_subdepartments.deleteMany({
    where: {
      memSubDeptId: id,
      characterId: characterId,
    },
  });

  res.json(_delete);
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, characterId } = JSON.parse(req.body);

  const post = await prisma.mdt_member_subdepartments.create({
    data: {
      characterId,
      memSubDeptId: id,
    },
  });

  res.json(post);
};
