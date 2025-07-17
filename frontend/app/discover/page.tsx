'use client'

import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Users, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Creators
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Support creators directly with zero middlemen. Find exclusive content, 
            join memberships, and be part of creator communities.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search creators, categories, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Creators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{creator.name}</h3>
                    <p className="text-blue-100">{creator.category}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
                      <Users className="h-4 w-4" />
                      <span>{creator.followers}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {creator.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{creator.tips}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{creator.members}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {creator.minTier}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/creator/${creator.id}`}
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 group-hover:scale-105"
                  >
                    Support Creator
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{creator.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    +{creator.growth}% growth
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {creator.newMembers} new members
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
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
