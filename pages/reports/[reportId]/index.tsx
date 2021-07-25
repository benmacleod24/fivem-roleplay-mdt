// import Image from 'next/image';
import Layout from '../../../components/layout';
import React, { useMemo } from 'react';
import { HStack, Button, VStack, Flex, Text, Radio, RadioGroup, useToast } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
import { FieldInputProps, FieldMetaProps, Form as FForm, Formik, FormikProps } from 'formik';
// import useSWR from 'swr';
import { mdt_booked_charges_new, mdt_bookings_new, mdt_reports_new } from '@prisma/client';
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
import Reports from '../../api/reports/[reportId]';

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

interface SWRResponseType extends mdt_reports_new {
  mdt_bookings_new: mdt_bookings_new_with_charges[];
}

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
  } = useSWR(`/api/reports/${reportId}`) as SWRResponse<SWRResponseType, any>;

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
      <LoadableContentSafe data={{ report, penal }} errors={[reportError, penalError]}>
        {({ report, penal }) => {
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
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, actions) => {
                      try {
                        console.log(values);
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
                            <TextForm name="title" type="string" label="Title" />
                            <Textarea
                              name="content"
                              placeholder="Here is a sample placeholder"
                              size="sm"
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
                  <Flex>Original Time: {timeAndPenalty?.time}</Flex>
                  <Flex>Fine: ${timeAndPenalty?.penalty}</Flex>
                  <Flex>Plea: {shittyPrintableBooking.bookingPlea}</Flex>
                  <Flex>Booking reduction: {shittyPrintableBooking.bookingReduction}%</Flex>
                  <Flex>Override time: {shittyPrintableBooking.bookingOverride}</Flex>
                  <Flex>Officer: {shittyPrintableBooking.filingOfficerId} (todo later)</Flex>

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
