import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import * as React from 'react';

export interface SearchWrapperProps {
    filter: string;
    setFilter: any;
    placeholder?: string
}

const SearchWrapper: React.SFC<SearchWrapperProps> = ({ filter, setFilter, placeholder }) => {
    return (
        <InputGroup variant="filled" mt="3">
            <InputLeftElement children={<SearchIcon />} />
            <Input placeholder={placeholder} value={filter} onChange={(evt) => setFilter(evt.target.value)} />
        </InputGroup>
    );
}

export default SearchWrapper;