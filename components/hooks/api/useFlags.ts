import { mdt_flag_types } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

export const useFlags = (): {
  flags?: mdt_flag_types[]
  error: any;
} => {
  const { data: flags, error } = useSWR('/api/flags') as SWRResponse<
    mdt_flag_types[] | undefined,
    any
  >;

  return { flags, error };
};

export default useFlags;
