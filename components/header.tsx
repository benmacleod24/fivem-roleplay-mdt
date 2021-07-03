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
  useColorModeValue,
  Text,
  Skeleton,
  IconButton,
  MenuDivider,
  Heading
} from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon, InfoIcon } from '@chakra-ui/icons';
import { BsFillPersonLinesFill } from "react-icons/bs"
import { BiExit } from "react-icons/bi"

export interface HeaderProps {

}

const Header: React.SFC<HeaderProps> = ({ }) => {

  // Session Data
  const [session, loading] = useSession();


  // Chakra Colors
  const headerColor = useColorModeValue("gray.50", "gray.700")
  const mdtText = useColorModeValue("gray.800", "gray.200")
  const saText = useColorModeValue("blue.500", "blue.300")
  const { colorMode, toggleColorMode } = useColorMode();


  return (
    <Flex minHeight="8vh" maxHeight="8vh" pl="6.5%" pr="6.5%" width="100%" height="8vh" mb="1rem" background={headerColor} justifyContent={"space-between"}>
      {/* Police Branding */}
      <Flex boxSizing="border-box" height="100%" minWidth="20%" alignItems="center">
        <Image width="3.5rem" mr="5%" src={"https://i.imgur.com/AHFKtEZ.png"} alt="Police Badge" />
        <Flex direction="column" width="100%">
          <Heading fontStyle="italic" fontWeight="normal" size="sm" color={saText}>San Andreas</Heading>
          <Heading size="md" color={mdtText}>Mobile Data Terminal</Heading>
        </Flex>
      </Flex>

      {/* Menu Buttons */}
      <Flex boxSizing="border-box" height="100%" minWidth="60%" alignItems="center" justifyContent="center">
        <ButtonGroup>
          <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">
            <Link href="/" passHref>
              Home
            </Link>
          </Button>
          <Menu>
            <MenuButton variant="outline" colorScheme="yellow" as={Button} rightIcon={<ChevronDownIcon />}>
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
          <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">Reports</Button>
          <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">Warrants</Button>
          <Link href="/penal" passHref>
            <Button variant="outline" colorScheme="yellow" ml="1%" mr="1%" size="md">Penal Code</Button>
          </Link>
        </ButtonGroup>
      </Flex>

      {/* Sign in & Sign Out Buttons */}
      <Flex boxSizing="border-box" height="100%" minWidth="20%" justifyContent="flex-end" alignItems="center">
        {session ?
          <Flex width="3.3rem" height="3.3rem" position="relative">
            <Image src={session?.user.image} alt="silhouette" width="100%" height="100%" borderRadius="full" />
            <Menu closeOnSelect={false}>
              <MenuButton as={IconButton} icon={<ChevronDownIcon />} position="absolute" bottom="-8%" right="-8%" size="xs" colorScheme="blue" opacity="0.9" borderRadius="full" />
              <MenuList>
                <Link href="/profile" passHref>
                  <MenuItem icon={<BsFillPersonLinesFill />}>Profile</MenuItem>
                </Link>
                <MenuItem onClick={toggleColorMode} icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}>{colorMode === "light" ? "Dark" : "Light"} Mode</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => signOut()} icon={<BiExit />}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex> :
          !loading ? <Button onClick={() => signIn("discord")} size="sm" variant="outline" colorScheme="blue">Sign In</Button> : ""
        }
        {loading ? <Skeleton width="3.3rem" height="3.3rem" borderRadius="full" /> : ""}
      </Flex>
    </Flex>
  );
}

export default Header;

// export default function Header() {
//   const [session, loading] = useSession();

//   const headerColor = useColorModeValue("gray.50", "gray.700")

//   return (
//     <Box pl="5%" pr="5%" width="100%" height="8vh" mb="1rem" background={headerColor} display="flex" alignItems="center" justifyContent="space-between">
//       {/* <DiscordAuth /> */}
//       <Grid templateColumns="repeat(12, 1fr)" width="100%">
//         <GridItem colSpan={3}>
//           <Flex pl="1rem">
//             {session && session.user && session.user.image && (
//               <Flex>
//                 <Image
//                   borderRadius="0.5rem"
//                   height="2.8rem"
//                   width="2.8rem"
//                   alt="silhouette"
//                   src={session.user.image}
//                 />
//                 {session.user.name && (
//                   <Flex pl="1rem" flexDir="column">
//                     <small>Welcome!</small>
//                     <strong>{session.user.name}</strong>
//                   </Flex>
//                 )}
//               </Flex>
//             )}
//           </Flex>
//         </GridItem>

//         <GridItem colSpan={7}>
//           <Flex justifyContent="center">
//             <ButtonGroup variant="outline" spacing="3" isAttached>
//               <Button>
//                 <Link href="/" passHref>
//                   Home
//                 </Link>
//               </Button>
//               <Menu>
//                 <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
//                   Databases
//                 </MenuButton>
//                 <MenuList>
//                   <Link href="/citizens" passHref>
//                     <MenuItem>Citizens</MenuItem>
//                   </Link>
//                   <MenuItem>Criminals</MenuItem>
//                   <MenuItem>Vehicles</MenuItem>
//                 </MenuList>
//               </Menu>
//               <Button>
//                 <Link href="#">Reports</Link>
//               </Button>
//               <Button>
//                 <Link href="#">Warrants</Link>
//               </Button>
//               <Button>
//                 <Link href="#">Penal Code</Link>
//               </Button>
//               <Button>
//                 <Link href="#">Profile</Link>
//               </Button>
//               <ToggleMode />
//             </ButtonGroup>
//           </Flex>
//         </GridItem>
//         <GridItem colSpan={2}>
//           <Flex
//             justifyContent="flex-end"
//             alignItems="flex-end"
//             flexDir="column"
//             alignContent="center"
//             paddingRight="1rem"
//           >
//             <Button
//               colorScheme={session ? 'red' : 'green'}
//               variant="solid"
//               onClick={e => {
//                 e.preventDefault();
//                 session ? signOut() : signIn('discord');
//               }}
//               size="sm"
//             >
//               {session ? 'Sign Out ' : 'Sign In'}
//             </Button>
//           </Flex>
//         </GridItem>
//       </Grid>
//     </Box>
//   );
// }

// function ToggleMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <Button onClick={toggleColorMode}>
//       {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
//     </Button>
//   );
// }
