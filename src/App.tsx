import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import useMetaMask from "./hooks/useEthereum";
import {
  getAccountSession,
  setAccountSession,
  signatureMessage,
} from "./utils/web3";
import { get, post } from "./api";
import { API_AUTHENTICATE, API_FIND_ADDRESS, API_SIGN_UP } from "./utils/const";
import HomePage from "./containers/homepage";

function App() {
  const { ethereum, isInstalledMetamask, accounts } = useMetaMask();

  const init = useMemo(
    () => (getAccountSession() ? [getAccountSession().account] : []),
    []
  );

  const [acc, setAcc] = useState<string[]>(init);

  const handleAuthenticate = useCallback(
    async (data: { signature: string; address: string }) => {
      await post(API_AUTHENTICATE, {
        address: data.address,
        signature: data.signature,
      })
        .then((res) => {
          setAccountSession({ account: data.address, token: res.data.token });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    []
  );

  const handleSignMessage = useCallback(
    async (data: { nonce: number; address: string }) => {
      try {
        const signature = await signatureMessage(data.address, data.nonce);
        return { address: data.address, signature };
      } catch (err) {
        throw new Error("You need to sign the message to be able to log in.");
      }
    },
    []
  );

  const handleSignup = useCallback(
    (address: string) => {
      post(API_SIGN_UP, { address })
        .then((res) =>
          handleSignMessage({
            address: res.data.data.address,
            nonce: res.data.data.nonce,
          })
        )
        .then(handleAuthenticate)
        .catch((error) => {
          console.log(error, "error");
        });
    },
    [handleAuthenticate, handleSignMessage]
  );

  const handleConnect = useCallback(async () => {
    if (!isInstalledMetamask) {
      window.open("https://metamask.io/download.html");
      return;
    }

    const newAccounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAcc(newAccounts);

    await get(API_FIND_ADDRESS, {
      publicAddress: newAccounts[0],
    })
      .then((response) => {
        return handleSignMessage({
          address: newAccounts[0],
          nonce: response.data.nonce,
        });
      })
      .then(handleAuthenticate)
      .catch((error) => {
        if (error.response.data.message === "Address does not exist") {
          handleSignup(newAccounts[0]);
        }
      });
  }, [
    ethereum,
    handleAuthenticate,
    handleSignMessage,
    handleSignup,
    isInstalledMetamask,
  ]);

  const handleDisconnect = useCallback(() => {
    setAcc([]);
    sessionStorage.removeItem("account");
  }, []);

  useEffect(() => {
    if (accounts.length === 0 && init.length === 0) {
      setAcc([]);
    }
  }, [accounts.length, init.length]);

  return (
    <div className="App">
      <Button
        variant="primary"
        onClick={acc.length > 0 ? handleDisconnect : handleConnect}
      >
        {acc.length > 0 ? "Disconnect" : "Connect"}
      </Button>
      <HomePage />
    </div>
  );
}

export default App;
