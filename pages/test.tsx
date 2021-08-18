// import Image from 'next/image';
import Layout from '../components/layout';
import React, { useState } from 'react';
import { HStack, Button, VStack, Box, Image, useColorModeValue, theme } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { FieldInputProps, FieldMetaProps, FormikProps } from 'formik';
// import useSWR from 'swr';
import { toQuery } from '../utils/query';
import { fivem_characters } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession } from 'next-auth/client';
import { Session } from 'inspector';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

function Page({ index, searchValues }: { index: number; searchValues: Record<string, string> }) {
  const searchParams = toQuery(searchValues);
  const { data } = useSWR(
    index !== null ? `/api/citizens?page=${index}&${searchParams}` : null,
  ) as SWRResponse<fivem_characters[], any>;
  const bgColor = useColorModeValue(theme.colors.gray[200], theme.colors.blue[800]);

  const styles = {
    picture: '5rem',
    name: '20rem',
  };
  return (
    <VStack spacing="1rem">
      {data &&
        data.map(c => {
          return (
            <HStack
              key={c.id}
              w="100%"
              align="stretch"
              justify="space-between"
              backgroundColor={bgColor}
            >
              <HStack spacing="2rem">
                <Image
                  w={styles.picture}
                  alt="silhouette"
                  src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                />
                <Box w={styles.name}>{`${c.first_name} ${c.last_name}`}</Box>
              </HStack>

              <VStack pr="2rem" justify="center">
                <Box>{c.dob}</Box>
              </VStack>
            </HStack>
          );
        })}
    </VStack>
  );
}

export default function Home({ session }: { session: Session }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState(0);
  const { data } = useSWR(`/api/test?discord=${1929}`);

  return (
    <Layout>
      <Box>
        <Button
          m="1rem"
          onClick={() => {
            setSearchValues(searchValues + 1);
          }}
        >
          yeet
        </Button>
      </Box>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (!session || !session.user || !session.user.isCop) {
    return { redirect: { permanent: false, destination: '/?l=t' } };
  }
  return { props: { session } };
};
