import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input, RadioGroup as RadioGroupUI, Select as SelectUI, Stack } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { ReactElement } from 'react';
import Radio from './radio';

// these are broken, dont use
const RadioGroup = ({
  label,
  children,
  id,
  name,
  ...props
}: {
  id: string;
  label?: string;
  name?: string;
  children: React.ReactElement<typeof Radio>[] | React.ReactElement<typeof Stack>;
}): ReactElement => {
  const [field, meta] = useField({ name: id });

  return (
    <>
      <FormControl id="id">
        <FormLabel>
          {label}
          <RadioGroupUI {...field} {...props}>
            {React.Children.map(children, (child: any) => {
              return React.cloneElement(child, {
                onChange: field.onChange,
                selectedValue: field.value,
                name: field.name,
                isInvalid: Boolean(meta.error),
              });
            })}
          </RadioGroupUI>
        </FormLabel>
        <FormErrorMessage>{meta.touched && meta.error ? meta.error : null}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default RadioGroup;
