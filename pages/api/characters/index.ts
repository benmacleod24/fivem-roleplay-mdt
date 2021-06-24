import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (req, res) {
  const { cursor, limit, firstName } = req.query;
  let where = {};
  if (firstName) {
    where = { ...where, firstName: `%${firstName}%` };
  }
  const posts = await prisma.fivem_characters.findMany({
    where,
    take: parseInt(limit),
    skip: parseInt(cursor),
    orderBy: { id: 'asc' },
  });
  res.json(posts);
}
