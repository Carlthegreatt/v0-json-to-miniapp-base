"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Heart, ShoppingCart, Wallet, Sparkles, Bomb, Trophy, Star, Zap, Gift, RotateCcw } from "lucide-react"

interface LootResult {
  tier: string
  reward: string
  coins: number
  isNFT?: boolean
  isBomb?: boolean
}

const LOOT_TABLE = [
  { chance: 0.15, tier: "Dud", reward: "Nothing", coins: 0 },
  { chance: 0.65, tier: "Common", reward: "1-3 Coins", coins: Math.floor(Math.random() * 3) + 1 },
  { chance: 0.15, tier: "Uncommon", reward: "5-8 Coins", coins: Math.floor(Math.random() * 4) + 5 },
  { chance: 0.03, tier: "Rare", reward: "15-25 Coins", coins: Math.floor(Math.random() * 11) + 15 },
  { chance: 0.015, tier: "Bomb", reward: "-1 Life", coins: 0, isBomb: true },
  { chance: 0.004, tier: "Epic", reward: "50-100 Coins", coins: Math.floor(Math.random() * 51) + 50 },
  { chance: 0.0009, tier: "Legendary", reward: "Rare NFT", coins: 0, isNFT: true },
  { chance: 0.0001, tier: "Mythic", reward: "Ultra Rare NFT + 500 Coins", coins: 500, isNFT: true },
]

