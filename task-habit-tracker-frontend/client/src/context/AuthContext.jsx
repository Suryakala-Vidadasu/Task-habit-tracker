import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { getErrorMessage } from "../utils/helpers";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { user } = await authService.getMe();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const register = useCallback(async (formData) => {
    const { user, token } = await authService.register(formData);
    if (token) localStorage.setItem("token", token);
    setUser(user);
    return user;
  }, []);

  const login = useCallback(async (formData) => {
    const { user, token } = await authService.login(formData);
    if (token) localStorage.setItem("token", token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(getErrorMessage(error));
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out");
    }
  }, []);

  const updateUserInPlace = useCallback((partialUser) => {
    setUser((prev) => ({ ...prev, ...partialUser }));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUserInPlace,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
