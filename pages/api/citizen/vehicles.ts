import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { stringToNumber } from "../../../utils/parse";

const prisma = new PrismaClient();

const CitizenVehicleRequest = z.object({
    cid: z.ostring().transform(stringToNumber)
})

type NextApiRequestWithQuery = NextApiRequest & z.infer<typeof CitizenVehicleRequest>

const CitizenVehicles = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
    switch(req.method) {
        case "GET":
            return GET(req, res);
        default: 
            throw new Error("How the fuck you get here?")
    }
}

export default CitizenVehicles

const GET = async (req: NextApiRequestWithQuery, res: NextApiResponse) => {

    const { cid } = CitizenVehicleRequest.parse(req.query)

    if (!cid) {
        return new Error("Could not find ID")
    }

    const vehicles = await prisma.fivem_vehicles.findMany({
        where: {
            ownerid: cid
        },
        select: {
            name: true,
            plate: true,
            vehicleuid: true,
            gov: true
        }
    })

    res.json(vehicles)
}