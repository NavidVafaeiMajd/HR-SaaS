import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import Cookies from "js-cookie";
import api from "@/api/axios";
import { setupInterceptors } from "@/api/interceptors";

interface User {
  id: string;
  name: string;
  // هر فیلدی که لازمه
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  authLoading: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  useEffect(() => {
      setupInterceptors(setIsLoggedIn);
    const verifyAuth = async () => {
      try {
        const res = await api.get("/auth/me");

        setUser(res.data);
        setIsLoggedIn(true);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);

    Cookies.set("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };
  return (
    <>
      <AuthContext.Provider
        value={{ user, login, logout, isLoggedIn, authLoading,setIsLoggedIn }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const user = Cookies.get("user");
  return { user };
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
