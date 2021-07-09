import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { stringToNumber } from "../../../utils/parse";

const prisma = new PrismaClient();

const CitizenFlagRequest = z.object({
    id: z.ostring().transform(stringToNumber)
})

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenFlagRequest>

const CitizenFlags = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
    switch(req.method) {
        case "GET":
            return GET(req, res);
        default:
            throw new Error("Some how got here?")
    }
}

export default CitizenFlags

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {

    const { id } = CitizenFlagRequest.parse(req.query)

    if (!id) {
        return res.status(300).json({
            status: 300,
            message: "Could not find citizen uid."
        })
    }

    const flags = await prisma.$queryRaw(`
        SELECT *
        FROM _mdt_criminal_flags f
        INNER JOIN _mdt_flag_types t
        ON t.typeid = f.type_id
        WHERE f.criminal_id = ${id}
    `)

    res.json(flags)
}