// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProfileImageNfts is ERC721, Ownable {

    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter _tokenIds;
    mapping(uint256 => string) _tokenURIs;

    struct RenderToken{
        uint256 id;
        string uri;
        string space;
    }

    struct Post {
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

    mapping(address => UserProfile) private userProfiles;

    event PostCreated(string username, address author, uint256 timestamp, string text, string imageUrl, string authorImageUrl);
    event UserProfileCreated(address indexed user, string name, string walletAddress, string profileImage, string coverImage);
    event UserProfileUpdated(address indexed user, string name, string walletAddress, string profileImage, string coverImage);

    
    constructor() ERC721("ProfileImageNfts","PIN"){}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId),"URI not exist on that ID");
        string memory _RUri =  _tokenURIs[tokenId];
        return _RUri;
    }

    function getAlltoken() public view returns (RenderToken[] memory){
        uint256 latestId = _tokenIds.current();
        RenderToken[] memory res = new RenderToken[](latestId);
        for(uint256 i = 0; i  <= latestId ; i++){
            if(_exists(i)){
                string memory uri = tokenURI(i);
                res[i] = RenderToken(i,uri," ");
            }
        }
        return res;
    }

    function mint(address recipents, string memory _uri) public returns (uint256){
        uint256 newId = _tokenIds.current();
        _mint(recipents,newId);
        _setTokenURI(newId,_uri);
        _tokenIds.increment();
        return newId;
    }

    function createPost(string memory _username, address _author, uint256 _timestamp, string memory _text, string memory _imageUrl, string memory _authorImageUrl) public {
        posts.push(Post(_username, _author, _timestamp, _text, _imageUrl, _authorImageUrl));
        emit PostCreated(_username, _author, _timestamp, _text, _imageUrl, _authorImageUrl);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getUserPosts() public view returns (Post[] memory) {
        uint256 userPostCount = 0;
        address caller = msg.sender;
        
        for(uint256 i = 0; i < posts.length; i++) {
            if(posts[i].author == caller) {
                userPostCount++;
            }
        }
        
        Post[] memory userPosts = new Post[](userPostCount);
        uint256 index = 0;
        
        for(uint256 i = 0; i < posts.length; i++) {
            if(posts[i].author == caller) {
                userPosts[index] = posts[i];
                index++;
            }
        }
        
        return userPosts;
    }

    function createUserProfile(string memory _name, string memory _walletAddress, string memory _profileImage, string memory _coverImage) public {
        userProfiles[msg.sender] = UserProfile(_name, _walletAddress, _profileImage, _coverImage);
        emit UserProfileCreated(msg.sender, _name, _walletAddress, _profileImage, _coverImage);
    }

    function getUserProfile(address _user) public view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    function updateUserProfile(string memory _name, string memory _walletAddress, string memory _profileImage, string memory _coverImage) public {
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

        emit UserProfileUpdated(msg.sender, _name, _walletAddress, _profileImage, _coverImage);
    }
}