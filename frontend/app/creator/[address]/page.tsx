'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, DollarSign, Gift, Users, Zap, Crown, Star, Trophy, Calendar, MapPin, Link as LinkIcon, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock creator data
const creator = {
  name: "Alex Chen",
  username: "@alexcreates",
  bio: "Digital artist creating unique NFT collections and teaching creative coding. Supported by an amazing community of 2.5K fans! 🎨✨",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  cover: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=300&fit=crop",
  walletAddress: "0x742d35e6c2d8b6c3f1d9a8e4b5c7f8d9e0f1a2b3c4d5e6f7",
  isVerified: true,
  joinDate: "2023-03-15",
  location: "San Francisco, CA",
  website: "alexchen.art",
  stats: {
    totalEarned: 45.7, // ETH
    supporters: 2543,
    posts: 127,
    membershipRevenue: 23.2 // ETH monthly
  },
  membershipTiers: [
    {
      id: 1,
      name: "Bronze Supporter",
      price: 0.01, // ETH/month
      benefits: ["Access to community chat", "Weekly updates", "Bronze badge"],
      members: 1200,
      color: "bg-amber-500"
    },
    {
      id: 2,
      name: "Silver Creator",
      price: 0.05, // ETH/month
      benefits: ["All Bronze benefits", "Monthly video calls", "Early access to drops", "Silver badge"],
      members: 850,
      color: "bg-gray-400"
    },
    {
      id: 3,
      name: "Gold Patron",
      price: 0.1, // ETH/month
      benefits: ["All Silver benefits", "1-on-1 mentoring session", "Custom artwork", "Gold badge"],
      members: 350,
      color: "bg-yellow-500"
    },
    {
      id: 4,
      name: "Platinum Elite",
      price: 0.25, // ETH/month
      benefits: ["All Gold benefits", "Co-creation opportunities", "Revenue sharing", "Platinum badge"],
      members: 143,
      color: "bg-purple-500"
    }
  ],
  recentPosts: [
    {
      id: 1,
      content: "Just finished my latest piece! The community feedback has been incredible 🎨",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
      likes: 234,
      tips: 2.3,
      timestamp: "2h ago"
    },
    {
      id: 2,
      content: "Thank you all for the amazing support! Hit my monthly goal already 💜",
      likes: 189,
      tips: 1.8,
      timestamp: "1d ago"
    }
  ]
}

export default function CreatorProfile() {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [tipAmount, setTipAmount] = useState('')

  const copyAddress = () => {
    navigator.clipboard.writeText(creator.walletAddress)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleTip = () => {
    console.log(`Tipping ${tipAmount} ETH to ${creator.name}`)
    // Implement actual tipping logic
  }

  const handleSubscribe = (tierId: number) => {
    console.log(`Subscribing to tier ${tierId}`)
    // Implement subscription logic
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80">
        <img 
          src={creator.cover} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-2xl">{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{creator.name}</h1>
                  {creator.isVerified && (
                    <Badge className="bg-blue-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Verified Creator
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">{creator.username}</p>
                
                {/* Wallet Address */}
                <div className="flex items-center space-x-2 mb-4">
                  <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono">
                    {creator.walletAddress.slice(0, 10)}...{creator.walletAddress.slice(-8)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-8 w-8 p-0"
                  >
                    {copiedAddress ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{creator.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(creator.joinDate).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={`https://${creator.website}`} className="text-blue-500 hover:underline">{creator.website}</a>
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col space-y-2 w-full sm:w-auto">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="0.01"
                    className="w-24"
                    value={tipAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTipAmount(e.target.value)}
                  />
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleTip}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Tip ETH
                  </Button>
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Become Member
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{creator.stats.totalEarned} ETH</div>
                <div className="text-sm text-gray-500">Total Earned</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{creator.stats.supporters.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Supporters</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{creator.stats.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{creator.stats.membershipRevenue} ETH</div>
                <div className="text-sm text-gray-500">Monthly Revenue</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="memberships">Memberships</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-4">
                {creator.recentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post" 
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex space-x-4">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">{post.tips} ETH</span>
                            </span>
                          </div>
                          <span>{post.timestamp}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="memberships" className="space-y-4">
                <div className="grid gap-4">
                  {creator.membershipTiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-2 ${selectedTier === tier.id ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${tier.color}`} />
                              <CardTitle className="text-xl">{tier.name}</CardTitle>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{tier.price} ETH</div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {tier.members.toLocaleString()} members
                            </p>
                            <ul className="space-y-1">
                              {tier.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm flex items-center space-x-2">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => handleSubscribe(tier.id)}
                          >
                            Subscribe Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="rewards" className="space-y-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Exclusive Rewards Coming Soon!</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This creator is setting up amazing rewards for supporters. 
                      Become a member to be the first to know!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
