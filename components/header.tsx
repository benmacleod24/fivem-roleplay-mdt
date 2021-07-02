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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
export default function Header() {
  const [session, loading] = useSession();
  return (
    <Box pb="1rem" pt="1rem" mb="1rem" borderBottom="1px solid #555">
      {/* <DiscordAuth /> */}
      <Grid templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={3}>
          <Flex pl="1rem">
            {session && session.user && session.user.image && (
              <Flex>
                <Image
                  borderRadius="2rem"
                  height="2.8rem"
                  width="2.8rem"
                  alt="silhouette"
                  src={session.user.image}
                />
                {session.user.name && (
                  <Flex pl="1rem" flexDir="column">
                    <small>Signed in as</small>
                    <strong>{session.user.copName ?? session.user.name}</strong>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </GridItem>

        <GridItem colSpan={7}>
          <Flex justifyContent="center">
            <ButtonGroup variant="outline" spacing="3">
              <Button>
                <Link href="/" passHref>
                  Home
                </Link>
              </Button>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Databases
                </MenuButton>
                <MenuList>
                  <Link href="/citizens" passHref>
                    <MenuItem>Citizens</MenuItem>
                  </Link>
                  <MenuItem>Criminals</MenuItem>
                  <MenuItem>Vehicles</MenuItem>
                </MenuList>
              </Menu>
              <Button>
                <Link href="#">Reports</Link>
              </Button>
              <Button>
                <Link href="#">Warrants</Link>
              </Button>
              <Button>
                <Link href="/penal">Penal Code</Link>
              </Button>
              <Button>
                <Link href="#">Profile</Link>
              </Button>
              <ToggleMode />
            </ButtonGroup>
          </Flex>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex
            justifyContent="flex-end"
            alignItems="flex-end"
            flexDir="column"
            alignContent="center"
            paddingRight="1rem"
          >
            <Button
              colorScheme={session ? 'red' : 'green'}
              variant="solid"
              onClick={e => {
                e.preventDefault();
                session ? signOut() : signIn('discord');
              }}
            >
              {session ? 'Sign Out ' : 'Sign In'}
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

function ToggleMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button marginLeft="3rem" onClick={toggleColorMode}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
