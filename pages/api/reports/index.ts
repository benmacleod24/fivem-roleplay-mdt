import {
  mdt_booked_charges,
  PrismaClient,
  fivem_characters,
  mdt_criminals,
  mdt_charges,
  Prisma,
} from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { string, z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof ReportRequest>;

const Reports = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    default:
      throw new Error('Not it chief');
  }
};

export default Reports;

const POST = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  throw 'not yet implemented';
  // const { officerId, criminal_id, report_id, for_warrant, booking_plea, booking_reduction, charges } =
  //   req.body;
  // const booked_charges: mdt_booked_charges[] = charges;
  // const date = new Date(dayjs().toISOString());
  // const bookingRes = await prisma.mdt_bookings.create({
  //   data: {
  //     officer_id: officerId,
  //     criminal_id,
  //     report_id,
  //     date,
  //     for_warrant,
  //     booking_plea,
  //     booking_reduction,
  //     mdt_booked_charges: { create: booked_charges },
  //   },
  // });
  // res.json(bookingRes);
};

const ReportRequest = z.object({
  page: z.ostring().transform(stringToNumber),
  suspectFirstName: z.ostring(),
  suspectLastName: z.ostring(),
  suspectStateId: z.ostring().transform(stringToNumber),
  copFirstName: z.ostring(),
  copLastName: z.ostring(),
});

export type Reportsz = Prisma.PromiseReturnType<typeof GET>;

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { page, suspectFirstName, suspectLastName, suspectStateId, copFirstName, copLastName } =
    ReportRequest.parse(req.query);

  let where = {};
  if (suspectFirstName || suspectLastName || suspectStateId) {
    where = {
      ...where,
      fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId: {
        first_name: suspectFirstName ? { contains: suspectFirstName } : {},
        last_name: suspectLastName ? { contains: suspectLastName } : {},
        id: suspectStateId ? suspectStateId : undefined,
      },
    };
  }
  if (copFirstName || copLastName) {
    where = {
      ...where,
      fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId: {
        first_name: copFirstName ? { contains: copFirstName } : {},
        last_name: copLastName ? { contains: copLastName } : {},
      },
    };
  }
  // use booking because it has more shit already.
  const reports = await prisma.mdt_bookings_new.findMany({
    take: 5,
    skip: page !== undefined && page !== null ? 20 * page : 0,
    orderBy: { bookingId: 'desc' },
    include: {
      mdt_booked_charges_new: {
        include: { mdt_charges: true },
      },
      fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId: {
        select: { first_name: true, last_name: true },
      },
      fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId: {
        select: { first_name: true, last_name: true, image: true },
      },
      mdt_reports_new: true,
    },
    where,
  });

  res.json(reports);
  return reports;
};
