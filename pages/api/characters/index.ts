import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (req, res) {
  const { cursor, limit } = req.query;
  const posts = await prisma.fivem_characters.findMany({
    take: parseInt(limit),
    skip: parseInt(cursor),
    orderBy: { id: 'asc' },
  });
  res.json(posts);
}
