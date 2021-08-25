import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Flex, Heading, Text } from '@chakra-ui/layout';
import { Button, Textarea } from '@chakra-ui/react';
import * as React from 'react';
import { BiDollar, BiMoney } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { Formik, FormikProps, Form as FForm } from 'formik';
import usePenal from '../../../hooks/api/usePenal';
import * as Form from '../../../form';
import * as yup from 'yup';
import useDepartments, { mdtRanks } from '../../../hooks/api/useDepartments';
import { mdt_departments } from '.prisma/client';
import { createMember } from '../../../hooks/api/postMember';

export interface RegisterOfficerProps {}

const newChargeInitValues = {
  characterId: 0,
  departmentId: 0,
  rankId: 0,
};

const validSchema = yup.object().shape({
  characterId: yup.number().required('A character Id is required'),
  departmentId: yup.number().required('A department is required'),
  rankId: yup.number().required('A rank is required'),
});

const RegisterOfficer: React.SFC<RegisterOfficerProps> = ({}) => {
  const { category, error: penalError } = usePenal();
  const { departments, error: deptError } = useDepartments();
  const [currDept, setCurrDept] = React.useState<(mdt_departments & mdtRanks) | undefined>();

  const handleNewCharge = async (values: typeof newChargeInitValues, actions: any) => {
    createMember({
      characterId: Number(values.characterId),
      departmentId: Number(values.departmentId),
      rankId: Number(values.rankId),
    });
  };

  return (
    <Flex borderRadius="md" w="sm" h="fit-content" background="gray.700" px="4" flexDir="column">
      <Formik
        initialValues={newChargeInitValues}
        onSubmit={handleNewCharge}
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
              <Heading size="md">Register Officer</Heading>
            </Flex>
            <Flex flexDir="column" mb="5">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Character ID
              </Text>
              <InputGroup>
                <Input
                  name="characterId"
                  onChange={e => props.setFieldValue('characterId', Number(e.target.value))}
                  placeholder="Character ID"
                />
              </InputGroup>
            </Flex>
            <Flex flexDir="column" mb="5" w="full">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Department
              </Text>
              <Form.Select
                type="string"
                onChange={e => {
                  props.setFieldValue('departmentId', e.target.value);
                  setCurrDept(departments?.find(d => d.departmentId === Number(e.target.value)));
                }}
                placeholder="Select Department"
                name="departmentId"
              >
                {departments ? (
                  departments.map(d => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName.toLocaleUpperCase()}
                    </option>
                  ))
                ) : (
                  <option>No Options Avaible</option>
                )}
              </Form.Select>
            </Flex>
            <Flex flexDir="column" mb="5">
              <Text fontWeight="bold" fontSize="sm" mb="1" textTransform="uppercase">
                Rank
              </Text>
              <Form.Select
                type="string"
                onChange={e => props.setFieldValue('rankId', e.target.value)}
                placeholder="Select Rank"
                name="rankId"
              >
                {currDept && currDept.mdt_department_ranks ? (
                  currDept.mdt_department_ranks.map(r => (
                    <option key={r.rankId} value={r.rankId}>
                      {r.rankName}
                    </option>
                  ))
                ) : (
                  <option>No Options Avaible</option>
                )}
              </Form.Select>
            </Flex>
            <Flex w="full" mb="5">
              <Button type="submit" colorScheme="yellow" isFullWidth>
                Register
              </Button>
            </Flex>
          </FForm>
        )}
      </Formik>
    </Flex>
  );
};

export default RegisterOfficer;
