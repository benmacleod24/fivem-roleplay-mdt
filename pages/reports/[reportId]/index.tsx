import Layout from '../../../components/layout';
import React, { useMemo } from 'react';
import {
  Image,
  HStack,
  Button,
  VStack,
  Flex,
  Radio,
  RadioGroup,
  useToast,
  InputGroup,
  Input,
  FormLabel,
  Text,
  Textarea,
} from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { CheckIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
import { mdt_booked_charges_new, mdt_bookings_new } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession } from 'next-auth/client';
import { Session } from 'inspector';
import { LoadableContentSafe } from '../../../ui/LoadableContent';
import { useRouter } from 'next/router';
import usePenal from '../../../components/hooks/api/usePenal';
import { Text as TextForm } from '../../../components/form';
import * as yup from 'yup';
import { patchReport } from '../../../components/hooks/api/patchReport';
import { SingleReport } from '../../api/reports/[reportId]';
import { patchImage } from '../../../components/hooks/api/patchCitizen';
import { SingleCitizen } from '../../api/citizen';
import CopSelect from '../../../components/CopSelect';
import { tCop } from '../../api/cops';
import moment from 'moment';
import { numberWithComma } from '../../../utils';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

const schema = yup.object().shape({});

const defaultReport = `BSCO/LSPD Crime Report
Date: ${moment().format('MM/DD/yy')}                      Time: ${moment().format('h:mm a')}

Synopsis:

Evidence:

Penalty:
Time:    Fine:    Reduction:

Mirandized:  Y/N (If Yes, state when the suspect was Mirandized. Cells, after Pillbox treatment, etc)
GSR: Positive/Negative or N/A (if positive, include picture in evidence)
Items seized from suspect: List items or state N/A (if seized items applies, include picture in evidence)
Identified through: Identification Card
Requested Attorney: Y/N`;

interface mdt_bookings_new_with_charges extends mdt_bookings_new {
  mdt_booked_charges_new: mdt_booked_charges_new[];
}

export interface ReportProps {
  session: Session;
}

