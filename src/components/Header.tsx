import { ModeToggle } from "./theme-button";

const Header = () => {
  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-transparent backdrop-blur-2xl opacity-90">
        <div className="flex items-center space-x-4">
          <img src="/game.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-accent-foreground">Web3 Wallet</h1>
        </div>
        <nav>
          <ModeToggle />
        </nav>
      </header>
    </div>
  );
};

export default Header;
