import Layout from '../../components/layout';
import React, { useState } from 'react';
import {
  HStack,
  Button,
  VStack,
  Box,
  Image,
  useColorModeValue,
  theme,
  Flex,
  Heading,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
import * as Form from '../../components/form';
import { toQuery } from '../../utils/query';
import { fivem_characters, mdt_criminals, mdt_reports_new } from '@prisma/client';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { LoadableContentSafe } from '../../ui/LoadableContent';
import { Reportsz } from '../api/reports';

const initialValues = {
  firstName: undefined,
  lastName: undefined,
  stateId: undefined,
};

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

export interface CitizenCardProps {
  index: number;
  searchValues: Record<string, string>;
}

const ReportCard = ({ index, searchValues }: { index: number; searchValues: any }) => {
  // Params & Data
  const searchParams = toQuery(searchValues);
  const [session, loading] = useSession();

  const { data: reports, error } = useSWR(
    index !== null ? `/api/reports?page=${index}&${searchParams}` : null,
  ) as SWRResponse<Reportsz, any>;

  // Chakra Color Modes
  const cardBackground = useColorModeValue(theme.colors.gray[200], theme.colors.gray[700]);

  return (
    <LoadableContentSafe data={{ reports, session }} errors={[error]}>
      {({ reports, session }) => {
        return (
          <VStack spacing="1rem" mt="1%" mb="1%">
            {reports &&
              reports.map(r => {
                const criminal =
                  r.mdt_bookings_new[0]
                    .fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId;
                const filingOfficer =
                  r.mdt_bookings_new[0]
                    .fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId;
                return (
                  <Flex
                    key={r.reportid}
                    boxSizing="border-box"
                    p="1%"
                    pr="3%"
                    borderRadius="md"
                    overflow="hidden"
                    width="100%"
                    background={cardBackground}
                    alignItems="center"
                  >
                    <Image
                      border="1px solid #4A5568"
                      mr="2.5%"
                      boxSize="5.5rem"
                      objectFit="fill"
                      borderRadius="md"
                      src={'https://i.imgur.com/tdi3NGah.jpg'} // todo images later
                      alt="blank_profile_picture"
                    />
                    <Grid
                      templateColumns="repeat(10, 1fr)"
                      gap={6}
                      justifyContent="center"
                      alignItems="center"
                      w="100%"
                    >
                      <GridItem colSpan={3} colStart={0} colEnd={3}>
                        <Heading flex={1} size="md">
                          {r.title ? r.title : 'Untitled report'}
                        </Heading>
                      </GridItem>
                      <GridItem colSpan={4} colStart={3} colEnd={8}>
                        <Flex>
                          {r.mdt_bookings_new[0].mdt_booked_charges_new
                            .map(c => c.mdt_charges.name)
                            .join(', ')}
                        </Flex>
                      </GridItem>
                      <GridItem colSpan={2} colStart={8} colEnd={10}>
                        <VStack>
                          <Flex>Criminal: {`${criminal.first_name} ${criminal.last_name}`}</Flex>
                          <Flex>
                            Officer: {`${filingOfficer.first_name} ${filingOfficer.last_name}`}
                          </Flex>
                        </VStack>
                      </GridItem>
                      <GridItem colSpan={2} colStart={10}>
                        <Flex>
                          <VStack>
                            <Link passHref href={`/reports/${r.reportid}`}>
                              <Button size="sm" colorScheme={r.draft ? 'yellow' : 'green'}>
                                View Report
                              </Button>
                            </Link>
                          </VStack>
                        </Flex>
                      </GridItem>
                    </Grid>
                  </Flex>
                );
              })}
          </VStack>
        );
      }}
    </LoadableContentSafe>
  );
};

export default function Reports() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState({});

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          setSearchValues(values);
          setPageIndex(0);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<typeof initialValues>) => (
          <FForm>
            <HStack justifyContent="center" alignItems="center">
              {/* <Form.Text name="firstName" type="text" label="First name" /> */}
              {/* <Form.Text name="firstName" type="text" label="First Name" placeholder="John" />
              <Form.Text name="lastName" type="text" label="Last Name" placeholder="Smith" />
              <Form.Text name="stateId" type="number" label="State ID" placeholder="1234" />

              <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                <SearchIcon />
              </Button> */}
            </HStack>
          </FForm>
        )}
      </Formik>
      <Box>
        <Flex mt="1rem">
          <Button size="sm" colorScheme="yellow" mr="1rem">
            Draft
          </Button>
          <Button size="sm" colorScheme="green">
            Finalized
          </Button>
        </Flex>
        <ReportCard index={pageIndex} searchValues={searchValues} />
        <Button m="1rem" isDisabled={pageIndex < 1} onClick={() => setPageIndex(pageIndex - 1)}>
          Previous
        </Button>
        <Button m="1rem" onClick={() => setPageIndex(pageIndex + 1)}>
          Next
        </Button>
      </Box>
    </Layout>
  );
}