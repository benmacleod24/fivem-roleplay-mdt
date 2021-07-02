import { mdt_charges, mdt_charges_categories } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

export interface mdtCharges {
  mdt_charges: mdt_charges[];
}

export const usePenal = (): {
  category?: Array<mdt_charges_categories & mdtCharges>;
  error: any;
} => {
  const { data: category, error } = useSWR('/api/penal') as SWRResponse<
    Array<mdt_charges_categories & mdtCharges>,
    any
  >;

  return { category, error };
};

export default usePenal;
