import { Flex, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import * as React from 'react';
import usePenal from '../../components/hooks/api/usePenal';
import Layout from '../../components/layout';
import PCodeAccordian from './components/accordian';

export interface PenalCodeProps {

}

const PenalCode: React.SFC<PenalCodeProps> = ({ }) => {
    const { category, error } = usePenal();

    return (
        <Layout>
            <Flex pt="1%" width="100%" height="100%" direction="column">
                <PCodeHeader />
                {!category ? <PCodeLoading /> : ""}
                {category && category.length ? <PCodeAccordian category={category} /> : ""}
            </Flex>
        </Layout>
    );
}

export default PenalCode;

// Header Component for Penal Code
export interface PCodeHeaderProps { }

const PCodeHeader: React.SFC<PCodeHeaderProps> = ({ }) => {
    return (
        <Flex direction="column">
            <Heading mb="2" size="md">San Andreas State Penal Code</Heading>
            <Text color="gray.400">
                The San Andreas state penal code provides an outline for all state mandated laws. Each charge will consisit of a title, time to be served, fine to be paid, and the classification of the charge. The penal code may be updated by the department of justice if laws are to be changed.
            </Text>
        </Flex>
    );
}

// Penal Code Loading Skelton
export interface PCodeLoadingProps { }

const PCodeLoading: React.SFC<PCodeLoadingProps> = (props) => {
    return (
        <VStack spacing="4" mt="5">
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
            <Skeleton speed={1} width="full" height="10" />
        </VStack>
    );
}