import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/layout';
import { Button, Fade, IconButton, Image } from '@chakra-ui/react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/menu';
import * as React from 'react';
import Link from 'next/link';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { GiRank3 } from 'react-icons/gi';
import { signIn, signOut, useSession } from 'next-auth/client';
import { BiExit } from 'react-icons/bi';

export interface HeaderProfileProps {}

const HeaderProfile: React.FunctionComponent<HeaderProfileProps> = ({}) => {
  const [session, loading] = useSession();

  return (
    <Flex
      boxSizing="border-box"
      height="100%"
      minWidth="20%"
      justifyContent="flex-end"
      alignItems="center"
      display={['none', 'none', 'none', 'flex']}
    >
      <Fade in={Boolean(session)} unmountOnExit>
        <Flex width="3rem" height="3rem" alignItems="center" mr="9">
          <Menu closeOnSelect={false}>
            {({ isOpen }) => (
              <React.Fragment>
                <MenuButton
                  as={IconButton}
                  icon={
                    <ChevronDownIcon
                      transition="0.2s ease-in-out"
                      transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                    />
                  }
                  size="sm"
                  fontSize="xl"
                  variant="ghost"
                  borderRadius="md"
                />
                <MenuList>
                  <Link href="/profile" passHref>
                    <MenuItem icon={<BsFillPersonLinesFill />}>Profile</MenuItem>
                  </Link>
                  {session?.user.rankLvl || session!.user.rankLvl >= 4 ? (
                    <Link href="/command" passHref>
                      <MenuItem icon={<GiRank3 />}>Command Managment</MenuItem>
                    </Link>
                  ) : (
                    ''
                  )}
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()} icon={<BiExit />}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </React.Fragment>
            )}
          </Menu>
          <Image
            src={session?.user.image}
            alt="silhouette"
            width="90%"
            height="90%"
            borderRadius="lg"
            ml="2"
          />
        </Flex>
      </Fade>
      {!session ? (
        <Button size="sm" colorScheme="blue" onClick={() => signIn('discord')}>
          Sign In
        </Button>
      ) : (
        ''
      )}
    </Flex>
  );
};

export default HeaderProfile;
