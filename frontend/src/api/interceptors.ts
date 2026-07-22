import type { Dispatch, SetStateAction } from "react";
import api from "./axios";

export const setupInterceptors = (
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>
) => {
    api.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                setIsLoggedIn(false);
            }

            return Promise.reject(error);
        }
    );
};