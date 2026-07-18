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

  // Memoize the prefetch function to avoid recreating it
  const prefetchEmployees = useMemo(() => async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/employees`);
    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }
    return res.json();
  }, []);

   useEffect(() => {
      if (prefetchDisabledRoutes.includes(pathname)) {
         return; // skip prefetch on these routes
      }
      
      // Only prefetch if not already cached
      const cachedData = queryClient.getQueryData(["employees"]);
      if (cachedData) {
         return; // already cached, skip prefetch
      }
      
      // Users list (adjust endpoint to your API naming)
      queryClient.prefetchQuery({
         queryKey: ["employees"],
         queryFn: prefetchEmployees,
         staleTime: 2 * 60_000,
      });

      // Add more bootstrapped queries if needed, e.g. roles, departments
      // queryClient.prefetchQuery({ queryKey: ["roles"], queryFn: () => useGetRows("roles"), staleTime: 10 * 60_000 });
  }, [queryClient, pathname, prefetchDisabledRoutes, prefetchEmployees]);
};


