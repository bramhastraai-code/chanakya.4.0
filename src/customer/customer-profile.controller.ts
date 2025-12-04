import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileService } from './customer-profile.service';
import { UpdateUserProfileDto } from './dto/update-customer-profile.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('Customer Profile')
@ApiBearerAuth()
@Controller('customer/profile')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class UserProfileController {
  constructor(
    private readonly profileService: UserProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get customer profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.profileService.getProfile(user.userId);
    return { data, message: 'Profile retrieved successfully' };
  }

  @Put()
  @ApiOperation({ summary: 'Update customer profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserProfileDto,
  ) {
    const data = await this.profileService.updateProfile(user.userId, dto);
    return { data, message: 'Profile updated successfully' };
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(
      file,
      'customer-profiles',
    );
    const data = await this.profileService.updateProfileImage(
      user.userId,
      imageResult.url,
    );
    return { data, message: 'Profile image uploaded successfully' };
  }

  @Post('saved-searches')
  @ApiOperation({ summary: 'Add saved search' })
  async addSavedSearch(
    @CurrentUser() user: any,
    @Body('searchQuery') searchQuery: string,
  ) {
    const data = await this.profileService.addSavedSearch(
      user.userId,
      searchQuery,
    );
    return { data, message: 'Search saved successfully' };
  }

  @Get('saved-searches')
  @ApiOperation({ summary: 'Get saved searches' })
  async getSavedSearches(@CurrentUser() user: any) {
    const data = await this.profileService.getSavedSearches(user.userId);
    return { data, message: 'Saved searches retrieved successfully' };
  }
}
