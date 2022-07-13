import { createContext, FC, useCallback, useMemo, useState } from "react";
import { setAccountSession } from "../utils/web3";

interface MetaMaskProviderProps {
  children: any;
}

export interface StateMetamaskProps {
  isOpen: boolean;
  message: string;
}

interface ConextProps {
  ethereum: any;
  accounts: string[];
  isInstalledMetamask: boolean;
}

export const MetaMaskContext = createContext<ConextProps>({
  ethereum: window?.ethereum,
  accounts: [],
  isInstalledMetamask: false,
});

export const MetaMaskProvider: FC<MetaMaskProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const ethereum = useMemo(() => window?.ethereum, []);

  const isInstalledMetamask = useMemo(
    () => ethereum?.isMetaMask,
    [ethereum?.isMetaMask]
  );

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length > 0) {
      setAccountSession({ account: accounts[0] });
      setAccounts(accounts);
    } else {
      setAccounts([]);
      sessionStorage.removeItem("account");
    }
  }, []);

  const handleChainsChanged = useCallback((chainId: any) => {
    window.location.reload();
  }, []);

  useMemo(() => {
    ethereum?.on("accountsChanged", handleAccountsChanged);
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [ethereum, handleAccountsChanged]);

  useMemo(() => {
    ethereum?.on("chainChanged", handleChainsChanged);
    return () => {
      ethereum?.removeListener("chainChanged", handleChainsChanged);
    };
  }, [ethereum, handleChainsChanged]);

  const values = useMemo(
    () => ({
      accounts,
      ethereum,
      isInstalledMetamask,
    }),
    [accounts, ethereum, isInstalledMetamask]
  );

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};