export default function NFTuklasApp() {
  const [coins, setCoins] = useState(0)
  const [lives, setLives] = useState(5)
  const [isConnected, setIsConnected] = useState(false)
  const [isProspecting, setIsProspecting] = useState(false)
  const [lastResult, setLastResult] = useState<LootResult | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [totalProspects, setTotalProspects] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const savedCoins = localStorage.getItem("nftuklas-coins")
    const savedLives = localStorage.getItem("nftuklas-lives")
    const savedProspects = localStorage.getItem("nftuklas-prospects")
    const savedStreak = localStorage.getItem("nftuklas-streak")
    if (savedCoins) setCoins(Number.parseInt(savedCoins))
    if (savedLives) setLives(Number.parseInt(savedLives))
    if (savedProspects) setTotalProspects(Number.parseInt(savedProspects))
    if (savedStreak) setStreak(Number.parseInt(savedStreak))
  }, [])

  useEffect(() => {
    localStorage.setItem("nftuklas-coins", coins.toString())
    localStorage.setItem("nftuklas-lives", lives.toString())
    localStorage.setItem("nftuklas-prospects", totalProspects.toString())
    localStorage.setItem("nftuklas-streak", streak.toString())
  }, [coins, lives, totalProspects, streak])

  const connectWallet = () => {
    setIsConnected(true)
  }

  const resetDemo = () => {
    setCoins(0)
    setLives(5)
    setTotalProspects(0)
    setStreak(0)
    setLastResult(null)
    localStorage.clear()
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
          coins: item.coins,
          isNFT: item.isNFT,
          isBomb: item.isBomb,
        }
      }
    }

    return { ...LOOT_TABLE[1], coins: Math.floor(Math.random() * 3) + 1 } as LootResult
  }

  const prospect = async () => {
    if (lives <= 0 || isProspecting) return

    setIsProspecting(true)
    setLives((prev) => prev - 1)
    setTotalProspects((prev) => prev + 1)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const result = rollLoot()
    setLastResult(result)

    if (result.isBomb) {
      setLives((prev) => Math.max(0, prev - 1))
      setStreak(0)
    } else if (result.coins > 0) {
      setCoins((prev) => prev + result.coins)
      setShowCoinAnimation(true)
      setStreak((prev) => prev + 1)
      setTimeout(() => setShowCoinAnimation(false), 600)
    } else if (result.tier === "Dud") {
      setStreak(0)
    } else {
      setStreak((prev) => prev + 1)
    }

    if (result.tier === "Epic" || result.tier === "Legendary" || result.tier === "Mythic") {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }

    setIsProspecting(false)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Common":
        return "bg-muted text-muted-foreground"
      case "Uncommon":
        return "bg-chart-2 text-primary-foreground"
      case "Rare":
        return "bg-chart-1 text-primary-foreground"
      case "Epic":
        return "bg-chart-4 text-primary-foreground"
      case "Legendary":
        return "bg-chart-5 text-foreground"
      case "Mythic":
        return "bg-gradient-to-r from-chart-5 to-chart-1 text-foreground"
      case "Bomb":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Mythic":
        return <Star className="w-4 h-4" />
      case "Legendary":
        return <Trophy className="w-4 h-4" />
      case "Epic":
        return <Sparkles className="w-4 h-4" />
      case "Rare":
        return <Zap className="w-4 h-4" />
      case "Bomb":
        return <Bomb className="w-4 h-4" />
      default:
        return <Coins className="w-4 h-4" />
    }
  }

  const livesProgress = (lives / 5) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20 p-4">
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(100)].map((_, i) => (
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
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 4,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
                className={`absolute w-3 h-3 rounded ${
                  i % 4 === 0 ? "bg-chart-1" : i % 4 === 1 ? "bg-chart-2" : i % 4 === 2 ? "bg-chart-5" : "bg-primary"
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          className="text-center space-y-2 floating"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            NFTuklas
          </h1>
          <p className="text-muted-foreground text-lg">Prospect for coins and rare NFTs on Base</p>
          {totalProspects > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Total Prospects: {totalProspects} | Current Streak: {streak}
              </p>
              <Button
                onClick={resetDemo}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <Wallet className="w-12 h-12 mx-auto text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold text-card-foreground">Connect Your Wallet</h2>
                <p className="text-muted-foreground">Connect to Base network to start prospecting</p>
                <Button onClick={connectWallet} className="w-full" size="lg">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <motion.div
                        className={showCoinAnimation ? "coin-collect" : ""}
                        animate={showCoinAnimation ? { scale: [1, 1.2, 1] } : {}}
                      >
                        <Coins className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="text-card-foreground font-semibold">Coins</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{coins.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-destructive" />
                      <span className="text-card-foreground font-semibold">Lives</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">{lives}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <motion.div
                        className="bg-destructive h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${livesProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    className={isProspecting ? "prospect-pulse" : ""}
                    whileHover={{ scale: lives > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: lives > 0 ? 0.98 : 1 }}
                  >
                    <Button
                      onClick={prospect}
                      disabled={lives <= 0 || isProspecting}
                      size="lg"
                      className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 disabled:opacity-50 shadow-lg"
                    >
                      {isProspecting ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                            className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                          <span>Prospecting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Gift className="w-6 h-6" />
                          <span>Prospect!</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {lives <= 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-destructive text-sm font-medium"
                    >
                      No lives remaining! Visit the shop to buy more.
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="loot-reveal"
                >
                  <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-card-foreground text-center flex items-center justify-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Last Prospect</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Badge className={`${getTierColor(lastResult.tier)} px-3 py-1 text-sm font-semibold`}>
                          <span className="flex items-center space-x-1">
                            {getTierIcon(lastResult.tier)}
                            <span>{lastResult.tier}</span>
                          </span>
                        </Badge>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-card-foreground font-semibold text-lg"
                      >
                        {lastResult.reward}
                      </motion.p>
                      {lastResult.coins > 0 && (
                        <motion.p
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                          className="text-primary font-bold text-xl"
                        >
                          +{lastResult.coins} coins
                        </motion.p>
                      )}
                      {lastResult.isBomb && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-destructive font-medium"
                        >
                          Lost 1 life!
                        </motion.p>
                      )}
                      {lastResult.isNFT && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="text-chart-5 font-bold text-lg"
                        >
                          🎉 NFT Discovered! 🎉
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center space-x-2">
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
                  <Button disabled className="w-full bg-transparent" variant="outline">
                    Lucky Charm (+10% Rare) - 0.005 ETH
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <Card className="bg-card/60 backdrop-blur border-border/30">
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">🪙 1000 Coins = 0.01 ETH (when live)</p>
                  <p className="text-muted-foreground text-xs mt-1">Built on Base • Powered by v0</p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
