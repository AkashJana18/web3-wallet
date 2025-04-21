"use client"

import { Button } from '@/components/ui/button';
import { useMnemonic } from '@/context/MnemonicContext'; // You'll need to create this
import { generateMnemonic, validateMnemonic } from 'bip39';
import { Check, Copy, Eye, EyeOff, RefreshCw, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function MnemonicComponent() {
  const { setMnemonic: setGlobalMnemonic } = useMnemonic()
  const [localMnemonic, setLocalMnemonic] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [isRevealed, setIsRevealed] = useState<boolean>(false)


  // Generate a new mnemonic on component mount
  useEffect(() => {
    generateNewMnemonic()
  }, [])

  const generateNewMnemonic = () => {
    const newMnemonic = generateMnemonic(128) // 256 bits of entropy (24 words)
    setLocalMnemonic(newMnemonic)
    setGlobalMnemonic(newMnemonic) // Update context
    setCopied(false)
    setIsRevealed(false)
    toast.success('New recovery phrase generated')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(localMnemonic)
    setCopied(true)
    toast.success('Recovery phrase copied to clipboard', {
      description: 'Store it securely and never share with anyone',
      action: {
        label: 'I understand',
        onClick: () => {}
      },
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const verifyMnemonic = () => {
    if (!isRevealed) {
      toast.error('Please reveal your recovery phrase first')
      return
    }
    
    const isValid = validateMnemonic(localMnemonic)
    if (isValid) {
      toast.success('Valid recovery phrase', {
        description: 'Your recovery phrase is properly formatted',
      })
    } else {
      toast.error('Invalid recovery phrase', {
        description: 'The recovery phrase appears to be invalid',
        action: {
          label: 'Regenerate',
          onClick: generateNewMnemonic,
        },
      })
    }
  }

  const handleReveal = () => {
    setIsRevealed(true)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-transparent backdrop-blur-3xl rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-8 w-8" />
          Recovery Phrase
        </h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateNewMnemonic}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {isRevealed ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-muted/50 rounded-lg">
            {localMnemonic.split(' ').map((word, index) => (
              <div key={index} className="flex items-center">
                <span className="text-muted-foreground text-md mr-2">{index + 1}.</span>
                <span className="text-lg font-medium">{word}</span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setIsRevealed(false)}
            className="w-full gap-2 hover:cursor-pointer"
          >
            <EyeOff className="h-4 w-4" />
            Hide Recovery Phrase
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={handleReveal}
          className="w-full gap-2 hover:cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Reveal Recovery Phrase
        </Button>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={copyToClipboard}
          className="flex-1 gap-2"
          disabled={!isRevealed}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </Button>
        
        <Button 
          onClick={verifyMnemonic}
          className="flex-1 hover:cursor-pointer"
          disabled={!isRevealed}
        >
          Verify Phrase
        </Button>
      </div>


    </div>
  )
}