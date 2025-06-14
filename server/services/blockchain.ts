import { storage } from "../storage";
import { Web3 } from "web3";

interface BlockchainStatus {
  isConnected: boolean;
  lastBlockNumber: number;
  eventsProcessed: number;
  lastUpdate: Date;
}

class BlockchainService {
  private web3: Web3;
  private isMonitoring = false;
  private status: BlockchainStatus = {
    isConnected: false,
    lastBlockNumber: 0,
    eventsProcessed: 0,
    lastUpdate: new Date()
  };

  constructor() {
    const rpcUrl = process.env.BNB_RPC_URL || "https://bsc-dataseed1.binance.org/";
    this.web3 = new Web3(rpcUrl);
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      this.status.isConnected = true;
      this.status.lastBlockNumber = Number(blockNumber);
      this.status.lastUpdate = new Date();
      console.log("Connected to BNB Chain, current block:", blockNumber);
    } catch (error) {
      console.error("Failed to connect to BNB Chain:", error);
      this.status.isConnected = false;
    }
  }

  public getStatus(): BlockchainStatus {
    return { ...this.status };
  }

  public async startMonitoring(updateCallback?: (update: any) => void) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("Starting blockchain monitoring...");

    // Process existing unprocessed events
    await this.processEvents();

    // Set up periodic monitoring
    setInterval(async () => {
      try {
        await this.processEvents();
        await this.updateBlockNumber();
        
        if (updateCallback) {
          updateCallback({
            status: this.status,
            type: "status_update"
          });
        }
      } catch (error) {
        console.error("Error in blockchain monitoring:", error);
      }
    }, 30000); // Check every 30 seconds
  }

  public async processEvents() {
    try {
      const unprocessedEvents = await storage.getUnprocessedEvents();
      
      for (const event of unprocessedEvents) {
        await this.processBlockchainEvent(event);
        await storage.markEventProcessed(event.id);
        this.status.eventsProcessed++;
      }

      // Scan for new events
      await this.scanForNewEvents();
      
      this.status.lastUpdate = new Date();
    } catch (error) {
      console.error("Error processing blockchain events:", error);
      throw error;
    }
  }

  private async processBlockchainEvent(event: any) {
    const user = await storage.getUserByWalletAddress(event.userAddress);
    if (!user) return;

    let points = 0;
    let activityType = "";

    // Determine points based on event type
    switch (event.eventType) {
      case "TokenCreated":
        points = 100;
        activityType = "token_creation";
        break;
      case "FairLaunchCreated":
        points = 500;
        activityType = "fair_launch";
        break;
      case "PresaleCreated":
        points = 750;
        activityType = "presale";
        break;
      case "DutchAuctionCreated":
        points = 1000;
        activityType = "dutch_auction";
        break;
      case "TokenPurchase":
        // Volume-based points (1 point per $1)
        const value = event.metadata?.value || 0;
        points = Math.floor(value);
        activityType = "volume_contribution";
        break;
      default:
        return; // Unknown event type
    }

    // Create activity record
    await storage.createActivity({
      userId: user.id,
      activityType,
      points,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      metadata: event.metadata || {}
    });

    console.log(`Processed ${event.eventType} for user ${user.walletAddress}: +${points} points`);
  }

  private async scanForNewEvents() {
    if (!this.status.isConnected) return;

    try {
      const currentBlock = await this.web3.eth.getBlockNumber();
      const fromBlock = Math.max(Number(currentBlock) - 1000, this.status.lastBlockNumber);

      // Contract addresses to monitor (these would be the actual Gemlaunch contract addresses)
      const contractAddresses = [
        process.env.GEMLAUNCH_TOKEN_FACTORY || "0x0000000000000000000000000000000000000000",
        process.env.GEMLAUNCH_LAUNCHPAD || "0x0000000000000000000000000000000000000000",
        process.env.GEMLAUNCH_PRESALE || "0x0000000000000000000000000000000000000000"
      ];

      for (const contractAddress of contractAddresses) {
        const logs = await this.web3.eth.getPastLogs({
          fromBlock: fromBlock,
          toBlock: 'latest',
          address: contractAddress
        });

        for (const log of logs) {
          // Parse event based on contract and topic
          const eventData = this.parseEventLog(log);
          if (eventData) {
            await storage.createBlockchainEvent({
              transactionHash: log.transactionHash!,
              blockNumber: Number(log.blockNumber),
              eventType: eventData.eventType,
              contractAddress: log.address!,
              userAddress: eventData.userAddress,
              processed: false
            });
          }
        }
      }

      this.status.lastBlockNumber = Number(currentBlock);
    } catch (error) {
      console.error("Error scanning for new events:", error);
    }
  }

  private parseEventLog(log: any): { eventType: string; userAddress: string; metadata?: any } | null {
    // This would contain the actual event parsing logic based on Gemlaunch contract ABIs
    // For now, return null as we don't have the actual contract details
    
    // Example parsing logic:
    // const eventSignature = log.topics[0];
    // switch (eventSignature) {
    //   case "0x...": // TokenCreated event signature
    //     return {
    //       eventType: "TokenCreated",
    //       userAddress: `0x${log.topics[1].slice(26)}`, // Extract address from topic
    //       metadata: { /* decoded event data */ }
    //     };
    //   // ... other events
    // }
    
    return null;
  }

  private async updateBlockNumber() {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      this.status.lastBlockNumber = Number(blockNumber);
    } catch (error) {
      console.error("Error updating block number:", error);
    }
  }

  public stopMonitoring() {
    this.isMonitoring = false;
    console.log("Stopped blockchain monitoring");
  }
}

export const blockchainService = new BlockchainService();
