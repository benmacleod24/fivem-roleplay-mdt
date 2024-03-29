import { Flex, Text } from '@chakra-ui/layout';
import { Button, Heading, Input, InputGroup, InputLeftElement, useToast } from '@chakra-ui/react';
import * as React from 'react';
import usePenal, { mdtCharges } from '../../../../hooks/api/usePenal';
import * as yup from 'yup';
import * as Form from '../../../../form';
import { Formik, FormikProps, Form as FForm } from 'formik';
import { mdt_charges, mdt_charges_categories } from '.prisma/client';
import { EditIcon } from '@chakra-ui/icons';

export interface EditChargeProps {}

const EditCharge: React.FunctionComponent<EditChargeProps> = ({}) => {
  const { category, error: penalError } = usePenal();
  const [currCat, setCat] = React.useState<(mdt_charges_categories & mdtCharges) | undefined>();
  const [currCharge, setCharge] = React.useState<mdt_charges | undefined>();
  const toast = useToast();

  const initValues = {
    chargeId: '',
  };

  return (
    <Flex
      ml={[0, 0, '0', '3']}
      mt={['3', '3', '3', '0']}
      borderRadius="md"
      w="sm"
      h="fit-content"
      background="gray.700"
      px="4"
      flexDir="column"
    >
      <Formik
        initialValues={initValues}
        onSubmit={async (values, actions) => {
          try {
            const res = await fetch(`/api/penal?chargeId=${values.chargeId}`, {
              method: 'DELETE',
            }).then(r => r.json());
            toast({
              position: 'top-right',
              status: 'success',
              description: 'Charge Deleted!',
            });
          } catch (e) {
            toast({
              position: 'top-right',
              status: 'error',
              description: 'An error occured while deleting charge',
            });
          }
        }}
      >
        {(props: FormikProps<typeof initValues>) => (
          <FForm>
            <Flex
              w="full"
              py="3"
              mb="3"
              borderBottomColor="gray.600"
              borderBottomStyle="solid"
              borderBottomWidth="1px"
              flexDir="column"
            >
              <Heading mb="2" size="md">
                Delete Charge
              </Heading>
              <Text fontSize="xs" color="gray.500">
                Deleting a charge only performs a soft delete of the charge. Meaning that the charge
                will remain there for anyone who has been previous charged with it, but is not
                longer bookable.
              </Text>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Charge Category
              </Text>
              <Form.Select
                type="string"
                placeholder="Select Category"
                name="chargeCategory"
                onChange={e => {
                  setCat(category?.find(c => c.categoryid === Number(e.target.value)));
                }}
              >
                {category ? (
                  category.map(c => (
                    <option key={c.categoryid} value={c.categoryid}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option>No Options Avaible</option>
                )}
              </Form.Select>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Select Charge
              </Text>
              <Form.Select
                type="string"
                placeholder="Select Charge"
                name="charge"
                onChange={async e => {
                  props.setFieldValue('chargeId', e.target.value);
                  setCharge(currCat?.mdt_charges.find(c => c.chargeid === Number(e.target.value)));
                }}
              >
                {currCat ? (
                  currCat.mdt_charges.map(c => <option value={c.chargeid}>{c.name}</option>)
                ) : (
                  <option>No options avaible</option>
                )}
              </Form.Select>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Button colorScheme="red" type="submit" isLoading={props.isSubmitting}>
                Delete Charge
              </Button>
            </Flex>
          </FForm>
        )}
      </Formik>
    </Flex>
  );
};

export default EditCharge;
