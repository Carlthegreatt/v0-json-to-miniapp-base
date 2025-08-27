"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  Heart,
  ShoppingCart,
  Wallet,
  Sparkles,
  Bomb,
  Trophy,
  Star,
  Zap,
  Gift,
  RotateCcw,
  Save as Sieve,
  Crown,
  Diamond,
  Gem,
} from "lucide-react"

interface LootResult {
  tier: string
  reward: string
  coins: number
  isNFT?: boolean
  isBomb?: boolean
  nftName?: string
  rarity?: string
}

const LOOT_TABLE = [
  { chance: 0.08, tier: "Dud", reward: "Nothing", coins: 0 },
  { chance: 0.45, tier: "Common", reward: "1-5 Coins", coins: Math.floor(Math.random() * 5) + 1 },
  { chance: 0.25, tier: "Uncommon", reward: "8-15 Coins", coins: Math.floor(Math.random() * 8) + 8 },
  { chance: 0.12, tier: "Rare", reward: "20-35 Coins", coins: Math.floor(Math.random() * 16) + 20 },
  { chance: 0.05, tier: "Bomb", reward: "BOOM! All coins lost!", coins: 0, isBomb: true },
  { chance: 0.03, tier: "Epic", reward: "50-100 Coins", coins: Math.floor(Math.random() * 51) + 50 },
  { chance: 0.015, tier: "Legendary", reward: "Rare NFT", coins: 0, isNFT: true, rarity: "Legendary" },
  { chance: 0.004, tier: "Mythic", reward: "Ultra Rare NFT + 200 Coins", coins: 200, isNFT: true, rarity: "Mythic" },
  { chance: 0.001, tier: "Divine", reward: "Divine NFT + 1000 Coins", coins: 1000, isNFT: true, rarity: "Divine" },
]

