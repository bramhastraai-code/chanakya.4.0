import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserBehaviorService } from './user-behavior.service';
import { UserBehavior } from './entities/user-behavior.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { TrackUserBehaviorDto } from './dto/create-user-behavior.dto';

@ApiTags('Tracking')
@Controller('tracking')
export class UserBehaviorController {
  constructor(private readonly trackingService: UserBehaviorService) {}

  @ApiOperation({ summary: 'Track user behavior event' })
  @ApiBody({ type: TrackUserBehaviorDto })
  @ApiResponse({
    status: 200,
    description: 'Event tracked successfully',
    type: UserBehavior,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post('event')
  async trackEvent(
    @Body() trackUserBehaviorDto: TrackUserBehaviorDto,
    @Req() req: Request,
  ): Promise<Response<UserBehavior>> {
    const data = await this.trackingService.trackEvent(
      trackUserBehaviorDto,
      req.headers['user-agent'] as string,
      req.ip,
    );

    return {
      data,
      message: 'Event tracked successfully',
    };
  }

  @Get('daily-activity')
  @ApiOperation({ summary: 'Get daily user activity metrics' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Daily activity metrics' })
  async getDailyActivity(@Query('days') days = 30): Promise<Response<any>> {
    const data = await this.trackingService.getDailyActivity(days);
    return {
      data,
      message: 'Daily activity metrics retrieved successfully',
    };
  }

  @Get('user-retention')
  @ApiOperation({ summary: 'Calculate user retention rates' })
  @ApiQuery({
    name: 'cohortSize',
    required: false,
    description: 'Cohort size in days',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User retention metrics' })
  async getUserRetention(
    @Query('cohortSize') cohortSize = 7,
  ): Promise<Response<any>> {
    const data = await this.trackingService.calculateRetention(cohortSize);
    return {
      data,
      message: 'User retention metrics calculated successfully',
    };
  }

  @Get('popular-pages')
  @ApiOperation({ summary: 'Get most visited pages' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Popular pages metrics' })
  async getPopularPages(@Query('limit') limit = 10): Promise<Response<any>> {
    const data = await this.trackingService.getPopularPages(limit);
    return {
      data,
      message: 'Popular pages metrics retrieved successfully',
    };
  }

  @Get('cta-performance')
  @ApiOperation({ summary: 'Get CTA performance metrics' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'CTA performance metrics' })
  async getCtaPerformance(@Query('limit') limit = 20): Promise<Response<any>> {
    const data = await this.trackingService.getCtaPerformance(limit);
    return {
      data,
      message: 'CTA performance metrics retrieved successfully',
    };
  }

  @Get('user-journeys')
  @ApiOperation({ summary: 'Analyze common user journeys' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of journeys to analyze',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User journey patterns' })
  async getUserJourneys(@Query('limit') limit = 50): Promise<Response<any>> {
    const data = await this.trackingService.analyzeUserJourneys(limit);
    return {
      data,
      message: 'User journey patterns analyzed successfully',
    };
  }

  @Get('device-breakdown')
  @ApiOperation({ summary: 'Get device usage breakdown' })
  @ApiResponse({ status: 200, description: 'Device usage metrics' })
  async getDeviceBreakdown(): Promise<Response<any>> {
    const data = await this.trackingService.getDeviceBreakdown();
    return {
      data,
      message: 'Device usage metrics retrieved successfully',
    };
  }

  @Get('section-engagement')
  @ApiOperation({ summary: 'Get section engagement metrics' })
  @ApiResponse({ status: 200, description: 'Section engagement metrics' })
  async getSectionEngagement(): Promise<Response<any>> {
    const data = await this.trackingService.getSectionEngagement();
    return {
      data,
      message: 'Section engagement metrics retrieved successfully',
    };
  }
}
