import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

const PenalPOST = z.object({
  chargeTitle: z.string(),
  chargeDescription: z.string(),
  chargeTime: z.string().transform(stringToNumber),
  chargeFine: z.string().transform(stringToNumber),
  chargeCategory: z.string().transform(stringToNumber),
  chargeClass: z.string(),
});

const PenalGET = z.object({
  getDeleted: z.ostring(),
});

const PenalDELETE = z.object({
  chargeId: z.string().transform(stringToNumber),
});

type NextApiRequestWithQuery = NextApiRequest &
  (z.infer<typeof PenalPOST> | z.infer<typeof PenalDELETE> | z.infer<typeof PenalGET>);
export default async function Citizen(
  req: NextApiRequestWithQuery,
  res: NextApiResponse,
): Promise<void> {
  const METHOD = req.method;

  switch (METHOD) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    case 'DELETE':
      return DELETE(req, res);
    default:
      throw 'No clue how you got here buddy :).';
  }
}

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { getDeleted } = PenalGET.parse(req.query);

  const posts = await prisma.mdt_charges_categories.findMany({
    include: {
      mdt_charges: {},
    },
  });
  res.json(posts);
};

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { chargeClass, chargeDescription, chargeTitle, chargeCategory, chargeFine, chargeTime } =
    PenalPOST.parse(JSON.parse(req.body));

  const newCharge = await prisma.mdt_charges.create({
    data: {
      category_id: chargeCategory,
      class: chargeClass,
      description: chargeDescription,
      fine: chargeFine,
      name: chargeTitle,
      time: chargeTime,
    },
  });

  res.json(newCharge);
};

const DELETE = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { chargeId } = PenalDELETE.parse(req.query);

  if (!chargeId) {
    throw 'No Charge ID';
  }

  const deletedCharge = await prisma.mdt_charges.update({
    data: {
      deleted: true,
    },
    where: {
      chargeid: chargeId,
    },
  });

  res.json(deletedCharge);
};
