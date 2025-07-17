'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Wallet, Zap, Shield, TrendingUp, Users, Gift, DollarSign, Globe, Lock, Heart, MessageCircle, Share2, Home } from 'lucide-react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-8"
            >
              <Wallet className="h-4 w-4" />
              <span>The Web3 Social Platform for Creators</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="block">The Social Platform</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent">
                Where Creators Earn
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-600 dark:text-gray-400 mt-4">
                Directly from Fans
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
            >
              Join the first social platform where creators have their own wallet profiles, 
              fans support directly through tips and memberships, and everyone earns together. 
              <strong>No middlemen. No algorithm controlling your reach. Just pure connection.</strong>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                            >
                              <Wallet className="h-5 w-5" />
                              <span>Launch Your Creator Wallet</span>
                              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )
                        }

                        return (
                          <Link
                            href="/dashboard"
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                          >
                            <TrendingUp className="h-5 w-5" />
                            <span>Open Dashboard</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>

              <Link
                href="/feed"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Explore Social Feed</span>
              </Link>
            </motion.div>

            {/* Platform Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mx-auto max-w-4xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">15-30%</div>
                  <div className="text-gray-600 dark:text-gray-400">Traditional Platform Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">VS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">0%</div>
                  <div className="text-gray-600 dark:text-gray-400">LoopFan Platform Fees</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Creators Choose LoopFan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The only platform that puts creators first — with true ownership, instant payments, and zero middlemen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Direct, Profitable
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three steps to start earning 100% of your fan support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Own Your Creator Economy?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the revolution. Keep 100% of your earnings. Control your audience. Build your empire.
            </p>
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted
                const connected = ready && account && chain

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                          >
                            <Wallet className="h-5 w-5" />
                            <span>Connect Wallet & Start Earning</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )
                      }

                      return (
                        <Link
                          href="/dashboard"
                          className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                        >
                          <TrendingUp className="h-5 w-5" />
                          <span>Go to Your Dashboard</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: DollarSign,
    title: "100% Earnings",
    description: "Keep every dollar except gas fees. No platform cuts, no hidden fees, no surprises.",
    color: "bg-green-500"
  },
  {
    icon: Wallet,
    title: "Your Wallet, Your Money",
    description: "Direct payments to your personal blockchain wallet. Instant settlement, full control.",
    color: "bg-blue-500"
  },
  {
    icon: Shield,
    title: "Censorship Resistant",
    description: "No platform can ban or demonetize you. True creator sovereignty on the blockchain.",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Own Your Audience",
    description: "Direct connection to fans. No algorithm controls your reach or relationship.",
    color: "bg-indigo-500"
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Tips and payments arrive in seconds, not weeks. Real-time blockchain transactions.",
    color: "bg-yellow-500"
  },
  {
    icon: Gift,
    title: "NFT Memberships",
    description: "Tradeable subscription tokens your fans actually own. Create scarcity and value.",
    color: "bg-pink-500"
  }
]

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your crypto wallet to create your personal creator economy. No signup required."
  },
  {
    title: "Set Up Your Profile",
    description: "Create membership tiers, upload content, and design custom rewards for your fans."
  },
  {
    title: "Start Earning",
    description: "Receive direct tips, sell memberships, and earn from content — 100% goes to you."
  }
]
