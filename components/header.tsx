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
} from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';
// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const [session, loading] = useSession();
  console.log(session);

  return (
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
      {/* <Flex justifyContent="center"> */}
      <ButtonGroup variant="outline" spacing="6">
        <Breadcrumb>
          <Button>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" as={Link}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Button>
          <Button>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" as={Link}>
                Docs
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Button>
          <Button>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#" as={Link}>
                Breadcrumb
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Button>
        </Breadcrumb>
        <ToggleMode />
      </ButtonGroup>
      {/* </Flex> */}
    </header>
  );
}

function ToggleMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <header>
      <Box marginLeft="3rem" onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Box>
    </header>
  );
}
