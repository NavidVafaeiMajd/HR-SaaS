import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

/**
 * Prefetch global, frequently-used server data so it's instantly
 * available across the app via React Query's cache.
 */
export const useBootstrapData = () => {
   const queryClient = useQueryClient();
   const { pathname } = useLocation();

   // Routes where we do NOT want to prefetch
   const prefetchDisabledRoutes = useMemo(() =>
      ["/login", "/auth/login", "/signin"],
      []
   );


   useEffect(() => {
      if (prefetchDisabledRoutes.includes(pathname)) {
         return; // skip prefetch on these routes
      }

      // Only prefetch if not already cached
      const cachedData = queryClient.getQueryData(["employees"]);
      if (cachedData) {
         return; // already cached, skip prefetch
      }

      // Add more bootstrapped queries if needed, e.g. roles, departments
      // queryClient.prefetchQuery({ queryKey: ["roles"], queryFn: () => useGetRows("roles"), staleTime: 10 * 60_000 });
   }, [queryClient, pathname, prefetchDisabledRoutes]);
};


