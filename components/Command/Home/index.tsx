import { Flex } from '@chakra-ui/layout';
import * as React from 'react';
import RegisterOfficer from './components/RegisterOfficer';

export interface CommandHomeProps {}

const CommandHome: React.FunctionComponent<CommandHomeProps> = ({}) => {
  return (
    <Flex w="full" h="full">
      <RegisterOfficer />
    </Flex>
  );
};

export default CommandHome;
