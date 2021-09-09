import { Flex } from '@chakra-ui/layout';
import * as React from 'react';
import EditCharge from './components/EditCharge/EditCharge';
import NewCharge from './components/NewCharge/NewCharge';

export interface DojContainerProps {}

const DojContainer: React.FunctionComponent<DojContainerProps> = ({}) => {
  return (
    <Flex w="full" h="full" px="4" flexDir={['column', 'column', 'column', 'row']}>
      <NewCharge />
      <EditCharge />
    </Flex>
  );
};

export default DojContainer;
