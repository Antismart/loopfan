'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Crown, Users, Zap, TrendingUp, Star, MapPin, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock creators data
const creators = [
  {
    id: 1,
    name: "Alex Chen",
    username: "@alexcreates",
    bio: "Digital artist creating unique NFT collections and interactive art experiences.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=200&fit=crop",
    walletAddress: "0x742d...8c4e",
    isVerified: true,
    category: "Art",
    location: "San Francisco, CA",
    joinDate: "2023-03-15",
    stats: {
      totalEarned: 45.7,
      supporters: 2543,
      posts: 127,
      monthlyRevenue: 12.3
    },
    membershipTiers: 4,
    trending: true
  },
  {
    id: 2,
    name: "Maya Rodriguez",
    username: "@mayamusic",
    bio: "Independent musician creating original compositions and teaching music production.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    walletAddress: "0x123a...9f2d",
    isVerified: true,
    category: "Music",
    location: "Austin, TX",
    joinDate: "2023-01-22",
    stats: {
      totalEarned: 32.1,
      supporters: 1876,
      posts: 94,
      monthlyRevenue: 8.7
    },
    membershipTiers: 3,
    trending: true
  },
  {
    id: 3,
    name: "CodeMaster",
    username: "@codemaster",
    bio: "Senior developer sharing coding tutorials, best practices, and career advice.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    walletAddress: "0x456b...7h8j",
    isVerified: false,
    category: "Tech",
    location: "Seattle, WA",
    joinDate: "2023-06-10",
    stats: {
      totalEarned: 18.9,
      supporters: 987,
      posts: 156,
      monthlyRevenue: 5.2
    },
    membershipTiers: 3,
    trending: false
  },
  {
    id: 4,
    name: "Fitness_Flora",
    username: "@fitness_flora",
    bio: "Certified personal trainer helping people achieve their fitness goals through sustainable habits.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    walletAddress: "0x789c...4k5m",
    isVerified: true,
    category: "Fitness",
    location: "Miami, FL",
    joinDate: "2023-04-05",
    stats: {
      totalEarned: 27.6,
      supporters: 1432,
      posts: 203,
      monthlyRevenue: 7.1
    },
    membershipTiers: 4,
    trending: false
  },
  {
    id: 5,
    name: "Chef_Antoine",
    username: "@chef_antoine",
    bio: "Professional chef sharing recipes, cooking techniques, and culinary culture.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
    walletAddress: "0x012d...8n9p",
    isVerified: true,
    category: "Food",
    location: "Paris, France",
    joinDate: "2023-02-18",
    stats: {
      totalEarned: 41.2,
      supporters: 2156,
      posts: 89,
      monthlyRevenue: 11.8
    },
    membershipTiers: 3,
    trending: true
  },
  {
    id: 6,
    name: "GamerGirl_Tech",
    username: "@gamergirl_tech",
    bio: "Gaming content creator and tech reviewer. Building the future of gaming communities.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
    walletAddress: "0x345e...1r2s",
    isVerified: false,
    category: "Gaming",
    location: "Tokyo, Japan",
    joinDate: "2023-05-12",
    stats: {
      totalEarned: 15.3,
      supporters: 743,
      posts: 178,
      monthlyRevenue: 4.9
    },
    membershipTiers: 2,
    trending: false
  }
]

const categories = ["All", "Art", "Music", "Tech", "Fitness", "Food", "Gaming", "Education", "Business"]

export default function Creators() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('trending')

  const filteredCreators = creators
    .filter(creator => 
      (selectedCategory === 'All' || creator.category === selectedCategory) &&
      (creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       creator.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'earnings':
          return b.stats.totalEarned - a.stats.totalEarned
        case 'supporters':
          return b.stats.supporters - a.stats.supporters
        case 'newest':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        default: // trending
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.stats.supporters - a.stats.supporters
      }
    })

  const CreatorCard = ({ creator }: { creator: typeof creators[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/creator/${creator.walletAddress}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
          {/* Cover Image */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <img 
              src={creator.cover} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {creator.trending && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          <CardHeader className="pb-2 relative -mt-8">
            <div className="flex items-start space-x-3">
              <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-gray-800">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 mt-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
                  {creator.isVerified && (
                    <Badge variant="default" className="bg-blue-500 text-white text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{creator.username}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {creator.category}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {creator.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">{creator.stats.totalEarned} ETH</div>
                <div className="text-gray-500">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{creator.stats.supporters.toLocaleString()}</div>
                <div className="text-gray-500">Supporters</div>
              </div>
            </div>

            {/* Location & Join Date */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{creator.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(creator.joinDate).getFullYear()}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Users className="h-4 w-4 mr-1" />
                Follow
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Zap className="h-4 w-4 mr-1" />
                Tip
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Amazing Creators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find and support talented creators earning directly from their community with zero middlemen
            </p>
          </motion.div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{creators.length}</div>
                <div className="text-sm text-gray-500">Active Creators</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {creators.reduce((sum, c) => sum + c.stats.totalEarned, 0).toFixed(1)} ETH
                </div>
                <div className="text-sm text-gray-500">Total Earned</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {creators.reduce((sum, c) => sum + c.stats.supporters, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Supporters</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">0%</div>
                <div className="text-sm text-gray-500">Platform Fees</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search creators by name, username, or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="trending">Trending</option>
                <option value="earnings">Top Earners</option>
                <option value="supporters">Most Supporters</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4 md:grid-cols-9 w-full">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        </div>

        {/* Creators Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CreatorCard creator={creator} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCreators.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No creators found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filters
            </p>
          </motion.div>
        )}

        {/* Load More */}
        {filteredCreators.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Creators
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
