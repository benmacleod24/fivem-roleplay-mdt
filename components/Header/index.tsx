import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Flex, Image, useColorModeValue, Skeleton, Heading, IconButton } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import HeaderButtons from './components/HeaderButtons';
import HeaderProfile from './components/HeaderProfile';
import { HamburgerIcon } from '@chakra-ui/icons';
import MobileMenu from './components/MobileMenu';

export interface HeaderProps {}

const Header: React.FunctionComponent<HeaderProps> = ({}) => {
  // Session Data
  const [session, loading] = useSession();
  const [modal, setModal] = React.useState(false);

  // Chakra Colors
  const headerColor = useColorModeValue('gray.50', 'gray.700');
  const mdtText = useColorModeValue('gray.800', 'gray.200');
  const saText = useColorModeValue('blue.500', 'blue.300');

  return (
    <React.Fragment>
      <Flex
        minHeight="8vh"
        maxHeight="8vh"
        width="100%"
        height="8vh"
        px="6.5%"
        mb="1rem"
        background={headerColor}
        justifyContent={'space-between'}
        boxSizing="border-box"
        alignItems="center"
      >
        <Flex
          boxSizing="border-box"
          height="100%"
          minWidth={['75%', '75%', '50%', '20%', '20%']}
          alignItems="center"
          justifyContent={['center', 'center', 'flex-start', 'flex-start']}
        >
          <Image
            width={['2.8rem', '2.8rem', '2.8rem', '2.8rem', '3rem']}
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
        <HeaderButtons />
        <IconButton
          variant="ghost"
          borderRadius="lg"
          aria-label="mobile-menu"
          icon={<HamburgerIcon />}
          display={['inherit', 'inherit', 'inherit', 'inherit', 'none']}
          onClick={() => setModal(true)}
        />
        <HeaderProfile />
      </Flex>
      <MobileMenu modal={modal} setModal={setModal} />
    </React.Fragment>
  );
};

export default Header;
