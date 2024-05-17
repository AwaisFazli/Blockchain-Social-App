import React, { useState, useEffect } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { format } from "timeago.js";
import { getEthereumContract } from "../lib/getContract";

const style = {
  wrapper: "flex p-3 border-b border-[#38444d]",
  profileImage: "rounded-full h-[40px] w-[40px] object-cover",
  postMain: "flex-1 px-4",
  headerDetails: "flex items-center",
  name: "font-bold mr-1",
  verified: "text-[0.8rem]",
  handleAndTimeAgo: "text-[#8899a6] ml-1",
  tweet: "my-2",
  image: "rounded-3xl",
  footer: "flex justify-between mr-28 mt-4 text-[#8899a6]",
  footerIcon: "rounded-full text-lg p-2",
  commentBox: "mt-4",
  commentInput: "w-full rounded-lg p-2 border border-[#38444d] mr-2",
  submitButton: "bg-[#1d9bf0] text-white px-4 py-2 rounded-lg",
};

const Post = ({
  displayName,
  userName,
  text,
  avatar,
  timestamp,
  isProfileImageNft,
  postImage,
  postId,
}) => {
  const [profileImageLink] = useState(avatar);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loading, setLoading] = useState(false)
  const contract = getEthereumContract();

  const fetchComments = async () => {
    const postComments = await contract.getCommentsByPostId(postId);
    setComments(postComments);
  };

  useEffect(() => {
    fetchComments();
  }, [contract, postId]);

  const handleSubmitComment = async () => {
    setLoading(true)
    await contract.createComment(postId, displayName, avatar, commentText);
    setCommentText("");
    fetchComments();
    setLoading(false)
  };

  return (
    <div className={style.wrapper}>
      <div>
        <img
          src={profileImageLink}
          alt={userName}
          className={
            isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <div className={style.postMain}>
        <div>
          <span className={style.headerDetails}>
            <span className={style.name}>{displayName}</span>
            {isProfileImageNft && (
              <span className={style.verified}>
                <BsFillPatchCheckFill />
              </span>
            )}
            <span className={style.handleAndTimeAgo}>
              @{userName} • {format(new Date(timestamp).getTime())}
            </span>
          </span>
          <div className={style.tweet}>{text}</div>
        </div>
        {postImage !== "noImage" && (
          <div>
            <img
              src={`https://gateway.pinata.cloud/ipfs/${postImage}`}
              alt=""
            />
          </div>
        )}

        <div className={style.footer}>
          <div
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
            onClick={() => setShowCommentBox(true)}
          >
            <FaRegComment />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#03ba7c] hover:bg-[#1b393b]`}
          >
            <FaRetweet />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#f91c80] hover:bg-[#39243c]`}
          >
            <AiOutlineHeart />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <FiShare />
          </div>
        </div>
        {showCommentBox && (
          <>
            {comments.map((comment) => (
              <div className={style.commentBox}>
              <div className="flex">
                <div className="w-[55px]">
                  <img
                    src={comment.authorImageUrl}
                    className="h-[50px] w-[50px] rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex flex-grow flex-col">
                  <span  className="font-bold ml-1">{comment.authorName}</span>
                  <div className="flex flex-grow">  
                    <span 
                      className="text-white bg-transparent w-full rounded-lg p-2 outline-none border-0">{comment.text}</span>
                  </div>
                </div>
              </div>
            </div>
            ))}
            <div className={style.commentBox}>
              <div className="flex">
                <div className="w-[55px]">
                  <img
                    src={profileImageLink}
                    className="h-[50px] w-[50px] rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex flex-grow flex-col">
                  <span>{displayName}</span>
                  <div className="flex flex-grow">  
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="text-white bg-transparent bg-[#2a4056] w-full rounded-lg p-2 outline-none border-0"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={handleSubmitComment}
                      className="text-white ml-2"
                      disabled={loading && true}
                    >
                      {loading? "Submitting" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
