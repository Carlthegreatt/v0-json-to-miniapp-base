"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gem, Heart, ShoppingCart, Wallet, Sparkles, Bomb, Trophy } from "lucide-react"

interface LootResult {
  tier: string
  reward: string
  gems: number
  isNFT?: boolean
  isBomb?: boolean
}

const LOOT_TABLE = [
  { chance: 0.1, tier: "Dud", reward: "Nothing", gems: 0 },
  { chance: 0.9, tier: "Common", reward: "1 Gem", gems: 1 },
  { chance: 0.01, tier: "Uncommon", reward: "4 Gems", gems: 4 },
  { chance: 0.001, tier: "Bomb", reward: "-1 Life", gems: 0, isBomb: true },
  { chance: 0.0001, tier: "Rare", reward: "10 Gems", gems: 10 },
  { chance: 0.00001, tier: "Epic", reward: "100 Gems", gems: 100 },
  { chance: 0.0000001, tier: "Legendary", reward: "NFT", gems: 0, isNFT: true },
]

export default function NFTuklasApp() {
  const [gems, setGems] = useState(0)
  const [lives, setLives] = useState(5)
  const [isConnected, setIsConnected] = useState(false)
  const [isProspecting, setIsProspecting] = useState(false)
  const [lastResult, setLastResult] = useState<LootResult | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load saved data from localStorage
  useEffect(() => {
    const savedGems = localStorage.getItem("nftuklas-gems")
    const savedLives = localStorage.getItem("nftuklas-lives")
    if (savedGems) setGems(Number.parseInt(savedGems))
    if (savedLives) setLives(Number.parseInt(savedLives))
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("nftuklas-gems", gems.toString())
    localStorage.setItem("nftuklas-lives", lives.toString())
  }, [gems, lives])

  const connectWallet = () => {
    // Mock wallet connection for MVP
    setIsConnected(true)
  }

  const rollLoot = (): LootResult => {
    const random = Math.random()
    let cumulativeChance = 0

    for (const item of LOOT_TABLE) {
      cumulativeChance += item.chance
      if (random <= cumulativeChance) {
        return {
          tier: item.tier,
          reward: item.reward,
          gems: item.gems,
          isNFT: item.isNFT,
          isBomb: item.isBomb,
        }
      }
    }

    // Fallback to common
    return LOOT_TABLE[1] as LootResult
  }

  const prospect = async () => {
    if (lives <= 0 || isProspecting) return

    setIsProspecting(true)
    setLives((prev) => prev - 1)

    // Simulate prospecting delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = rollLoot()
    setLastResult(result)

    if (result.isBomb) {
      setLives((prev) => Math.max(0, prev - 1))
    } else if (result.gems > 0) {
      setGems((prev) => prev + result.gems)
    }

    // Show confetti for rare items
    if (result.tier === "Epic" || result.tier === "Legendary") {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setIsProspecting(false)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Common":
        return "bg-gray-500"
      case "Uncommon":
        return "bg-green-500"
      case "Rare":
        return "bg-blue-500"
      case "Epic":
        return "bg-purple-500"
      case "Legendary":
        return "bg-yellow-500"
      case "Bomb":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Legendary":
        return <Trophy className="w-4 h-4" />
      case "Epic":
        return <Sparkles className="w-4 h-4" />
      case "Bomb":
        return <Bomb className="w-4 h-4" />
      default:
        return <Gem className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">NFTuklas</h1>
          <p className="text-blue-200">Prospect for gems and rare NFTs on Base</p>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center space-y-4">
              <Wallet className="w-12 h-12 mx-auto text-blue-300" />
              <h2 className="text-xl font-semibold text-white">Connect Your Wallet</h2>
              <p className="text-blue-200">Connect to Base network to start prospecting</p>
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Gem className="w-5 h-5 text-blue-300" />
                    <span className="text-white font-semibold">Gems</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-300">{gems.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-red-300" />
                    <span className="text-white font-semibold">Lives</span>
                  </div>
                  <p className="text-2xl font-bold text-red-300">{lives}</p>
                </CardContent>
              </Card>
            </div>

            {/* Prospect Button */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  animate={isProspecting ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isProspecting ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
                >
                  <Button
                    onClick={prospect}
                    disabled={lives <= 0 || isProspecting}
                    size="lg"
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                  >
                    {isProspecting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Prospect!"
                    )}
                  </Button>
                </motion.div>

                {lives <= 0 && <p className="text-red-300 text-sm">No lives remaining! Visit the shop to buy more.</p>}
              </CardContent>
            </Card>

            {/* Last Result */}
            <AnimatePresence>
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white text-center">Last Prospect</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-3">
                      <Badge className={`${getTierColor(lastResult.tier)} text-white px-3 py-1`}>
                        <span className="flex items-center space-x-1">
                          {getTierIcon(lastResult.tier)}
                          <span>{lastResult.tier}</span>
                        </span>
                      </Badge>
                      <p className="text-white font-semibold">{lastResult.reward}</p>
                      {lastResult.gems > 0 && <p className="text-blue-300">+{lastResult.gems} gems</p>}
                      {lastResult.isBomb && <p className="text-red-300">Lost 1 life!</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shop (Mocked) */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop</span>
                  <Badge variant="secondary" className="ml-auto">
                    Coming Soon
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button disabled className="w-full bg-transparent" variant="outline">
                  Buy 5 Lives - 0.001 ETH
                </Button>
                <Button disabled className="w-full bg-transparent" variant="outline">
                  Buy Unlimited Life - 0.01 ETH
                </Button>
              </CardContent>
            </Card>

            {/* Economy Info */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4 text-center">
                <p className="text-blue-200 text-sm">1000 Gems = 0.01 ETH (when live)</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
