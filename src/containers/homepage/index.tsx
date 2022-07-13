import { useEffect } from "react";
import { get } from "../../api";
import { API_SIGN_UP } from "../../utils/const";
import { getAccountSession } from "../../utils/web3";

const HomePage = () => {
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await get(API_SIGN_UP, undefined, {
          authorization: `Bearer ${getAccountSession().token}`,
        });

        console.log(res, "res");
      } catch (error) {
        console.log(error, "error");
      }
    }

    if (getAccountSession()?.token) {
      fetchUsers();
    }
  }, []);

  return <div>aaaaa</div>;
};

export default HomePage;
