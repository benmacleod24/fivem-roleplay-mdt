import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: number;
      isCop: boolean;
      isJudge: boolean;
      isDA: boolean;
      image?: string;
      name?: string;
      copName?: string;
      copId?: number;
      rankLvl?: number;
      dept?: number;
    };
  }
}
