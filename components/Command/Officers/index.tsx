import { mdt_department_members } from '.prisma/client';
import { IconButton } from '@chakra-ui/button';
import { EditIcon } from '@chakra-ui/icons';
import { Flex, Grid, Heading, Text } from '@chakra-ui/layout';
import { Modal, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { ModalBody } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import { Head } from 'next/document';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { tDeptMember } from '../../../pages/api/departments/member';
import { tDeptMembers } from '../../../pages/api/departments/members';
import { LoadableContentSafe } from '../../../ui/LoadableContent';

interface OfficersProps {}

const Officers: React.FunctionComponent<OfficersProps> = ({}) => {
  const [session, loading] = useSession();
  const [officer, setOfficer] = React.useState<number | undefined>();

  const { data: officers, error } = useSWR(
    `/api/departments/members?departmentId=${session?.user.dept}`,
  ) as SWRResponse<tDeptMembers, any>;

  const { data: member, error: memberError } = useSWR(
    Boolean(officer) ? `/api/departments/member?characterId=${officer}` : '',
  ) as SWRResponse<tDeptMember, any>;

  return (
    <React.Fragment>
      <Flex maxW="full" w="full" h="full" alignItems="center" justifyContent="center" px="4">
        <LoadableContentSafe data={{ officers }} errors={[error]}>
          {({ officers }) => {
            return (
              <Grid
                maxW="full"
                w="full"
                h="full"
                alignContent="start"
                templateColumns="repeat(3, 1fr)"
                gap="3"
              >
                {officers.map(o => (
                  <Flex
                    w="full"
                    h="fit-content"
                    background="gray.700"
                    py="4"
                    px="3"
                    borderRadius="lg"
                    justifyContent="center"
                    alignItems="center"
                    flexDir="column"
                    pos="relative"
                    maxW="100%"
                    boxSizing="border-box"
                  >
                    <Flex alignItems="center" justifyContent="center" pos="relative" w="100%">
                      <Heading size="md" maxW="100%" isTruncated>
                        {o.fivem_characters.first_name} {o.fivem_characters.last_name}
                      </Heading>
                    </Flex>
                    <Flex mt="1" alignItems="center" justifyContent="center">
                      <Text mr="2" color="gray.400" fontSize="xs">
                        Rank: {o.rankId}
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        Call Sign: {o.callSign}
                      </Text>
                    </Flex>
                    <IconButton
                      onClick={() => setOfficer(o.characterId)}
                      aria-label="edit-officer"
                      icon={<EditIcon />}
                      colorScheme="yellow"
                      variant="ghost"
                      borderRadius="full"
                      size="sm"
                      pos="absolute"
                      right="1.5"
                      top="1.5"
                    />
                  </Flex>
                ))}
              </Grid>
            );
          }}
        </LoadableContentSafe>
      </Flex>
      <Modal isCentered isOpen={Boolean(officer)} onClose={() => setOfficer(undefined)}>
        <ModalOverlay background="blackAlpha.500" backdropFilter="blur(0.5px)" />
        <ModalContent>
          <ModalHeader>Edit Officer</ModalHeader>
          <ModalBody>
            <Text>Editing Character ID {member?.fivem_characters.first_name}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default Officers;
