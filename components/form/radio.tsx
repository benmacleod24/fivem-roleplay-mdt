import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input, Radio as RadioUI, Select as SelectUI } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { ReactElement } from 'react';

// these are broken, dont use
const Radio = ({
  label,
  name,
  value,
  selectedValue,
  onChange,
  onClick,
  id,
  defaultChecked = false,
  ...props
}: {
  id?: string;
  value?: string | number;
  label?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedValue?: string | number;
  name?: string;
  defaultChecked?: boolean;
}): ReactElement => {
  const isChecked = selectedValue == value;

  return (
    <>
      <FormLabel>
        {label}
        <RadioUI
          color="red"
          id={id}
          onClick={onClick}
          name={name}
          value={value}
          isChecked={isChecked}
          onChange={onChange}
          defaultChecked={defaultChecked}
          {...props}
          _after={{
            content: "''",
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '0.5rem',
            opacity: isChecked ? 1 : 0,
          }}
          _checked={{
            _after: {
              opacity: 1,
            },
          }}
        />
      </FormLabel>
    </>
  );
};

export default Radio;
