// import Image from 'next/image';
import Layout from '../../..//components/layout';
import React, { useState } from 'react';
import {
  HStack,
  Button,
  VStack,
  Box,
  Image,
  Text,
  useColorModeValue,
  theme,
  Flex,
  Grid,
  GridItem,
  Tooltip,
  Input,
  IconButton,
  Stack,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
// import useSWR from 'swr';
import * as Form from '../../../components/form';
import { toQuery } from '../../../utils/query';
import { fivem_characters, mdt_charges } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession, useSession } from 'next-auth/client';
import { Session } from 'inspector';
import { LoadableContentSafe } from '../../../ui/LoadableContent';
import { useRouter } from 'next/router';
import usePenal from '../../../components/hooks/api/usePenal';
import { Radio as RadioUI } from '@chakra-ui/react';
import { Text as TextForm } from '../../../components/form/text';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

const ChargeBox = ({
  charge,
  addCharge,
}: {
  charge: mdt_charges;
  addCharge: (a: mdt_charges) => void;
}) => {
  const classColor = () => {
    switch (charge.class) {
      case 'infraction':
        return 'blue';
      case 'misdemeanor':
        return 'orange';
      case 'felony':
        return 'red';
      default:
        return;
    }
  };

  return (
    <Tooltip hasArrow label={charge.description}>
      <GridItem
        borderRadius=".5rem"
        background={classColor()}
        key={charge.chargeid}
        height="5rem"
        w="12rem"
        onClick={() => addCharge(charge)}
      >
        <Flex flexDir="column" justifyContent="center" alignItems="center" h="100%" w="100%">
          <Text
            textAlign="center"
            w="12em"
            fontWeight="bold"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            fontSize="sm"
          >
            {charge.name}
          </Text>
          {charge.time === TRIAL ? (
            <Text>Hold Until Trial</Text>
          ) : (
            <Text fontSize="sm">{`${charge.time} | Penalty: $${charge.fine}`}</Text>
          )}
        </Flex>
      </GridItem>
    </Tooltip>
  );
};

interface chargeAndCount {
  counts: number;
  charge: mdt_charges;
}

const TRIAL = 99999;

export default function Home({ session }: { session: Session }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState(0);
  const router = useRouter();
  const { category: penal, error: penalError } = usePenal();
  const { cuid } = router.query;
  const { data: character, error: characterError } = useSWR(
    `/api/citizen/?citizenid=${cuid}`,
  ) as SWRResponse<
    {
      id: number;
      uId: number | null;
      cuid: string;
      first_name: string | null;
      last_name: string | null;
      dob: string | null;
      gender: boolean | null;
    },
    any
  >;
  const [filter, setFilter] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(event.target.value.toLowerCase());
  const [selectedCharges, setSelectedCharges] = useState<Record<number, chargeAndCount>>({});

  const addCharge = (c: mdt_charges) => {
    if (!selectedCharges[c.chargeid]) {
      const newCharge = {} as Record<number, chargeAndCount>;
      newCharge[c.chargeid] = { counts: 1, charge: c };
      setSelectedCharges({ ...selectedCharges, ...newCharge });
    } else {
      const updatedCharge = Object.assign({}, selectedCharges);
      updatedCharge[c.chargeid].counts = updatedCharge[c.chargeid].counts + 1;
      setSelectedCharges(updatedCharge);
    }
  };

  const removeCharge = (chargeId: number) => {
    const updatedCharge = Object.assign({}, selectedCharges);

    if (selectedCharges[chargeId].counts > 1) {
      updatedCharge[chargeId].counts = updatedCharge[chargeId].counts - 1;
    } else {
      delete updatedCharge[chargeId];
    }
    setSelectedCharges(updatedCharge);
  };

  return (
    <Layout>
      <Box>
        Processing {`${character && character.first_name} ${character && character.last_name}`}
      </Box>
      <Input placeholder="filter" value={filter} onChange={e => handleChange(e)} />
      <LoadableContentSafe data={{ character, penal }} errors={[characterError, penalError]}>
        {({ character, penal }) => {
          return (
            <HStack
              flexDir="row"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              h="100%"
              w="100%"
              spacing="6"
            >
              {/* <VStack spacing="6" flexDir="row" w="100%"> */}
              <Box w="70%">
                <Box>
                  {penal.map(p => {
                    return (
                      <VStack key={p.categoryid}>
                        <Box>{p.name}</Box>
                        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                          {p.mdt_charges
                            .filter(c => {
                              return (
                                (c.description && c.description.toLowerCase().match(filter)) ||
                                (c.name && c.name.toLowerCase().match(filter))
                              );
                            })
                            .map(c => {
                              return (
                                <ChargeBox key={c.category_id} charge={c} addCharge={addCharge} />
                              );
                            })}
                        </Grid>
                      </VStack>
                    );
                  })}
                </Box>
              </Box>
              <Box w="30%" h="100%">
                Booking Charges
                <BookingCharges
                  character={character}
                  selectedCharges={selectedCharges}
                  removeCharge={removeCharge}
                />
              </Box>
              {/* </VStack> */}
            </HStack>
          );
        }}
      </LoadableContentSafe>
    </Layout>
  );
}

