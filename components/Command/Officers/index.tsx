import {
  fivem_characters,
  mdt_department_members,
  mdt_department_ranks,
  mdt_department_subdepartments,
  mdt_member_subdepartments,
} from '.prisma/client';
import { Button, IconButton } from '@chakra-ui/button';
import { DeleteIcon, EditIcon, EmailIcon, Search2Icon } from '@chakra-ui/icons';
import { Flex, Grid, Heading, Text } from '@chakra-ui/layout';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import {
  Checkbox,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  ModalBody,
  Select,
  Tag,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import * as React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { LoadableContentSafe } from '../../../ui/LoadableContent';
import { FiHash } from 'react-icons/fi';
import { BiSave } from 'react-icons/bi';
import { Formik, FormikProps, Form as FForm } from 'formik';
import useDepartments from '../../hooks/api/useDepartments';
import { patchMember } from '../../hooks/api/patchMember';

interface OfficersProps {}

export interface DeptMember extends mdt_department_members {
  fivem_characters: DeptFivemMember;
  mdt_department_ranks: mdt_department_ranks;
}

export interface DeptFivemMember extends fivem_characters {
  mdt_member_subdepartments: Array<
    mdt_member_subdepartments & {
      mdt_department_subdepartments: mdt_department_subdepartments;
    }
  >;
}

const Officers: React.FunctionComponent<OfficersProps> = ({}) => {
  const [session, loading] = useSession();
  const [officer, setOfficer] = React.useState<number | undefined>();
  const [filter, setFilter] = React.useState('');
  const { departments, error: deptError } = useDepartments();
  const [department, setDepartment] = React.useState(session?.user.dept);

  const {
    data: officers,
    error,
    mutate,
  } = useSWR(`/api/departments/members?departmentId=${department}`) as SWRResponse<
    DeptMember[],
    any
  >;

  const {
    data: member,
    error: memberError,
    mutate: MutateMember,
    revalidate,
  } = useSWR(
    Boolean(officer) ? `/api/departments/members?characterId=${officer}` : '',
  ) as SWRResponse<DeptMember, any>;

  const {
    data: subdepartments,
    error: subdepartmentsError,
    mutate: subdepartmentsMutate,
  } = useSWR(Boolean(officer) ? `/api/departments/sub` : '') as SWRResponse<
    mdt_department_subdepartments[],
    any
  >;

  const onDeleteSub = async (id: number) => {
    const _delete = await fetch(`/api/departments/sub`, {
      method: 'DELETE',
      body: JSON.stringify({
        id,
        characterId: member?.characterId,
      }),
    }).then(r => r.json());
    MutateMember();
  };

  const onPostSub = async (id: number) => {
    const post = await fetch(`/api/departments/sub`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        characterId: member?.characterId,
      }),
    }).then(r => r.json());
    MutateMember();
  };

  return (
    <React.Fragment>
      <Flex
        maxW="full"
        w="full"
        h="full"
        alignItems="center"
        justifyContent="center"
        px="4"
        flexDir="column"
      >
        <LoadableContentSafe data={{ officers }} errors={[error]}>
          {({ officers }) => {
            return (
              <React.Fragment>
                <Flex w="full" alignItems="flex-start" justifyContent="space-between">
                  <InputGroup variant="filled" mb="5" w="40%">
                    <InputLeftElement children={<Search2Icon />} />
                    <Input
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                      placeholder="Search Officers"
                      _focus={{ boxShadow: 'none' }}
                    />
                  </InputGroup>
                  {session!.user.rankLvl! >= 5 && (
                    <Select
                      variant="filled"
                      w="20%"
                      value={department}
                      _focus={{ boxShadow: 'none' }}
                      onChange={e => setDepartment(Number(e.target.value))}
                    >
                      {departments?.map(d => (
                        <option value={d.departmentId}>
                          {d.departmentName.toLocaleUpperCase()}
                        </option>
                      ))}
                    </Select>
                  )}
                </Flex>
                <Grid
                  maxW="full"
                  w="full"
                  h="full"
                  alignContent="start"
                  templateColumns="repeat(3, 1fr)"
                  gap="3"
                >
                  {officers
                    .filter(
                      o =>
                        o.fivem_characters.first_name
                          ?.toLocaleLowerCase()
                          .includes(filter.toLocaleLowerCase()) ||
                        o.fivem_characters.last_name
                          ?.toLocaleLowerCase()
                          .includes(filter.toLocaleLowerCase()) ||
                        o.callSign.includes(filter),
                    )
                    .sort(
                      (a, b) => b.mdt_department_ranks.rankLevel - a.mdt_department_ranks.rankLevel,
                    )
                    .map(o => (
                      <Flex
                        w="full"
                        h="full"
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
                            {o.mdt_department_ranks.rankName}
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
              </React.Fragment>
            );
          }}
        </LoadableContentSafe>
      </Flex>
      <Modal isCentered isOpen={Boolean(officer)} onClose={() => setOfficer(undefined)}>
        <ModalOverlay background="blackAlpha.500" backdropFilter="blur(0.5px)" />
        <ModalContent>
          <LoadableContentSafe data={{ member }} errors={[memberError]}>
            {({ member }) => (
              <ModalBody px="8" py="5">
                <Flex w="100%" flexDir="column" mx="auto">
                  <Flex>
                    <Heading size="md">
                      {member.mdt_department_ranks.rankName} {member.fivem_characters.first_name}{' '}
                      {member.fivem_characters.last_name}
                    </Heading>
                  </Flex>
                  <Formik
                    onSubmit={async (values, action) => {
                      try {
                        const _member = await patchMember({
                          rankId: Number(values.rankId),
                          departmentId: values.departmentId,
                          memberId: member.memberId,
                          callSign: values.callSign,
                          email: values.email ? values.email : '',
                        });
                        MutateMember();
                        revalidate();
                        setOfficer(undefined);
                      } catch (e) {}
                    }}
                    initialValues={{
                      callSign: member.callSign,
                      rankId: member.rankId,
                      departmentId: member.departmentId,
                      email: member.email,
                    }}
                  >
                    {props => (
                      <FForm>
                        <Grid my="5" mb="8" templateColumns="repeat(1, 1fr)" gap="3.5">
                          <InputGroup variant="filled">
                            <InputLeftAddon children={<FiHash />} />
                            <Input
                              placeholder="Call Sign"
                              _focus={{ boxShadow: 'none' }}
                              value={props.values.callSign}
                              onChange={e => {
                                if (isNaN(Number(e.target.value))) return;
                                props.setFieldValue('callSign', e.target.value);
                              }}
                            />
                          </InputGroup>
                          <Flex flexDir="column">
                            <Text fontSize="sm" color="yellow.300" mb="0.5">
                              Contact Info:
                            </Text>
                            <InputGroup variant="filled">
                              <InputLeftAddon children={<EmailIcon />} />
                              <Input
                                placeholder="Email"
                                _focus={{ boxShadow: 'none' }}
                                value={props.values.email ? props.values.email : ''}
                                onChange={e => {
                                  props.setFieldValue('email', e.target.value);
                                }}
                              />
                            </InputGroup>
                          </Flex>
                          <Flex flexDir="column">
                            <Text fontSize="sm" color="yellow.300" mb="0.5">
                              Member Rank:
                            </Text>
                            <Select
                              value={String(props.values.rankId)}
                              onChange={e => {
                                props.setFieldValue('rankId', e.target.value);
                              }}
                            >
                              {departments
                                ?.find(d => d.departmentId === department)
                                ?.mdt_department_ranks.map(r => (
                                  <option value={r.rankId} key={r.rankId}>
                                    {r.rankName}
                                  </option>
                                ))}
                            </Select>
                          </Flex>
                          <Flex flexDir="column">
                            <Text fontSize="sm" mb="1" color="yellow.300">
                              Sub Departments:
                            </Text>

                            {subdepartments?.map(msb => {
                              const isChecks =
                                member.fivem_characters.mdt_member_subdepartments.find(
                                  msd => msd.subDepartmentName === msb.subdepartmentId,
                                );

                              return (
                                <Checkbox
                                  isChecked={Boolean(isChecks)}
                                  onChange={e =>
                                    Boolean(isChecks)
                                      ? onDeleteSub(msb.subdepartmentId)
                                      : onPostSub(msb.subdepartmentId)
                                  }
                                >
                                  {msb.subdepartmentName}
                                </Checkbox>
                              );
                            })}
                          </Flex>
                        </Grid>
                        <Flex>
                          <Button
                            size="sm"
                            mr="2.5"
                            type="submit"
                            isLoading={props.isSubmitting}
                            colorScheme="yellow"
                            leftIcon={<BiSave />}
                          >
                            Submit Changes
                          </Button>
                          <Button size="sm" colorScheme="red" leftIcon={<DeleteIcon />}>
                            Remove Officer
                          </Button>
                        </Flex>
                      </FForm>
                    )}
                  </Formik>
                </Flex>
              </ModalBody>
            )}
          </LoadableContentSafe>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default Officers;
