import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        setUser(JSON.parse(cookieUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed for this effect
    };
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 0.041666667 }); 
    if (token) {
      Cookies.set("token", token, { expires: 0.041666667 , secure: true });
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };
  return (
    <>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const token = Cookies.get("token");
  const user = Cookies.get("user");
  const isLoggedIn = Boolean(token);
  return { isLoggedIn, user, token };
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};