import { NextApiRequest, NextApiResponse } from 'next';

export interface OfficerStatus {
  characterId: number;
  statusNumber: string;
}

// Temp Officer Status Table
const officerStatuses: OfficerStatus[] = [];

const DispatchStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const METHOD = req.method;

  switch (METHOD) {
    default:
      throw 'Your a dumbass for getting here.';
  }
};

// Return all the officers in dispatch or just one officer
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  // Return = Array or Object
};
