'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, Home, Search, Users, Bell, Menu, X, Zap, TrendingUp, DollarSign, Crown } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navigation = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'Creators', href: '/creators', icon: Users },
  { name: 'Rewards', href: '/rewards', icon: Zap },
]

const stats = {
  totalTips: "1,234 ETH",
  activeCreators: "12.5K",
  totalMembers: "45.2K"
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl"
            >
              <Wallet className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LoopFan
              </h1>
              <p className="text-xs text-gray-500">Creator Wallet</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Platform Stats */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-600">{stats.totalTips}</span>
              <span className="text-gray-500">tipped</span>
            </div>
            <div className="flex items-center space-x-1">
              <Crown className="h-4 w-4 text-purple-500" />
              <span className="font-semibold">{stats.activeCreators}</span>
              <span className="text-gray-500">creators</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{stats.totalMembers}</span>
              <span className="text-gray-500">fans</span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white">
                3
              </Badge>
            </Button>

            {/* Connect Wallet */}
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted
                const connected = ready && account && chain

                return (
                  <div>
                    {(() => {
                      if (!ready) {
                        return null
                      }

                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal} 
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Connect Wallet
                          </Button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <Button 
                            onClick={openChainModal} 
                            variant="destructive"
                          >
                            Wrong network
                          </Button>
                        )
                      }

                      return (
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </Button>
                          
                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            className="flex items-center space-x-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {account.displayName?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:block">{account.displayName}</span>
                          </Button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
            
            {/* Mobile stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-green-600">{stats.totalTips}</div>
                  <div className="text-xs text-gray-500">Tipped</div>
                </div>
                <div>
                  <div className="font-semibold">{stats.activeCreators}</div>
                  <div className="text-xs text-gray-500">Creators</div>
                </div>
                <div>
                  <div className="font-semibold">{stats.totalMembers}</div>
                  <div className="text-xs text-gray-500">Fans</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
