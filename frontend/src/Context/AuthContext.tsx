import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";

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
  authLoading:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
useEffect(() => {
  const verifyAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Not authenticated");
      }

      const data = await res.json();

      setUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Auth failed:", error);

      setUser(null);
      setIsLoggedIn(false);
    }finally {
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
      <AuthContext.Provider value={{ user, login, logout, isLoggedIn , authLoading}}>
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
