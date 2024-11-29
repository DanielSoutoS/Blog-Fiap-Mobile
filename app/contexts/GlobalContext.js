import React, { createContext, useState } from 'react';
import { userLogin, autoLogin } from '../ApiStructure';
import { useNavigation } from '@react-navigation/native';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [data, setData] = React.useState(null);
    const [logged, setLogged] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isSearching, setIsSearching] = React.useState(false);
    const [isHomeBack, setIsHomeBack] = React.useState(false);
    const navigation = useNavigation();

    async function userLoginFunc(email, password) {
        setError(null);
        setLoading(true);
    
        try {
          const { url, options } = userLogin(email, password);
          const response = await fetch(url, options);
          const json = await response.json();
    
          if (!json.success) {
            throw new Error(json.message);
          }
          toast.success('Login realizado com sucesso!');
          const token = json.token;
          const userData = json.user;
    
          document.cookie = `token=${token}; path=/; max-age=3600`;
    
          setData(userData);
          setLogged(true);
    
          navigation.navigate('Home');
        } catch (err) {
          toast.error('Erro ao fazer login!');
          setError(err.message);
          setLogged(false);
        } finally {
          setLoading(false);
        }
    }
    async function userLogout() {
        setData(null);
        setError(null);
        setLoading(false);
        setLogged(false);
        document.cookie = 'token=; path=/; max-age=0';
    
        navigation.navigate('Login');
    }
    
    function getCookie(name) {
        if (typeof document !== 'undefined') {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        }
        return null;
    }

    React.useEffect(() => {
        async function autoLoginFunc() {
          const token = getCookie('token');
    
          if (token) {
            try {
              setError(null);
              setLoading(true);
              const { url, options } = autoLogin(token);
              const response = await fetch(url, options);
              const json = await response.json();
    
              document.cookie = `token=${json.token}; path=/; max-age=3600`;
    
              if (!json.success) {
                throw new Error(json.message);
              }
    
              const userData = json.user;
              setData(userData);
              setLogged(true);
            } catch (err) {
              toast.error('Erro ao logar!');
              userLogout();
            } finally {
              setLoading(false);
            }
          } else {
            setLogged(false);
          }
        }
    
        autoLoginFunc();
    }, []);

  return (
    <GlobalContext.Provider 
        value={{ 
            userLoginFunc,
            userLogout,
            data,
            error,
            loading,
            logged,
            getCookie,
            searchTerm,
            setSearchTerm,
            currentPage,
            setCurrentPage,
            isSearching,
            setIsSearching,
            isHomeBack,
            setIsHomeBack
        }}>
      {children}
    </GlobalContext.Provider>
  );
};
