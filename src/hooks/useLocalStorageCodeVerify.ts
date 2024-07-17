const useLocalStorageCodeVerify = () => {
  function setLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLocalStorage<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return { setLocalStorage, getLocalStorage, removeItem };
};

export default useLocalStorageCodeVerify;
