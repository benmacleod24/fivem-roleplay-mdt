import { fivem_characters, mdt_dispatch_new } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';
import { string } from 'zod';

export interface dispatchType extends mdt_dispatch_new {
  fivem_characters: {
    first_name: string;
    last_name: string;
  };
}

export const useDispatch = (): {
  dispatch?: Array<dispatchType>;
  error: any;
} => {
  const { data: dispatch, error } = useSWR('/api/dispatch?characterId=') as SWRResponse<
    Array<dispatchType> | undefined,
    any
  >;

  return { dispatch, error };
};

export default useDispatch;
