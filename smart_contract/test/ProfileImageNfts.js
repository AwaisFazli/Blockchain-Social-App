const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProfileImageNfts", function () {
  let ProfileImageNfts, profileImageNfts, owner, addr1, addr2;

  beforeEach(async function () {
    ProfileImageNfts = await ethers.getContractFactory("ProfileImageNfts");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    profileImageNfts = await ProfileImageNfts.deploy();
    await profileImageNfts.deployed();
  });

  it("Should mint a new token", async function () {
    const mintTx = await profileImageNfts.mint(addr1.address, "tokenURI1");
    await mintTx.wait();

    expect(await profileImageNfts.tokenURI(0)).to.equal("tokenURI1");
    expect(await profileImageNfts.ownerOf(0)).to.equal(addr1.address);
  });

  it("Should create a new post", async function () {
    const createPostTx = await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await createPostTx.wait();

    const posts = await profileImageNfts.getPosts();
    expect(posts.length).to.equal(1);
    expect(posts[0].username).to.equal("username1");
    expect(posts[0].text).to.equal("Hello World");
    expect(posts[0].imageUrl).to.equal("imageUrl1");
    expect(posts[0].authorImageUrl).to.equal("authorImageUrl1");
  });

  it("Should create a user profile", async function () {
    const createUserProfileTx = await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");
    await createUserProfileTx.wait();

    const userProfile = await profileImageNfts.getUserProfile(addr1.address);
    expect(userProfile.name).to.equal("name1");
    expect(userProfile.walletAddress).to.equal("walletAddress1");
    expect(userProfile.profileImage).to.equal("profileImage1");
    expect(userProfile.coverImage).to.equal("coverImage1");
  });

  it("Should update a user profile", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    const updateUserProfileTx = await profileImageNfts.connect(addr1).updateUserProfile("name2", "walletAddress2", "profileImage2", "coverImage2");
    await updateUserProfileTx.wait();

    const userProfile = await profileImageNfts.getUserProfile(addr1.address);
    expect(userProfile.name).to.equal("name2");
    expect(userProfile.walletAddress).to.equal("walletAddress2");
    expect(userProfile.profileImage).to.equal("profileImage2");
    expect(userProfile.coverImage).to.equal("coverImage2");
  });

  it("Should create a comment on a post", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");

    const createCommentTx = await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");
    await createCommentTx.wait();

    const comments = await profileImageNfts.getCommentsByPostId(1);
    expect(comments.length).to.equal(1);
    expect(comments[0].authorName).to.equal("authorName1");
    expect(comments[0].text).to.equal("Nice post!");
  });

  it("Should create a reply to a comment", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");

    const createReplyTx = await profileImageNfts.connect(owner).createReply(1, "replyAuthorName1", "replyAuthorImageUrl1", "Thank you!");
    await createReplyTx.wait();

    const replies = await profileImageNfts.getRepliesByCommentId(1);
    expect(replies.length).to.equal(1);
    expect(replies[0].authorName).to.equal("replyAuthorName1");
    expect(replies[0].text).to.equal("Thank you!");
  });

  it("Should retrieve all user posts", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr1).createPost("username1", "Another Post", "imageUrl2", "authorImageUrl2");

    const userPosts = await profileImageNfts.connect(addr1).getUserPosts();
    expect(userPosts.length).to.equal(2);
    expect(userPosts[0].text).to.equal("Hello World");
    expect(userPosts[1].text).to.equal("Another Post");
  });

  it("Should not allow non-existent token URI retrieval", async function () {
    await expect(profileImageNfts.tokenURI(9999)).to.be.revertedWith("URI not exist on that ID");
  });

  it("Should return an empty array when no tokens exist", async function () {
    const tokens = await profileImageNfts.getAlltoken();
    expect(tokens.length).to.equal(0);
  });

  it("Should increment post IDs correctly", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "First Post", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr1).createPost("username1", "Second Post", "imageUrl2", "authorImageUrl2");

    const posts = await profileImageNfts.getPosts();
    expect(posts[0].id).to.equal(1);
    expect(posts[1].id).to.equal(2);
  });

  it("Should allow multiple users to create posts", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "First Post", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createPost("username2", "Second Post", "imageUrl2", "authorImageUrl2");

    const posts = await profileImageNfts.getPosts();
    expect(posts.length).to.equal(2);
    expect(posts[0].author).to.equal(addr1.address);
    expect(posts[1].author).to.equal(addr2.address);
  });

  it("Should emit events correctly when creating posts", async function () {
    await expect(profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1"))
      .to.emit(profileImageNfts, "PostCreated")
      .withArgs("username1", addr1.address, anyValue, "Hello World", "imageUrl1", "authorImageUrl1");
  });

  it("Should create and retrieve user profiles accurately", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    const userProfile = await profileImageNfts.getUserProfile(addr1.address);
    expect(userProfile.name).to.equal("name1");
    expect(userProfile.walletAddress).to.equal("walletAddress1");
    expect(userProfile.profileImage).to.equal("profileImage1");
    expect(userProfile.coverImage).to.equal("coverImage1");
  });

  it("Should update user profiles partially", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    const updateUserProfileTx = await profileImageNfts.connect(addr1).updateUserProfile("name2", "", "", "coverImage2");
    await updateUserProfileTx.wait();

    const userProfile = await profileImageNfts.getUserProfile(addr1.address);
    expect(userProfile.name).to.equal("name2");
    expect(userProfile.walletAddress).to.equal("walletAddress1");
    expect(userProfile.profileImage).to.equal("profileImage1");
    expect(userProfile.coverImage).to.equal("coverImage2");
  });

  it("Should not allow unauthorized updates to user profiles", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    await expect(profileImageNfts.connect(addr2).updateUserProfile("name2", "walletAddress2", "profileImage2", "coverImage2"))
      .to.be.reverted;
  });

  it("Should create and retrieve comments accurately", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");

    const createCommentTx = await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");
    await createCommentTx.wait();

    const comments = await profileImageNfts.getCommentsByPostId(1);
    expect(comments.length).to.equal(1);
    expect(comments[0].text).to.equal("Nice post!");
  });

  it("Should retrieve comments by post ID", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");
    await profileImageNfts.connect(addr1).createComment(1, "authorName2", "authorImageUrl2", "Thanks!");

    const comments = await profileImageNfts.getCommentsByPostId(1);
    expect(comments.length).to.equal(2);
    expect(comments[0].text).to.equal("Nice post!");
    expect(comments[1].text).to.equal("Thanks!");
  });

  it("Should create and retrieve replies accurately", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");

    const createReplyTx = await profileImageNfts.connect(owner).createReply(1, "replyAuthorName1", "replyAuthorImageUrl1", "Thank you!");
    await createReplyTx.wait();

    const replies = await profileImageNfts.getRepliesByCommentId(1);
    expect(replies.length).to.equal(1);
    expect(replies[0].text).to.equal("Thank you!");
  });

  it("Should retrieve replies by comment ID", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");
    await profileImageNfts.connect(owner).createReply(1, "replyAuthorName1", "replyAuthorImageUrl1", "Thank you!");
    await profileImageNfts.connect(addr1).createReply(1, "replyAuthorName2", "replyAuthorImageUrl2", "You're welcome!");

    const replies = await profileImageNfts.getRepliesByCommentId(1);
    expect(replies.length).to.equal(2);
    expect(replies[0].text).to.equal("Thank you!");
    expect(replies[1].text).to.equal("You're welcome!");
  });

  it("Should emit UserProfileCreated event correctly", async function () {
    await expect(profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1"))
      .to.emit(profileImageNfts, "UserProfileCreated")
      .withArgs(addr1.address, "name1", "walletAddress1", "profileImage1", "coverImage1");
  });

  it("Should emit UserProfileUpdated event correctly", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    await expect(profileImageNfts.connect(addr1).updateUserProfile("name2", "walletAddress2", "profileImage2", "coverImage2"))
      .to.emit(profileImageNfts, "UserProfileUpdated")
      .withArgs(addr1.address, "name2", "walletAddress2", "profileImage2", "coverImage2");
  });

  it("Should not allow creating a post without a username", async function () {
    await expect(profileImageNfts.connect(addr1).createPost("", "Hello World", "imageUrl1", "authorImageUrl1"))
      .to.be.revertedWith("Username is required");
  });

  it("Should return empty user posts when user has not created any post", async function () {
    const userPosts = await profileImageNfts.connect(addr1).getUserPosts();
    expect(userPosts.length).to.equal(0);
  });

  it("Should allow updating user profile partially with empty fields", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    await profileImageNfts.connect(addr1).updateUserProfile("", "walletAddress2", "", "");
    const userProfile = await profileImageNfts.getUserProfile(addr1.address);

    expect(userProfile.name).to.equal("name1");
    expect(userProfile.walletAddress).to.equal("walletAddress2");
    expect(userProfile.profileImage).to.equal("profileImage1");
    expect(userProfile.coverImage).to.equal("coverImage1");
  });

  it("Should allow deleting a post", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr1).createPost("username1", "Second Post", "imageUrl2", "authorImageUrl2");

    const deletePostTx = await profileImageNfts.connect(addr1).deletePost(1);
    await deletePostTx.wait();

    const posts = await profileImageNfts.getPosts();
    expect(posts.length).to.equal(1);
    expect(posts[0].text).to.equal("Second Post");
  });

  it("Should not allow deleting a post by non-author", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");

    await expect(profileImageNfts.connect(addr2).deletePost(1)).to.be.revertedWith("Only the author can delete this post");
  });

  it("Should emit CommentCreated event correctly", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");

    await expect(profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!"))
      .to.emit(profileImageNfts, "CommentCreated")
      .withArgs(1, anyValue, "authorName1", addr2.address, "authorImageUrl1", "Nice post!", anyValue);
  });

  it("Should emit ReplyCreated event correctly", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Hello World", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Nice post!");

    await expect(profileImageNfts.connect(owner).createReply(1, "replyAuthorName1", "replyAuthorImageUrl1", "Thank you!"))
      .to.emit(profileImageNfts, "ReplyCreated")
      .withArgs(1, anyValue, "replyAuthorName1", owner.address, "replyAuthorImageUrl1", "Thank you!", anyValue);
  });

  it("Should not allow creating a comment on non-existent post", async function () {
    await expect(profileImageNfts.connect(addr1).createComment(999, "authorName1", "authorImageUrl1", "Nice post!"))
      .to.be.revertedWith("Post does not exist");
  });

  it("Should not allow creating a reply on non-existent comment", async function () {
    await expect(profileImageNfts.connect(addr1).createReply(999, "replyAuthorName1", "replyAuthorImageUrl1", "Thank you!"))
      .to.be.revertedWith("Comment does not exist");
  });

  it("Should allow users to update their profile image", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    await profileImageNfts.connect(addr1).updateUserProfile("", "", "newProfileImage", "");
    const userProfile = await profileImageNfts.getUserProfile(addr1.address);

    expect(userProfile.profileImage).to.equal("newProfileImage");
  });

  it("Should not allow updating other user's profile", async function () {
    await profileImageNfts.connect(addr1).createUserProfile("name1", "walletAddress1", "profileImage1", "coverImage1");

    await expect(profileImageNfts.connect(addr2).updateUserProfile("name2", "walletAddress2", "profileImage2", "coverImage2"))
      .to.be.revertedWith("Only the profile owner can update");
  });

  it("Should handle multiple posts, comments, and replies correctly", async function () {
    await profileImageNfts.connect(addr1).createPost("username1", "Post 1", "imageUrl1", "authorImageUrl1");
    await profileImageNfts.connect(addr1).createPost("username1", "Post 2", "imageUrl2", "authorImageUrl2");
    await profileImageNfts.connect(addr2).createComment(1, "authorName1", "authorImageUrl1", "Comment 1 on Post 1");
    await profileImageNfts.connect(addr2).createComment(2, "authorName1", "authorImageUrl1", "Comment 1 on Post 2");
    await profileImageNfts.connect(addr1).createReply(1, "replyAuthorName1", "replyAuthorImageUrl1", "Reply 1 on Comment 1 of Post 1");
    await profileImageNfts.connect(addr1).createReply(2, "replyAuthorName1", "replyAuthorImageUrl1", "Reply 1 on Comment 1 of Post 2");

    const post1Comments = await profileImageNfts.getCommentsByPostId(1);
    const post2Comments = await profileImageNfts.getCommentsByPostId(2);
    const comment1Replies = await profileImageNfts.getRepliesByCommentId(1);
    const comment2Replies = await profileImageNfts.getRepliesByCommentId(2);

    expect(post1Comments.length).to.equal(1);
    expect(post2Comments.length).to.equal(1);
    expect(comment1Replies.length).to.equal(1);
    expect(comment2Replies.length).to.equal(1);
  });
});
