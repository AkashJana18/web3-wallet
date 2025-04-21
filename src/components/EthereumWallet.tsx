"use client"

import { Button } from '@/components/ui/button'
import { useMnemonic } from '@/context/MnemonicContext'
import { ethers } from 'ethers'
import { Check, Copy, ExternalLink, Eye, EyeOff, RefreshCw, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const ETHEREUM_DERIVATION_PATH = "m/44'/60'/0'/0/0"
const DEFAULT_RPC_URL = 'https://cloudflare-eth.com'

export const EthereumWallet = () => {
  const { mnemonic } = useMnemonic()
  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [isPvtKeyRevealed, setIsPvtKeyRevealed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState<'address' | 'pvtKey' | null>(null)

  useEffect(() => {
    const initializeWallet = async () => {
      if (!mnemonic) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // 1. Create root node from mnemonic
        const rootNode = ethers.HDNodeWallet.fromPhrase(
          mnemonic.trim(),
          '', // no password
          `m/44'/60'/0'` // base path for Ethereum
        )
        
        // 2. Derive specific account
        const derivedWallet = rootNode.derivePath('0/0')
        setWallet(derivedWallet)
        
        // 3. Fetch balance
        await fetchBalance(derivedWallet.address)
      } catch (error) {
        console.error('Wallet derivation error:', error)
        toast.error('Failed to initialize wallet', {
          description: error instanceof Error ? error.message : 'Unknown error occurred'
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeWallet()
  }, [mnemonic])

  const fetchBalance = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(DEFAULT_RPC_URL)
      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))
    } catch (error) {
      toast.error('Failed to fetch balance')
      setBalance('0')
    }
  }

  const refreshBalance = async () => {
    if (!wallet) return
    setIsLoading(true)
    await fetchBalance(wallet.address)
    setIsLoading(false)
  }

  const copyToClipboard = (text: string, type: 'address' | 'pvtKey') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast.success(`${type === 'address' ? 'Address' : 'Private key'} copied`, {
      action: {
        label: 'Dismiss',
        onClick: () => {}
      }
    })
    setTimeout(() => setCopied(null), 2000)
  }

  if (!mnemonic) {
    return (
      <div className="p-6 bg-background/50 rounded-lg border h-full">
        <h2 className="text-xl font-semibold mb-4">Ethereum Wallet</h2>
        <p className="text-muted-foreground">No mnemonic available</p>
      </div>
    )
  }

  if (isLoading || !wallet) {
    return (
      <div className="p-6 bg-background/50 rounded-lg border h-full">
        <h2 className="text-xl font-semibold mb-4">Ethereum Wallet</h2>
        <p className="text-muted-foreground">Initializing wallet...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background/50 rounded-lg border h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-yellow-500" />
          Ethereum Wallet
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshBalance}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Balance */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Balance</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{balance} ETH</p>
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://etherscan.io/address/${wallet.address}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Etherscan
            </a>
          </Button>
        </div>
      </div>

      {/* Public Address */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Public Address</p>
        <div className="flex items-center gap-2">
          <p className="font-mono text-sm p-2 bg-muted rounded flex-1 overflow-x-auto">
            {wallet.address}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(wallet.address, 'address')}
          >
            {copied === 'address' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Private Key */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Private Key</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPvtKeyRevealed(!isPvtKeyRevealed)}
          >
            {isPvtKeyRevealed ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Reveal
              </>
            )}
          </Button>
        </div>
        
        {isPvtKeyRevealed ? (
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm p-2 bg-muted rounded flex-1 overflow-x-auto">
              {wallet.privateKey}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(wallet.privateKey, 'pvtKey')}
            >
              {copied === 'pvtKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <div className="h-10 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Private key hidden for security
            </p>
          </div>
        )}
      </div>
      
    </div>
  )
}