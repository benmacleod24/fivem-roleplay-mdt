import { mdt_department_members } from '.prisma/client';
import { Flex } from '@chakra-ui/layout';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { tDeptMembers } from '../../../pages/api/departments/members';

interface OfficersProps {}

const Officers: React.FunctionComponent<OfficersProps> = ({}) => {
  const { data: officers } = useSWR(`/api/departments/members?departmentId=1`) as SWRResponse<
    tDeptMembers,
    any
  >;

  return (
    <Flex w="full" h="full">
      {officers?.map(o => `${o.fivem_characters.first_name} ${o.fivem_characters.last_name}`)}
    </Flex>
  );
};

export default Officers;
