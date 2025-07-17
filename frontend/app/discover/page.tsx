'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Users, Zap, Crown, Calendar, MapPin, Star, Filter, Eye, Heart, MessageCircle, Share2, DollarSign, Activity, Clock, Trophy, Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Mock live activity data
const liveActivity = [
  {
    id: 1,
    type: 'tip',
    user: 'CryptoFan123',
    creator: 'Alex Chen',
    amount: '0.05 ETH',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 2,
    type: 'membership',
    user: 'MusicLover99',
    creator: 'Maya Rodriguez',
    tier: 'Gold',
    timestamp: '5 min ago',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 3,
    type: 'content',
    creator: 'Chef Antoine',
    title: 'New recipe video uploaded',
    timestamp: '12 min ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 4,
    type: 'tip',
    user: 'DevGuru',
    creator: 'CodeMaster',
    amount: '0.02 ETH',
    timestamp: '15 min ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 5,
    type: 'reward',
    user: 'FitnessFan',
    creator: 'Fitness Flora',
    reward: 'Custom workout plan',
    timestamp: '23 min ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
  }
]

// Mock trending posts
const trendingPosts = [
  {
    id: 1,
    creator: {
      name: "Alex Chen",
      username: "@alexcreates",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
      isVerified: true
    },
    content: "Just dropped my latest NFT collection! The community response has been incredible 🎨✨",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
    stats: {
      likes: 342,
      comments: 28,
      tips: 12.5,
      shares: 15,
      views: 2890
    },
    timestamp: "2h ago",
    trending: true
  },
  {
    id: 2,
    creator: {
      name: "Maya Rodriguez",
      username: "@mayamusic",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face",
      isVerified: true
    },
    content: "🎵 Behind the scenes of my latest track production. Thank you to all my supporters making this possible! 🎶",
    stats: {
      likes: 189,
      comments: 45,
      tips: 8.2,
      shares: 23,
      views: 1567
    },
    timestamp: "4h ago",
    trending: true
  },
  {
    id: 3,
    creator: {
      name: "Chef Antoine",
      username: "@chef_antoine",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      isVerified: true
    },
    content: "Today's special: French onion soup with a modern twist! Recipe video coming soon for my supporters 🍳",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
    stats: {
      likes: 267,
      comments: 34,
      tips: 6.8,
      shares: 12,
      views: 1834
    },
    timestamp: "6h ago",
    trending: false
  }
]

// Platform stats
const platformStats = {
  totalTipsToday: "234.7 ETH",
  newMembershipsToday: 147,
  activeCreatorsToday: 89,
  totalRewardsRedeemed: 23
}

