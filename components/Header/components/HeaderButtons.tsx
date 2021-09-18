import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/layout';
import { Menu, MenuButton as MB, MenuItem, MenuList } from '@chakra-ui/menu';
import { Button, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import MenuButton from './MenuButton';

export interface HeaderButtonsProps {}

const HeaderButtons: React.FunctionComponent<HeaderButtonsProps> = ({}) => {
  const router = useRouter();

  return (
    <Flex
      width="full"
      h="full"
      alignItems="center"
      justifyContent="center"
      display={['none', 'none', 'none', 'none', 'flex']}
    >
      <MenuButton title="home" link="/" />
      <Menu>
        <MB
          as={Button}
          rightIcon={<ChevronDownIcon mr="-1" ml="-1" mt="0.5" fontSize="xl" />}
          size="sm"
          variant={
            router.pathname === '/citizens' || router.pathname === '/vehicles' ? 'solid' : 'ghost'
          }
          colorScheme={
            router.pathname === '/citizens' || router.pathname === '/vehicles' ? 'yellow' : 'gray'
          }
          mr="3"
        >
          Databases
        </MB>
        <MenuList>
          <Link href="/citizens" passHref>
            <MenuItem>Citizens</MenuItem>
          </Link>
          <Link href="/vehicles" passHref>
            <MenuItem>Vehicles</MenuItem>
          </Link>
        </MenuList>
      </Menu>
      <MenuButton title="reports" />
      <MenuButton title="dispatch" />
      <MenuButton title="warrants" />
      <MenuButton title="Penal Code" link="/penal" />
    </Flex>
  );
};

export default HeaderButtons;
