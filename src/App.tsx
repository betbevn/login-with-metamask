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
import { post } from "./api";
import { API_AUTHENTICATE, API_SIGN_UP } from "./utils/const";
import CryptoJS from "crypto-js";

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
          console.log(res, "res");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    []
  );

  const handleSignMessage = useCallback(
    async (msg: string, address: string) => {
      try {
        const signature = await signatureMessage(msg, address);
        return { address, signature };
      } catch (err) {
        throw new Error("You need to sign the message to be able to log in.");
      }
    },
    []
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
    setAccountSession(newAccounts[0]);

    await post(API_SIGN_UP, {
      address: newAccounts[0],
    })
      .then((response) => {
        if (response.data.isSigned) {
          const signature = CryptoJS.AES.encrypt(
            newAccounts[0],
            response.data.nonce
          ).toString();

          return {
            address: newAccounts[0],
            signature,
          };
        } else {
          return handleSignMessage(
            response.data.message,
            response.data.address
          );
        }
      })
      .then(handleAuthenticate)
      .catch((error) => {
        console.log(error, "error");
      });
  }, [ethereum, handleAuthenticate, handleSignMessage, isInstalledMetamask]);

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
    </div>
  );
}

export default App;
