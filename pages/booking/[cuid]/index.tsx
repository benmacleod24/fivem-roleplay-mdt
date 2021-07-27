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
  Heading,
  InputGroup,
  InputLeftElement,
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
import { numberWithComma } from '../../../utils';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

const TRIAL = 99999;

export interface ChargeBoxProps {
  charge: mdt_charges;
  addCharge: (a: mdt_charges) => void
}

const ChargeBox: React.FunctionComponent<ChargeBoxProps> = ({ charge, addCharge }) => {

  const classColor = () => {
    switch (charge.class) {
      case 'infraction':
        return 'blue.400';
      case 'misdemeanor':
        return 'orange';
      case 'felony':
        return 'red.600';
      default:
        return;
    }
  }

  return (
    <GridItem cursor="pointer" onClick={() => addCharge(charge)} key={charge.chargeid} background={classColor()} borderRadius="sm" h="5rem" w="13.45rem">
      <Flex w="full" h="full" justifyContent="center" alignItems="center" flexDir="column">
        <Tooltip label={
          <Flex flexDir="column">
            <Text mb="1.4" fontWeight="bold">{charge.name}</Text>
            <Text color="gray.400">{charge.description}</Text>
          </Flex>
        } openDelay={500} closeDelay={200} borderRadius="md" background="gray.700" color="white" p="3" fontSize="xs">
          <Text width="12em" fontWeight="semibold" textAlign="center" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">{charge.name}</Text>
        </Tooltip>
        {charge.time === TRIAL ? <Text fontStyle="italic" fontSize="sm">Hold Until Trial</Text> : <Text fontStyle="italic" fontSize="sm">{charge.time} Months(s) | ${numberWithComma(charge.time)}</Text>}
      </Flex>
    </GridItem>
  );
}

interface chargeAndCount {
  counts: number;
  charge: mdt_charges;
}

interface CharacterSWR {
  id: number;
  uId: number | null;
  cuid: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  gender: boolean | null;
}

export interface BookingProps {
  session: Session
}

const Booking: React.FunctionComponent<BookingProps> = ({ session }) => {

  // Comp State
  const [filter, setFilter] = React.useState("")
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState(0);
  const [selectedCharges, setSelectedCharges] = useState<Record<number, chargeAndCount>>({});

  // Router Data
  const router = useRouter();
  const { cuid } = router.query;

  // SWR Requests
  const { data: character, error: characterError } = useSWR(`/api/citizen/?citizenid=${cuid}`) as SWRResponse<CharacterSWR, any>;
  const { category: penal, error: penalError } = usePenal();

  // Handlers
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.target.value.toLowerCase());

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
      <Flex w="full" h="full" flexDir="column">
        <Flex w="full" py="1">
          <Heading fontSize="lg">Processing {character?.first_name} {character?.last_name}</Heading>
        </Flex>
        <Flex w="full" py="3">
          <InputGroup size="md" variant="filled" onChange={handleFilterChange}>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input placeholder="Search Filter" borderRadius="md" />
          </InputGroup>
        </Flex>
        <LoadableContentSafe data={{ character, penal }} errors={[characterError, penalError]}>
          {({ character, penal }) => {
            return (
              <Flex w="full" flexGrow={1}>
                <Flex w="70%" mr="2" height="100%" flexDir="column">
                  {penal?.map(p => {
                    return (
                      <VStack w="full" my="2" boxSizing="border-box">
                        <Box p="2" background={"gray.700"} w="full" borderTopRadius="md">
                          <Text fontWeight="semibold">{p.name}</Text>
                        </Box>
                        <Grid templateColumns="repeat(4, 1fr)" gap={1}>
                          {p.mdt_charges.filter(c => c.name && c.name.toLowerCase().match(filter)).map(c => <ChargeBox key={c.chargeid} charge={c} addCharge={addCharge} />)}
                        </Grid>
                      </VStack>
                    )
                  })}
                </Flex>
                <Flex my="2" flexGrow={1} height="100%">
                  <BookingCharges selectedCharges={selectedCharges} character={character} removeCharge={removeCharge} />
                </Flex>
              </Flex>
            )
          }}
        </LoadableContentSafe>
      </Flex>
    </Layout>
  );
}

export default Booking;

export interface BookingChargesProps {
  selectedCharges: Record<number, chargeAndCount>;
  removeCharge: (a: number) => void,
  character: CharacterSWR;
}

