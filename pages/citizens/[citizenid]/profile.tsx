import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { fivem_characters, mdt_criminals } from '@prisma/client';
import { useRouter } from 'next/router';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import Layout from '../../../components/layout';

export interface CitizenProfileProps {
    
}

interface SWRResponseType extends fivem_characters {
    mdt_criminals: mdt_criminals[]
}
 
const CitizenProfile: React.SFC<CitizenProfileProps> = ({}) => {

    // Router Data
    const router = useRouter();
    const { citizenid } = router.query

    // API Data
    const {data: citizen, error} = useSWR(`/api/citizen/?citizenid=${citizenid}`) as SWRResponse<SWRResponseType, any>

    if (!citizen) return <React.Fragment></React.Fragment>;

    return ( 
        <Layout>
            <Flex width="full" height="full" direction="column">
                <Box width="full" p="3" mb="3" background="gray.700" height="fit-content" borderRadius="md">
                    <Heading size="md">Viewing {citizen?.first_name} {citizen?.last_name}</Heading>
                </Box>
                <Flex width="full" height="30%" maxHeight="30%">
                    <Image mr="3" borderRadius="md" height="auto" width="16%" border="1px solid #4A5568" src={citizen.mdt_criminals && citizen.mdt_criminals[0] && citizen.mdt_criminals[0].image ? citizen.mdt_criminals[0].image : "https://i.imgur.com/tdi3NGah.jpg"} alt="profile-pic"/>
                    <Box p="5" background="gray.700" borderRadius="md" flexGrow={1}>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Name:</Text> {citizen.first_name} {citizen.last_name}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Date of Birth:</Text> {citizen.dob}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Drivers Liscense Ref:</Text> {citizen.cuid.split("-")[0]}</Flex>
                        <Flex><Text fontWeight="medium" color="blue.400" mr="1">Gender:</Text> {citizen.gender ? "Female" : "Male"}</Flex>
                    </Box>
                </Flex>
            </Flex>
        </Layout>
     );
}
 
export default CitizenProfile;