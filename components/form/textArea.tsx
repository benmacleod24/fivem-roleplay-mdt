import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input, ResponsiveValue, Textarea as Tarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { ReactElement } from 'react';

export const Textarea = ({
  label,
  ...props
}: {
  label?: string;
  name: string;
  size?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  height?: string;
  resize?: ResponsiveValue<any> | undefined;
  placeholder?: string;
}): ReactElement => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <FormControl>
        <FormLabel>
          {label}
          <Tarea {...field} {...props} />
        </FormLabel>
        <FormErrorMessage>{meta.touched && meta.error ? meta.error : null}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default Textarea;
