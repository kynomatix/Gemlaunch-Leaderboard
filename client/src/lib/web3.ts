import { Web3 } from "web3";

class Web3Service {
  private web3: Web3 | null = null;
  private account: string | null = null;
  private simulatedWallet = "0x2d9b878DD5f779aF723a430F8d56f21dAc847592";

  async connectWallet(): Promise<string | null> {
    // Simulate wallet connection for testing
    this.account = this.simulatedWallet;
    console.log("Simulated wallet connected:", this.account);
    return this.account;
  }

  async connectWalletReal(): Promise<string | null> {
    if (typeof window !== "undefined") {
      // Check for ethereum provider (MetaMask, Brave, etc.)
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        throw new Error("No Web3 wallet detected. Please install MetaMask, enable Brave wallet, or use another Web3 browser.");
      }

      try {
        // For Brave wallet, we might need to check if it's enabled
        if (ethereum.isBraveWallet) {
          console.log("Brave wallet detected");
        }

        this.web3 = new Web3(ethereum);
        
        // Request account access
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
          console.log("Connected to wallet:", this.account);
          
          // Try to switch to BNB Chain, but don't fail if it doesn't work
          try {
            await this.switchToBNBChain();
          } catch (switchError) {
            console.warn("Could not switch to BNB Chain:", switchError);
            // Continue anyway - user can switch manually
          }
          
          return this.account;
        } else {
          throw new Error("No accounts found. Please unlock your wallet.");
        }
      } catch (error: any) {
        console.error("Wallet connection error:", error);
        
        if (error.code === 4001) {
          throw new Error("Connection rejected by user");
        } else if (error.code === -32002) {
          throw new Error("Connection request already pending. Please check your wallet.");
        } else {
          throw new Error(error.message || "Failed to connect wallet");
        }
      }
    } else {
      throw new Error("Web3 not supported in this environment");
    }
  }

  async switchToBNBChain() {
    if (!this.web3 || typeof window === "undefined") return;

    const chainId = "0x38"; // BNB Chain mainnet
    
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      // Chain not added to wallet, add it
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: "BNB Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed1.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add BNB Chain:", addError);
          throw new Error("Failed to add BNB Chain to wallet");
        }
      } else {
        console.error("Failed to switch to BNB Chain:", switchError);
        throw new Error("Failed to switch to BNB Chain");
      }
    }
  }

  getAccount(): string | null {
    return this.account;
  }

  isConnected(): boolean {
    return this.account !== null;
  }

  // Check if wallet is available
  isWalletAvailable(): boolean {
    return typeof window !== "undefined" && !!(window as any).ethereum;
  }

  // Get wallet info for debugging
  getWalletInfo(): any {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      return {
        isMetaMask: ethereum.isMetaMask,
        isBraveWallet: ethereum.isBraveWallet,
        isConnected: ethereum.isConnected ? ethereum.isConnected() : false,
        chainId: ethereum.chainId,
      };
    }
    return null;
  }

  async getBalance(): Promise<string> {
    if (!this.web3 || !this.account) {
      throw new Error("Wallet not connected");
    }

    const balance = await this.web3.eth.getBalance(this.account);
    return this.web3.utils.fromWei(balance, "ether");
  }

  async getCurrentBlock(): Promise<number> {
    if (!this.web3) {
      throw new Error("Web3 not initialized");
    }

    const blockNumber = await this.web3.eth.getBlockNumber();
    return Number(blockNumber);
  }

  disconnect() {
    this.web3 = null;
    this.account = null;
  }
}

export const web3Service = new Web3Service();
