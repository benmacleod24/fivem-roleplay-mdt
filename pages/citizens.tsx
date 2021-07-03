import Layout from '../components/layout';
import React, { useState } from 'react';
import { HStack, Button, VStack, Box, Image, useColorModeValue, theme, Flex, Heading } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
import * as Form from '../components/form';
import { toQuery } from '../utils/query';
import { fivem_characters } from '@prisma/client';

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
  searchValues: Record<string, string>
}

const CitizenCard: React.SFC<CitizenCardProps> = ({ index, searchValues }) => {

  // Params & Data
  const searchParams = toQuery(searchValues);
  const { data } = useSWR(index !== null ? `/api/citizens?page=${index}&${searchParams}` : null) as SWRResponse<fivem_characters[], any>;

  // Chakra Color Modes
  const cardBackground = useColorModeValue("gray.200", "gray.700")
  // Real Image: https://i.imgur.com/MtrDeB8.png
  // Fake Image: https://i.imgur.com/tdi3NGah.jpg

  return (
    <VStack spacing="1rem" mt="1%" mb="1%">
      {data && data.map(c => {
        return (
          <Flex boxSizing="border-box" p="1%" pr="3%" borderRadius="md" overflow="hidden" width="100%" background={cardBackground} alignItems="center">
            <Image border="1px solid #4A5568" mr="2.5%" width="5.5rem" borderRadius="md" src="https://i.imgur.com/MtrDeB8.png" alt="blank_profile_picture" />
            <Heading flex={1} size="md">{c.first_name} {c.last_name}</Heading>
            <Button size="sm" colorScheme="yellow">View Profile</Button>
          </Flex>
        );
      })}
    </VStack>
  );
}

// function Page({ index, searchValues }: { index: number; searchValues: Record<string, string> }) {
//   const searchParams = toQuery(searchValues);
//   const { data } = useSWR(
//     index !== null ? `/api/citizens?page=${index}&${searchParams}` : null,
//   ) as SWRResponse<fivem_characters[], any>;
//   const bgColor = useColorModeValue(theme.colors.gray[200], theme.colors.blue[800]);

//   const styles = {
//     picture: '5rem',
//     name: '20rem',
//   };
//   return (
//     <VStack spacing="1rem">
//       {data &&
//         data.map(c => {
//           return (
//             <HStack
//               key={c.id}
//               w="100%"
//               align="stretch"
//               justify="space-between"
//               backgroundColor={bgColor}
//             >
//               <HStack spacing="2rem">
//                 <Image
//                   w={styles.picture}
//                   alt="silhouette"
//                   src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
//                 />
//                 <Box w={styles.name}>{`${c.first_name} ${c.last_name}`}</Box>
//               </HStack>

//               <VStack pr="2rem" justify="center">
//                 <Box>{c.dob}</Box>
//               </VStack>
//             </HStack>
//           );
//         })}
//     </VStack>
//   );
// }

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  console.log(pageIndex);
  const [searchValues, setSearchValues] = useState({});

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log(values);
          setSearchValues(values);
          setPageIndex(0);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<typeof initialValues>) => (
          <FForm>
            <HStack justifyContent="center" alignItems="center">
              {/* <Form.Text name="firstName" type="text" label="First name" /> */}
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
        <CitizenCard index={pageIndex} searchValues={searchValues} />
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

// <Field name="firstName">
//                 {({
//                   field,
//                   form,
//                 }: {
//                   field: FormikState<typeof initialValues>;
//                   form: FormikState<typeof initialValues>;
//                 }) => (
//                   <FormControl isInvalid={Boolean(form.errors.firstName) && form.touched.firstName}>
//                     {/* <FormLabel htmlFor="firstName">First name</FormLabel> */}
//                     <Input {...field} id="firstName" placeholder="First name" />
//                     <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
//                   </FormControl>
//                 )}
//               </Field>
//               <Field name="lastName">
//                 {({
//                   field,
//                   form,
//                 }: {
//                   field: FormikState<typeof initialValues>;
//                   form: FormikState<typeof initialValues>;
//                 }) => (
//                   <FormControl isInvalid={Boolean(form.errors.lastName) && form.touched.lastName}>
//                     {/* <FormLabel htmlFor="firstName">First name</FormLabel> */}
//                     <Input {...field} id="lastName" placeholder="Last name" />
//                     <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
//                   </FormControl>
//                 )}
//               </Field>
//               <Field name="stateId">
//                 {({
//                   field,
//                   form,
//                 }: {
//                   field: FormikState<typeof initialValues>;
//                   form: FormikState<typeof initialValues>;
//                 }) => (
//                   <FormControl isInvalid={Boolean(form.errors.stateId) && form.touched.stateId}>
//                     {/* <FormLabel htmlFor="firstName">First name</FormLabel> */}
//                     <NumberInput>
//                       <NumberInputField {...field} id="stateId" placeholder="State ID" />
//                     </NumberInput>
//                     <FormErrorMessage>{form.errors.stateId}</FormErrorMessage>
//                   </FormControl>
//                 )}
//               </Field>
