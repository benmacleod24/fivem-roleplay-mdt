import Layout from '../../../components/layout';
import React, { useMemo } from 'react';
import { Image, HStack, Button, VStack, Flex, Radio, RadioGroup, useToast } from '@chakra-ui/react';
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
import { Text as TextForm, Textarea } from '../../../components/form';
import * as yup from 'yup';
import { patchReport } from '../../../components/hooks/api/patchReport';
import { SingleReport } from '../../api/reports/[reportId]';
import { patchImage } from '../../../components/hooks/api/patchCitizen';
import { SingleCitizen } from '../../api/citizen';
import CopSelect from '../../../components/CopSelect';
import { tCop } from '../../api/cops';

export interface FieldProps<V = any> {
  field: FieldInputProps<V>;
  form: FormikProps<V>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<V>;
}

const schema = yup.object().shape({});

const defaultReport = `BSCO/LSPD Crime Report
Date:                               Time:

Synopsis:

Evidence:

Penalty:
Time:    Fine:    Reduction:

Mirandarized:  Y/N (If Yes, state when the suspect was Mirandarized. Cells, after Pillbox treatment, etc)
GSR: Positive/Negative or N/A (if positive, include picture in evidence)
Items seized from suspect: List items or state N/A (if seized items applies, include picture in evidence)
Identified through: Identification Card
Requested Attorney: Y/N`;

interface mdt_bookings_new_with_charges extends mdt_bookings_new {
  mdt_booked_charges_new: mdt_booked_charges_new[];
}

