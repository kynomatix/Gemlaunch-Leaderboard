import { Web3 } from "web3";

class Web3Service {
  private web3: Web3 | null = null;
  private account: string | null = null;

  async connectWallet(): Promise<string | null> {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        this.web3 = new Web3((window as any).ethereum);
        
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        
        if (accounts.length > 0) {
          this.account = accounts[0];
          
          // Switch to BNB Chain if not already on it
          await this.switchToBNBChain();
          
          return this.account;
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw new Error("Failed to connect wallet");
      }
    } else {
      throw new Error("No wallet detected. Please install MetaMask or another Web3 wallet.");
    }
    
    return null;
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
