import { mdt_charges, mdt_charges_categories } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

export interface mdtCharges {
  mdt_charges: mdt_charges[];
}

export const usePenal = (
  getDeleted?: boolean,
): {
  category?: Array<mdt_charges_categories & mdtCharges>;
  error: any;
  mutate: any;
} => {
  const {
    data: category,
    error,
    mutate,
  } = useSWR(`/api/penal?getDeleted=${getDeleted ? true : false}`) as SWRResponse<
    Array<mdt_charges_categories & mdtCharges> | undefined,
    any
  >;

  return { category, error, mutate };
};

export default usePenal;
