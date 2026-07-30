import { useLocation } from "react-router-dom";

export const useProfileApi = (id?: string) => {
   const { pathname } = useLocation();

   const isAccount = pathname.startsWith("/account");

   return {
      isAccount,
      url: isAccount ? "account" : `users/${id}`,
      queryKey: isAccount ? ["account"] : ["usersDetaile", id],
   };
};



