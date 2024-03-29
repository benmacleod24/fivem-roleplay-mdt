import Layout from '../components/layout';
import React, { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import {
  Box,
  useToast,
  Text,
  Flex,
  useColorModeValue,
  theme,
  Heading,
  Button,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { useSWRInfinite } from 'swr';
import dayjs from 'dayjs';
import { mdt_annoucments } from '.prisma/client';
import { RepeatClockIcon, SpinnerIcon } from '@chakra-ui/icons';
const PAGE_SIZE = 6;

export default function Home() {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (router.query.l && router.query.l === 't') {
      toast({
        description: 'Please log in to view authorized pages.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      router.push({ pathname: '/' }, undefined, { shallow: true });
    }
  }, [router, router.query.l, toast]);

  const fontSize = '4xl';
  const sanAndreasColor = useColorModeValue(theme.colors.orange[400], theme.colors.yellow[200]);
  const mdtColor = useColorModeValue(theme.colors.blue[500], theme.colors.blue[400]);

  const announcementColor = useColorModeValue(theme.colors.white, theme.colors.gray[800]);
  const announcementBG = useColorModeValue(theme.colors.gray[100], theme.colors.gray[700]);

  const promotionColor = useColorModeValue(theme.colors.blue[600], theme.colors.cyan[300]);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    index => `/api/announcements?per_page=${PAGE_SIZE}&page=${index + 1}`,
  );
  const announcements = data ? [].concat(...data) : ([] as mdt_annoucments[]);
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <Layout>
      <Flex flexDir="column" justifyContent="center" alignContent="center" alignItems="center">
        <title>Raze MDT</title>
        <Flex>
          <Text fontSize={fontSize}>Welcome to the &nbsp;</Text>
          <Text fontSize={fontSize} color={sanAndreasColor}>
            San Andreas&nbsp;
          </Text>
          <Text fontSize={fontSize} color={mdtColor}>
            Mobile Data Terminal
          </Text>
        </Flex>
        <Text maxW="lg" align="center">
          The mobile data terminal is a large database of all criminals and civillians in the state
          of san andreas. You can find police reports, criminals histories, and many other things
          here. Interested in becoming a police officer{' '}
          <Link target="_blank" href="https://discord.gg/jHSDqpfN2k" color={mdtColor}>
            Join Here
          </Link>
          .
        </Text>

        <Box
          backgroundColor={announcementBG}
          marginTop="1rem"
          padding=".2rem"
          borderWidth="2px"
          dropShadow="xl"
          borderRadius="lg"
          overflowY="auto"
          maxW="xl"
          maxH="lg"
        >
          <Flex
            justifyContent="space-between"
            pl="1rem"
            pr="1rem"
            pt=".5rem"
            alignItems="center"
            border="none !important"
          >
            <Text color={sanAndreasColor} fontSize="lg">
              Law Enforcement Announcements
            </Text>
            <IconButton
              aria-label="refresh"
              colorScheme="telegram"
              borderRadius="md"
              border="2px"
              isLoading={isRefreshing}
              variant="outline"
              size="md"
              icon={isRefreshing ? <SpinnerIcon /> : <RepeatClockIcon />}
              disabled={isRefreshing}
              onClick={() => mutate()}
            >
              {isRefreshing ? 'refreshing...' : 'refresh'}
            </IconButton>
          </Flex>
          {announcements &&
            announcements.map(a => {
              return (
                <Box
                  key={a.annoucmentid}
                  backgroundColor={announcementColor}
                  m="1rem"
                  borderRadius="lg"
                  p="1rem"
                >
                  <Heading as="h6" size="sm" color={promotionColor}>
                    {a.annoucment_title}
                  </Heading>
                  <Text>{a.annocument_body}</Text>
                  {a.annoucment_date && (
                    <Text align="right" fontSize="xs" pt="1rem">
                      {dayjs(a.annoucment_date).format('DD/MM/YYYY h:mm a')}
                    </Text>
                  )}
                </Box>
              );
            })}
          <Flex justifyContent="center">
            <Button disabled={isLoadingMore || isReachingEnd} onClick={() => setSize(size + 1)}>
              {isLoadingMore ? 'loading...' : isReachingEnd ? 'no more announcements' : 'load more'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  );
}
