import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/dashboard')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get agent performance stats' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@CurrentUser() user: any) {
    const data = await this.dashboardService.getAgentStats(user.userId);

    return {
      success: true,
      data,
    };
  }

  @Get('listings-summary')
  @ApiOperation({ summary: 'Get listings breakdown summary' })
  @ApiResponse({ status: 200, description: 'Listings summary retrieved' })
  async getListingsSummary(@CurrentUser() user: any) {
    const data = await this.dashboardService.getListingsSummary(user.userId);

    return {
      success: true,
      data,
    };
  }

  @Post('chat')
  @ApiOperation({ summary: 'AI chatbot interaction' })
  @ApiResponse({ status: 200, description: 'AI response generated' })
  async chat(@Body() chatDto: ChatMessageDto, @CurrentUser() user: any) {
    const data = await this.dashboardService.chat(user.userId, chatDto);

    return {
      success: true,
      data,
    };
  }

  @Get('chat-history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Chat history retrieved' })
  async getChatHistory(
    @CurrentUser() user: any,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.dashboardService.getChatHistory(user.userId, limit);

    return {
      success: true,
      data,
    };
  }
}