// Trending categories
const trendingCategories = [
  { name: "Art", growth: "+45%", posts: 234, icon: "🎨" },
  { name: "Music", growth: "+38%", posts: 189, icon: "🎵" },
  { name: "Tech", growth: "+67%", posts: 156, icon: "💻" },
  { name: "Food", growth: "+41%", posts: 98, icon: "🍳" },
  { name: "Fitness", growth: "+52%", posts: 87, icon: "💪" },
  { name: "Gaming", growth: "+78%", posts: 76, icon: "🎮" }
]

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('')

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Zap className="h-4 w-4 text-green-500" />
      case 'membership': return <Crown className="h-4 w-4 text-purple-500" />
      case 'content': return <Eye className="h-4 w-4 text-blue-500" />
      case 'reward': return <Trophy className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'tip':
        return (
          <span>
            <strong>{activity.user}</strong> tipped <strong>{activity.creator}</strong> {activity.amount}
          </span>
        )
      case 'membership':
        return (
          <span>
            <strong>{activity.user}</strong> became a {activity.tier} member of <strong>{activity.creator}</strong>
          </span>
        )
      case 'content':
        return (
          <span>
            <strong>{activity.creator}</strong> {activity.title}
          </span>
        )
      case 'reward':
        return (
          <span>
            <strong>{activity.user}</strong> redeemed "{activity.reward}" from <strong>{activity.creator}</strong>
          </span>
        )
      default:
        return <span>Unknown activity</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What's Happening Now
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Live activity, trending content, and the pulse of the creator economy
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search trending content, creators, or topics..."
              className="pl-12 py-4 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{platformStats.totalTipsToday}</div>
              <div className="text-green-100 text-sm">Tips Today</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{platformStats.newMembershipsToday}</div>
              <div className="text-purple-100 text-sm">New Members</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{platformStats.activeCreatorsToday}</div>
              <div className="text-blue-100 text-sm">Active Creators</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{platformStats.totalRewardsRedeemed}</div>
              <div className="text-yellow-100 text-sm">Rewards Redeemed</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Activity className="h-5 w-5 text-green-500" />
                  <h2 className="text-xl font-bold">Live Activity</h2>
                  <Badge className="bg-green-500 text-white animate-pulse">
                    Live
                  </Badge>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {liveActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {getActivityText(activity)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Trending Categories */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Flame className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-bold">Trending Categories</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link href={`/creators?category=${category.name}`}>
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer text-center group">
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <h3 className="font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.posts} posts today
                          </p>
                          <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
                            {category.growth}
                          </Badge>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Posts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-bold">Trending Posts</h2>
                  </div>
                  <Link href="/feed">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="space-y-6">
                  {trendingPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
                          <AvatarFallback>{post.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{post.creator.name}</h4>
                            {post.creator.isVerified && (
                              <Badge className="bg-blue-500 text-white text-xs">✓</Badge>
                            )}
                            <span className="text-sm text-gray-500">{post.creator.username}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{post.timestamp}</span>
                            {post.trending && (
                              <Badge className="bg-red-500 text-white text-xs">
                                <Flame className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt="Post content"
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.stats.likes}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.stats.comments}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Zap className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-semibold">{post.stats.tips} ETH</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.stats.views.toLocaleString()}</span>
                              </span>
                            </div>
                            <span>{post.stats.shares} shares</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Join the Action?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Discover amazing creators, join exclusive communities, and be part of the creator economy revolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/creators">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Users className="h-5 w-5 mr-2" />
                    Browse All Creators
                  </Button>
                </Link>
                <Link href="/feed">
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30">
                    <Activity className="h-5 w-5 mr-2" />
                    Join the Feed
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'art', name: 'Art' },
  { id: 'music', name: 'Music' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'tech', name: 'Tech' },
  { id: 'fitness', name: 'Fitness' },
]

const featuredCreators = [
  {
    id: 1,
    name: "Alex Rivera",
    category: "Digital Artist",
    description: "Creating stunning NFT art and exclusive digital collectibles. Join for early access to drops and behind-the-scenes content.",
    followers: "2.3K",
    tips: "156",
    members: "89",
    minTier: "0.02 ETH"
  },
  {
    id: 2,
    name: "Sarah Chen",
    category: "Music Producer",
    description: "Electronic music producer sharing exclusive tracks, stems, and production tutorials with my community.",
    followers: "4.1K",
    tips: "203",
    members: "142",
    minTier: "0.05 ETH"
  },
  {
    id: 3,
    name: "GameDev Mike",
    category: "Game Developer",
    description: "Indie game developer creating unique experiences. Get early access to games and development insights.",
    followers: "1.8K",
    tips: "98",
    members: "67",
    minTier: "0.03 ETH"
  }
]

const trendingCreators = [
  {
    id: 4,
    name: "CryptoChef",
    category: "Food & Crypto",
    growth: 45,
    newMembers: 23
  },
  {
    id: 5,
    name: "BaseBuilder",
    category: "Web3 Education",
    growth: 38,
    newMembers: 31
  },
  {
    id: 6,
    name: "NFT Photographer",
    category: "Photography",
    growth: 52,
    newMembers: 18
  },
  {
    id: 7,
    name: "DeFi Analyst",
    category: "Finance",
    growth: 41,
    newMembers: 27
  }
]
