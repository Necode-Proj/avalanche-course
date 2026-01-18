import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain') // This defines the "/blockchain" prefix
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get() // This maps to GET /blockchain
  async getValue() {
    return await this.blockchainService.getLatestValue();
  }

  @Get('events') // This maps to GET /blockchain/events
  async getEvents() {
    return await this.blockchainService.getValueUpdatedEvents();
  }
}