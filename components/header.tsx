import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  Box,
  ButtonGroup,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorModeValue,
  Skeleton,
  IconButton,
  MenuDivider,
  Heading,
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
} from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { GiRank3 } from 'react-icons/gi';

export interface HeaderProps {}

const Header: React.SFC<HeaderProps> = ({}) => {
  // State
  const [mobileMenu, setMobileMenu] = React.useState(false);

  // Session Data
  const [session, loading] = useSession();

  // Chakra Colors
  const headerColor = useColorModeValue('gray.50', 'gray.700');
  const mdtText = useColorModeValue('gray.800', 'gray.200');
  const saText = useColorModeValue('blue.500', 'blue.300');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <React.Fragment>
      <Flex
        minHeight="8vh"
        maxHeight="8vh"
        pl="6.5%"
        pr="6.5%"
        width="100%"
        height="8vh"
        mb="1rem"
        background={headerColor}
        justifyContent={'space-between'}
      >
        {/* Police Branding */}
        <Flex
          boxSizing="border-box"
          height="100%"
          minWidth={['75%', '75%', '50%', '20%', '20%']}
          alignItems="center"
          justifyContent={['center', 'center', 'flex-start', 'flex-start']}
        >
          <Image
            width={['2.8rem', '2.8rem', '3rem', '3rem']}
            mr="2"
            src={'https://i.imgur.com/AHFKtEZ.png'}
            alt="Police Badge"
          />
          <Flex direction="column" width="100%">
            <Heading
              fontStyle="italic"
              fontWeight="normal"
              fontSize={['sm', 'sm', 'xs', 'xs', 'sm']}
              color={saText}
            >
              San Andreas
            </Heading>
            <Heading fontSize={['sm', 'sm', 'x-small', 'xs', 'md']} color={mdtText}>
              Mobile Data Terminal
            </Heading>
          </Flex>
        </Flex>

        {/* Menu Buttons */}
        <Flex
          boxSizing="border-box"
          height="100%"
          minWidth={['0', '0', '60%', '60%']}
          alignItems="center"
          justifyContent="center"
          display={['none', 'none', 'none', 'flex']}
        >
          <ButtonGroup>
            <Link href="/" passHref>
              <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
                Home
              </Button>
            </Link>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon ml="2" mr="-2" mt="0.5" fontSize="xl" />}
                variant="outline"
                colorScheme="yellow"
                mr="1%"
              >
                Databases
              </MenuButton>
              <MenuList>
                <Link href="/citizens" passHref>
                  <MenuItem>Citizens</MenuItem>
                </Link>
                <MenuItem>Vehicles</MenuItem>
              </MenuList>
            </Menu>
            <Link href="/reports" passHref>
              <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
                Reports
              </Button>
            </Link>
            <Link href="/dispatch" passHref>
              <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
                Dispatch
              </Button>
            </Link>
            <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
              Warrants
            </Button>
            <Link href="/penal" passHref>
              <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
                Penal Code
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>

        {/* Sign in & Sign Out Buttons */}
        <Flex
          boxSizing="border-box"
          height="100%"
          minWidth="20%"
          justifyContent="flex-end"
          alignItems="center"
          display={['none', 'none', 'none', 'flex']}
        >
          {session ? (
            <Flex width="3.3rem" height="3.3rem" position="relative">
              <Image
                src={session?.user.image}
                alt="silhouette"
                width="100%"
                height="100%"
                borderRadius="full"
              />
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  position="absolute"
                  bottom="-8%"
                  right="-8%"
                  size="xs"
                  colorScheme="blue"
                  opacity="0.9"
                  borderRadius="full"
                />
                <MenuList>
                  <Link href="/profile" passHref>
                    <MenuItem icon={<BsFillPersonLinesFill />}>Profile</MenuItem>
                  </Link>
                  {session.user.rankLvl >= 4 ? (
                    <Link href="/command" passHref>
                      <MenuItem icon={<GiRank3 />}>Command Managment</MenuItem>
                    </Link>
                  ) : (
                    ''
                  )}
                  <MenuItem
                    onClick={toggleColorMode}
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  >
                    {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()} icon={<BiExit />}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : !loading ? (
            <Button
              onClick={() => signIn('discord')}
              size="sm"
              variant="outline"
              colorScheme="blue"
            >
              Sign In
            </Button>
          ) : (
            ''
          )}
          {loading ? <Skeleton width="3.3rem" height="3.3rem" borderRadius="full" /> : ''}
        </Flex>

        {/* Hamburger Menu */}
        <Flex
          boxSizing="border-box"
          height="100%"
          minWidth={['25%', '25%', '50%', '20%', '20%']}
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton
            variant="ghost"
            borderRadius="md"
            size="sm"
            icon={<HamburgerIcon />}
            aria-label="hamburger-menu"
            onClick={() => setMobileMenu(true)}
          />
        </Flex>
      </Flex>
      <Drawer isOpen={mobileMenu} onClose={() => setMobileMenu(false)}>
        <DrawerContent>
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Link href="/" passHref>
              <Button
                mb="3"
                isFullWidth
                variant="outline"
                colorScheme="yellow"
                ml="1%"
                mr="1%"
                size="md"
              >
                Home
              </Button>
            </Link>
            <Link href="/reports" passHref>
              <Button
                isFullWidth
                mb="3"
                variant="outline"
                colorScheme="yellow"
                ml="1%"
                mr="1%"
                size="md"
              >
                Reports
              </Button>
            </Link>
            <Link href="/dispatch" passHref>
              <Button
                mb="3"
                isFullWidth
                variant="outline"
                colorScheme="yellow"
                ml="1%"
                mr="1%"
                size="md"
              >
                Dispatch
              </Button>
            </Link>
            <Button
              mb="3"
              isFullWidth
              variant="outline"
              colorScheme="yellow"
              ml="1%"
              mr="1%"
              size="md"
            >
              Warrants
            </Button>
            <Link href="/penal" passHref>
              <Button isFullWidth variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
                Penal Code
              </Button>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default Header;
