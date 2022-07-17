import Web3 from "web3";

export const signatureMessage = async (msg: string, address: string) => {
  const web3 = new Web3(window.ethereum);
  return await web3.eth.personal.sign(msg, address, "");
};

export const getAccounts = async () => {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  return accounts;
};

export const getBalanceOf = async (
  isMetaMaskInstalled: boolean,
  account: string
) => {
  if (!isMetaMaskInstalled || !account) {
    return 0;
  }
  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance);
};

export const setAccountSession = ({
  account,
  token,
}: {
  account: string;
  token?: string;
}) => {
  sessionStorage.setItem(
    "account",
    JSON.stringify({
      account,
      token,
    })
  );
};

export const getAccountSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem("account") || "");
  } catch (e) {
    return null;
  }
};
