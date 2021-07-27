import { mdt_booked_charges, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { string, z } from 'zod';
import { stringToNumber } from '../../../utils/parse';

const prisma = new PrismaClient();

const ReportRequest = z.object({
  reportId: z.string().transform(stringToNumber),
});

const ReportBodyRequest = z.object({
  content: z.string(),
  title: z.string(),
  filingOfficerId: z.number(),
  draft: z.boolean(),
});

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof ReportRequest>;

const Reports = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    case 'PATCH':
      return PATCH(req, res);
    default:
      throw new Error('Not it chief');
  }
};

export default Reports;

const PATCH = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { reportId } = ReportRequest.parse(req.query) as { reportId: number };
  const { content, title, filingOfficerId, draft } = ReportBodyRequest.parse(JSON.parse(req.body));

  const session = await getSession({ req });
  const copId = session?.user.copId;
  if (!copId) {
    throw 'Not a cop/not logged in';
  }

  if (filingOfficerId !== copId) {
    throw "you're not the officer that wrote this";
  }

  const reportRes = await prisma.mdt_reports_new.update({
    where: {
      reportid: reportId,
    },
    data: {
      content,
      title,
      draft: Boolean(draft),
    },
  });

  res.json(reportRes);
};

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

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { reportId } = ReportRequest.parse(req.query);

  if (!reportId) {
    return res.status(300).json({
      status: 300,
      message: 'Could not find report id',
    });
  }

  const citizen = await prisma.mdt_reports_new.findFirst({
    where: {
      reportid: reportId,
    },
    include: {
      mdt_bookings_new: {
        include: {
          mdt_booked_charges_new: true,
        },
      },
    },
  });

  res.json(citizen);
};
