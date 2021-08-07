import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input, Select as SelectUI } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import React, { ReactElement } from 'react';

export const Select = ({
  label,
  children,
  onChange,
  placeholder,
  name,
  type,
  ...props
}: {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  children: ReactElement<'option'> | ReactElement<'option'>[] | null;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): ReactElement => {
  const [field, meta, helpers] = useField(name);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) onChange(e);
    field.onChange(e);
  };
  return (
    <>
      <FormControl isInvalid={meta.touched && !!meta.error}>
        <FormLabel mb="2">
          {label}
          <SelectUI {...field} {...props} placeholder={placeholder} onChange={handleChange}>
            {children}
          </SelectUI>
        </FormLabel>
        <FormErrorMessage>{meta.touched && meta.error ? meta.error : null}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default Select;
