"use client"

import { ReactNode, createContext, useContext, useState } from 'react'

type MnemonicContextType = {
  mnemonic: string
  setMnemonic: (mnemonic: string) => void
  clearMnemonic: () => void
}

const MnemonicContext = createContext<MnemonicContextType | undefined>(undefined)

export function MnemonicProvider({ children }: { children: ReactNode }) {
  const [mnemonic, setMnemonic] = useState<string>('')

  const clearMnemonic = () => {
    setMnemonic('')
  }

  return (
    <MnemonicContext.Provider value={{ mnemonic, setMnemonic, clearMnemonic }}>
      {children}
    </MnemonicContext.Provider>
  )
}

export function useMnemonic() {
  const context = useContext(MnemonicContext)
  if (!context) {
    throw new Error('useMnemonic must be used within a MnemonicProvider')
  }
  return context
}