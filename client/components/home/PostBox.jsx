import { useState, useContext, useEffect } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { BsCardImage, BsEmojiSmile } from "react-icons/bs";
import { RiFileGifLine, RiBarChartHorizontalFill } from "react-icons/ri";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { pinFileToIPFS } from "../../lib/pinata";
import { getEthereumContract } from "../../lib/getContract";

const style = {
  wrapper: `px-4 flex flex-row border-b border-[#38444d] pb-4`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
  icon: `mr-2`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
  inactiveSubmit: `bg-[#196195] text-[#95999e]`,
  activeSubmit: `bg-[#1d9bf0] text-white`,
  loadingSubmit: `cursor-not-allowed opacity-50`,
};

function PostBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentAccount, fetchTweets, currentUser } =
    useContext(TwitterContext);
  const contract = getEthereumContract();

  const submitTweet = async (event) => {
    event.preventDefault();

    if (!tweetMessage && !imageFile) return;

    setLoading(true); // Enable loading state

    let imageUrl = "noImage"; // Default image URL if no image is uploaded

    if (imageFile) {
      const pinataMetaData = {
        name: "tweetImage",
      };

      try {
        imageUrl = await pinFileToIPFS(imageFile, pinataMetaData);
      } catch (error) {
        console.error("Error uploading image to Pinata:", error);
        setLoading(false); // Disable loading state on error
        return;
      }
    }

    // Post to the smart contract
    try {
      const username = currentUser.name || currentAccount;
      const authorImageUrl = currentUser.profileImage || "NoImage";

      await contract.createPost(
        username,
        tweetMessage,
        imageUrl,
        authorImageUrl
      );

      // Clear message and image after posting
      setTweetMessage("");
      setImageFile(null);
      setLoading(false); // Disable loading state on successful submission
    } catch (error) {
      console.error("Error posting to smart contract:", error);
      setLoading(false); // Disable loading state on error
    }
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        <img
          src={currentUser.profileImage}
          className={
            currentUser.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <div className={style.tweetBoxRight}>
        <form>
          <textarea
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            className={style.inputField}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <div className={style.formLowerContainer}>
            <div className={style.iconsContainer}>
              <BsCardImage className={style.icon} />
              <RiFileGifLine className={style.icon} />
              <RiBarChartHorizontalFill className={style.icon} />
              <BsEmojiSmile className={style.icon} />
              <IoMdCalendar className={style.icon} />
              <MdOutlineLocationOn className={style.icon} />
            </div>
            <button
              type="submit"
              onClick={submitTweet}
              disabled={!tweetMessage && !imageFile}
              className={`${style.submitGeneral} ${
                (tweetMessage || imageFile) && !loading
                  ? style.activeSubmit
                  : style.inactiveSubmit
              } ${loading && style.loadingSubmit}`} // Apply loading style if loading
            >
              {loading ? "Tweeting..." : "Tweet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostBox;
