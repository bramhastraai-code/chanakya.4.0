import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from '../../services/ai.service';
import {
  GenerateDescriptionDto,
  EstimatePriceDto,
  ChatDto,
} from '../../dto/v1/ai.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';

@ApiTags('AI Tools')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(jwtGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-description')
  @ApiOperation({ summary: 'Generate engaging property description' })
  @ApiResponse({
    status: 201,
    description: 'Description generated successfully',
  })
  async generateDescription(@Body() dto: GenerateDescriptionDto) {
    const data = await this.aiService.generateDescription(dto);
    return {
      success: true,
      data,
    };
  }

  @Post('estimate-price')
  @ApiOperation({ summary: 'Estimate property price (Market Valuation)' })
  @ApiResponse({ status: 201, description: 'Price estimated successfully' })
  async estimatePrice(@Body() dto: EstimatePriceDto) {
    const data = await this.aiService.estimatePrice(dto);
    return {
      success: true,
      data,
    };
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with Chanakya AI' })
  @ApiResponse({ status: 201, description: 'Response received successfully' })
  async chat(@Body() dto: ChatDto) {
    const data = await this.aiService.chat(dto);
    return {
      success: true,
      data,
    };
  }
}
