'use client'

import { useEffect, useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACTS, GAME_POOL_ABI, REWARD_VAULT_ABI, ACHIEVEMENT_NFT_ABI, BADGE_TYPES } from '../lib/contracts'

export default function Home() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  
  const [selectedOption, setSelectedOption] = useState(0)
  const [multiCount, setMultiCount] = useState(1)
  const [stakeAmount, setStakeAmount] = useState('0.0001')
  const [activeTab, setActiveTab] = useState('game')

  // Read current round info
  const { data: roundInfo, refetch: refetchRound } = useReadContract({
    address: CONTRACTS.GAME_POOL,
    abi: GAME_POOL_ABI,
    functionName: 'getCurrentRoundInfo',
  })

  // Read player stats
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

  // Read stake info
  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: CONTRACTS.REWARD_VAULT,
    abi: REWARD_VAULT_ABI,
    functionName: 'getStakeInfo',
    args: [address],
  })

  // Read badge count
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
    }
  }, [isConfirmed])

  const enterGame = () => {
    writeContract({
      address: CONTRACTS.GAME_POOL,
      abi: GAME_POOL_ABI,
      functionName: 'enterGame',
      args: [selectedOption, '0x0000000000000000000000000000000000000000'],
      value: parseEther('0.0001'),
    })
  }

  const multiEntry = () => {
    writeContract({
      address: CONTRACTS.GAME_POOL,
      abi: GAME_POOL_ABI,
      functionName: 'multiEntry',
      args: [selectedOption, multiCount, '0x0000000000000000000000000000000000000000'],
      value: parseEther((0.0001 * multiCount).toString()),
    })
  }

  const stakeTokens = () => {
    writeContract({
      address: CONTRACTS.REWARD_VAULT,
      abi: REWARD_VAULT_ABI,
      functionName: 'stake',
      args: ['0x0000000000000000000000000000000000000000'],
      value: parseEther(stakeAmount),
    })
  }

  const claimRewards = () => {
    writeContract({
      address: CONTRACTS.REWARD_VAULT,
      abi: REWARD_VAULT_ABI,
      functionName: 'claimRewards',
    })
  }

  const compoundRewards = () => {
    writeContract({
      address: CONTRACTS.REWARD_VAULT,
      abi: REWARD_VAULT_ABI,
      functionName: 'compoundRewards',
    })
  }

  const claimBadge = (badgeType) => {
    writeContract({
      address: CONTRACTS.ACHIEVEMENT_NFT,
      abi: ACHIEVEMENT_NFT_ABI,
      functionName: 'claimBadge',
      args: [badgeType],
    })
  }

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
      <div className="header">
        <div className="logo">⚡ BaseRush Arena</div>
        <button className="btn" onClick={() => open()}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      </div>

      {/* Player Stats */}
      <div className="card">
        <div className="grid">
          <div className="stat">
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{playerEntries?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Wins</div>
            <div className="stat-value">{playerWins?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Badges</div>
            <div className="stat-value">{badgeCount?.toString() || '0'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Staked</div>
            <div className="stat-value">
              {stakeInfo ? formatEther(stakeInfo[0]).slice(0, 6) : '0'} ETH
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
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
        </div>

        {/* Game Tab */}
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

              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '16px'}}
                onClick={multiCount === 1 ? enterGame : multiEntry}
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : `Enter (${(0.0001 * multiCount).toFixed(4)} ETH)`}
              </button>
            </div>
          </div>
        )}

        {/* Stake Tab */}
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

            <div style={{marginTop: '24px'}}>
              <label>Stake Amount (ETH):</label>
              <input 
                type="text" 
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0001"
              />

              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '16px'}}
                onClick={stakeTokens}
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Stake'}
              </button>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px'}}>
                <button className="btn" onClick={claimRewards} disabled={isConfirming}>
                  Claim Rewards
                </button>
                <button className="btn" onClick={compoundRewards} disabled={isConfirming}>
                  Compound
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <h2>Achievement Badges</h2>
            <p style={{opacity: 0.8, marginBottom: '24px'}}>
              Collect badges by completing milestones!
            </p>

            <div style={{display: 'grid', gap: '12px'}}>
              {Object.entries(BADGE_TYPES).map(([name, id]) => (
                <div key={id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
                  <span>{name.replace(/_/g, ' ')}</span>
                  <button className="btn" onClick={() => claimBadge(id)} disabled={isConfirming}>
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
