import metamaskLogo from "../../assets/metamask.png";
import connextLogo from "../../assets/connext-logo.png";
import { useContext } from "react";
import { TwitterContext } from "../../context/TwitterContext";

import Image from "next/image";

export const NavBar = ({metamaskFound}) => {
  const { connectWallet } = useContext(TwitterContext);
  return (
    <nav className="flex w-[100vw] p-8 justify-between">
      <ul className="flex justify-center items-center">
        <li className="flex justify-center">
          <Image src={connextLogo} width={20} height={20} />
        </li>
        <li className="font-bold mx-4">Connext</li>
        <li className="font-bold mx-4">About</li>
        <li className="font-bold mx-4">Docs</li>
      </ul>
      <ul className="flex justify-center items-center">
        <li className="flex justify-center">
          <Image src={metamaskLogo} width={30} height={30} />
        </li>
        <li>
        {metamaskFound ? <button
            className="bg-gradient-to-r from-primaryBlue to-secondaryBlue text-white font-bold py-2 px-4 ml-6 rounded"
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </button> : <p>No MetaMask/Account Found</p>}
          
        </li>
      </ul>
    </nav>
  );
};
