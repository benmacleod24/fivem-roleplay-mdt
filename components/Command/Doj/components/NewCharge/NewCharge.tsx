import { EditIcon, SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Flex, Heading, Text } from '@chakra-ui/layout';
import { Button, Textarea } from '@chakra-ui/react';
import * as React from 'react';
import { BiDollar, BiMoney } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { Formik, FormikProps, Form as FForm } from 'formik';
import usePenal from '../../../../hooks/api/usePenal';
import * as Form from '../../../../form';
import { map, string } from 'zod';
import * as yup from 'yup';

export interface NewChargeProps {}

const newChargeInitValues = {
  chargeTitle: '',
  chargeDescription: '',
  chargeTime: '',
  chargeFine: '',
  chargeCategory: 0,
  chargeClass: '',
};

const validSchema = yup.object().shape({
  chargeTitle: yup.string().required('A title is required.'),
  chargeDescription: yup.string().required('A description is required.'),
  chargeTime: yup.string().required('A time is required'),
  chargeFine: yup.string().required('A fine is required'),
  chargeCategory: yup.number().required('A Category is required.'),
  chargeClass: yup.string().required('A Class is required.'),
});

const NewCharge: React.SFC<NewChargeProps> = ({}) => {
  const { category, error: penalError } = usePenal();

  const handleNewCharge = async (values: typeof newChargeInitValues, actions: any) => {
    console.log(values);
  };

  return (
    <Flex borderRadius="md" w="sm" h="fit-content" background="gray.700" px="4" flexDir="column">
      <Formik
        initialValues={newChargeInitValues}
        onSubmit={handleNewCharge}
        isInitialValid
        validationSchema={validSchema}
      >
        {(props: FormikProps<typeof newChargeInitValues>) => (
          <FForm>
            <Flex
              w="full"
              py="3"
              mb="3"
              borderBottomColor="gray.600"
              borderBottomStyle="solid"
              borderBottomWidth="1px"
            >
              <Heading size="md">Create new Charge</Heading>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Charge Title
              </Text>
              <InputGroup variant="filled">
                <InputLeftElement children={<EditIcon />} />
                <Input
                  name="chargeTitle"
                  placeholder="Charge Title"
                  onChange={e => props.setFieldValue('chargeTitle', e.target.value)}
                />
              </InputGroup>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Charge Description
              </Text>
              <Textarea
                name="chargeDescription"
                variant="filled"
                resize="vertical"
                placeholder="Charge Description..."
                onChange={e => props.setFieldValue('chargeDescription', e.target.value)}
              />
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Charge Details
              </Text>
              <Flex>
                <InputGroup variant="filled" mr="2">
                  <InputLeftElement children={<BsClock />} />
                  <Input
                    name="chargeTime"
                    placeholder="Time"
                    onChange={e => props.setFieldValue('chargeTime', e.target.value)}
                  />
                </InputGroup>
                <InputGroup variant="filled" ml="2">
                  <InputLeftElement children={<BiDollar />} />
                  <Input
                    name="chargeFine"
                    placeholder="Fine"
                    onChange={e => props.setFieldValue('chargeFine', e.target.value)}
                  />
                </InputGroup>
              </Flex>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Charge Category
              </Text>
              <Form.Select
                type="string"
                placeholder="Select Category"
                name="chargeCategory"
                onChange={e => props.setFieldValue('chargeCategory', e.target.value)}
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
                Charge Class
              </Text>
              <Form.Select
                type="string"
                placeholder="Select Class"
                name="chargeClass"
                onChange={e => props.setFieldValue('chargeClass', e.target.value)}
              >
                <option value="infraction">Infraction</option>
                <option value="misdemeanor">Misdemeanor</option>
                <option value="felony">Felony</option>
              </Form.Select>
            </Flex>
            <Flex mb="5" flexDir="column">
              <Button colorScheme="yellow" type="submit" isLoading={props.isSubmitting}>
                Submit Charge
              </Button>
            </Flex>
          </FForm>
        )}
      </Formik>
    </Flex>
  );
};

export default NewCharge;
