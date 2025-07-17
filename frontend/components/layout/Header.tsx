'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Wallet className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LoopFan
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/creators" 
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>For Creators</span>
          </Link>
          <Link 
            href="/fans" 
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>For Fans</span>
          </Link>
          <Link 
            href="/discover" 
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Discover</span>
          </Link>
        </nav>

        {/* Connect Wallet */}
        <ConnectButton />
      </div>
    </header>
  )
}
