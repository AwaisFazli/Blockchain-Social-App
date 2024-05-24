import React, { useContext, useEffect, useState } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import PostBox from "./PostBox";
import Post from "../Post";
import { BsStars } from "react-icons/bs";
import {getEthereumContract} from "../../lib/getContract"

const style = {
  wrapper: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

function Feed() {
  const contract = getEthereumContract();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await contract.getPosts();
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handlePostCreatedEvent = async () => {
      const newPosts = await contract.getPosts();
      setPosts(newPosts);
    };

    contract.on("PostCreated", handlePostCreatedEvent);

    return () => {
      contract.off("PostCreated", handlePostCreatedEvent);
    };
  }, [contract]);
  
  const { tweets } = useContext(TwitterContext);

  return (
    <div className={`${style.wrapper} no-scrollbar`}>
      <div className={style.header}>
        <div className={style.headerTitle}>Home</div>
        <BsStars />
      </div>
      <PostBox />
      {posts.map((post, index) => (
        <Post
          key={index}
          displayName={post.username}
          userName={`${post.author.slice(0, 4)}...${post.author.slice(41)}`}
          text={post.text}
          avatar={post.authorImageUrl}
          isProfileImageNft={false}
          timestamp={post.timestamp}
          postImage={post.imageUrl}
          postId={post.id}
        />
      ))}
    </div>
  );
}

export default Feed;
