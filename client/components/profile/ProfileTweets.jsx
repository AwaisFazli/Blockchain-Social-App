import { useEffect, useContext, useState } from 'react'
import { TwitterContext } from '../../context/TwitterContext'
import Post from '../Post'
import { contractABI, contractAddress } from '../../lib/constants'
import { ethers } from 'ethers'

const style = {
  wrapper: `no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
}

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

const ProfileTweets = () => {
  const { currentUser } = useContext(TwitterContext)
  const [tweets, setTweets] = useState([])
  const [author, setAuthor] = useState({})

  useEffect(() => {
    if (!currentUser) return

    setTweets(currentUser.tweets)
    const fetchPosts = async () => {
      const contract = await getEthereumContract();

      const posts = await contract.getUserPosts()
      console.log(posts)
      setTweets(posts)
    }

    fetchPosts()
    setAuthor({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      walletAddress: currentUser.walletAddress,
      isProfileImageNft: currentUser.isProfileImageNft,
    })
  }, [currentUser])

  return (
    <div className={style.wrapper}>
      {tweets?.map((tweet, index) => (
        <Post
          key={index}
          displayName={tweet.username}
          userName={`${author.walletAddress.slice(
            0,
            4,
          )}...${author.walletAddress.slice(41)}`}
          text={tweet.text}
          avatar={author.profileImage}
          timestamp={tweet.timestamp}
          postImage={tweet.imageUrl}
        />
      ))}
    </div>
  )
}

export default ProfileTweets
