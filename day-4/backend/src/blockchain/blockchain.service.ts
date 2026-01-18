import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createPublicClient, http, PublicClient, parseAbiItem } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './storage.abi.json';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    // GANTI dengan address hasil deploy Day 2
    this.contractAddress =
      '0x1e4944c2755f3438af5fe1aa77f9f4518316365c' as `0x${string}`;
  }

  // 🔹 Read latest value
  async getLatestValue() {
    try {
      const value: bigint = (await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      })) as bigint;

      return {
        value: value.toString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents(fromBlock?: number, toBlock?: number) {
  try {
    const currentBlock = await this.client.getBlockNumber();
    const end = toBlock ? BigInt(toBlock) : currentBlock;
    const start = fromBlock ? BigInt(fromBlock) : end - 2000n;

    const events = await this.client.getLogs({
      address: this.contractAddress,
      event: parseAbiItem('event ValueUpdated(uint256 newValue)'),
      fromBlock: start,
      toBlock: end,
    });

    return events.map((event) => ({
      blockNumber: event.blockNumber?.toString(),
      value: event.args.newValue?.toString(),
      txHash: event.transactionHash,
    }));
  } catch (error) {
    this.handleRpcError(error);
  }
}

  // 🔹 Centralized RPC Error Handler
  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);

    console.log({ error: message });

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException(
        'RPC timeout. Silakan coba beberapa saat lagi.',
      );
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException(
        'Tidak dapat terhubung ke blockchain RPC.',
      );
    }

    throw new InternalServerErrorException(
      'Terjadi kesalahan saat membaca data blockchain',
    );
  }
}