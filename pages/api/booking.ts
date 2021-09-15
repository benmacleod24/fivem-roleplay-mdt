import { PrismaClient, fivem_characters } from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { z } from 'zod';
import { stringToNumber } from '../../utils/parse';

const prisma = new PrismaClient();

const CitizenRequest = z.object({
  criminalId: z.number(),
  forWarrant: z.boolean(),
  bookingPlea: z.string(),
  bookingReduction: z.string().transform(stringToNumber),
  bookingOverride: z.number(),
  bookedCharges: z.array(
    z.object({
      chargeId: z.number(),
      chargeCount: z.number(),
    }),
  ),
});

const BookingRequest = z.object({
  criminalId: z.string().transform(stringToNumber),
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
  const { criminalId, forWarrant, bookingPlea, bookingReduction, bookedCharges, bookingOverride } =
    CitizenRequest.parse(JSON.parse(req.body));
  const session = await getSession({ req });
  const copId = session?.user.copId;
  if (!copId) {
    throw 'Not a cop/not logged in';
  }
  const date = new Date(dayjs().toISOString());
  const bookingRes = await prisma.mdt_bookings_new.create({
    data: {
      fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId: {
        connect: { id: criminalId },
      },
      fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId: {
        connect: { id: copId },
      },
      date,
      forWarrant,
      bookingPlea,
      bookingReduction,
      bookingOverride,
      mdt_booked_charges_new: { create: bookedCharges },
      mdt_reports_new: {
        create: { filingOfficerId: copId, title: '', content: '', draft: true, date },
      },
    },
  });
  res.json(bookingRes);
};

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { criminalId } = BookingRequest.parse(req.query);

  if (criminalId) {
    const allBookings = await prisma.mdt_bookings_new.findMany({
      where: {
        criminalId: criminalId,
      },
      include: {
        mdt_booked_charges_new: {
          include: {
            mdt_charges: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.json(allBookings);
  }
};
