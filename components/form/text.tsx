import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { ReactElement } from 'react';

export const Text = ({
  label,
  ...props
}: {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  isReadOnly?: boolean;
}): ReactElement => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <FormControl>
        <FormLabel>
          {label}
          <Input {...field} {...props} />
        </FormLabel>
        <FormErrorMessage>{meta.touched && meta.error ? meta.error : null}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default Text;
