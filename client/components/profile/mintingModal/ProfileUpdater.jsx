import { useState, useContext, useEffect } from 'react';
import { TwitterContext } from '../../../context/TwitterContext';
import { useRouter } from 'next/router';
import { contractABI, contractAddress } from '../../../lib/constants';
import { ethers } from 'ethers';
import InitialState from './InitialState';
import LoadingState from './LoadingState';
import FinishedState from './FinishedState';
import { pinJSONToIPFS, pinFileToIPFS } from '../../../lib/pinata';

let metamask;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metamask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  );

  return transactionContract;
};

const createPinataRequestHeaders = (headers) => {
  const requestHeaders = new Headers();

  headers.forEach((header) => {
    requestHeaders.append(header.key, header.value);
  });

  return requestHeaders;
};

const ProfileUpdater = () => {
  const { currentAccount, setAppStatus } = useContext(TwitterContext);
  const router = useRouter();

  const [name, setName] = useState('');
  const [coverImage, setCoverImage] = useState();
  const [status, setStatus] = useState('initial');
  const [profileImage, setProfileImage] = useState();  

  const mint = async () => {
    setStatus('loading');

    const pinataMetaData = {
        name: `${name}`,
    };

    let ipfsImageHash = '';
    let ipfsCoverImageHash = '';
    let username = name


    if (profileImage) {
        ipfsImageHash = await pinFileToIPFS(profileImage, pinataMetaData);
    }

    if (coverImage) {
        ipfsCoverImageHash = await pinFileToIPFS(coverImage, pinataMetaData);
    }

    const contract = await getEthereumContract();

    try {
        await contract.createUserProfile(
            username,
            currentAccount,
            ipfsImageHash,
            ipfsCoverImageHash
        );

      setStatus('finished');
    } catch (error) {
      console.log(error);
      setStatus('finished');
    }
  };

  const renderLogic = (modalStatus = status) => {
    switch (modalStatus) {
      case 'initial':
        return (
          <InitialState
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            name={name}
            setName={setName}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            mint={mint}
          />
        );

      case 'loading':
        return <LoadingState />;

      case 'finished':
        return <FinishedState />;

      default:
        router.push('/');
        setAppStatus('error');
        break;
    }
  };

  return <>{renderLogic()}</>;
};

export default ProfileUpdater;
