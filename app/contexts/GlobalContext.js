import React, { createContext, useState } from 'react';
import { userLogin, autoLogin } from '../ApiStructure';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const token = json.token;
      const userData = json.user;

      await AsyncStorage.setItem('token', token);
      setData(userData);
      setLogged(true);

      return {
        success: true,
      };
    } catch (err) {
      setError(err.message);
      setLogged(false);

      return {
        success: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
    }
  }
  async function userLogout() {
    setData(null);
    setError(null);
    setLoading(false);
    setLogged(false);

    await AsyncStorage.removeItem('token');
  }

  async function getCookie(name) {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error('Erro ao buscar cookie:', error);
      return null;
    }
  }

  React.useEffect(() => {
    async function autoLoginFunc() {
      const token = await getCookie('token');

      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = autoLogin(token);
          const response = await fetch(url, options);
          const json = await response.json();

          await AsyncStorage.setItem('token', json.token);

          if (!json.success) {
            throw new Error(json.message);
          }

          const userData = json.user;
          setData(userData);
          setLogged(true);
        } catch (err) {
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
        setIsHomeBack,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
