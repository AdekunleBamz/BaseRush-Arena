
// BaseRush Arena Main Page
// This file contains the main Home component for the dApp, handling game logic, contract interactions, and UI state.
'use client'


// React and external hooks
import { useEffect, useState, useMemo, useCallback } from 'react'
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
  const [showSettings, setShowSettings] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Gamification features
  const [currentStreak, setCurrentStreak] = useState(2)
  const [bestStreak, setBestStreak] = useState(5)
  const [showAchievement, setShowAchievement] = useState(false)
  const [latestAchievement, setLatestAchievement] = useState('')

  // Mock data for demonstration - in a real app this would come from contract events
  const gameHistory = [
    { round: 1, result: 'win', amount: 0.001 },
    { round: 2, result: 'loss', amount: -0.0001 },
    { round: 3, result: 'win', amount: 0.001 },
    { round: 4, result: 'win', amount: 0.001 },
    { round: 5, result: 'loss', amount: -0.0001 },
    { round: 6, result: 'win', amount: 0.001 },
    { round: 7, result: 'win', amount: 0.001 },
    { round: 8, result: 'loss', amount: -0.0001 },
  ]

  // Achievement definitions
  const achievements = [
    { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆', unlocked: true },
    { id: 'win_streak_3', name: 'Hot Streak', description: 'Win 3 games in a row', icon: '🔥', unlocked: true },
    { id: 'win_streak_5', name: 'Unstoppable', description: 'Win 5 games in a row', icon: '⚡', unlocked: false },
    { id: 'big_winner', name: 'High Roller', description: 'Stake more than 0.01 ETH', icon: '💰', unlocked: false },
    { id: 'dedicated', name: 'Dedicated Player', description: 'Play 10 games', icon: '🎯', unlocked: false },
    { id: 'legend', name: 'Legend', description: 'Achieve 90%+ win rate', icon: '👑', unlocked: false },
  ]

  // Function to check and unlock achievements
  const checkAchievements = useCallback(() => {
    const totalGames = Number(playerEntries || 0)
    const wins = Number(playerWins || 0)
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

    // Check for new achievements
    if (totalGames >= 10 && !achievements.find(a => a.id === 'dedicated').unlocked) {
      setLatestAchievement('Dedicated Player')
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }

    if (winRate >= 90 && !achievements.find(a => a.id === 'legend').unlocked) {
      setLatestAchievement('Legend')
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }
  }, [playerEntries, playerWins])

  // Check achievements when stats change
  useEffect(() => {
    checkAchievements()
  }, [checkAchievements])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle keyboard shortcuts when not typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      switch (event.key) {
        case '1':
        case '2':
        case '3':
          event.preventDefault()
          const optionIndex = parseInt(event.key) - 1
          if (optionIndex >= 0 && optionIndex <= 2) {
            setSelectedOption(optionIndex)
            playSound('click')
          }
          break
        case 'Enter':
          event.preventDefault()
          if (event.ctrlKey || event.metaKey) {
            enterGame()
          }
          break
        case 't':
          event.preventDefault()
          toggleTheme()
          break
        case 's':
          event.preventDefault()
          toggleSound()
          break
        case 'ArrowLeft':
          event.preventDefault()
          setActiveTab(prev => prev === 'game' ? 'leaderboard' : prev === 'leaderboard' ? 'chat' : 'game')
          break
        case 'ArrowRight':
          event.preventDefault()
          setActiveTab(prev => prev === 'game' ? 'chat' : prev === 'chat' ? 'leaderboard' : 'game')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playSound, enterGame, toggleTheme, toggleSound])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('baserush-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setAnimationsEnabled(settings.animationsEnabled ?? true)
        setCompactMode(settings.compactMode ?? false)
      } catch (error) {
        console.warn('Failed to load settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      animationsEnabled,
      compactMode
    }
    localStorage.setItem('baserush-settings', JSON.stringify(settings))
  }, [animationsEnabled, compactMode])

  // Contract reads
  // Get current round info
  const { data: roundInfo, refetch: refetchRound, isLoading: roundLoading } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'getCurrentRoundInfo',
  })

  // Get player stats
  const { data: playerEntries, isLoading: entriesLoading } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'playerTotalEntries',
    args: [address],
  })

  const { data: playerWins, isLoading: winsLoading } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'playerWins',
    args: [address],
  })

  // Get stake info
  const { data: stakeInfo, refetch: refetchStake, isLoading: stakeLoading } = useReadContract({
    address: CONTRACTS.REWARD_VAULT,
    abi: REWARD_VAULT_ABI,
    functionName: 'getStakeInfo',
    args: [address],
  })

  // Get badge count
  const { data: badgeCount, isLoading: badgeLoading } = useReadContract({
    address: CONTRACTS.ACHIEVEMENT_NFT,
    abi: ACHIEVEMENT_NFT_ABI,
    functionName: 'getUserBadgeCount',
    args: [address],
  })

  // Memoized calculations for performance
  const totalStaked = useMemo(() => {
    if (!stakeInfo) return '0'
    return formatEther(stakeInfo[0] || 0n)
  }, [stakeInfo])

  const pendingRewards = useMemo(() => {
    if (!stakeInfo) return '0'
    return formatEther(stakeInfo[1] || 0n)
  }, [stakeInfo])

  const winRate = useMemo(() => {
    const entries = Number(playerEntries || 0)
    const wins = Number(playerWins || 0)
    if (entries === 0) return '0%'
    return ((wins / entries) * 100).toFixed(1) + '%'
  }, [playerEntries, playerWins])

  const isLoadingStats = entriesLoading || winsLoading || stakeLoading || badgeLoading

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
  const handleTransaction = useCallback((txFn, actionName = 'transaction') => {
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
  }, [isConnected, playSound, setErrorMessage, setShowError])

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
  const enterGame = useCallback(() => {
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
  }, [playSound, handleTransaction, writeContract, selectedOption])


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

      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Header with logo, theme toggle, sound toggle, and wallet address */}
      <header className="header" role="banner">
        <h1 className="logo">⚡ BaseRush Arena</h1>
        <nav aria-label="User controls">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn"
              onClick={toggleTheme}
              style={{ fontSize: '18px', padding: '8px 12px' }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              className="btn"
              onClick={toggleSound}
              style={{ fontSize: '18px', padding: '8px 12px' }}
              aria-label={isSoundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              aria-pressed={isSoundEnabled}
            >
              {isSoundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              className="btn"
              onClick={() => setShowSettings(true)}
              style={{ fontSize: '18px', padding: '8px 12px' }}
              aria-label="Open settings panel"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              className="btn"
              onClick={() => setShowHelp(true)}
              style={{ fontSize: '18px', padding: '8px 12px' }}
              aria-label="Open help and tutorial"
              title="Help"
            >
              ❓
            </button>
            <button
              className="btn"
              onClick={() => open()}
              aria-label={isConnected ? `Connected wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect wallet'}
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          </div>
        </nav>
      </header>


      {/* Error Message Display */}
      {showError && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <div className="error-content">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <span className="error-text">{errorMessage}</span>
            <button
              className="error-close"
              onClick={() => setShowError(false)}
              aria-label="Close error message"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="achievement-banner" role="alert" aria-live="assertive">
          <div className="achievement-content">
            <span className="achievement-icon" aria-hidden="true">🎉</span>
            <div className="achievement-text">
              <div className="achievement-title">Achievement Unlocked!</div>
              <div className="achievement-name">{latestAchievement}</div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Settings</h3>
              <button
                className="modal-close"
                onClick={() => setShowSettings(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="setting-group">
                <h4>Appearance</h4>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                  />
                  <span>Dark Mode</span>
                </label>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                  <span>Compact Mode</span>
                </label>
              </div>

              <div className="setting-group">
                <h4>Audio</h4>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={isSoundEnabled}
                    onChange={toggleSound}
                  />
                  <span>Sound Effects</span>
                </label>
              </div>

              <div className="setting-group">
                <h4>Accessibility</h4>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={animationsEnabled}
                    onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  />
                  <span>Enable Animations</span>
                </label>
              </div>

              <div className="setting-group">
                <h4>Keyboard Shortcuts</h4>
                <div className="shortcut-list">
                  <div className="shortcut-item">
                    <kbd>1-3</kbd> <span>Select prediction option</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Ctrl/Cmd + Enter</kbd> <span>Enter game</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>T</kbd> <span>Toggle theme</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>S</kbd> <span>Toggle sound</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>← →</kbd> <span>Switch tabs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Tutorial Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Help & Tutorial</h3>
              <button
                className="modal-close"
                onClick={() => setShowHelp(false)}
                aria-label="Close help"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="help-section">
                <h4>🎮 How to Play</h4>
                <ol className="help-steps">
                  <li><strong>Connect Wallet:</strong> Click the wallet button to connect your Web3 wallet</li>
                  <li><strong>Choose Option:</strong> Select 0, 1, or 2 for your prediction</li>
                  <li><strong>Enter Game:</strong> Click "Enter Game" or press Ctrl/Cmd + Enter</li>
                  <li><strong>Wait for Result:</strong> The smart contract will randomly select a winner</li>
                  <li><strong>Collect Rewards:</strong> Winners receive ETH from the prize pool</li>
                </ol>
              </div>

              <div className="help-section">
                <h4>💰 Staking & Rewards</h4>
                <ul className="help-list">
                  <li><strong>Staking:</strong> Deposit ETH to earn rewards over time</li>
                  <li><strong>Claim Rewards:</strong> Withdraw earned staking rewards</li>
                  <li><strong>Compounding:</strong> Reinvest rewards to earn more</li>
                  <li><strong>APY:</strong> Variable rates based on total staked amount</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>🏆 Achievements</h4>
                <ul className="help-list">
                  <li><strong>Streaks:</strong> Build winning streaks for bonus achievements</li>
                  <li><strong>Milestones:</strong> Reach game count and win rate goals</li>
                  <li><strong>Badges:</strong> Unlock special badges for accomplishments</li>
                  <li><strong>Progress:</strong> Track your achievements in the Achievements tab</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>⚙️ Features</h4>
                <ul className="help-list">
                  <li><strong>Dark/Light Theme:</strong> Toggle with 🌙 button or press 'T'</li>
                  <li><strong>Sound Effects:</strong> Enable/disable with 🔊 button or press 'S'</li>
                  <li><strong>Performance Chart:</strong> View your game history and statistics</li>
                  <li><strong>Settings:</strong> Customize your experience and accessibility options</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>🛠️ Troubleshooting</h4>
                <ul className="help-list">
                  <li><strong>Connection Issues:</strong> Refresh page and reconnect wallet</li>
                  <li><strong>Transaction Failed:</strong> Check ETH balance and network</li>
                  <li><strong>Slow Loading:</strong> Ensure stable internet connection</li>
                  <li><strong>Sound Not Working:</strong> Check browser audio permissions</li>
                </ul>
              </div>

              <div className="help-contact">
                <p style={{ margin: '16px 0 0 0', textAlign: 'center', opacity: 0.8 }}>
                  Need more help? Check the README.md or open an issue on GitHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="main-content">
      <section className="card" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Player Statistics</h2>
        <div className="grid" role="list">
          <div className="stat" role="listitem">
            <Tooltip content="Total number of game entries you've made">
              <div className="stat-label">Total Entries</div>
            </Tooltip>
            <div className="stat-value" aria-label={`Total entries: ${isLoadingStats ? 'Loading' : (playerEntries?.toString() || '0')}`}>
              {isLoadingStats ? <Loading /> : (playerEntries?.toString() || '0')}
            </div>
          </div>
          <div className="stat" role="listitem">
            <Tooltip content="Number of rounds you've won">
              <div className="stat-label">Wins</div>
            </Tooltip>
            <div className="stat-value" aria-label={`Wins: ${isLoadingStats ? 'Loading' : (playerWins?.toString() || '0')}`}>
              {isLoadingStats ? <Loading /> : (playerWins?.toString() || '0')}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="Your win rate percentage">
              <div className="stat-label">Win Rate</div>
            </Tooltip>
            <div className="stat-value">
              {isLoadingStats ? <Loading /> : winRate}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="Achievement badges you've earned">
              <div className="stat-label">Badges</div>
            </Tooltip>
            <div className="stat-value">
              {isLoadingStats ? <Loading /> : (badgeCount?.toString() || '0')}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="ETH amount staked in the reward vault">
              <div className="stat-label">Staked</div>
            </Tooltip>
            <div className="stat-value">
              {isLoadingStats ? <Loading /> : `${totalStaked.slice(0, 6)} ETH`}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="Pending rewards available to claim">
              <div className="stat-label">Pending Rewards</div>
            </Tooltip>
            <div className="stat-value">
              {isLoadingStats ? <Loading /> : `${pendingRewards.slice(0, 6)} ETH`}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="Current winning streak">
              <div className="stat-label">Current Streak</div>
            </Tooltip>
            <div className="stat-value" style={{ color: currentStreak > 0 ? '#4CAF50' : '#fff' }}>
              {currentStreak}
            </div>
          </div>
          <div className="stat">
            <Tooltip content="Best winning streak achieved">
              <div className="stat-label">Best Streak</div>
            </Tooltip>
            <div className="stat-value" style={{ color: '#FFD700' }}>
              {bestStreak}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            className="btn"
            onClick={() => setShowChart(!showChart)}
            style={{ fontSize: '14px', padding: '6px 12px' }}
            aria-expanded={showChart}
            aria-controls="performance-chart"
          >
            {showChart ? '📊 Hide Performance Chart' : '📈 Show Performance Chart'}
          </button>
        </div>
      </section>

      {/* Performance Chart */}
      {showChart && (
        <section className="card" aria-labelledby="chart-heading">
          <h3 id="chart-heading" style={{ marginBottom: '16px', color: '#fff' }}>
            Recent Game Performance
          </h3>
          <div className="chart-container">
            <svg
              width="100%"
              height="200"
              viewBox="0 0 400 200"
              role="img"
              aria-labelledby="chart-heading"
            >
              <title>Game results over the last 8 rounds</title>
              {gameHistory.map((game, index) => {
                const x = (index / (gameHistory.length - 1)) * 350 + 25
                const height = Math.abs(game.amount) * 10000 // Scale for visibility
                const y = game.result === 'win' ? 150 - height : 150
                const color = game.result === 'win' ? '#4CAF50' : '#f44336'

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width="20"
                    height={height}
                    fill={color}
                    rx="2"
                  >
                    <title>Round {game.round}: {game.result} ({game.amount} ETH)</title>
                  </rect>
                )
              })}
              {/* X-axis labels */}
              <text x="25" y="180" fill="#fff" fontSize="12">Round 1</text>
              <text x="200" y="180" fill="#fff" fontSize="12">Round {Math.floor(gameHistory.length / 2)}</text>
              <text x="375" y="180" fill="#fff" fontSize="12">Round {gameHistory.length}</text>

              {/* Legend */}
              <rect x="25" y="10" width="12" height="12" fill="#4CAF50" />
              <text x="42" y="20" fill="#fff" fontSize="12">Wins</text>
              <rect x="100" y="10" width="12" height="12" fill="#f44336" />
              <text x="117" y="20" fill="#fff" fontSize="12">Losses</text>
            </svg>
          </div>
          <div className="chart-stats" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <div className="chart-stat">
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                {gameHistory.filter(g => g.result === 'win').length}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Wins</div>
            </div>
            <div className="chart-stat">
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
                {gameHistory.filter(g => g.result === 'loss').length}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Losses</div>
            </div>
            <div className="chart-stat">
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
                {(gameHistory.reduce((sum, g) => sum + g.amount, 0) * 1000).toFixed(1)} ETH
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Net Profit</div>
            </div>
          </div>
        </section>
      )}

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
            🏆 Achievements
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

        {/* Achievements Tab UI */}
        {activeTab === 'badges' && (
          <div>
            <h2>Achievements & Milestones</h2>
            <p style={{opacity: 0.8, marginBottom: '24px'}}>
              Unlock achievements by reaching milestones and maintaining streaks!
            </p>

            {/* Achievement grid */}
            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="achievement-info">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="achievement-badge">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Streak information */}
            <div className="streak-info" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#FFD700' }}>🔥 Current Streak</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                You're on a {currentStreak} game winning streak! Keep it up to unlock the "Unstoppable" achievement.
              </p>
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
      </main>
    </div>
  )
}
