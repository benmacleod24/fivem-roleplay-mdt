import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const Flags = (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
        case "GET":
            return GET(req, res)
        default: 
        throw new Error("Don't know how you got here?")
    }
}

export default Flags

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const flags = await prisma.mdt_flag_types.findMany();
    res.json(flags)
}