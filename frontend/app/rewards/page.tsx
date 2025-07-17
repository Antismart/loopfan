'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Gift, Zap, Crown, Target, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock rewards data
const userPoints = {
  total: 2450,
  thisMonth: 320,
  rank: 47,
  nextMilestone: 3000
}

const availableRewards = [
  {
    id: 1,
    title: "Exclusive Art Print",
    description: "Limited edition signed print from Alex Chen's latest collection",
    cost: 500,
    creator: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face"
    },
    category: "Physical",
    available: 25,
    claimed: 12,
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    title: "1-on-1 Mentoring Session",
    description: "30-minute personal coaching session with Maya Rodriguez",
    cost: 1000,
    creator: {
      name: "Maya Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face"
    },
    category: "Experience",
    available: 5,
    claimed: 2,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Early Access NFT Drop",
    description: "Get first access to CodeMaster's exclusive coding NFT collection",
    cost: 750,
    creator: {
      name: "CodeMaster",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    category: "Digital",
    available: 50,
    claimed: 28,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Custom Recipe Video",
    description: "Chef Antoine creates a personalized cooking video just for you",
    cost: 1200,
    creator: {
      name: "Chef Antoine",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    category: "Experience",
    available: 10,
    claimed: 3,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Fitness Plan + Live Session",
    description: "Personalized workout plan with live training session from Fitness Flora",
    cost: 800,
    creator: {
      name: "Fitness Flora",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    category: "Experience",
    available: 15,
    claimed: 7,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Gaming Setup Consultation",
    description: "Get expert advice on your gaming setup from GamerGirl Tech",
    cost: 600,
    creator: {
      name: "GamerGirl Tech",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face"
    },
    category: "Experience",
    available: 20,
    claimed: 9,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
  }
]

const rewardHistory = [
  {
    id: 1,
    title: "Digital Art Collection",
    creator: "Alex Chen",
    points: 400,
    date: "2024-01-15",
    status: "delivered"
  },
  {
    id: 2,
    title: "Music Production Tips",
    creator: "Maya Rodriguez",
    points: 300,
    date: "2024-01-10",
    status: "pending"
  },
  {
    id: 3,
    title: "Coding Bootcamp Access",
    creator: "CodeMaster",
    points: 650,
    date: "2024-01-05",
    status: "delivered"
  }
]

const pointsEarningTips = [
  {
    action: "Daily tip to creators",
    points: "10-50 points",
    icon: Zap
  },
  {
    action: "Share creator content",
    points: "5-15 points",
    icon: ArrowRight
  },
  {
    action: "Become a new member",
    points: "100-500 points",
    icon: Crown
  },
  {
    action: "Refer new supporters",
    points: "50-200 points",
    icon: Users
  },
  {
    action: "Engage with posts",
    points: "2-10 points",
    icon: Star
  }
]

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Physical', 'Digital', 'Experience']
  
  const filteredRewards = selectedCategory === 'All' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory)

  const handleRedeem = (rewardId: number, cost: number) => {
    if (userPoints.total >= cost) {
      console.log(`Redeeming reward ${rewardId} for ${cost} points`)
      // Implement redemption logic
    }
  }

  const RewardCard = ({ reward }: { reward: typeof availableRewards[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img 
            src={reward.image} 
            alt={reward.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {reward.category}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-white">
              <Trophy className="h-3 w-3 mr-1" />
              {reward.cost} pts
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={reward.creator.avatar} alt={reward.creator.name} />
              <AvatarFallback className="text-xs">{reward.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{reward.creator.name}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2">{reward.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {reward.description}
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              {reward.available - reward.claimed} of {reward.available} available
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(reward.claimed / reward.available) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full"
            disabled={userPoints.total < reward.cost || reward.claimed >= reward.available}
            onClick={() => handleRedeem(reward.id, reward.cost)}
          >
            {userPoints.total < reward.cost ? 'Insufficient Points' : 
             reward.claimed >= reward.available ? 'Sold Out' : 'Redeem Now'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Creator Rewards Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Earn points by supporting creators and redeem exclusive rewards from your favorite community
          </p>
        </motion.div>

        {/* Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{userPoints.total.toLocaleString()}</div>
              <div className="text-yellow-100">Total Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">+{userPoints.thisMonth}</div>
              <div className="text-sm text-gray-500">This Month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">#{userPoints.rank}</div>
              <div className="text-sm text-gray-500">Global Rank</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{userPoints.nextMilestone}</div>
              <div className="text-sm text-gray-500">Next Milestone</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress to Next Milestone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Progress to Next Milestone</h3>
                <Badge className="bg-purple-500 text-white">
                  <Target className="h-3 w-3 mr-1" />
                  {userPoints.nextMilestone - userPoints.total} points to go
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(userPoints.total / userPoints.nextMilestone) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 points</span>
                <span>{userPoints.nextMilestone} points</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="history">My Rewards</TabsTrigger>
              <TabsTrigger value="earn">Earn Points</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rewards" className="space-y-6">
              {/* Category Filter */}
              <div className="flex space-x-2 justify-center">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RewardCard reward={reward} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-4">
                {rewardHistory.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{reward.title}</h4>
                            <p className="text-sm text-gray-500">by {reward.creator}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(reward.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{reward.points} points</div>
                            <Badge 
                              variant={reward.status === 'delivered' ? 'default' : 'secondary'}
                              className={reward.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'}
                            >
                              {reward.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="earn" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span>Ways to Earn Points</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pointsEarningTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <tip.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">{tip.action}</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {tip.points}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-20 flex-col space-y-2">
                      <Zap className="h-6 w-6" />
                      <span>Tip a Creator</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Users className="h-6 w-6" />
                      <span>Invite Friends</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