const BookingCharges = ({
  selectedCharges,
  removeCharge,
  character,
}: {
  selectedCharges: Record<number, chargeAndCount>;
  removeCharge: (a: number) => void;
  character: {
    id: number;
    uId: number | null;
    cuid: string;
    first_name: string | null;
    last_name: string | null;
    dob: string | null;
    gender: boolean | null;
  };
}) => {
  const timeAndPenalty = Object.values(selectedCharges).reduce(
    (acc, res) => {
      acc.time += res.counts * (res.charge.time ?? 0);
      acc.penalty += res.counts * (res.charge.fine ?? 0);
      return acc;
    },
    {
      time: 0,
      penalty: 0,
    },
  );

  const chargesValues = Object.values(selectedCharges);

  const initialValues = {
    firstName: character.first_name,
    lastName: character.last_name,
    stateId: character.uId,
    plea: undefined,
    bookingReduction: '0',
  };

  console.log(selectedCharges);

  return (
    <>
      <Flex style={{ visibility: chargesValues.length ? 'hidden' : 'visible' }}>
        No Charges currently selected.
      </Flex>
      <Flex style={{ visibility: !chargesValues.length ? 'hidden' : 'visible' }}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            const chargesAndCounts = chargesValues.map(c => ({
              chargeId: c.charge.chargeid,
              charge_count: c.counts,
            }));
            const submission = Object.assign({
              ...timeAndPenalty,
              ...values,
              ...{ chargesAndCounts },
            });

            // todo fix the override time to not apply when empty
            // todo fix booking reduction to show live

            console.log(submission);
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<typeof initialValues>) => (
            <FForm>
              <Flex flexDir="column">
                {chargesValues.map(c => {
                  return (
                    <Flex
                      key={`booking-${c.charge.chargeid}`}
                      flexDir="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb="1rem"
                    >
                      <Text fontSize="xs" fontWeight="bold">
                        {c.charge.name}
                      </Text>
                      <Flex flexDir="row" justifyContent="center" alignItems="center">
                        <Text>{c.counts}</Text>
                        <IconButton
                          ml="1rem"
                          size="sm"
                          aria-label="close"
                          onClick={() => removeCharge(c.charge.chargeid)}
                          icon={<CloseIcon />}
                        />{' '}
                      </Flex>
                    </Flex>
                  );
                })}
                <Flex flexDir="row"></Flex>
                {timeAndPenalty.time < TRIAL ? (
                  <Flex flexDir="column">
                    <Text>time:</Text> <Text>{timeAndPenalty.time} Month(s);</Text>
                  </Flex>
                ) : (
                  <Flex flexDir="column">
                    <Text>Time:</Text> <Text>Hold Until Trial</Text>
                  </Flex>
                )}
                {timeAndPenalty.penalty < TRIAL ? (
                  <Flex flexDir="column">penalty: ${timeAndPenalty.penalty}</Flex>
                ) : (
                  <Flex flexDir="column">
                    <Text>Penalty:</Text> <Text>Hold Until Trial</Text>
                  </Flex>
                )}

                <TextForm type="string" label="Override time" name="time" />

                {/* todo get proper values here */}
                <Flex mt="2rem">
                  <Form.Select type="string" placeholder="Select plea" label="Yolo" name="plea">
                    <option value="guilty">Plea of guilty</option>
                    <option value="innocense">Plea of innocense</option>
                    <option value="no_contest">Plea of no contest</option>
                  </Form.Select>
                </Flex>

                <Flex mt="2rem" flexDir="column">
                  <Text>Booking reduction</Text>
                  <RadioGroup
                    name="bookingReduction"
                    defaultValue={'0'}
                    onChange={e => {
                      props.setFieldValue('bookingReduction', e);
                    }}
                  >
                    <HStack>
                      <Radio value={'0'} defaultChecked>
                        0%
                      </Radio>
                      <Radio value={'25'}>25%</Radio>
                      <Radio value={'50'}>50%</Radio>
                      <Radio value={'75'}>75%</Radio>
                    </HStack>
                  </RadioGroup>
                </Flex>
                <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                  <SearchIcon />
                </Button>
              </Flex>
            </FForm>
          )}
        </Formik>
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (!session || !session.user || !session.user.isCop) {
    const res = ctx.res;
    if (res) {
      res.writeHead(302, {
        Location: `/?l=t`,
      });
      res.end();
      return { props: {} };
    }
  }
  return { props: { session } };
};