export default function Home({ session }: { session: Session }) {
  const router = useRouter();
  const { category: penal, error: penalError } = usePenal();
  const { reportId } = router.query as { reportId: string };
  const {
    data: report,
    error: reportError,
    mutate: mutateReport,
  } = useSWR(`/api/reports/${reportId}`) as SWRResponse<SingleReport, any>;

  const { data: cops, error: copsError } = useSWR(`/api/cops`) as SWRResponse<tCop, any>;

  const penalByChargeId = useMemo(() => {
    return new Map(
      penal
        ?.map(penal => penal.mdt_charges)
        .flat()
        .map(p => [p.chargeid, p]),
    );
  }, [penal]);

  const charges = report?.mdt_bookings_new[0].mdt_booked_charges_new;
  const timeAndPenalty = useMemo(() => {
    return charges?.reduce(
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
  }, [charges, penalByChargeId]);
  const toast = useToast();

  const shittyPrintableBooking = Object.assign({}, report?.mdt_bookings_new)[0];
  return (
    <Layout>
      <LoadableContentSafe
        data={{ report, penal, cops }}
        errors={[reportError, penalError, copsError]}
      >
        {({ report, penal, cops }) => {
          const criminal =
            report.mdt_bookings_new[0]
              .fivem_characters_fivem_charactersTo_mdt_bookings_new_criminalId;
          const cop =
            report.mdt_bookings_new[0]
              .fivem_characters_fivem_charactersTo_mdt_bookings_new_filingOfficerId;

          const copsOnReport = report.mdt_reports_involved_new.map(r => ({
            id: r.officer_id ? r.officer_id.toString() : '0',
            name: `${r.fivem_characters?.first_name} ${r.fivem_characters?.last_name}`,
          }));
          return (
            <Flex w="100%">
              <HStack flexDir="row" h="100%" w="100%" spacing="6">
                <Flex w="70%">
                  <Formik
                    initialValues={{
                      content: report.content ? report.content : defaultReport,
                      title: report.title ? report.title : '',
                      reportId,
                      draft: report.draft ? '1' : '0',
                      filingOfficerId: report.filingOfficerId,
                      cops: copsOnReport.map(c => c.id),
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, actions) => {
                      try {
                        const res = await patchReport(reportId, {
                          ...values,
                          draft: values.draft === '1' ? true : false,
                        });
                        actions.setSubmitting(false);
                        toast({
                          description: 'Saved report!',
                          status: 'success',
                          duration: 5000,
                          isClosable: true,
                        });
                      } catch (e) {
                        toast({
                          description: 'Something broke...',
                          status: 'error',
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                      mutateReport();
                    }}
                  >
                    {props => (
                      <FForm>
                        <Flex justifyContent="flex-start">
                          <VStack w="50rem">
                            <TextForm
                              name="title"
                              type="string"
                              label="Title"
                              isReadOnly={!Boolean(report.draft)}
                            />
                            <Textarea
                              name="content"
                              placeholder="Here is a sample placeholder"
                              size="sm"
                              isReadOnly={!Boolean(report.draft)}
                              height="20rem"
                              resize="vertical"
                            />
                            <Flex mb="1rem" mt="1rem" flexDir="column">
                              <RadioGroup
                                name="draft"
                                defaultValue={report.draft ? '1' : '0'}
                                onChange={e => {
                                  props.setFieldValue('draft', e);
                                }}
                              >
                                <HStack>
                                  <Radio value={'1'} defaultChecked isDisabled={!report.draft}>
                                    Draft
                                  </Radio>
                                  <Radio value={'0'}>Final Submission</Radio>
                                </HStack>
                              </RadioGroup>
                            </Flex>
                            <CopSelect
                              name="cops"
                              type="string"
                              cops={cops}
                              preSelected={copsOnReport.map(c => ({
                                label: c.name,
                                value: c.id,
                              }))}
                            />
                            <Button
                              mt={4}
                              colorScheme="teal"
                              isDisabled={!Boolean(report.draft)}
                              isLoading={props.isSubmitting}
                              type="submit"
                            >
                              <CheckIcon />
                            </Button>
                          </VStack>
                        </Flex>
                      </FForm>
                    )}
                  </Formik>
                </Flex>
                <VStack w="30%" flexDir="column" spacing="6">
                  {/* <Flex>{JSON.stringify(shittyPrintableBooking, undefined, 2)}</Flex> */}
                  <Flex>
                    <Mugshot criminal={criminal} />
                  </Flex>
                  <Flex>{`${criminal.first_name} ${criminal.last_name}`}</Flex>
                  <Flex>Original Time: {timeAndPenalty?.time}</Flex>
                  <Flex>Fine: ${timeAndPenalty?.penalty}</Flex>
                  <Flex>Plea: {shittyPrintableBooking.bookingPlea}</Flex>
                  <Flex>Booking reduction: {shittyPrintableBooking.bookingReduction}%</Flex>
                  <Flex>Override time: {shittyPrintableBooking.bookingOverride}</Flex>
                  <Flex>Officer: {`${cop.first_name} ${cop.last_name}`} </Flex>
                  <Flex>Additionals involved:</Flex>
                  {/*  todo: add delete on mdt_reports_involved_new or tie it into the multiselect and clear 
                  any officers that aren't present there  */}
                  <VStack>
                    {copsOnReport.map(c => {
                      return <Flex key={c.id}>{`${c.name}`}</Flex>;
                    })}
                  </VStack>
                  {charges?.map(c => {
                    return (
                      <Flex key={c.chargeId} mt="1rem">
                        {penalByChargeId.get(c.chargeId)?.name ?? 'failed getting charge'} *{' '}
                        {c.chargeCount}
                      </Flex>
                    );
                  })}
                </VStack>
              </HStack>
            </Flex>
          );
        }}
      </LoadableContentSafe>
    </Layout>
  );
}

// todo pull this out unti its own component
const Mugshot = ({
  criminal,
}: {
  criminal: {
    image: string | null;
    first_name: string | null;
    last_name: string | null;
    id: number;
    cuid: string;
  };
}) => {
  const { data: citizen, mutate } = useSWR(
    `/api/citizen/?citizenid=${criminal.cuid}`,
  ) as SWRResponse<SingleCitizen, any>;
  if (!citizen) return <></>;
  const schema = yup.object().shape({ image: yup.string().required('must have image to update') });
  return (
    <Flex>
      {criminal.image && (
        <Image
          border="1px solid #4A5568"
          mr="2.5%"
          boxSize="5.5rem"
          objectFit="fill"
          borderRadius="md"
          src={citizen.image ? citizen.image : undefined}
          alt="blank_profile_picture"
        />
      )}
      <Formik
        initialValues={{ image: citizen.image }}
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          try {
            const res = await patchImage(criminal.id.toString(), {
              image: values.image,
            });
            mutate();
          } catch (e) {
            // todo add toast shit
            //   toast({
            //     description: 'Something broke...',
            //     status: 'error',
            //     duration: 5000,
            //     isClosable: true,
            //   });
            // }
            // mutateReport();
          }
        }}
      >
        {props => (
          <FForm>
            <Flex justifyContent="flex-start">
              <VStack w="30rem">
                <TextForm name="image" type="string" label="Mugshot URL" />

                <Button
                  mt={4}
                  colorScheme="teal"
                  isDisabled={props.isSubmitting}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  <CheckIcon />
                </Button>
              </VStack>
            </Flex>
          </FForm>
        )}
      </Formik>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (!session || !session.user || !session.user.isCop) {
    return { redirect: { permanent: false, destination: '/?l=t' } };
  }
  return { props: { session } };
};
