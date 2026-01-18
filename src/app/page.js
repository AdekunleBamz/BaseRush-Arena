
// BaseRush Arena Main Page
// This file contains the main Home component for the dApp, handling game logic, contract interactions, and UI state.
'use client'


// React and external hooks
import { useEffect, useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// App-specific imports
import { CONTRACTS, GAME_POOL_ABI, REWARD_VAULT_ABI, ACHIEVEMENT_NFT_ABI, BADGE_TYPES } from '../lib/contracts'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Leaderboard from '../components/Leaderboard'
import Chat from '../components/Chat'
import Notifications from '../components/Notifications'
import { useTheme } from '../lib/theme-context'
import { useSound } from '../lib/sound-context'
import Tooltip from '../components/Tooltip'

// Main Home component for the dApp
export default function Home() {
  // External hooks
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { isDark, toggleTheme } = useTheme()
  const { isSoundEnabled, toggleSound, playSound } = useSound()

  // UI state
  const [selectedOption, setSelectedOption] = useState(0)
  const [multiCount, setMultiCount] = useState(1)
  const [stakeAmount, setStakeAmount] = useState('0.0001')
  const [activeTab, setActiveTab] = useState('game')
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  // Contract reads
  // Get current round info
  const { data: roundInfo, refetch: refetchRound } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'getCurrentRoundInfo',
  })

  // Get player stats
  const { data: playerEntries } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'playerTotalEntries',
    args: [address],
  })

  const { data: playerWins } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'playerWins',
    args: [address],
  })

  // Get stake info
  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: CONTRACTS.REWARD_VAULT,
    abi: REWARD_VAULT_ABI,
    functionName: 'getStakeInfo',
    args: [address],
  })

  // Get badge count
  const { data: badgeCount } = useReadContract({
    address: CONTRACTS.ACHIEVEMENT_NFT,
    abi: ACHIEVEMENT_NFT_ABI,
    functionName: 'getUserBadgeCount',
    args: [address],
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchRound()
      refetchStake()
      playSound('win') // Play success sound
    }
  }, [isConfirmed, refetchRound, refetchStake, playSound])


  /**
   * Handles contract transaction execution with error handling and connection checks.
   * @param {Function} txFn - Transaction function to execute
   * @param {string} actionName - Name of the action for error messages
   */
  const handleTransaction = (txFn, actionName = 'transaction') => {
    // Ensure wallet is connected
    if (!isConnected) {
      setErrorMessage('Please connect your wallet to continue')
      setShowError(true)
      playSound('error')
      open()
      return
    }

    // Prevent duplicate transactions
    if (isPending) {
      setErrorMessage('Transaction already in progress. Please wait...')
      setShowError(true)
      return
    }

    try {
      txFn()
    } catch (error) {
      console.error('Transaction error:', error)

      // Handle specific error types
      let userMessage = `Failed to ${actionName}: `

      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        userMessage += 'Transaction was cancelled by user'
      } else if (error?.message?.includes('insufficient funds')) {
        userMessage += 'Insufficient funds for transaction'
      } else if (error?.message?.includes('network')) {
        userMessage += 'Network error. Please check your connection'
      } else if (error?.message?.includes('gas')) {
        userMessage += 'Gas estimation failed. Try again or increase gas limit'
      } else {
        userMessage += error?.message || 'Unknown error occurred'
      }

      setErrorMessage(userMessage)
      setShowError(true)
      playSound('error')
    }
  }

  // Show write errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError)
      playSound('error') // Play error sound

      // Handle specific write error types
      let userMessage = 'Transaction failed: '

      if (writeError.message?.includes('User rejected') || writeError.code === 4001) {
        return // Don't show error for user rejection
      } else if (writeError.message?.includes('insufficient funds')) {
        userMessage += 'Insufficient funds for transaction'
      } else if (writeError.message?.includes('network')) {
        userMessage += 'Network error. Please check your connection'
      } else if (writeError.message?.includes('gas')) {
        userMessage += 'Gas estimation failed. Try again or increase gas limit'
      } else {
        userMessage += writeError.message || 'Unknown error occurred'
      }

      setErrorMessage(userMessage)
      setShowError(true)
    }
  }, [writeError, playSound])


  /**
   * Enter the game with selected option
   */
  const enterGame = () => {
    playSound('click') // Play click sound
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.GAME_POOL,
        abi: GAME_POOL_ABI,
        functionName: 'enterGame',
        args: [selectedOption, '0x0000000000000000000000000000000000000000'],
        value: parseEther('0.0001'),
      }),
      'enter game'
    )
  }


  /**
   * Enter multiple times in the game
   */
  const multiEntry = () => {
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.GAME_POOL,
        abi: GAME_POOL_ABI,
        functionName: 'multiEntry',
        args: [selectedOption, multiCount, '0x0000000000000000000000000000000000000000'],
        value: parseEther((0.0001 * multiCount).toString()),
      }),
      `enter game ${multiCount} times`
    )
  }


  /**
   * Stake tokens in the reward vault
   */
  const stakeTokens = () => {
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.REWARD_VAULT,
        abi: REWARD_VAULT_ABI,
        functionName: 'stake',
        args: ['0x0000000000000000000000000000000000000000'],
        value: parseEther(stakeAmount),
      }),
      `stake ${stakeAmount} ETH`
    )
  }


  /**
   * Claim earned rewards from the vault
   */
  const claimRewards = () => {
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.REWARD_VAULT,
        abi: REWARD_VAULT_ABI,
        functionName: 'claimRewards',
      }),
      'claim rewards'
    )
  }


  /**
   * Compound earned rewards in the vault
   */
  const compoundRewards = () => {
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.REWARD_VAULT,
        abi: REWARD_VAULT_ABI,
        functionName: 'compoundRewards',
      }),
      'compound rewards'
    )
  }


  /**
   * Claim achievement badge NFT
   * @param {string} badgeType - Type of badge to claim
   */
  const claimBadge = (badgeType) => {
    handleTransaction(() =>
      writeContract({
        address: CONTRACTS.ACHIEVEMENT_NFT,
        abi: ACHIEVEMENT_NFT_ABI,
        functionName: 'claimBadge',
        args: [badgeType],
      }),
      `claim ${badgeType} badge`
    )
  }


  // Render UI for disconnected state
  if (!isConnected) {
    return (
      <div className="container">
        <div className="header">
          <div className="logo">⚡ BaseRush Arena</div>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '60px 20px'}}>
          <h2>Welcome to BaseRush Arena</h2>
          <p style={{margin: '20px 0', opacity: 0.9}}>
            Compete in prediction rounds, stake for rewards, and collect achievement NFTs
          </p>
          <button className="btn btn-primary" onClick={() => open()}>
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">

      {/* Header with logo, theme toggle, sound toggle, and wallet address */}
      <div className="header">
        <div className="logo">⚡ BaseRush Arena</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn"
            onClick={toggleTheme}
            style={{ fontSize: '18px', padding: '8px 12px' }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            className="btn"
            onClick={toggleSound}
            style={{ fontSize: '18px', padding: '8px 12px' }}
            title={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {isSoundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="btn" onClick={() => open()}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        </div>
      </div>


      {/* Error Message Display */}
      {showError && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMessage}</span>
            <button
              className="error-close"
              onClick={() => setShowError(false)}
              title="Close error message"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Player Stats section */}
      <div className="card">
        <div className="grid">
          <div className="stat">
            <Tooltip content="Total number of game entries you've made">
              <div className="stat-label">Total Entries</div>
            </Tooltip>
            <div className="stat-value">{playerEntries?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <Tooltip content="Number of rounds you've won">
              <div className="stat-label">Wins</div>
            </Tooltip>
            <div className="stat-value">{playerWins?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <Tooltip content="Achievement badges you've earned">
              <div className="stat-label">Badges</div>
            </Tooltip>
            <div className="stat-value">{badgeCount?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <Tooltip content="ETH amount staked in the reward vault">
              <div className="stat-label">Staked</div>
            </Tooltip>
            <div className="stat-value">
              {stakeInfo ? formatEther(stakeInfo[0]).slice(0, 6) : '0'} ETH
            </div>
          </div>
        </div>
      </div>


      {/* Tab Navigation for Game, Stake, Badges */}
      <div className="card">
        <div style={{display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap'}}>
          <button
            className={`btn ${activeTab === 'game' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            🎮 Game
          </button>
          <button
            className={`btn ${activeTab === 'stake' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('stake')}
          >
            💰 Stake
          </button>
          <button
            className={`btn ${activeTab === 'badges' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            🏆 Badges
          </button>
          {/* Additional tabs for Leaderboard, Chat, Notifications */}
          <button
            className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🥇 Leaderboard
          </button>
          <button
            className={`btn ${activeTab === 'chat' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={`btn ${activeTab === 'notifications' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Game Tab UI */}
        {activeTab === 'game' && (
          <div>
            <h2>Current Round #{roundInfo?.[0]?.toString()}</h2>
            <div className="grid" style={{marginTop: '20px'}}>
              <div className="stat">
                <div className="stat-label">Pool</div>
                <div className="stat-value">
                  {roundInfo ? formatEther(roundInfo[3]).slice(0, 6) : '0'} ETH
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Option A Total</div>
                <div className="stat-value">
                  {roundInfo ? formatEther(roundInfo[5]).slice(0, 6) : '0'} ETH
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Option B Total</div>
                <div className="stat-value">
                  {roundInfo ? formatEther(roundInfo[6]).slice(0, 6) : '0'} ETH
                </div>
              </div>
            </div>

            {/* Prediction selection UI */}
            <div style={{marginTop: '24px'}}>
              <h3>Select Your Prediction</h3>
              <button 
                className={`btn option-btn ${selectedOption === 0 ? 'btn-primary' : ''}`}
                onClick={() => setSelectedOption(0)}
              >
                🔵 Option A
              </button>
              <button 
                className={`btn option-btn ${selectedOption === 1 ? 'btn-primary' : ''}`}
                onClick={() => setSelectedOption(1)}
              >
                🔴 Option B
              </button>

              <div style={{marginTop: '20px'}}>
                <label>Multi-Entry (1-10):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={multiCount}
                  onChange={(e) => setMultiCount(Number(e.target.value))}
                />
              </div>

              {/* Enter game button with dynamic text and loading states */}
              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '16px'}}
                onClick={multiCount === 1 ? enterGame : multiEntry}
                disabled={isConfirming || isPending}
              >
                {isPending ? 'Requesting...' : isConfirming ? 'Confirming...' : `Enter (${(0.0001 * multiCount).toFixed(4)} ETH)`}
              </button>
            </div>
          </div>
        )}

        {/* Stake Tab UI */}
        {activeTab === 'stake' && (
          <div>
            <h2>Staking Pool</h2>
            <div className="grid" style={{marginTop: '20px'}}>
              <div className="stat">
                <div className="stat-label">Your Stake</div>
                <div className="stat-value">
                  {stakeInfo ? formatEther(stakeInfo[0]).slice(0, 6) : '0'} ETH
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Pending Rewards</div>
                <div className="stat-value">
                  {stakeInfo ? formatEther(stakeInfo[4]).slice(0, 6) : '0'} ETH
                </div>
              </div>
            </div>

            {/* Stake amount input and buttons */}
            <div style={{marginTop: '24px'}}>
              <label>Stake Amount (ETH):</label>
              <input 
                type="text" 
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0001"
              />

              {/* Stake button */}
              {/* Stake button */}
              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '16px'}}
                onClick={stakeTokens}
                disabled={isConfirming || isPending}
              >
                {isPending ? 'Requesting...' : isConfirming ? 'Confirming...' : 'Stake'}
              </button>

              {/* Claim and compound buttons */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px'}}>
                <button className="btn" onClick={claimRewards} disabled={isConfirming || isPending}>
                  {isPending ? 'Requesting...' : 'Claim Rewards'}
                </button>
                <button className="btn" onClick={compoundRewards} disabled={isConfirming || isPending}>
                  {isPending ? 'Requesting...' : 'Compound'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab UI */}
        {activeTab === 'badges' && (
          <div>
            <h2>Achievement Badges</h2>
            <p style={{opacity: 0.8, marginBottom: '24px'}}>
              Collect badges by completing milestones!
            </p>

            {/* Badge list with claim buttons */}
            <div style={{display: 'grid', gap: '12px'}}>
              {Object.entries(BADGE_TYPES).map(([name, id]) => (
                <div key={id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
                  <span>{name.replace(/_/g, ' ')}</span>
                  <button className="btn" onClick={() => claimBadge(id)} disabled={isConfirming || isPending}>
                    {isPending ? 'Requesting...' : 'Claim'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && <Leaderboard />}

        {/* Chat Tab */}
        {activeTab === 'chat' && <Chat />}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && <Notifications />}
      </div>

      {/* Transaction status messages */}
      {isConfirming && (
        <div className="card" style={{textAlign: 'center'}}>
          ⏳ Transaction confirming...
        </div>
      )}

      {isConfirmed && (
        <div className="card" style={{textAlign: 'center', background: 'rgba(76, 175, 80, 0.3)'}}>
          ✅ Transaction confirmed!
        </div>
      )}
    </div>
  )
}
