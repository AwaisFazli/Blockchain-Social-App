// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProfileImageNfts is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    uint32 private _postIdCounter = 1;
    uint32 private _commentIdCounter = 1;
    uint32 private _replyIdCounter = 1;

    mapping(uint256 => string) private _tokenURIs;

    struct RenderToken {
        uint256 id;
        string uri;
        string space;
    }

    struct Post {
        uint32 id;
        string username;
        address author;
        uint256 timestamp;
        string text;
        string imageUrl;
        string authorImageUrl;
    }

    Post[] public posts;

    struct UserProfile {
        string name;
        string walletAddress;
        string profileImage;
        string coverImage;
    }

    struct Comment {
        uint32 id;
        uint32 postId;
        string authorName;
        address author;
        string authorImageUrl;
        string text;
        uint256 timestamp;
    }

    struct Reply {
        uint32 id;
        uint32 commentId;
        string authorName;
        address author;
        string authorImageUrl;
        string text;
        uint256 timestamp;
    }

    Comment[] public comments;
    Reply[] public replies;

    mapping(address => UserProfile) private userProfiles;

    event PostCreated(
        string username,
        address author,
        uint256 timestamp,
        string text,
        string imageUrl,
        string authorImageUrl
    );
    event UserProfileCreated(
        address indexed user,
        string name,
        string walletAddress,
        string profileImage,
        string coverImage
    );
    event UserProfileUpdated(
        address indexed user,
        string name,
        string walletAddress,
        string profileImage,
        string coverImage
    );
    event CommentCreated(
        uint32 postId,
        uint32 id,
        string authorName,
        address author,
        string authorImageUrl,
        string text,
        uint256 timestamp
    );
    event ReplyCreated(
        uint32 commentId,
        uint32 id,
        string authorName,
        address author,
        string authorImageUrl,
        string text,
        uint256 timestamp
    );

    constructor() ERC721("ProfileImageNfts", "PIN") {}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI not exist on that ID");
        string memory _RUri = _tokenURIs[tokenId];
        return _RUri;
    }

    function getAlltoken() public view returns (RenderToken[] memory) {
        uint256 latestId = _tokenIds.current();
        RenderToken[] memory res = new RenderToken[](latestId);
        for (uint256 i = 0; i <= latestId; i++) {
            if (_exists(i)) {
                string memory uri = tokenURI(i);
                res[i] = RenderToken(i, uri, " ");
            }
        }
        return res;
    }

    function mint(
        address recipents,
        string memory _uri
    ) public returns (uint256) {
        uint256 newId = _tokenIds.current();
        _mint(recipents, newId);
        _setTokenURI(newId, _uri);
        _tokenIds.increment();
        return newId;
    }

    function createPost(
        string memory _username,
        string memory _text,
        string memory _imageUrl,
        string memory _authorImageUrl
    ) public {
        uint32 postId = _postIdCounter;
        _postIdCounter++;
        posts.push(
            Post(
                postId,
                _username,
                msg.sender,
                block.timestamp,
                _text,
                _imageUrl,
                _authorImageUrl
            )
        );
        emit PostCreated(
            _username,
            msg.sender,
            block.timestamp,
            _text,
            _imageUrl,
            _authorImageUrl
        );
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getUserPosts() public view returns (Post[] memory) {
        uint256 userPostCount = 0;
        address caller = msg.sender;

        for (uint256 i = 0; i < posts.length; i++) {
            if (posts[i].author == caller) {
                userPostCount++;
            }
        }

        Post[] memory userPosts = new Post[](userPostCount);
        uint256 index = 0;

        for (uint256 i = 0; i < posts.length; i++) {
            if (posts[i].author == caller) {
                userPosts[index] = posts[i];
                index++;
            }
        }

        return userPosts;
    }

    function createUserProfile(
        string memory _name,
        string memory _walletAddress,
        string memory _profileImage,
        string memory _coverImage
    ) public {
        userProfiles[msg.sender] = UserProfile(
            _name,
            _walletAddress,
            _profileImage,
            _coverImage
        );
        emit UserProfileCreated(
            msg.sender,
            _name,
            _walletAddress,
            _profileImage,
            _coverImage
        );
    }

    function getUserProfile(
        address _user
    ) public view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    function updateUserProfile(
        string memory _name,
        string memory _walletAddress,
        string memory _profileImage,
        string memory _coverImage
    ) public {
        UserProfile storage userProfile = userProfiles[msg.sender];

        if (bytes(_name).length == 0) {
            _name = userProfile.name;
        }
        if (bytes(_profileImage).length == 0) {
            _profileImage = userProfile.profileImage;
        }
        if (bytes(_coverImage).length == 0) {
            _coverImage = userProfile.coverImage;
        }

        userProfile.name = _name;
        userProfile.walletAddress = _walletAddress;
        userProfile.profileImage = _profileImage;
        userProfile.coverImage = _coverImage;

        emit UserProfileUpdated(
            msg.sender,
            _name,
            _walletAddress,
            _profileImage,
            _coverImage
        );
    }

    function createComment(
        uint32 _postId,
        string memory _authorName,
        string memory _authorImageUrl,
        string memory _text
    ) public {
        uint32 commentId = _commentIdCounter;
        _commentIdCounter++;
        comments.push(
            Comment(
                commentId,
                _postId,
                _authorName,
                msg.sender,
                _authorImageUrl,
                _text,
                block.timestamp
            )
        );
        emit CommentCreated(
            _postId,
            commentId,
            _authorName,
            msg.sender,
            _authorImageUrl,
            _text,
            block.timestamp
        );
    }

    function getCommentsByPostId(
        uint32 _postId
    ) public view returns (Comment[] memory) {
        uint256 commentCount = 0;

        // Count the number of comments for the post
        for (uint256 i = 0; i < comments.length; i++) {
            if (comments[i].postId == _postId) {
                commentCount++;
            }
        }

        Comment[] memory postComments = new Comment[](commentCount);
        uint256 index = 0;

        // Retrieve the comments for the post
        for (uint256 i = 0; i < comments.length; i++) {
            if (comments[i].postId == _postId) {
                postComments[index] = comments[i];
                index++;
            }
        }

        return postComments;
    }

    function createReply(
        uint32 _commentId,
        string memory _authorName,
        string memory _authorImageUrl,
        string memory _text
    ) public {
        uint32 replyId = _replyIdCounter;
        _replyIdCounter++;
        replies.push(
            Reply(
                replyId,
                _commentId,
                _authorName,
                msg.sender,
                _authorImageUrl,
                _text,
                block.timestamp
            )
        );
        emit ReplyCreated(
            _commentId,
            replyId,
            _authorName,
            msg.sender,
            _authorImageUrl,
            _text,
            block.timestamp
        );
    }

    function getRepliesByCommentId(
        uint32 _commentId
    ) public view returns (Reply[] memory) {
        uint256 replyCount = 0;

        // Count the number of replies for the comment
        for (uint256 i = 0; i < replies.length; i++) {
            if (replies[i].commentId == _commentId) {
                replyCount++;
            }
        }

        Reply[] memory commentReplies = new Reply[](replyCount);
        uint256 index = 0;

        // Retrieve the replies for the comment
        for (uint256 i = 0; i < replies.length; i++) {
            if (replies[i].commentId == _commentId) {
                commentReplies[index] = replies[i];
                index++;
            }
        }

        return commentReplies;
    }
}