const Report: React.FunctionComponent<ReportProps> = ({ session }) => {
  const router = useRouter();
  const { reportId } = router.query as { reportId: string };

  // Report
  const {
    data: report,
    error: reportError,
    mutate: mutateReport,
  } = useSWR(`/api/reports/${reportId}`) as SWRResponse<SingleReport, any>;
  const { category: penal, error: penalError } = usePenal();
  const { data: cops, error: copsError } = useSWR(`/api/cops`) as SWRResponse<tCop, any>;
  const toast = useToast();

  // Memos
  const penalByChargeId = useMemo(() => {
    return new Map(
      penal
        ?.map(penal => penal.mdt_charges)
        .flat()
        .map(p => [p.chargeid, p]),
    );
  }, [penal]);

  const _charges = report?.mdt_bookings_new[0].mdt_booked_charges_new;
  const timeAndPenalty = useMemo(() => {
    return _charges?.reduce(
      (acc, res) => {
        const penalCharge = penalByChargeId?.get(res.chargeId);
        acc.time += res.chargeCount * ((penalCharge && penalCharge.time) ?? 0);
        acc.penalty += res.chargeCount * ((penalCharge && penalCharge.fine) ?? 0);
        return acc;
      },
      {
        time: 0,
        penalty: 0,
      },
    );
  }, [_charges, penalByChargeId]);

  const shittyPrintableBooking = Object.assign({}, report?.mdt_bookings_new)[0];

  return (
    <Layout>
      <LoadableContentSafe data={{ report }} errors={[reportError]}>
        {({ report }) => {
          const copsOnReport = report.mdt_reports_involved_new.map(r => ({
            id: r.officer_id ? r.officer_id.toString() : '0',
            name: `${r.fivem_characters?.first_name} ${r.fivem_characters?.last_name}`,
          }));

          const charges = report.mdt_bookings_new[0].mdt_booked_charges_new;
          const cop =
            report.mdt_bookings_new[0]
              .fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId;
          const criminal =
            report.mdt_bookings_new[0]
              .fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId;

          return (
            <Formik
              validationSchema={schema}
              initialValues={{
                content: report.content ? report.content : defaultReport,
                title: report.title ? report.title : '',
                reportId,
                draft: report.draft ? '1' : '0',
                filingOfficerId: report.filingOfficerId,
                cops: copsOnReport.map(c => c.id),
              }}
              onSubmit={async (values, actions) => {
                try {
                  console.log(values);
                  const res = await patchReport(reportId, {
                    ...values,
                    draft: values.draft === '1' ? true : false,
                  });

                  actions.setSubmitting(false);
                  toast({
                    description: 'Report Saved!',
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    variant: 'solid',
                    position: 'top-right',
                  });
                } catch (e) {
                  toast({
                    description: 'Error Occured While Saving Report',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    variant: 'solid',
                    position: 'top-right',
                  });
                }
                mutateReport();
              }}
            >
              {props => (
                <FForm>
                  <Flex w="full" h="fit-content" flexDir="column" mb="4">
                    <Text mb="0.5" color="yellow.200" fontWeight="semibold">
                      Report Title
                    </Text>
                    <InputGroup variant="filled">
                      <Input
                        isReadOnly={!Boolean(report.draft)}
                        placeholder="Report Title"
                        value={props.values.title}
                        onChange={e => props.setFieldValue('title', e.target.value)}
                        _focus={{ boxShadow: 'none' }}
                      />
                    </InputGroup>
                  </Flex>
                  <Flex w="full" mb="4" justifyContent="space-between">
                    <Flex w="49%" flexDir="column">
                      <Text mb="0.5" color="yellow.200" fontWeight="semibold">
                        Booked Charges
                      </Text>
                      <Flex w="full" background="gray.700" borderRadius="md" p="3" flexDir="column">
                        {charges.map(c => {
                          return (
                            <Flex
                              my="1"
                              w="full"
                              p="2"
                              key={c.chargeId}
                              borderRadius="md"
                              transition="0.2s ease-in-out"
                              justifyContent="space-between"
                              alignItems="center"
                              _hover={{ background: 'gray.600' }}
                            >
                              <Text fontWeight="semibold">
                                {penalByChargeId.get(c.chargeId)?.name ?? 'Failed to get charge.'}
                              </Text>
                              <Text mr="1" color="blue.300" fontWeight="semibold">
                                {c.chargeCount} Count{c.chargeCount === 1 ? '' : '(s)'}{' '}
                              </Text>
                            </Flex>
                          );
                        })}
                      </Flex>
                    </Flex>
                    <Flex w="49%" flexDir="column" minH="100%">
                      <Text mb="0.5" color="yellow.200" fontWeight="semibold">
                        Booking Details
                      </Text>
                      <Flex
                        w="full"
                        h="100%"
                        background="gray.700"
                        borderRadius="md"
                        p="3"
                        flexDir="column"
                      >
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Booking Officer:
                          </Text>
                          <Text>
                            {cop.first_name} {cop.last_name}
                          </Text>
                        </Flex>
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Booked Criminal:
                          </Text>
                          <Text>
                            {criminal.first_name} {criminal.last_name}
                          </Text>
                        </Flex>
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Time:
                          </Text>
                          <Text>{numberWithComma(timeAndPenalty?.time)} month(s)</Text>
                        </Flex>
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Penalty:
                          </Text>
                          <Text textTransform="capitalize">
                            ${numberWithComma(timeAndPenalty?.penalty)}
                          </Text>
                        </Flex>
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Plea:
                          </Text>
                          <Text textTransform="capitalize">
                            {shittyPrintableBooking.bookingPlea}
                          </Text>
                        </Flex>
                        <Flex mb="1">
                          <Text mr="1" color="blue.300" fontWeight="medium">
                            Reduction Amount:
                          </Text>
                          <Text textTransform="capitalize">
                            {shittyPrintableBooking.bookingReduction}%
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                  <CopSelect
                    cops={cops}
                    preSelected={copsOnReport.map(c => ({
                      label: c.name,
                      value: c.id,
                    }))}
                    isDraft={report.draft}
                  />
                  <Flex w="full" h="fit-content" flexDir="column" mb="4">
                    <Text mb="0.5" color="yellow.200" fontWeight="semibold">
                      Report Content
                    </Text>
                    <Textarea
                      value={props.values.content}
                      onChange={e => props.setFieldValue('content', e.target.value)}
                      placeholder="Report Content"
                      name="content"
                      variant="filled"
                      _focus={{ boxShadow: 'none' }}
                      h="sm"
                      isReadOnly={!Boolean(report.draft)}
                    />
                  </Flex>
                  <Flex
                    pos="relative"
                    justifyContent="flex-start"
                    alignItems="center"
                    w="full"
                    h="fit-content"
                  >
                    <RadioGroup
                      defaultValue={report.draft ? '1' : '0'}
                      name="draft"
                      onChange={e => props.setFieldValue('draft', e)}
                    >
                      <Radio value="0" mr="3" _focus={{ boxShadow: 'none' }}>
                        Finalized
                      </Radio>
                      <Radio
                        value="1"
                        defaultChecked
                        isDisabled={!report.draft}
                        _focus={{ boxShadow: 'none' }}
                      >
                        Draft
                      </Radio>
                    </RadioGroup>
                  </Flex>
                  <Flex w="full" justifyContent="center" alignItems="center">
                    {report.draft ? (
                      <Button
                        w="25%"
                        colorScheme="yellow"
                        visibility={report.draft ? 'visible' : 'hidden'}
                        isLoading={props.isSubmitting}
                        type="submit"
                      >
                        {props.values.draft === '1' ? 'Submit Changes' : 'Submit Report'}
                      </Button>
                    ) : (
                      ''
                    )}
                  </Flex>
                </FForm>
              )}
            </Formik>
          );
        }}
      </LoadableContentSafe>
    </Layout>
  );
};