const NFT_NAMES = {
  Common: [
    "Pixel Warrior",
    "Digital Coin",
    "Crypto Gem",
    "Base Token",
    "Chain Link",
    "Block Miner",
    "Hash Fragment",
    "Code Snippet",
    "Data Byte",
    "Network Node",
  ],
  Uncommon: [
    "Neon Samurai",
    "Cyber Wolf",
    "Electric Tiger",
    "Frost Bear",
    "Wind Serpent",
    "Digital Phoenix",
    "Quantum Butterfly",
    "Crystal Dragon",
    "Shadow Panther",
    "Fire Lion",
  ],
  Rare: [
    "Stellar Guardian",
    "Cosmic Wanderer",
    "Mystic Owl",
    "Golden Eagle",
    "Silver Hawk",
    "Plasma Sword",
    "Energy Shield",
    "Void Walker",
    "Time Keeper",
    "Space Ranger",
  ],
  Epic: [
    "Galactic Emperor",
    "Nebula Queen",
    "Starforge Master",
    "Void Sovereign",
    "Cosmic Titan",
    "Quantum Lord",
    "Digital Overlord",
    "Cyber Deity",
    "Plasma God",
    "Energy Supreme",
  ],
  Legendary: [
    "Genesis Creator",
    "Universe Architect",
    "Reality Shaper",
    "Dimension Walker",
    "Infinity Guardian",
    "Eternal Warden",
    "Celestial Being",
    "Divine Avatar",
    "Cosmic Entity",
    "Supreme Consciousness",
  ],
  Mythic: [
    "The First Code",
    "Origin Protocol",
    "Prime Algorithm",
    "Genesis Block",
    "Alpha Sequence",
    "Omega Cipher",
    "Eternal Matrix",
    "Infinite Loop",
    "Perfect Hash",
    "Ultimate Key",
  ],
  Divine: [
    "The Creator's Vision",
    "Source of All Chains",
    "The Original Satoshi",
    "Genesis of Genesis",
    "The Prime Mover",
    "Alpha and Omega",
    "The Eternal Flame",
    "The First Light",
  ],
}

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
  const [livesTimer, setLivesTimer] = useState<number | null>(null)
  const [prospectRunCoins, setProspectRunCoins] = useState(0)
  const [isInProspectRun, setIsInProspectRun] = useState(false)
  const [showBombExplosion, setShowBombExplosion] = useState(false)
  const [showCashoutAnimation, setShowCashoutAnimation] = useState(false)
  const [multiplier, setMultiplier] = useState(1)
  const [bonusActive, setBonusActive] = useState(false)
  const [nftCollection, setNftCollection] = useState<LootResult[]>([])
  const [shopQuantities, setShopQuantities] = useState({
    lives1: 1,
    lives5: 1,
    unlimited: 1,
  })

  useEffect(() => {
    const savedCoins = localStorage.getItem("nftuklas-coins")
    const savedLives = localStorage.getItem("nftuklas-lives")
    const savedProspects = localStorage.getItem("nftuklas-prospects")
    const savedStreak = localStorage.getItem("nftuklas-streak")
    const savedNFTs = localStorage.getItem("nftuklas-nfts")
    if (savedCoins) setCoins(Number.parseInt(savedCoins))
    if (savedLives) setLives(Number.parseInt(savedLives))
    if (savedProspects) setTotalProspects(Number.parseInt(savedProspects))
    if (savedStreak) setStreak(Number.parseInt(savedStreak))
    if (savedNFTs) setNftCollection(JSON.parse(savedNFTs))
  }, [])

  useEffect(() => {
    localStorage.setItem("nftuklas-coins", coins.toString())
    localStorage.setItem("nftuklas-lives", lives.toString())
    localStorage.setItem("nftuklas-prospects", totalProspects.toString())
    localStorage.setItem("nftuklas-streak", streak.toString())
    localStorage.setItem("nftuklas-nfts", JSON.stringify(nftCollection))
  }, [coins, lives, totalProspects, streak, nftCollection])

  useEffect(() => {
    if (lives < 5 && lives >= 0) {
      const timer = setTimeout(() => {
        setLives((prev) => Math.min(5, prev + 1))
      }, 30000) // Regenerate 1 life every 30 seconds for demo
      setLivesTimer(timer)
      return () => clearTimeout(timer)
    } else {
      setLivesTimer(null)
    }
  }, [lives])

  useEffect(() => {
    if (livesTimer && lives < 5) {
      const interval = setInterval(() => {
        // Force re-render to update timer display
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [livesTimer, lives])

  const connectWallet = () => {
    setIsConnected(true)
  }

  const resetDemo = () => {
    setCoins(0)
    setLives(5)
    setTotalProspects(0)
    setStreak(0)
    setLastResult(null)
    setProspectRunCoins(0)
    setIsInProspectRun(false)
    setMultiplier(1)
    setBonusActive(false)
    setNftCollection([])
    if (livesTimer) clearTimeout(livesTimer)
    setLivesTimer(null)
    localStorage.clear()
  }

  const buyLives = (amount: number, cost?: string) => {
    // Added cost parameter for demo
    if (amount === 999) {
      setLives(999)
    } else {
      setLives((prev) => Math.min(5, prev + amount))
    }
  }

  const rollLoot = (): LootResult => {
    const random = Math.random()
    let cumulativeChance = 0

    for (const item of LOOT_TABLE) {
      cumulativeChance += item.chance
      if (random <= cumulativeChance) {
        const result = {
          tier: item.tier,
          reward: item.reward,
          coins: item.coins,
          isNFT: item.isNFT,
          isBomb: item.isBomb,
          rarity: item.rarity,
        }

        if (item.isNFT && item.rarity) {
          const rarityNames = NFT_NAMES[item.rarity as keyof typeof NFT_NAMES] || NFT_NAMES.Common
          result.nftName = rarityNames[Math.floor(Math.random() * rarityNames.length)]
        }

        return result
      }
    }

    return { ...LOOT_TABLE[1], coins: Math.floor(Math.random() * 5) + 1 } as LootResult
  }

  const cashout = async () => {
    if (prospectRunCoins <= 0) return

    setShowCashoutAnimation(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setCoins((prev) => prev + prospectRunCoins)
    setProspectRunCoins(0)
    setIsInProspectRun(false)
    setShowCashoutAnimation(false)
    setShowCoinAnimation(true)
    setTimeout(() => setShowCoinAnimation(false), 600)
  }

  const prospect = async () => {
    if (isProspecting) return

    setIsProspecting(true)
    setTotalProspects((prev) => prev + 1)
    if (!isInProspectRun) {
      setIsInProspectRun(true)
      setProspectRunCoins(0)
    }

    const streakBonus = Math.floor(streak / 5) * 0.1
    setMultiplier(1 + streakBonus)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const result = rollLoot()
    setLastResult(result)

    if (result.isBomb) {
      setShowBombExplosion(true)
      setTimeout(() => setShowBombExplosion(false), 2000)
      setProspectRunCoins(0)
      setIsInProspectRun(false)
      setStreak(0)
      setMultiplier(1)
      setLives((prev) => Math.max(0, prev - 1))
    } else if (result.coins > 0) {
      const bonusCoins = Math.floor(result.coins * multiplier)
      setProspectRunCoins((prev) => prev + bonusCoins)
      setStreak((prev) => prev + 1)
    } else if (result.tier === "Dud") {
      setStreak(0)
      setMultiplier(1)
    } else {
      setStreak((prev) => prev + 1)
    }

    if (result.isNFT) {
      setNftCollection((prev) => [...prev, result])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
      if (result.coins > 0) {
        setCoins((prev) => prev + result.coins)
      }
    } else if (result.tier === "Epic") {
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
      case "Divine":
        return "bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 text-white animate-pulse"
      case "Bomb":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Divine":
        return <Crown className="w-4 h-4" />
      case "Mythic":
        return <Star className="w-4 h-4" />
      case "Legendary":
        return <Trophy className="w-4 h-4" />
      case "Epic":
        return <Diamond className="w-4 h-4" />
      case "Rare":
        return <Gem className="w-4 h-4" />
      case "Uncommon":
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
      {/* ... existing animations ... */}

      <AnimatePresence>
        {showBombExplosion && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-8xl"
            >
              💥
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-destructive/20 backdrop-blur-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... existing cashout animation ... */}

      {/* ... existing confetti animation ... */}

      <AnimatePresence>
        {showCashoutAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { repeat: Number.POSITIVE_INFINITY, duration: 1 },
                scale: { duration: 2, ease: "easeInOut" },
              }}
              className="text-6xl"
            >
              <Sieve className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 50, opacity: [0, 1, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
              className="absolute text-2xl"
            >
              🪙
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                Total Prospects: {totalProspects} | Streak: {streak}
                {multiplier > 1 && <span className="text-chart-2 font-bold"> | {multiplier.toFixed(1)}x Bonus!</span>}
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
          {nftCollection.length > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-4 h-4 text-chart-5" />
              <span className="text-sm text-chart-5 font-medium">NFTs Collected: {nftCollection.length}</span>
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
                      <span className="text-card-foreground font-semibold">Banked</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{coins.toLocaleString()}</p>
                    {isInProspectRun && (
                      <div className="mt-2 p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">Prospect Run</p>
                        <p className="text-lg font-semibold text-chart-2">+{prospectRunCoins}</p>
                        {multiplier > 1 && (
                          <p className="text-xs text-chart-2">{multiplier.toFixed(1)}x streak bonus</p>
                        )}
                      </div>
                    )}
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
                    {lives < 5 && <p className="text-xs text-muted-foreground mt-1">+1 life in 30s</p>}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ... existing cashout section ... */}

            {isInProspectRun && prospectRunCoins > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-gradient-to-r from-chart-2/20 to-primary/20 backdrop-blur border-chart-2/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <Button
                      onClick={cashout}
                      disabled={showCashoutAnimation}
                      className="w-full bg-gradient-to-r from-chart-2 to-primary hover:from-chart-2/90 hover:to-primary/90 disabled:opacity-50 shadow-lg"
                    >
                      {showCashoutAnimation ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                          >
                            <Sieve className="w-5 h-5" />
                          </motion.div>
                          <span>Sieving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Sieve className="w-5 h-5" />
                          <span>Cashout {prospectRunCoins} Coins</span>
                        </div>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">⚠️ Bombs will destroy all prospect run coins!</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-card/80 backdrop-blur border-border/50 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    className={isProspecting ? "prospect-pulse" : ""}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={prospect}
                      disabled={isProspecting}
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
                          <span>Prospect! (Free)</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-muted-foreground">💡 Prospecting is free! Only bombs cost lives.</p>
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
                        {lastResult.nftName && (
                          <span className="block text-chart-5 font-bold mt-1">"{lastResult.nftName}"</span>
                        )}
                      </motion.p>
                      {lastResult.coins > 0 && !lastResult.isBomb && (
                        <motion.p
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                          className="text-primary font-bold text-xl"
                        >
                          +{lastResult.coins} coins {lastResult.isNFT ? "(banked)" : "(to prospect run)"}
                          {multiplier > 1 && !lastResult.isNFT && (
                            <span className="block text-chart-2 text-sm">
                              ({Math.floor(lastResult.coins / multiplier)} base × {multiplier.toFixed(1)})
                            </span>
                          )}
                        </motion.p>
                      )}
                      {lastResult.isBomb && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-destructive font-medium"
                        >
                          💥 All prospect run coins destroyed! Lost 1 life!
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

            {/* ... existing shop section ... */}

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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">1 Life</p>
                        <p className="text-sm text-muted-foreground">0.0005 ETH</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShopQuantities((prev) => ({ ...prev, lives1: Math.max(1, prev.lives1 - 1) }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{shopQuantities.lives1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShopQuantities((prev) => ({ ...prev, lives1: Math.min(10, prev.lives1 + 1) }))
                          }
                        >
                          +
                        </Button>
                        <Button onClick={() => buyLives(shopQuantities.lives1)} size="sm">
                          Buy
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">5 Lives (Full)</p>
                        <p className="text-sm text-muted-foreground">0.002 ETH</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShopQuantities((prev) => ({ ...prev, lives5: Math.max(1, prev.lives5 - 1) }))
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{shopQuantities.lives5}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShopQuantities((prev) => ({ ...prev, lives5: Math.min(5, prev.lives5 + 1) }))
                          }
                        >
                          +
                        </Button>
                        <Button onClick={() => buyLives(5 * shopQuantities.lives5)} size="sm">
                          Buy
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-primary/10 to-chart-2/10">
                      <div className="flex-1">
                        <p className="font-medium text-primary">Unlimited Lives (Demo)</p>
                        <p className="text-sm text-muted-foreground">0.01 ETH</p>
                      </div>
                      <Button onClick={() => buyLives(999)} className="bg-gradient-to-r from-primary to-chart-2">
                        Buy Now
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Button disabled className="w-full bg-transparent" variant="outline">
                      Lucky Charm (+10% Rare) - 0.005 ETH
                    </Button>
                  </div>
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
