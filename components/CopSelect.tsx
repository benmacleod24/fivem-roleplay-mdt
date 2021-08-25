import React, { useMemo } from 'react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useField } from 'formik';
import { tCop } from '../pages/api/cops';

export interface Item {
  label: string;
  value: string;
}
const countries = [
  { value: 'ghana', label: 'Ghana' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'southAfrica', label: 'South Africa' },
  { value: 'unitedStates', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'germany', label: 'Germany' },
];

export default function CopSelect({
  name,
  type,
  cops,
  preSelected,
  ...props
}: {
  name: string;
  type: string;
  preSelected: Item[];
  cops: tCop;
}) {
  const copOptions = useMemo(() => {
    return cops.map(c => ({ value: c.id.toString(), label: `${c.first_name} ${c.last_name}` }));
  }, [cops]);
  const [field, meta, helpers] = useField(name);
  const [pickerItems, setPickerItems] = React.useState(copOptions);
  const [selectedItems, setSelectedItems] = React.useState<Item[]>(preSelected);

  const handleCreateItem = (item: Item) => {
    setPickerItems(curr => [...curr, item]);
    setSelectedItems(curr => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
      helpers.setValue(selectedItems.map(k => k.value));
    }
  };

  return (
    <CUIAutoComplete
      label="Add officers"
      placeholder="Type a Name"
      onCreateItem={handleCreateItem}
      items={pickerItems}
      selectedItems={selectedItems}
      listStyleProps={{ bg: 'black' }}
      listItemStyleProps={{ color: 'pink' }}
      tagStyleProps={{ color: 'purple' }}
      highlightItemBg={'purple'}
      onSelectedItemsChange={changes => handleSelectedItemsChange(changes.selectedItems)}
    />
  );
}
