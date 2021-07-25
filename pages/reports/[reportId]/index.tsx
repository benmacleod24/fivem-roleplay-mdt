// import Image from 'next/image';
import Layout from '../../../components/layout';
import React, { useState } from 'react';
import {
  HStack,
  Button,
  VStack,
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Tooltip,
  Input,
  IconButton,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
// import useSWR from 'swr';
import * as Form from '../../../components/form';
import { mdt_charges } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession } from 'next-auth/client';
import { Session } from 'inspector';
import { LoadableContentSafe } from '../../../ui/LoadableContent';
import router, { useRouter } from 'next/router';
import usePenal from '../../../components/hooks/api/usePenal';
import { Text as TextForm } from '../../../components/form/text';
import * as yup from 'yup';
import { createBooking } from '../../../components/hooks/api/postBooking';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

export default function Home({ session }: { session: Session }) {
  const router = useRouter();
  const { category: penal, error: penalError } = usePenal();
  const { reportId } = router.query;
  const { data, error } = useSWR(`/api/reports/${reportId}`);
  console.log('stuff: ', data);
  // const { data: character, error: characterError } = useSWR(
  //   `/api/citizen/?citizenid=${id}`,
  // ) as SWRResponse<
  //   {
  //     id: number;
  //     uId: number | null;
  //     cuid: string;
  //     first_name: string | null;
  //     last_name: string | null;
  //     dob: string | null;
  //     gender: boolean | null;
  //   },
  //   any
  // >;

  // console.log(character)
  // const [filter, setFilter] = useState('');
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setFilter(event.target.value.toLowerCase());
  // const [selectedCharges, setSelectedCharges] = useState<Record<number, chargeAndCount>>({});

  // const addCharge = (c: mdt_charges) => {
  //   if (!selectedCharges[c.chargeid]) {
  //     const newCharge = {} as Record<number, chargeAndCount>;
  //     newCharge[c.chargeid] = { counts: 1, charge: c };
  //     setSelectedCharges({ ...selectedCharges, ...newCharge });
  //   } else {
  //     const updatedCharge = Object.assign({}, selectedCharges);
  //     updatedCharge[c.chargeid].counts = updatedCharge[c.chargeid].counts + 1;
  //     setSelectedCharges(updatedCharge);
  //   }
  // };

  // const removeCharge = (chargeId: number) => {
  //   const updatedCharge = Object.assign({}, selectedCharges);

  //   if (selectedCharges[chargeId].counts > 1) {
  //     updatedCharge[chargeId].counts = updatedCharge[chargeId].counts - 1;
  //   } else {
  //     delete updatedCharge[chargeId];
  //   }
  //   setSelectedCharges(updatedCharge);
  // };

  return (
    <Layout>
      hi
      {/* <Box>
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
              <Box w="70%">
                <Box mb="2rem">
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
            </HStack>
          );
        }}
      </LoadableContentSafe> */}
    </Layout>
  );
}

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
