import { IconButton } from '@chakra-ui/button';
import { useOutsideClick } from '@chakra-ui/hooks';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import * as React from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchDropdownProps {
  children: (filter: string, status: boolean) => React.ReactElement;
  Button?: React.ReactElement;
  placeholder?: string;
  debounce?: boolean;
  debounceTimeout?: number;
  buttonSize?: (string & {}) | 'sm' | 'md' | 'lg' | 'xs' | undefined;
  offsetY?: number;
  offsetX?: number;
}

const SearchDropdown: React.FunctionComponent<SearchDropdownProps> = ({
  children,
  placeholder,
  debounce,
  debounceTimeout = 1000,
  buttonSize,
  offsetY = 6.3,
  offsetX = 0,
}) => {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const debouncedValue = useDebounce(filter, debounceTimeout);
  const buttonRef = document.getElementById('search-ddbutton');
  const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

  React.useEffect(() => {
    setFilter('');

    if (open) {
      const body = document.getElementById('body');
      body!.style.overflow = 'hidden';
    } else {
      const body = document.getElementById('body');
      body!.style.overflow = 'auto';
    }
  }, [open]);

  useOutsideClick({
    ref: wrapperRef,
    handler: () => setOpen(false),
  });

  return (
    <Flex pos="relative" h="fit-content">
      <IconButton
        w="fit-content"
        borderRadius="full"
        aria-label="dropdown"
        icon={
          <AddIcon
            transition="0.1s ease-in-out"
            transform={open ? 'rotate(45deg)' : 'rotate(0deg)'}
          />
        }
        variant={open ? 'ghost' : 'ghost'}
        colorScheme={open ? 'red' : 'gray'}
        size={buttonSize ? buttonSize : 'xs'}
        onClick={() => setOpen(!open)}
        id="search-ddbutton"
      />
      <Flex
        background="gray.600"
        opacity={open ? '1.0' : '0'}
        // display={open ? 'flex' : 'none'}
        transition="0.2s ease-in-out"
        pos="fixed"
        pointerEvents={open ? 'auto' : 'none'}
        bottom={0}
        transform={`translate(-${offsetX * 3}px
        , ${
          buttonRef
            ? buttonRef?.getBoundingClientRect().bottom -
              buttonRef?.getBoundingClientRect().height * 19.2
            : 0
        }px)`}
        borderRadius="lg"
        boxShadow="lg"
        zIndex={100}
        minW="80"
        maxW="80"
        h="64"
        boxSizing="border-box"
        flexDir="column"
        ref={wrapperRef}
        overflow="hidden"
      >
        <InputGroup variant="outline" w="92%" my="3" mx="auto">
          <InputLeftElement children={<SearchIcon />} />
          <Input
            placeholder={placeholder ? placeholder : 'Type Something...'}
            _focus={{ outline: 'none' }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </InputGroup>
        <Flex flexDir="column" minH="75%">
          {children(debounce ? debouncedValue : filter, open)}{' '}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SearchDropdown;
