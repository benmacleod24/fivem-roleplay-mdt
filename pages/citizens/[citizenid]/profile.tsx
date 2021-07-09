import { Box, Flex, Heading, Text, Image, Button, Badge, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { fivem_characters, mdt_criminals, mdt_criminal_flags, mdt_flag_types } from '@prisma/client';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import Layout from '../../../components/layout';
import { stringToNumber } from '../../../utils/parse';

export interface CitizenProfileProps {
    
}

interface SWRResponseType extends fivem_characters {
    mdt_criminals: mdt_criminals[]
}

type SWRFlagsResponse = Array<mdt_criminal_flags & mdt_flag_types>
 
const CitizenProfile: React.SFC<CitizenProfileProps> = ({}) => {

    // Router Data
    const router = useRouter();
    const { citizenid } = router.query

    // Session Data
    const [session, loading] = useSession();

    // API Data
    const {data: citizen} = useSWR(`/api/citizen/?citizenid=${citizenid}`) as SWRResponse<SWRResponseType, any>
    const {data: flags, error} = useSWR(`/api/citizen/flags?id=${citizen?.mdt_criminals[0] ? citizen.mdt_criminals[0].criminalid : ""}`) as SWRResponse<SWRFlagsResponse, any>

    if (!citizen) return <React.Fragment></React.Fragment>;

    const calcAge = (dob: string | null): string => {
        if (!dob) return "DoB not found"
        const birthYear = stringToNumber(dob.split("-")[0])
        if (!birthYear) return dob;
        return String(2020 - birthYear)
    }
 
    return ( 
        <Layout>
            <Flex width="full" height="full" direction="column">
                <Box width="full" display="flex" alignItems="center" p="3" mb="3" pr="5" background="gray.700" height="fit-content" borderRadius="md">
                    <Heading flex={1} size="md">Viewing {citizen?.first_name} {citizen?.last_name}</Heading>
                    <Link href={`/booking/${citizen.cuid}`}>
                        {session?.user.isCop ? <Button size="sm" colorScheme="blue">Process</Button> : ""}
                    </Link>
                </Box>
                <Flex width="full" height="30%" maxHeight="30%">
                    <Image mr="3" borderRadius="md" height="auto" width="16%" border="1px solid #4A5568" src={citizen.mdt_criminals && citizen.mdt_criminals[0] && citizen.mdt_criminals[0].image ? citizen.mdt_criminals[0].image : "https://i.imgur.com/tdi3NGah.jpg"} alt="profile-pic"/>
                    <Box p="5" background="gray.700" borderRadius="md" flexGrow={1}>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Name:</Text> {citizen.first_name} {citizen.last_name}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Date of Birth:</Text> {citizen.dob}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Drivers Liscense Ref:</Text> {citizen.cuid.split("-")[0]}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Age:</Text> {calcAge(citizen.dob)}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Gender:</Text> {citizen.gender ? "Female" : "Male"}</Flex>
                        <Flex mt="3" alignItems="center">
                            {Array.isArray(flags) ? flags.map(f => {
                                return (<Tag key={f.flagid} fontSize="sm" borderRadius="md" p="1" pl="2" pr="2" mr="2" variant="subtle" colorScheme={f.type_color}>
                                    <TagLabel>{f.type_name}</TagLabel>
                                    {session?.user.isCop ? <TagCloseButton/> : ""}
                                </Tag>)
                            }) : ""}
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Layout>
     );
}
 
export default CitizenProfile;