export default Report;

// export default function Home({ session }: { session: Session }) {
//   const router = useRouter();
//   const { category: penal, error: penalError } = usePenal();
//   const { reportId } = router.query as { reportId: string };
//   const {
//     data: report,
//     error: reportError,
//     mutate: mutateReport,
//   } = useSWR(`/api/reports/${reportId}`) as SWRResponse<SingleReport, any>;

//   const { data: cops, error: copsError } = useSWR(`/api/cops`) as SWRResponse<tCop, any>;

//   const penalByChargeId = useMemo(() => {
//     return new Map(
//       penal
//         ?.map(penal => penal.mdt_charges)
//         .flat()
//         .map(p => [p.chargeid, p]),
//     );
//   }, [penal]);

//   const charges = report?.mdt_bookings_new[0].mdt_booked_charges_new;
//   const timeAndPenalty = useMemo(() => {
//     return charges?.reduce(
//       (acc, res) => {
//         const penalCharge = penalByChargeId?.get(res.chargeId);
//         acc.time += res.chargeCount * ((penalCharge && penalCharge.time) ?? 0);
//         acc.penalty += res.chargeCount * ((penalCharge && penalCharge.fine) ?? 0);
//         return acc;
//       },
//       {
//         time: 0,
//         penalty: 0,
//       },
//     );
//   }, [charges, penalByChargeId]);
//   const toast = useToast();

//   const shittyPrintableBooking = Object.assign({}, report?.mdt_bookings_new)[0];
//   return (
//     <Layout>
//       <LoadableContentSafe
//         data={{ report, penal, cops }}
//         errors={[reportError, penalError, copsError]}
//       >
//         {({ report, penal, cops }) => {
//           const criminal =
//             report.mdt_bookings_new[0]
//               .fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId;
//           const cop =
//             report.mdt_bookings_new[0]
//               .fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId;

