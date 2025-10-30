import React, { useState, useEffect } from 'react';
import { Wallet, Zap, TrendingUp, DollarSign, Wifi, Activity, Globe, Download } from 'lucide-react';

export default function BandwidthBazaar() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [stats, setStats] = useState({
    bandwidthShared: 0,
    tokensEarned: 0,
    usdcValue: 0,
    activeTime: 0,
    dailyAverage: 0
  });

  // Simulate bandwidth contribution
  useEffect(() => {
    let interval;
    if (isContributing) {
      interval = setInterval(() => {
        setStats(prev => {
          const newBandwidth = prev.bandwidthShared + Math.random() * 0.5;
          const newTokens = prev.tokensEarned + Math.random() * 0.02;
          return {
            ...prev,
            bandwidthShared: newBandwidth,
            tokensEarned: newTokens,
            usdcValue: newTokens * 0.95,
            activeTime: prev.activeTime + 1,
            dailyAverage: (newBandwidth / (prev.activeTime + 1)) * 86400
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContributing]);

  const connectWallet = async () => {
    // Simulate wallet connection
    const mockAddress = '7xKX' + Math.random().toString(36).substring(2, 15).toUpperCase();
    setWalletAddress(mockAddress);
    setConnected(true);
  };

  const toggleContribution = () => {
    setIsContributing(!isContributing);
  };

  const claimRewards = () => {
    if (stats.tokensEarned > 0) {
      alert(`🎉 Success! Claimed ${stats.usdcValue.toFixed(4)} USDC!\n\nIn production, this would:\n• Create Solana transaction\n• Transfer USDC from treasury\n• Update on-chain balance`);
      setStats(prev => ({ ...prev, tokensEarned: 0, usdcValue: 0 }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BandwidthBazaar</h1>
              <p className="text-xs text-gray-400">Powered by Solana</p>
            </div>
          </div>
          
          {!connected ? (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono">{walletAddress}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!connected ? (
          <div className="text-center py-20">
            <Globe className="w-24 h-24 mx-auto mb-6 text-cyan-400" />
            <h2 className="text-4xl font-bold mb-4">Turn Your Idle Bandwidth Into Cash</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the decentralized data collection network. Share unused internet bandwidth and earn USDC passively while training the next generation of AI.
            </p>
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
            >
              Get Started →
            </button>
            
            <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Instant Setup</h3>
                <p className="text-gray-400 text-sm">Connect wallet and start earning in under 60 seconds</p>
              </div>
              <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Passive Income</h3>
                <p className="text-gray-400 text-sm">Earn $50-200/month based on bandwidth contribution</p>
              </div>
              <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <DollarSign className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">USDC Payments</h3>
                <p className="text-gray-400 text-sm">Withdraw earnings anytime to your Solana wallet</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur p-6 rounded-xl border border-cyan-500/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-300 text-sm">Bandwidth Shared</span>
                  <Download className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold">{stats.bandwidthShared.toFixed(2)} GB</p>
                <p className="text-xs text-gray-400 mt-1">{stats.dailyAverage.toFixed(1)} GB/day avg</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur p-6 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-300 text-sm">Tokens Earned</span>
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold">{stats.tokensEarned.toFixed(4)} BW</p>
                <p className="text-xs text-gray-400 mt-1">BandwidthBazaar Token</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur p-6 rounded-xl border border-purple-500/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-300 text-sm">USDC Value</span>
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold">${stats.usdcValue.toFixed(4)}</p>
                <p className="text-xs text-gray-400 mt-1">Ready to claim</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur p-6 rounded-xl border border-yellow-500/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-300 text-sm">Active Time</span>
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold">{Math.floor(stats.activeTime / 60)}:{(stats.activeTime % 60).toString().padStart(2, '0')}</p>
                <p className="text-xs text-gray-400 mt-1">Minutes online</p>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Contribution Status</h2>
                  <p className="text-gray-400">
                    {isContributing 
                      ? '🟢 Your bandwidth is being used for AI training data collection' 
                      : '⚪ Contribution paused - click Start to resume earning'}
                  </p>
                </div>
                <button
                  onClick={toggleContribution}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    isContributing
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg hover:shadow-red-500/50'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50'
                  }`}
                >
                  {isContributing ? 'Pause' : 'Start'} Contributing
                </button>
              </div>

              {isContributing && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Live Data Stream Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Current Rate:</span>
                      <p className="font-bold text-cyan-400">{(Math.random() * 2 + 1).toFixed(2)} Mbps</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Data Type:</span>
                      <p className="font-bold text-cyan-400">Web Scraping</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Client:</span>
                      <p className="font-bold text-cyan-400">AI Training Co.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Claim Rewards */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur rounded-xl border border-purple-500/30 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Earnings</h3>
                  <p className="text-gray-400 mb-4">
                    Convert your BW tokens to USDC and withdraw to your wallet
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      ${stats.usdcValue.toFixed(4)}
                    </span>
                    <span className="text-gray-400">USDC available</span>
                  </div>
                </div>
                <button
                  onClick={claimRewards}
                  disabled={stats.tokensEarned === 0}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    stats.tokensEarned > 0
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50'
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  Claim Rewards
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  How It Works
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Your unused bandwidth helps AI companies collect training data</li>
                  <li>✓ All traffic is encrypted and privacy-preserving</li>
                  <li>✓ Earn BW tokens automatically based on GB contributed</li>
                  <li>✓ Exchange tokens for USDC at any time (1 BW ≈ $0.95)</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Earning Potential
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Light usage (10 GB/day):</span>
                    <span className="font-bold text-green-400">~$50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Medium usage (50 GB/day):</span>
                    <span className="font-bold text-green-400">~$125/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Heavy usage (150 GB/day):</span>
                    <span className="font-bold text-green-400">~$200/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>Built on Solana • Superteam Pakistan Hackathon MVP • For demonstration purposes</p>
          <p className="mt-2">In production: Integrate with @solana/wallet-adapter, Helius RPC, and USDC token program</p>
        </div>
      </footer>
    </div>
  );
          }
