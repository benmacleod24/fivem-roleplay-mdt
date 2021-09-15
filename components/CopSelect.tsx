import React, { useMemo } from 'react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useField } from 'formik';
import { tCop } from '../pages/api/cops';
import { Code, Flex, Tag, TagCloseButton, Text } from '@chakra-ui/react';
import SearchDropdown from './SearchDropdonwn';
import { array } from 'zod';

// export interface Item {
//   label: string;
//   value: string;
// }
// const countries = [
//   { value: 'ghana', label: 'Ghana' },
//   { value: 'nigeria', label: 'Nigeria' },
//   { value: 'kenya', label: 'Kenya' },
//   { value: 'southAfrica', label: 'South Africa' },
//   { value: 'unitedStates', label: 'United States' },
//   { value: 'canada', label: 'Canada' },
//   { value: 'germany', label: 'Germany' },
// ];

// export default function CopSelect({
//   name,
//   type,
//   cops,
//   preSelected,
//   ...props
// }: {
//   name: string;
//   type: string;
//   preSelected: Item[];
//   cops: tCop;
// }) {
//   const copOptions = useMemo(() => {
//     return cops.map(c => ({ value: c.id.toString(), label: `${c.first_name} ${c.last_name}` }));
//   }, [cops]);
//   const [field, meta, helpers] = useField(name);
//   const [pickerItems, setPickerItems] = React.useState(copOptions);
//   const [selectedItems, setSelectedItems] = React.useState<Item[]>(preSelected);

//   const handleCreateItem = (item: Item) => {
//     setPickerItems(curr => [...curr, item]);
//     setSelectedItems(curr => [...curr, item]);
//   };

//   const handleSelectedItemsChange = (selectedItems?: Item[]) => {
//     if (selectedItems) {
//       setSelectedItems(selectedItems);
//       helpers.setValue(selectedItems.map(k => k.value));
//     }
//   };

//   return (
//     <CUIAutoComplete
//       label="Add officers"
//       placeholder="Type a Name"
//       onCreateItem={handleCreateItem}
//       items={pickerItems}
//       selectedItems={selectedItems}
//       listStyleProps={{ bg: 'black' }}
//       listItemStyleProps={{ color: 'pink' }}
//       tagStyleProps={{ color: 'purple' }}
//       highlightItemBg={'purple'}
//       onSelectedItemsChange={changes => handleSelectedItemsChange(changes.selectedItems)}
//     />
//   );
// }

export interface Item {
  label: string;
  value: string;
}

export default function CopSelect({
  cops,
  preSelected,
  ...props
}: {
  preSelected: Item[];
  cops: tCop;
}) {
  const [field, meta, helpers] = useField('cops');

  React.useEffect(() => {
    if (!preSelected) return;
    helpers.setValue(preSelected);
    console.log(preSelected);
  }, []);

  const onClick = (cop: Item) => {
    return helpers.setValue([...field.value, cop]);
  };

  const onDelete = (cop: Item) => {
    const newArray = field.value.filter((c: Item) => c.value !== cop.value);
    return helpers.setValue([...newArray]);
  };

  if (!cops) return <React.Fragment></React.Fragment>;

  const copOptions = useMemo(() => {
    return cops.map(c => ({ value: c.id.toString(), label: `${c.first_name} ${c.last_name}` }));
  }, [cops]);

  return (
    <Flex flexDir="column" w="full">
      <Flex alignItems="center">
        <Text mb="0.5" mr="1" color="yellow.200" fontWeight="semibold">
          Involved Officers
        </Text>
        <SearchDropdown>
          {(filter, open, setOpen) => {
            if (!filter)
              return (
                <Flex flexDir="column" alignItems="center" justifyContent="center" h="24">
                  <Text>Start Typing</Text>
                  <Code mt="1" borderRadius="lg" px="2">
                    First Last
                  </Code>
                </Flex>
              );

            return (
              <Flex w="full" h="full" flexDir="column" overflow="auto">
                {copOptions
                  .filter(
                    c =>
                      c.label?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) &&
                      field.value.indexOf(c) < 0,
                  )
                  .map(c => (
                    <Flex
                      py="2.5"
                      transition="0.2s ease-in-out"
                      cursor="pointer"
                      px="3.5"
                      onClick={() => {
                        onClick(c);
                        setOpen(false);
                      }}
                    >
                      {c.label}
                    </Flex>
                  ))}
              </Flex>
            );
          }}
        </SearchDropdown>
      </Flex>
      <Flex
        w="full"
        background="gray.700"
        borderRadius="md"
        mb="4"
        p="3"
        flexWrap="wrap"
        alignItems="center"
      >
        <Flex mr="1.5">
          {field.value.map((c: Item) => (
            <Tag mx="1" variant="subtle" colorScheme="blue">
              {c.label} <TagCloseButton onClick={() => onDelete(c)} />
            </Tag>
          ))}
          {field.value.length <= 0 ? (
            <Text color="gray.500" fontStyle="italic">
              No Officers Select
            </Text>
          ) : (
            ''
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}