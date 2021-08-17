import { Flex } from '@chakra-ui/layout';
import * as React from 'react';
import NewCharge from './components/NewCharge/NewCharge';

export interface DojContainerProps {}

const DojContainer: React.SFC<DojContainerProps> = ({}) => {
  return (
    <Flex w="full" h="full" px="4">
      <NewCharge />
    </Flex>
  );
};

export default DojContainer;
