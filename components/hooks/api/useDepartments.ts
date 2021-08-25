import { mdt_departments, mdt_department_ranks } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

export interface mdtRanks {
  mdt_department_ranks: mdt_department_ranks[];
}

export const useDepartments = (): {
  departments?: Array<mdt_departments & mdtRanks>;
  error: any;
} => {
  const { data: departments, error } = useSWR('/api/departments') as SWRResponse<
    Array<mdt_departments & mdtRanks> | undefined,
    any
  >;

  return { departments, error };
};

export default useDepartments;
