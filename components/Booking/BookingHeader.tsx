import { Badge, Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { BookingSWR } from '../../pages/booking/[cuid]';

export interface BookingHeaderProps {
    character: BookingSWR | undefined
}

const BookingHeader: React.SFC<BookingHeaderProps> = ({ character }) => {
    return (
        <Flex mb="8">
            <Heading flex={1} size="md">Processing {character && character.first_name} {character && character.last_name}</Heading>
            <Flex alignItems="center">
                <Badge borderRadius="sm" ml="2" px="1.5" py="0.5" colorScheme="blue">infraction</Badge>
                <Badge borderRadius="sm" ml="2" px="1.5" py="0.5" colorScheme="orange">misdemeanor</Badge>
                <Badge borderRadius="sm" ml="2" px="1.5" py="0.5" colorScheme="red">Felony</Badge>
            </Flex>
        </Flex>
    );
}

export default BookingHeader;