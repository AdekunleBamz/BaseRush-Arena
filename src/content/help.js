/**
 * Help/FAQ Content
 * Static content for help section
 */

export const FAQ_ITEMS = [
  {
    id: 'what-is-baserush',
    category: 'General',
    question: 'What is BaseRush Arena?',
    answer: 'BaseRush Arena is a Web3 prediction game built on the Base Network. Players predict whether the ETH price will go up or down, stake their ETH, and compete to win from the prize pool.',
  },
  {
    id: 'how-to-play',
    category: 'General',
    question: 'How do I play?',
    answer: 'Connect your wallet, choose UP or DOWN prediction, enter your stake amount, and submit your entry. If your prediction is correct when the round ends, you win a share of the prize pool!',
  },
  {
    id: 'what-network',
    category: 'General',
    question: 'What network does BaseRush use?',
    answer: 'BaseRush runs on Base, an Ethereum Layer 2 network. You need to have ETH on Base to play. You can bridge ETH from Ethereum mainnet using the official Base Bridge.',
  },
  {
    id: 'min-max-entry',
    category: 'Gameplay',
    question: 'What are the minimum and maximum entry amounts?',
    answer: 'The minimum entry is 0.001 ETH and the maximum is 10 ETH per entry. You can make multiple entries per round to increase your potential winnings.',
  },
  {
    id: 'multi-entry',
    category: 'Gameplay',
    question: 'What is multi-entry?',
    answer: 'Multi-entry allows you to submit multiple predictions in a single transaction. This increases your chances of winning and earns you bonus multipliers on rewards.',
  },
  {
    id: 'round-duration',
    category: 'Gameplay',
    question: 'How long does each round last?',
    answer: 'Each prediction round lasts 24 hours. You can enter at any time during an active round, but entries close 5 minutes before the round ends.',
  },
  {
    id: 'prize-distribution',
    category: 'Gameplay',
    question: 'How are prizes distributed?',
    answer: 'Winners share the prize pool proportionally based on their entry amount. The house takes a 5% fee, and the remaining 95% goes to winners. If you predicted correctly, your share is calculated based on your stake relative to all winning stakes.',
  },
  {
    id: 'how-staking-works',
    category: 'Staking',
    question: 'How does staking work?',
    answer: 'Stake your ETH in the Reward Vault to earn passive rewards. Stakers earn a portion of the platform fees plus additional staking rewards. The current APR varies based on platform activity.',
  },
  {
    id: 'staking-lockup',
    category: 'Staking',
    question: 'Is there a lock-up period for staking?',
    answer: 'Yes, staked ETH has a 7-day lock-up period. After 7 days, you can withdraw your stake at any time. Rewards can be claimed or compounded at any time.',
  },
  {
    id: 'what-are-achievements',
    category: 'Achievements',
    question: 'What are achievements?',
    answer: 'Achievements are special badges you earn for completing various milestones like winning streaks, total games played, or staking amounts. Some achievements unlock exclusive NFT badges!',
  },
  {
    id: 'achievement-nfts',
    category: 'Achievements',
    question: 'Can I mint achievement NFTs?',
    answer: 'Yes! Certain achievements can be minted as NFTs on Base. These NFTs are free to mint (just pay gas) and serve as on-chain proof of your accomplishments.',
  },
  {
    id: 'supported-wallets',
    category: 'Wallet',
    question: 'What wallets are supported?',
    answer: 'BaseRush supports any WalletConnect-compatible wallet including MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and many others.',
  },
  {
    id: 'wallet-safety',
    category: 'Wallet',
    question: 'Is it safe to connect my wallet?',
    answer: 'Yes! We only request permission to view your address and sign transactions. We never ask for your seed phrase. All transactions require your explicit approval.',
  },
  {
    id: 'gas-fees',
    category: 'Costs',
    question: 'What are the gas fees?',
    answer: 'Gas fees on Base are very low, typically less than $0.01 per transaction. You need ETH on Base to pay for gas.',
  },
  {
    id: 'smart-contracts',
    category: 'Security',
    question: 'Are the smart contracts audited?',
    answer: 'Our smart contracts have been reviewed for security. Contract addresses are publicly visible on BaseScan for transparency. We recommend only playing with funds you can afford to lose.',
  },
]

export const HELP_CATEGORIES = [
  { id: 'General', icon: '📚', description: 'Basic information about BaseRush' },
  { id: 'Gameplay', icon: '🎮', description: 'How to play and win' },
  { id: 'Staking', icon: '💎', description: 'Staking and rewards' },
  { id: 'Achievements', icon: '🏆', description: 'Earning badges and NFTs' },
  { id: 'Wallet', icon: '👛', description: 'Wallet connection and safety' },
  { id: 'Costs', icon: '💰', description: 'Fees and costs' },
  { id: 'Security', icon: '🔒', description: 'Safety and security' },
]

export const QUICK_TIPS = [
  {
    icon: '🎯',
    title: 'Research Before Predicting',
    description: 'Check market trends and news before making your prediction.',
  },
  {
    icon: '💡',
    title: 'Start Small',
    description: 'Begin with smaller entries to learn how the game works.',
  },
  {
    icon: '🔄',
    title: 'Compound Rewards',
    description: 'Compound your staking rewards to maximize earnings over time.',
  },
  {
    icon: '🎖️',
    title: 'Chase Achievements',
    description: 'Complete achievements to earn exclusive NFTs and bragging rights.',
  },
  {
    icon: '⏰',
    title: 'Watch the Clock',
    description: 'Enter early in the round for better odds and to avoid last-minute issues.',
  },
  {
    icon: '🔐',
    title: 'Stay Safe',
    description: 'Never share your seed phrase and always verify transaction details.',
  },
]

export const GLOSSARY = {
  APR: 'Annual Percentage Rate - the yearly return on staked assets',
  Base: 'An Ethereum Layer 2 network built by Coinbase',
  Entry: 'A prediction bet placed on a round outcome',
  Gas: 'Transaction fees paid to the network',
  Prediction: 'Your guess on whether the price will go UP or DOWN',
  Round: 'A single game period with a start and end time',
  Stake: 'ETH locked in the platform to earn rewards',
  'Prize Pool': 'Total ETH available to be won in a round',
  'Win Rate': 'Percentage of games you have won',
  Streak: 'Consecutive wins without a loss',
}

export default {
  FAQ_ITEMS,
  HELP_CATEGORIES,
  QUICK_TIPS,
  GLOSSARY,
}