const BookingCharges: React.SFC<BookingChargesProps> = ({ selectedCharges, removeCharge, character }) => {

  // Vars
  const chargeValues = Object.values(selectedCharges);

  // Init Values FormIK
  const initValues = {
    firstName: character.first_name,
    lastName: character.last_name,
    stateId: character.uId,
    plea: undefined,
    bookingReduction: '0'
  }

  return (
    <Flex flexDir="column" w="full">
      <Box mb="2" background="gray.700" borderTopRadius="md" p="2">
        <Text fontWeight="semibold">Booking Summary</Text>
      </Box>
      {!chargeValues.length ? <Box borderRadius="md" p="2.5" w="full" background="gray.700"><Text fontWeight="semibold">No Charges currently selected.</Text></Box> : ""}
      {!chargeValues.length ? "" :
        <Flex w="full" flexDir="column">
          <Flex flexDir="column" w="full" background="gray.700" p="2" borderRadius="md">
            {chargeValues.map(c => {
              return (
                <Flex _hover={{ backgroundColor: "#2D3748" }} transition="0.2s ease-in-out" w="full" my="1" p="2" borderRadius="sm" justifyContent="space-between" alignItems="center">
                  <Text fontSize="md" maxWidth="75%" flexGrow={1}>{c.charge.name}</Text>
                  <Flex>
                    <Flex fontSize="md" borderBottom="1px solid yellow" px="2" justifyContent="center" alignItems="center">{c.counts}</Flex>
                    <IconButton colorScheme="blue" onClick={() => removeCharge(c.charge.chargeid)} ml="4" aria-label="delete-charge" icon={<CloseIcon />} size="sm" borderRadius="sm" />
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      }
    </Flex>
  );
}

// const BookingCharges = ({
//   selectedCharges,
//   removeCharge,
//   character,
// }: {
//   selectedCharges: Record<number, chargeAndCount>;
//   removeCharge: (a: number) => void;
//   character: CharacterSWR;
// }) => {
//   const timeAndPenalty = Object.values(selectedCharges).reduce(
//     (acc, res) => {
//       acc.time += res.counts * (res.charge.time ?? 0);
//       acc.penalty += res.counts * (res.charge.fine ?? 0);
//       return acc;
//     },
//     {
//       time: 0,
//       penalty: 0,
//     },
//   );

//   const chargesValues = Object.values(selectedCharges);

//   const initialValues = {
//     firstName: character.first_name,
//     lastName: character.last_name,
//     stateId: character.uId,
//     plea: undefined,
//     bookingReduction: '0',
//   };

//   console.log(selectedCharges);

//   return (
//     <>
//       <Flex style={{ visibility: chargesValues.length ? 'hidden' : 'visible' }}>
//         No Charges currently selected.
//       </Flex>
//       <Flex style={{ visibility: !chargesValues.length ? 'hidden' : 'visible' }}>
//         <Formik
//           initialValues={initialValues}
//           onSubmit={(values, actions) => {
//             const chargesAndCounts = chargesValues.map(c => ({
//               chargeId: c.charge.chargeid,
//               charge_count: c.counts,
//             }));
//             const submission = Object.assign({
//               ...timeAndPenalty,
//               ...values,
//               ...{ chargesAndCounts },
//             });

//             // todo fix the override time to not apply when empty
//             // todo fix booking reduction to show live

//             console.log(submission);
//             actions.setSubmitting(false);
//           }}
//         >
//           {(props: FormikProps<typeof initialValues>) => (
//             <FForm>
//               <Flex flexDir="column">
//                 {chargesValues.map(c => {
//                   return (
//                     <Flex
//                       key={`booking-${c.charge.chargeid}`}
//                       flexDir="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       mb="1rem"
//                     >
//                       <Text fontSize="xs" fontWeight="bold">
//                         {c.charge.name}
//                       </Text>
//                       <Flex flexDir="row" justifyContent="center" alignItems="center">
//                         <Text>{c.counts}</Text>
//                         <IconButton
//                           ml="1rem"
//                           size="sm"
//                           aria-label="close"
//                           onClick={() => removeCharge(c.charge.chargeid)}
//                           icon={<CloseIcon />}
//                         />{' '}
//                       </Flex>
//                     </Flex>
//                   );
//                 })}
//                 <Flex flexDir="row"></Flex>
//                 {timeAndPenalty.time < TRIAL ? (
//                   <Flex flexDir="column">
//                     <Text>time:</Text> <Text>{timeAndPenalty.time} Month(s);</Text>
//                   </Flex>
//                 ) : (
//                   <Flex flexDir="column">
//                     <Text>Time:</Text> <Text>Hold Until Trial</Text>
//                   </Flex>
//                 )}
//                 {timeAndPenalty.penalty < TRIAL ? (
//                   <Flex flexDir="column">penalty: ${timeAndPenalty.penalty}</Flex>
//                 ) : (
//                   <Flex flexDir="column">
//                     <Text>Penalty:</Text> <Text>Hold Until Trial</Text>
//                   </Flex>
//                 )}

//                 <TextForm type="string" label="Override time" name="time" />

//                 {/* todo get proper values here */}
//                 <Flex mt="2rem">
//                   <Form.Select type="string" placeholder="Select plea" label="Yolo" name="plea">
//                     <option value="guilty">Plea of guilty</option>
//                     <option value="innocense">Plea of innocense</option>
//                     <option value="no_contest">Plea of no contest</option>
//                   </Form.Select>
//                 </Flex>

//                 <Flex mt="2rem" flexDir="column">
//                   <Text>Booking reduction</Text>
//                   <RadioGroup
//                     name="bookingReduction"
//                     defaultValue={'0'}
//                     onChange={e => {
//                       props.setFieldValue('bookingReduction', e);
//                     }}
//                   >
//                     <HStack>
//                       <Radio value={'0'} defaultChecked>
//                         0%
//                       </Radio>
//                       <Radio value={'25'}>25%</Radio>
//                       <Radio value={'50'}>50%</Radio>
//                       <Radio value={'75'}>75%</Radio>
//                     </HStack>
//                   </RadioGroup>
//                 </Flex>
//                 <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
//                   <SearchIcon />
//                 </Button>
//               </Flex>
//             </FForm>
//           )
//           }
//         </Formik >
//       </Flex >
//     </>
//   );
// };

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
