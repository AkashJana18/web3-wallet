import Header from "@/components/Header";
import { MnemonicComponent } from "@/components/Mnemonics";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mnemonic Column */}
          <div className="lg:col-span-1">
            <MnemonicComponent />
          </div>

          {/* Ethereum Wallet Column */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-background/50 rounded-lg border h-full">
              <h2 className="text-xl font-semibold mb-4">Ethereum Wallet</h2>
            </div>
          </div>

          {/* Solana Wallet Column */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-background/50 rounded-lg border h-full">
              <h2 className="text-xl font-semibold mb-4">Solana Wallet</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
