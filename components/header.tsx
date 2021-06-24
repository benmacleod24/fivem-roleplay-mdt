import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import styles from './header.module.css';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  return (
    <Box pb="1rem" mb="1rem" borderBottom="1px solid #555">
      <DiscordAuth />

      <Flex justifyContent="center">
        <ButtonGroup variant="outline" spacing="3">
          <Button>
            <Link href="#">Home</Link>
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Databases
            </MenuButton>
            <MenuList>
              <Link href="/citizens">
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
            <Link href="#">Penal Code</Link>
          </Button>
          <Button>
            <Link href="#">Profile</Link>
          </Button>
          <ToggleMode />
        </ButtonGroup>
      </Flex>
    </Box>
  );
}

const DiscordAuth = () => {
  const [session, loading] = useSession();
  console.log(session);

  return (
    <>
      <header>
        <noscript>
          <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
        </noscript>
        <div className={styles.signedInStatus}>
          <p className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}>
            {!session && (
              <>
                <span className={styles.notSignedInText}>You are not signed in</span>
                <a
                  href={`/api/auth/signin`}
                  className={styles.buttonPrimary}
                  onClick={e => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Sign in
                </a>
              </>
            )}
            {session && (
              <>
                {session.user.image && (
                  <span
                    style={{ backgroundImage: `url(${session.user.image})` }}
                    className={styles.avatar}
                  />
                )}
                <span className={styles.signedInText}>
                  <small>Signed in as</small>
                  <br />
                  <strong>{session.user.name}</strong>
                </span>
                <a
                  href={`/api/auth/signout`}
                  className={styles.button}
                  onClick={e => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </>
            )}
          </p>
        </div>
      </header>
    </>
  );
};

function ToggleMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button marginLeft="3rem" onClick={toggleColorMode}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
