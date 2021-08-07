// import Image from 'next/image';
import Layout from '../../../components/layout';
import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import useSWR, { SWRResponse } from 'swr';
import { mdt_charges } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSession } from 'next-auth/client';
import { Session } from 'inspector';
import { useRouter } from 'next/router';
import usePenal from '../../../components/hooks/api/usePenal';
import BookingHeader from '../../../components/Booking/BookingHeader';
import BookingCategoryCon from '../../../components/Booking/BookingCategoryCon';
import BookingSummary from '../../../components/Booking/BookingSummary';

export interface chargeAndCount {
  counts: number;
  charge: mdt_charges;
}

export const TRIAL = 99999;

export interface BookingSWR {
  id: number;
  uId: number | null;
  cuid: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  gender: boolean | null;
}

export interface HomeProps {
  session: Session;
}

const Home: React.SFC<HomeProps> = ({ session }) => {
  // Router
  const router = useRouter();

  // Booking Data
  const { category: penal, error: penalError } = usePenal();
  const { cuid } = router.query;
  const { data: character, error: characterError } = useSWR(
    `/api/citizen/?citizenid=${cuid}`,
  ) as SWRResponse<BookingSWR, any>;

  // State
  const [selectedCharges, setSelectedCharges] = useState<Record<number, chargeAndCount>>({});

  // Handlers
  const addCharge = (c: mdt_charges) => {
    if (!selectedCharges[c.chargeid]) {
      const newCharge = {} as Record<number, chargeAndCount>;
      newCharge[c.chargeid] = { counts: 1, charge: c };
      setSelectedCharges({ ...selectedCharges, ...newCharge });
    } else {
      const updatedCharge = Object.assign({}, selectedCharges);
      updatedCharge[c.chargeid].counts = updatedCharge[c.chargeid].counts + 1;
      setSelectedCharges(updatedCharge);
    }
  };

  const removeCharge = (chargeId: number) => {
    const updatedCharge = Object.assign({}, selectedCharges);

    if (selectedCharges[chargeId].counts > 1) {
      updatedCharge[chargeId].counts = updatedCharge[chargeId].counts - 1;
    } else {
      delete updatedCharge[chargeId];
    }
    setSelectedCharges(updatedCharge);
  };

  return (
    <Layout>
      <Flex flexDir="column" w="full" h="full">
        <BookingHeader character={character} />
        <Flex w="full" flexGrow={1}>
          <BookingCategoryCon
            addChagre={addCharge}
            character={character}
            penal={penal}
            characterError={characterError}
            penalError={penalError}
          />
          <Flex flexGrow={1} h="full" ml="2" flexDir="column">
            <BookingSummary
              character={character}
              removeCharge={removeCharge}
              selectedCharges={selectedCharges}
            />
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  const session = await getSession(ctx);
  if (!session || !session.user || !session.user.isCop) {
    const res = ctx.res;
    if (res) {
      res.writeHead(302, {
        Location: `/?l=t`,
      });
      res.end();
      return { props: {} };
    }
  }
  return { props: { session } };
};