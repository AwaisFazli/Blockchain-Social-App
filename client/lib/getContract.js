
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./constants";

let metamask;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}

export const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metamask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};