//           const copsOnReport = report.mdt_reports_involved_new.map(r => ({
//             id: r.officer_id ? r.officer_id.toString() : '0',
//             name: `${r.fivem_characters?.first_name} ${r.fivem_characters?.last_name}`,
//           }));
//           return (
//             <Flex w="100%">
//               <HStack flexDir="row" h="100%" w="100%" spacing="6">
//                 <Flex w="70%">
//                   <Formik
//                     initialValues={{
//                       content: report.content ? report.content : defaultReport,
//                       title: report.title ? report.title : '',
//                       reportId,
//                       draft: report.draft ? '1' : '0',
//                       filingOfficerId: report.filingOfficerId,
//                       cops: copsOnReport.map(c => c.id),
//                     }}
//                     validationSchema={schema}
//                     onSubmit={async (values, actions) => {
//                       try {
//                         console.log(values);
//                         const res = await patchReport(reportId, {
//                           ...values,
//                           draft: values.draft === '1' ? true : false,
//                         });
//                         actions.setSubmitting(false);
//                         toast({
//                           description: 'Saved report!',
//                           status: 'success',
//                           duration: 5000,
//                           isClosable: true,
//                         });
//                       } catch (e) {
//                         toast({
//                           description: 'Something broke...',
//                           status: 'error',
//                           duration: 5000,
//                           isClosable: true,
//                         });
//                       }
//                       mutateReport();
//                     }}
//                   >
//                     {props => (
//                       <FForm>
//                         <Flex justifyContent="flex-start">
//                           <VStack w="50rem">
//                             <TextForm
//                               name="title"
//                               type="string"
//                               label="Title"
//                               isReadOnly={!Boolean(report.draft)}
//                             />
//                             <Textarea
//                               name="content"
//                               placeholder="Here is a sample placeholder"
//                               size="sm"
//                               isReadOnly={!Boolean(report.draft)}
//                               height="20rem"
//                               resize="vertical"
//                             />
//                             <Flex mb="1rem" mt="1rem" flexDir="column">
//                               <RadioGroup
//                                 name="draft"
//                                 defaultValue={report.draft ? '1' : '0'}
//                                 onChange={e => {
//                                   props.setFieldValue('draft', e);
//                                 }}
//                               >
//                                 <HStack>
//                                   <Radio value={'1'} defaultChecked isDisabled={!report.draft}>
//                                     Draft
//                                   </Radio>
//                                   <Radio value={'0'}>Final Submission</Radio>
//                                 </HStack>
//                               </RadioGroup>
//                             </Flex>
//                             <CopSelect
//                               name="cops"
//                               type="string"
//                               cops={cops}
//                               preSelected={copsOnReport.map(c => ({
//                                 label: c.name,
//                                 value: c.id,
//                               }))}
//                             />
//                             <Button
//                               mt={4}
//                               colorScheme="teal"
//                               isDisabled={!Boolean(report.draft)}
//                               isLoading={props.isSubmitting}
//                               type="submit"
//                             >
//                               <CheckIcon />
//                             </Button>
//                           </VStack>
//                         </Flex>
//                       </FForm>
//                     )}
//                   </Formik>
//                 </Flex>
//                 <VStack w="30%" flexDir="column" spacing="6">
//                   {/* <Flex>{JSON.stringify(shittyPrintableBooking, undefined, 2)}</Flex> */}
//                   <Flex>
//                     <Mugshot criminal={criminal} />
//                   </Flex>
//                   <Flex>{`${criminal.first_name} ${criminal.last_name}`}</Flex>
//                   <Flex>Original Time: {timeAndPenalty?.time}</Flex>
//                   <Flex>Fine: ${timeAndPenalty?.penalty}</Flex>
//                   <Flex>Plea: {shittyPrintableBooking.bookingPlea}</Flex>
//                   <Flex>Booking reduction: {shittyPrintableBooking.bookingReduction}%</Flex>
//                   <Flex>Override time: {shittyPrintableBooking.bookingOverride}</Flex>
//                   <Flex>Officer: {`${cop.first_name} ${cop.last_name}`} </Flex>
//                   <Flex>Additionals involved:</Flex>
//                   {/*  todo: add delete on mdt_reports_involved_new or tie it into the multiselect and clear
//                   any officers that aren't present there  */}
//                   <VStack>
//                     {copsOnReport.map(c => {
//                       return <Flex key={c.id}>{`${c.name}`}</Flex>;
//                     })}
//                   </VStack>
//                   {charges?.map(c => {
//                     return (
//                       <Flex key={c.chargeId} mt="1rem">
//                         {penalByChargeId.get(c.chargeId)?.name ?? 'failed getting charge'} *{' '}
//                         {c.chargeCount}
//                       </Flex>
//                     );
//                   })}
//                 </VStack>
//               </HStack>
//             </Flex>
//           );
//         }}
//       </LoadableContentSafe>
//     </Layout>
//   );
// }

// // todo pull this out unti its own component
// const Mugshot = ({
//   criminal,
// }: {
//   criminal: {
//     image: string | null;
//     first_name: string | null;
//     last_name: string | null;
//     id: number;
//     cuid: string;
//   };
// }) => {
//   const { data: citizen, mutate } = useSWR(
//     `/api/citizen/?citizenid=${criminal.cuid}`,
//   ) as SWRResponse<SingleCitizen, any>;
//   if (!citizen) return <></>;
//   const schema = yup.object().shape({ image: yup.string().required('must have image to update') });
//   return (
//     <Flex>
//       {criminal.image && (
//         <Image
//           border="1px solid #4A5568"
//           mr="2.5%"
//           boxSize="5.5rem"
//           objectFit="fill"
//           borderRadius="md"
//           src={citizen.image ? citizen.image : undefined}
//           alt="blank_profile_picture"
//         />
//       )}
//       <Formik
//         initialValues={{ image: citizen.image }}
//         validationSchema={schema}
//         onSubmit={async (values, actions) => {
//           try {
//             console.log(values.image);
//             const res = await patchImage(criminal.id.toString(), {
//               image: values.image,
//             });
//             console.log(res);
//             mutate();
//           } catch (e) {
//             // todo add toast shit
//             //   toast({
//             //     description: 'Something broke...',
//             //     status: 'error',
//             //     duration: 5000,
//             //     isClosable: true,
//             //   });
//             // }
//             // mutateReport();
//           }
//         }}
//       >
//         {props => (
//           <FForm>
//             <Flex justifyContent="flex-start">
//               <VStack w="30rem">
//                 <TextForm name="image" type="string" label="Mugshot URL" />

//                 <Button
//                   mt={4}
//                   colorScheme="teal"
//                   isDisabled={props.isSubmitting}
//                   isLoading={props.isSubmitting}
//                   type="submit"
//                 >
//                   <CheckIcon />
//                 </Button>
//               </VStack>
//             </Flex>
//           </FForm>
//         )}
//       </Formik>
//     </Flex>
//   );
// };

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    return { redirect: { permanent: false, destination: '/?l=t' } };
  }
  return { props: { session } };
};
