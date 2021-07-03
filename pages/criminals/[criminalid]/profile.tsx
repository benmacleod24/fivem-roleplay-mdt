// import Image from 'next/image';
import Layout from '../../../components/layout';
import React, { useState } from 'react';
import {
  HStack,
  Button,
  VStack,
  Box,
  Text,
  Image,
  useColorModeValue,
  theme,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
// import useSWR from 'swr';
import * as Form from '../../../components/form';
import { toQuery } from '../../../utils/query';
import { fivem_characters, mdt_criminals } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession } from 'next-auth/client';
import { Session } from 'inspector';
import { z } from 'zod';
import { useRouter } from 'next/dist/client/router';
import { LoadableContentSafe } from '../../../ui/LoadableContent';

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

export default function Home({ session }: { session: Session }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState(0);
  const router = useRouter();
  const { criminalid } = router.query;
  const { data: criminal, error } = useSWR(
    `/api/criminals/?criminalid=${criminalid}`,
  ) as SWRResponse<mdt_criminals, any>;

  const loading = !criminal && !error;
  const color = useColorModeValue(theme.colors.blue[800], theme.colors.blue[400]);

  return (
    <Layout>
      <LoadableContentSafe data={{ criminal }} errors={[error]}>
        {({ criminal }) => {
          return (
            <Flex
              flexDir="column"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
            >
              <Flex>Viewing {`${criminal?.first_name} ${criminal?.last_name}`}</Flex>
              <Grid templateColumns="repeat(4, 1fr)">
                <GridItem colSpan={1}>
                  {criminal.image && (
                    <Image height="100%" width="100%" alt="silhouette" src={criminal.image} />
                  )}
                </GridItem>
                <GridItem colSpan={3} ml="1rem">
                  <Flex flexDir="row">
                    <Text color={color}>Name:</Text>
                    <Text>&nbsp;{`${criminal.first_name} ${criminal.last_name}`}</Text>
                  </Flex>

                  <Flex flexDir="row">
                    <Text color={color}>Date of Birth:</Text>{' '}
                    <Text>&nbsp;{criminal.date_of_birth}</Text>
                  </Flex>

                  <Flex flexDir="row">
                    <Text color={color}>Driver&apos;s License:</Text>
                    <Text>{criminal.character_uid?.split('-')[0]}</Text>
                  </Flex>
                </GridItem>
              </Grid>
            </Flex>
          );
        }}
      </LoadableContentSafe>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  const res = ctx.res;
  if (!session || !session.user || !session.user.isCop) {
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
