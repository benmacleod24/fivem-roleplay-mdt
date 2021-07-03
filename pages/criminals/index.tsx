import Layout from '../../components/layout';
import React, { useState } from 'react';
import { HStack, Button, VStack, Box, Image, useColorModeValue, theme } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
import * as Form from '../../components/form';
import { toQuery } from '../../utils/query';
import { mdt_criminals } from '@prisma/client';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { LoadableContentSafe } from '../../ui/LoadableContent';

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

function Page({ index, searchValues }: { index: number; searchValues: Record<string, string> }) {
  const searchParams = toQuery(searchValues);
  const { data: criminal, error } = useSWR(
    index !== null ? `/api/criminals?page=${index}&${searchParams}` : null,
  ) as SWRResponse<mdt_criminals[], any>;
  const bgColor = useColorModeValue(theme.colors.gray[200], theme.colors.blue[800]);
  const [session, loading] = useSession();
  const styles = {
    picture: '5rem',
    name: '20rem',
  };
  return (
    <VStack spacing="1rem">
      <LoadableContentSafe data={{ criminal }} errors={[error]}>
        {({ criminal }) => {
          return (
            <>
              {criminal.map(c => {
                return (
                  <HStack
                    key={c.criminalid}
                    w="100%"
                    align="stretch"
                    justify="space-between"
                    backgroundColor={bgColor}
                  >
                    <HStack spacing="2rem">
                      <Image
                        w={styles.picture}
                        alt="silhouette"
                        src={
                          c.image ??
                          'https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png'
                        }
                      />
                      <Box w={styles.name}>{`${c.first_name} ${c.last_name}`}</Box>
                    </HStack>

                    <HStack pr="2rem" justify="center">
                      <Box>{c.date_of_birth}</Box>
                      {session && session.user.isCop && (
                        <Link href={`/criminals/${c.criminalid}/profile`} passHref>
                          <Button colorScheme="yellow">Profile</Button>
                        </Link>
                      )}
                    </HStack>
                  </HStack>
                );
              })}
            </>
          );
        }}
      </LoadableContentSafe>
    </VStack>
  );
}

export default function Home() {
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
            <HStack justifyContent="center">
              <Form.Text name="firstName" type="text" label="First Name" placeholder="John" />
              <Form.Text name="lastName" type="text" label="Last Name" placeholder="Smith" />
              <Form.Text name="stateId" type="number" label="State ID" placeholder="1234" />

              <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                <SearchIcon />
              </Button>
            </HStack>
          </FForm>
        )}
      </Formik>
      <Box>
        <Page index={pageIndex} searchValues={searchValues} />
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
