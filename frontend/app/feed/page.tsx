'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, DollarSign, Gift, Users, Zap, MoreHorizontal, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Mock data for social feed
const feedPosts = [
  {
    id: 1,
    creator: {
      name: "Alex Chen",
      username: "@alexcreates",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
      membershipTier: "Gold",
      walletAddress: "0x742d...8c4e"
    },
    content: {
      text: "Just dropped my latest NFT collection! 🎨 Thank you to all my supporters who made this possible. Every tip and membership helps me create more amazing art for our community! 💜",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=300&fit=crop",
      type: "post"
    },
    stats: {
      likes: 342,
      comments: 28,
      tips: 12.5, // ETH
      shares: 15
    },
    timestamp: "2h ago",
    isLiked: false,
    hasTipped: false
  },
  {
    id: 2,
    creator: {
      name: "Maya Rodriguez",
      username: "@mayamusic",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
      membershipTier: "Platinum",
      walletAddress: "0x123a...9f2d"
    },
    content: {
      text: "🎵 Exclusive track preview for my Gold+ members! This wouldn't be possible without your direct support. No record labels, no middlemen - just pure music connection! 🎶",
      type: "gated",
      requiresTier: "Gold"
    },
    stats: {
      likes: 189,
      comments: 45,
      tips: 8.2,
      shares: 23
    },
    timestamp: "4h ago",
    isLiked: true,
    hasTipped: true
  },
  {
    id: 3,
    creator: {
      name: "CodeMaster",
      username: "@codemaster",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      isVerified: false,
      membershipTier: "Silver",
      walletAddress: "0x456b...7h8j"
    },
    content: {
      text: "Sharing my latest coding tutorial series! 💻 Thanks to everyone who tips and supports - it helps me dedicate more time to creating quality educational content for our dev community!",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
      type: "post"
    },
    stats: {
      likes: 156,
      comments: 19,
      tips: 3.7,
      shares: 8
    },
    timestamp: "6h ago",
    isLiked: false,
    hasTipped: false
  }
]

export default function Feed() {
  const [tipAmounts, setTipAmounts] = useState<{[key: number]: string}>({})

  const handleTip = (postId: number) => {
    const amount = tipAmounts[postId] || '0.01'
    console.log(`Tipping ${amount} ETH to post ${postId}`)
    // Implement actual tipping logic here
  }

  const PostCard = ({ post }: { post: typeof feedPosts[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100 dark:ring-blue-900">
                <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
                <AvatarFallback>{post.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{post.creator.name}</h3>
                  {post.creator.isVerified && (
                    <Badge variant="default" className="bg-blue-500 text-white text-xs">
                      ✓
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {post.creator.membershipTier}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.creator.username}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">{post.creator.walletAddress}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
              {post.content.text}
            </p>
            
            {post.content.type === 'gated' ? (
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-6 text-center border-2 border-dashed border-purple-300 dark:border-purple-700">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Exclusive Content for {post.content.requiresTier}+ Members
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Support this creator to unlock premium content
                      </p>
                      <div className="flex space-x-2 justify-center">
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          <Users className="h-4 w-4 mr-2" />
                          Become Member
                        </Button>
                        <Button variant="outline" size="sm">
                          <DollarSign className="h-4 w-4 mr-2" />
                          One-time Access
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : post.content.image && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={post.content.image} 
                  alt="Post content" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex space-x-4">
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
            </div>
            <span>{post.stats.shares} shares</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Button 
                variant={post.isLiked ? "default" : "ghost"} 
                size="sm"
                className={post.isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                Like
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {/* Tip Section */}
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0.01"
                className="w-20 h-8 text-sm"
                value={tipAmounts[post.id] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTipAmounts(prev => ({...prev, [post.id]: e.target.value}))}
              />
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleTip(post.id)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Tip ETH
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Creator Social Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Support your favorite creators directly with tips and engagement
              </p>
            </motion.div>
          </div>

          {/* Create Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      placeholder="Share something with your supporters..."
                      className="border-0 bg-gray-50 dark:bg-gray-800 mb-3"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Gift className="h-4 w-4 mr-1" />
                          Premium
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Members Only
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feed Posts */}
          <div>
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Button variant="outline" className="w-full">
              Load More Posts
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
