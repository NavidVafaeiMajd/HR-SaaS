import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "@/lib/nprogress";

export function RouteProgress() {

    const location = useLocation();

    useEffect(() => {

        NProgress.start();

        const timer = setTimeout(() => {
            NProgress.done();
        }, 400);

        return () => clearTimeout(timer);

    }, [location.pathname]);

    return null;
}