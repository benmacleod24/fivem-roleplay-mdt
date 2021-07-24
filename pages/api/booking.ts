import { mdt_booked_charges, PrismaClient, mdt_criminals } from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { string, z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  criminal_id: z.number(),
  for_warrant: z.boolean(),
  booking_plea: z.string(),
  booking_reduction: z.number(),
  booked_charges: z.array(
    z.object({
      charge_id: z.number(),
      charge_count: z.number(),
    }),
  ),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>;

const Citizen = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    default:
      throw new Error('Not it chief');
  }
};

export default Citizen;

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { criminal_id, for_warrant, booking_plea, booking_reduction, booked_charges } =
    CitizenRequest.parse(req.body);
  const session = await getSession({ req });
  const copId = session?.user.copId;
  if (!copId) throw 'Not a cop/not logged in';
  const date = new Date(dayjs().toISOString());
  const bookingRes = await prisma.mdt_bookings.create({
    data: {
      officer_id: copId,
      mdt_criminals: { connect: { criminalid: criminal_id } },
      date,
      for_warrant,
      booking_plea,
      booking_reduction,
      mdt_booked_charges: { create: booked_charges },
      mdt_reports: {
        create: { filing_officer_id: copId, title: '', content: '', draft: true, date },
      },
    },
  });
  res.json(bookingRes);
};

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  //   throw 'not yet implemented';
  const { citizenid } = CitizenRequest.parse(req.query);

  if (!citizenid) {
    return res.status(300).json({
      status: 300,
      message: 'Could not find citizens id',
    });
  }

  const citizen = await prisma.mdt_bookings.findMany({
    where: {
      cuid: citizenid,
    },
    include: {
      mdt_criminals: {
        where: {
          character_uid: citizenid,
        },
      },
    },
  });

  res.json(citizen);
};
