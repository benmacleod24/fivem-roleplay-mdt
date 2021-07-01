import { PrismaClient, fivem_characters } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { stringToNumber } from '../../../utils/parse';
import { z } from 'zod';

const prisma = new PrismaClient();

const CopListRequest = z.object({
  discord: z.string().transform(stringToNumber),
});

// where: { id: 1929 },
export default async function CopList(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { discord } = CopListRequest.parse(req.query);
  const posts =
    await prisma.$queryRaw(`select u.id, u.discord, c.first_name, c.last_name, c.id, ucj.job_id, wlj.displayName from _fivem_users as u 
	left join _fivem_characters as c on u.id=c.uId
	left join _fivem_whitelist_characters_jobs as ucj on c.id = ucj.character_id
	left join _fivem_whitelist_jobs as wlj on wlj.jobid = ucj.job_id
		where wlj.displayName = 'Police Officer'
		and u.discord = ${discord};`);
  res.json(posts);
}

// fivem_characters: {
//   select: {
//     fivem_users: {
//       where: { id: 1929 },
//     },
//   },
// },
