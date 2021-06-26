import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (req, res) {
  const { page, firstName, lastName, stateId } = req.query;
  let where = {};
  if (firstName) {
    where = { ...where, first_name: { contains: firstName } };
  }
  if (lastName) {
    where = { ...where, last_name: { contains: lastName } };
  }

  if (stateId) {
    where = { ...where, id: parseInt(stateId) };
  }
  const posts = await prisma.fivem_characters.findMany({
    where,
    take: 5,
    skip: page !== undefined ? 20 * parseInt(page) : 0,
    orderBy: { id: 'asc' },
  });
  res.json(posts);
}
