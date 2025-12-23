// Contract Addresses
export const CONTRACTS = {
  GAME_POOL: '0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1',
  REWARD_VAULT: '0xb6339F1857Ab28105472F1827C0D7948e8c3608D',
  ACHIEVEMENT_NFT: '0x1C9a074Eba68cbEf15BCeab209743388786A9756',
};

// GamePool ABI (Essential functions only)
export const GAME_POOL_ABI = [
  'function enterGame(uint256 _option, address _referrer) external payable',
  'function multiEntry(uint256 _option, uint256 _count, address _referrer) external payable',
  'function claimPrize(uint256 _roundId) external',
  'function finalizeRound() external',
  'function getCurrentRoundInfo() external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)',
  'function getPlayerEntry(uint256 _roundId, address _player) external view returns (uint256)',
  'function getPlayerChoice(uint256 _roundId, address _player) external view returns (uint256)',
  'function hasPlayerClaimed(uint256 _roundId, address _player) external view returns (bool)',
  'function playerTotalEntries(address) external view returns (uint256)',
  'function playerWins(address) external view returns (uint256)',
  'function currentRoundId() external view returns (uint256)',
  'function ENTRY_FEE() external view returns (uint256)',
];

// RewardVault ABI
export const REWARD_VAULT_ABI = [
  'function stake(address _referrer) external payable',
  'function unstake(uint256 _amount) external',
  'function claimRewards() external',
  'function compoundRewards() external',
  'function calculatePendingRewards(address _user) external view returns (uint256)',
  'function getStakeInfo(address _user) external view returns (uint256, uint256, uint256, uint256, uint256)',
  'function getReferralInfo(address _user) external view returns (address, uint256)',
  'function withdrawReferralEarnings() external',
  'function MIN_STAKE() external view returns (uint256)',
  'function totalStakedGlobal() external view returns (uint256)',
];

// AchievementNFT ABI
export const ACHIEVEMENT_NFT_ABI = [
  'function claimBadge(uint8 _badgeType) external',
  'function hasBadge(address _user, uint8 _badgeType) external view returns (bool)',
  'function getUserBadges(address _user) external view returns (uint256[])',
  'function getUserBadgeCount(address _user) external view returns (uint256)',
  'function getBadgeMetadata(uint8 _badgeType) external view returns (string)',
  'function balanceOf(address owner) external view returns (uint256)',
];

// Badge Types
export const BADGE_TYPES = {
  FIRST_ENTRY: 0,
  TEN_ENTRIES: 1,
  FIFTY_ENTRIES: 2,
  FIRST_WIN: 3,
  FIVE_WINS: 4,
  STAKER: 5,
  REFERRER: 6,
  WHALE: 7,
  STREAK_3: 8,
  LEGEND: 9,
};
