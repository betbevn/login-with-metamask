import { useContext } from "react";
import { MetaMaskContext } from "./MetaMaskProvider";

export default function useMetaMask() {
  const context = useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}
