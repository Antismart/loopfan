'use client'

import { useAccount, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Gift, 
  Zap, 
  Upload, 
  Settings,
  Eye,
  Heart,
  Star,
  ArrowUpRight,
  Wallet
} from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    chainId: base.id,
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950 flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl max-w-md mx-auto"
          >
            <Wallet className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Connect Your Creator Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet to access your creator dashboard and start earning directly from fans.
            </p>
            <ConnectButton />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950 pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Creator Wallet</h1>
                <p className="text-blue-100">
                  Welcome back! You're earning with <strong>0% platform fees</strong> 🎉
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">Total Balance</div>
                <div className="text-2xl font-bold">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm flex items-center ${stat.changeColor}`}>
                    {stat.change > 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : null}
                    {stat.change > 0 ? '+' : ''}{stat.change}% from last week
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left group"
                  >
                    <action.icon className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{action.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Tips</h3>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {tip.fan.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{tip.fan}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tip.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">+{tip.amount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tip.usd}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Membership & Rewards */}
          <div className="space-y-8">
            {/* Membership Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Membership Tiers</h3>
                <button className="text-blue-500 hover:text-blue-600">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {membershipTiers.map((tier, index) => (
                  <div
                    key={tier.name}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{tier.name}</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {tier.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {tier.members} members
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {tier.revenue}/month
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fan Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Fan Rewards</h3>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  Create New
                </button>
              </div>
              <div className="space-y-3">
                {fanRewards.map((reward, index) => (
                  <div
                    key={reward.name}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{reward.name}</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">
                        {reward.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reward.claimed} claimed</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

const stats = [
  {
    title: "Total Earnings",
    value: "$2,845.67",
    change: 12.5,
    changeColor: "text-green-500",
    icon: DollarSign,
    bgColor: "bg-green-500"
  },
  {
    title: "Active Members",
    value: "142",
    change: 8.2,
    changeColor: "text-green-500",
    icon: Users,
    bgColor: "bg-blue-500"
  },
  {
    title: "Tips This Week",
    value: "23",
    change: 15.8,
    changeColor: "text-green-500",
    icon: Heart,
    bgColor: "bg-pink-500"
  },
  {
    title: "Content Views",
    value: "1,203",
    change: 5.4,
    changeColor: "text-green-500",
    icon: Eye,
    bgColor: "bg-purple-500"
  }
]

const quickActions = [
  {
    title: "Upload Content",
    description: "Share exclusive content with your fans",
    icon: Upload
  },
  {
    title: "Create Tier",
    description: "Set up new membership levels",
    icon: Star
  },
  {
    title: "Launch Drop",
    description: "Release limited NFT collection",
    icon: Gift
  },
  {
    title: "Add Reward",
    description: "Create new fan incentives",
    icon: Zap
  }
]

const recentTips = [
  {
    fan: "CryptoFan.eth",
    amount: "0.1 ETH",
    usd: "$245.30",
    time: "2 minutes ago"
  },
  {
    fan: "SupporterDAO",
    amount: "50 USDC",
    usd: "$50.00",
    time: "1 hour ago"
  },
  {
    fan: "BaseBuilder",
    amount: "0.05 ETH",
    usd: "$122.65",
    time: "3 hours ago"
  }
]

const membershipTiers = [
  {
    name: "Gold Supporter",
    price: "0.1 ETH/month",
    members: 45,
    revenue: "$1,103.50"
  },
  {
    name: "Silver Fan",
    price: "0.05 ETH/month",
    members: 67,
    revenue: "$823.25"
  },
  {
    name: "Bronze Member",
    price: "0.02 ETH/month",
    members: 98,
    revenue: "$480.60"
  }
]

const fanRewards = [
  {
    name: "Exclusive Discord",
    points: 100,
    claimed: "23 times"
  },
  {
    name: "1-on-1 Call",
    points: 500,
    claimed: "5 times"
  },
  {
    name: "Custom Shoutout",
    points: 200,
    claimed: "18 times"
  }
]
