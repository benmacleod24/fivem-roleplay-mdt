import { Button, Flex, HStack, IconButton, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Formik, FormikProps, Form as FForm } from 'formik';
import * as React from 'react';
import { BookingSWR, chargeAndCount, TRIAL } from '../../pages/booking/[cuid]';
import { numberWithComma } from '../../utils';
import * as yup from 'yup';
import { createBooking } from '../hooks/api/postBooking';

import * as Form from '../../components/form/index';
import { useRouter } from 'next/router';

export interface BookingSummaryProps {
  selectedCharges: Record<number, chargeAndCount>;
  removeCharge: (a: number) => void;
  character: BookingSWR | undefined;
}

const schema = yup.object().shape({
  bookingPlea: yup.string().required('A plea is required'),
  chargesAndAccounts: yup.array().min(1, 'Must select at least one charge'),
});

const BookingSummary: React.SFC<BookingSummaryProps> = ({
  character,
  selectedCharges,
  removeCharge,
}) => {
  const router = useRouter();

  const initialValues = {
    bookingPlea: undefined,
    bookingReduction: '0',
    time: '',
  };

  const chargesArray = Object.values(selectedCharges);

  // Handlers & Functions
  const timeAndPenalty = Object.values(selectedCharges).reduce(
    (acc, res) => {
      acc.time += res.counts * (res.charge.time ?? 0);
      acc.penalty += res.counts * (res.charge.fine ?? 0);
      return acc;
    },
    {
      time: 0,
      penalty: 0,
    },
  );

  return (
    <Flex w="full" h="fit-content" flexDir="column">
      <Flex
        w="full"
        justifyContent="center"
        alignItems="center"
        py="2"
        background="gray.700"
        borderTopRadius="md"
      >
        <Text fontWeight="bold">Booking Summary</Text>
      </Flex>
      <Flex w="full" h="fit-content">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, actions) => {
            const chargesAndCounts = chargesArray.map(c => ({
              chargeId: c.charge.chargeid,
              chargeCount: c.counts,
            }));

            const defaultTime =
              timeAndPenalty.time * (1 - parseFloat(values.bookingReduction) / 100);

            const submission = Object.assign({
              ...values,
              criminalId: character?.id,
              forWarrant: false, //todo change later
              bookedCharges: chargesAndCounts,
              bookingOverride: values.time ? parseInt(values.time) : defaultTime,
            });

            const res = await createBooking(submission);
            const { reportId } = res;
            router.push(`/reports/${reportId}`);
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<typeof initialValues>) => (
            <FForm style={{ width: '100%' }}>
              <Flex flexDir="column" w="full" background="gray.700" p="2" mt="2" borderRadius="md">
                {chargesArray.length ? (
                  ''
                ) : (
                  <Text m="2" my="2">
                    No charges currently selected.
                  </Text>
                )}
                {chargesArray.map(char => (
                  <Flex
                    w="full"
                    _hover={{ background: 'gray.800' }}
                    transition="0.2s ease-in-out"
                    cursor="pointer"
                    py="2.5"
                    px="2"
                    borderRadius="md"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text maxW="75%" flex={1}>
                      {char.charge.name}
                    </Text>
                    <Flex alignItems="center">
                      <Text borderBottomColor="yellow" borderBottomWidth="1px" px="2">
                        {char.counts}
                      </Text>
                      <IconButton
                        ml="3.5"
                        aria-label="charge-remove"
                        size="sm"
                        borderRadius="md"
                        onClick={() => removeCharge(char.charge.chargeid)}
                        icon={<CloseIcon />}
                      />
                    </Flex>
                  </Flex>
                ))}
              </Flex>
              <Flex
                flexDir="row"
                mt="2"
                justifyContent="space-around"
                borderRadius="md"
                p="2"
                py="4"
                w="full"
                background="gray.700"
                visibility={chargesArray.length ? 'visible' : 'hidden'}
              >
                <Flex flexDir="column" w="45%">
                  <Text mb="0.5">Time:</Text>
                  <Text background="gray.800" borderRadius="md" p="1.5">
                    {timeAndPenalty.time < TRIAL
                      ? `${numberWithComma(
                          Math.floor(
                            timeAndPenalty.time *
                              (1 - parseFloat(props.values.bookingReduction) / 100),
                          ),
                        )} Month(s)`
                      : `Hold Until Trial`}
                  </Text>
                </Flex>
                <Flex flexDir="column" w="45%">
                  <Text mb="0.5">Penalty:</Text>
                  <Text background="gray.800" borderRadius="md" p="1.5">
                    {timeAndPenalty.penalty < TRIAL
                      ? `$${numberWithComma(
                          Math.floor(
                            timeAndPenalty.penalty *
                              (1 - parseFloat(props.values.bookingReduction) / 100),
                          ),
                        )}`
                      : `Hold Until Trial`}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                mt="2"
                background="gray.700"
                borderRadius="md"
                p="3"
                flexDir="column"
                visibility={chargesArray.length ? 'visible' : 'hidden'}
              >
                <Text fontWeight="medium" color="blue.300" mb="2">
                  Dept. of Justice Plea
                </Text>
                <Form.Select type="string" placeholder="Select plea" name="bookingPlea">
                  <option value="guilty">Plea of Guilty</option>
                  <option value="innocense">Plea of Innocense</option>
                  <option value="no_contest">Plea of No Contest</option>
                </Form.Select>
              </Flex>
              <Flex
                visibility={chargesArray.length ? 'visible' : 'hidden'}
                flexDir="column"
                w="full"
                background="gray.700"
                mt="2"
                borderRadius="md"
                p="4"
              >
                <Text mb="2">Booking Reduction</Text>
                <RadioGroup
                  name="bookingReduction"
                  defaultValue={'0'}
                  onChange={e => {
                    props.setFieldValue('bookingReduction', e);
                  }}
                >
                  <HStack>
                    <Radio value={'0'} defaultChecked>
                      0%
                    </Radio>
                    <Radio value={'25'}>25%</Radio>
                    <Radio value={'50'}>50%</Radio>
                    <Radio value={'75'}>75%</Radio>
                  </HStack>
                </RadioGroup>
              </Flex>
              <Flex w="full" mt="2.5" visibility={chargesArray.length ? 'visible' : 'hidden'}>
                <Button
                  isFullWidth
                  size="md"
                  colorScheme="blue"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Complete Booking
                </Button>
              </Flex>
            </FForm>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default BookingSummary;
