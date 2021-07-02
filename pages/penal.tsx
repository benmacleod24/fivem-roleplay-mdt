import Layout from '../components/layout';
import React, { ReactElement, useState } from 'react';
import { HStack, Box, Flex, Stack, Text, Heading } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { FieldInputProps, FieldMetaProps, FormikProps } from 'formik';
import { mdt_charges, mdt_charges_categories } from '@prisma/client';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
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

interface mdtCharges {
  mdt_charges: mdt_charges[];
}

export default function Home() {
  const { data: category } = useSWR('/api/penal') as SWRResponse<
    Array<mdt_charges_categories & mdtCharges>,
    any
  >;

  return (
    <Layout>
      <Flex flexDir="column" justifyContent="center" alignContent="center" alignItems="center">
        <Heading as="h2" size="md">
          San Andreas State Penal Code
        </Heading>
        <Flex>
          The penal code provided a list of all charges in the state of san andreas. Along with each
          charge is a penalty, time to be served, classification, and thorough description of the
          crime.
        </Flex>
        {category &&
          category.length &&
          category.map(d => {
            return (
              <Accordion key={d.categoryid} allowToggle allowMultiple w="100%">
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {d.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Stack>
                      {d.mdt_charges.map(c => {
                        return (
                          <Flex key={c.chargeid} flexDir="column">
                            <Heading as="h2" size="md">
                              {c.name}
                            </Heading>
                            <Text>{c.description}</Text>
                            <HStack>
                              <SoftBubble text={`Penalty: ${c.fine}`} />
                              <SoftBubble text={`Time to be served: ${c.time}`} />
                              <PClass penalClass={c.class} />
                            </HStack>
                          </Flex>
                        );
                      })}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            );
          })}
      </Flex>
    </Layout>
  );
}

const SoftBubble = ({ text, color }: { text: string | null; color: string | null }) => {
  if (!text) return <></>;
  return (
    <Box borderWidth="2px" borderRadius="lg" padding=".2rem" backgroundColor={color ?? 'gray800'}>
      {text}
    </Box>
  );
};

const PClass = ({ penalClass }: { penalClass: string | null }): ReactElement => {
  const color =
    penalClass === 'misdemeanor'
      ? 'orange'
      : penalClass === 'infraction'
      ? 'blue'
      : penalClass === 'felony'
      ? 'red'
      : 'cyan';
  return <SoftBubble text={penalClass} color={color} />;
};
