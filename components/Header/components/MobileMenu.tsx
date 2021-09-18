import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';
import * as React from 'react';
import MenuButton from './MenuButton';

export interface MobileMenuProps {
  modal: boolean;
  setModal: (v: boolean) => void;
}

const MobileMenu: React.FunctionComponent<MobileMenuProps> = ({ modal, setModal }) => {
  const [session, loading] = useSession();

  return (
    <Drawer isOpen={modal} onClose={() => setModal(false)} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody>
          <Flex justifyContent="space-between" flexDir="column" w="full" h="full">
            <Grid h="fit-content" w="full" my="1" templateColumns="repeat(1, 1fr)" gap="3">
              <MenuButton link="/" title={'Home'} />
              <MenuButton link="/citizens" title={'Citizens'} />
              <MenuButton link="/reports" title={'reports'} />
              <MenuButton link="/dispatch" title={'Dispatch'} />
              <MenuButton link="/warrants" title={'Warrants'} />
              <MenuButton link="/penal" title={'Penal Code'} />
              <MenuButton link="/profile" title={'Profile'} />
              {session && session.user.rankLvl && session.user.rankLvl >= 4 ? (
                <MenuButton link="/command" title={'Command Management'} />
              ) : (
                ''
              )}
            </Grid>
            {!session ? (
              <Button colorScheme="blue" onClick={() => signIn('discord')}>
                Sign In
              </Button>
            ) : (
              ''
            )}

            {session ? (
              <Button colorScheme="red" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              ''
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
