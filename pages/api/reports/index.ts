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
  firstName: z.ostring(),
  lastName: z.ostring(),
  stateId: z.ostring().transform(stringToNumber),
  cuid: z.ostring(),
});

export type Reportsz = Prisma.PromiseReturnType<typeof GET>;

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  // throw 'not yet implemnted'
  // const { reportId } = ReportRequest.parse(req.query);

  // console.log('yeet', reportId);
  // console.log('yeet');
  // if (!reportId) {
  //   return res.status(300).json({
  //     status: 300,
  //     message: 'Could not find report id',
  //   });
  // }

  const { page, firstName, lastName, stateId, cuid } = ReportRequest.parse(req.query);

  let where = {};
  if (firstName) {
    where = { ...where, first_name: { contains: firstName } };
  }
  if (lastName) {
    where = { ...where, last_name: { contains: lastName } };
  }

  if (stateId) {
    where = { ...where, id: stateId };
  }

  // todo just use bookings, less nesting and we can do searches by criminal id easier
  const whereCriminal = { firstName: 'Lays' };
  const reports = await prisma.mdt_reports_new.findMany({
    // where: {
    //   filingOfficerId: 5892,
    // },
    take: 5,
    skip: page !== undefined && page !== null ? 20 * page : 0,
    orderBy: { reportid: 'desc' },
    include: {
      mdt_bookings_new: {
        
        include: {
          mdt_booked_charges_new: {
            include: { mdt_charges: true },
          },
          fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId: {
            select: { first_name: true, last_name: true },
          },
          fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId: {
            select: { first_name: true, last_name: true },
          },
        },
      },
    },
    // select: {
    //   mdt_booked_charges_new: {},
    // },
    // include: {
    //   mdt_bookings_new: {
    //     include: {
    //       mdt_booked_charges_new: {
    //         include: { mdt_charges: true },
    //       },
    //       fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId: {
    //         select: { first_name: true, last_name: true },
    //       },
    //       fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId: {
    //         select: { first_name: true, last_name: true },
    //       },
    //     },
    //   },
    // },
  });

  res.json(reports);
  return reports;
};
