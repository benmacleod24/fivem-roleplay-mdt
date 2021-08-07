import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { string, z } from 'zod';
import { stringToNumber } from "../../../utils/parse";

const prisma = new PrismaClient();

const CitizenRequest = z.object({
    citizenid: z.ostring()
})

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenRequest>

const Citizen = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {

    switch(req.method) {
        case "GET":
            return GET(req, res);
        default:
            throw new Error("Not it chief")
    }
}

export default Citizen

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
    const { citizenid } = CitizenRequest.parse(req.query);

    if (!citizenid) {
        return res.status(300).json({
            status: 300,
            message: "Could not find citizens id"
        })
    }

    const citizen = await prisma.fivem_characters.findFirst({
        where: {
            cuid: citizenid
        },
        include: {
            mdt_criminals: {
                where: {
                    character_uid: citizenid
                },
            }
        }
    })

    res.json(citizen)
}