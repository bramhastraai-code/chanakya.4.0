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
import { SuperAdminProfileService } from './super-admin-profile.service';
import { UpdateSuperAdminProfileDto } from './dto/update-super-admin-profile.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { S3Service } from 'src/s3/s3.service';

@ApiTags('admin Profile')
@ApiBearerAuth()
@Controller('admin/profile')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SuperAdminProfileController {
  constructor(
    private readonly profileService: SuperAdminProfileService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get super admin profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.profileService.getProfile(user.userId);
    return { success: true, data };
  }

  @Put()
  @ApiOperation({ summary: 'Update super admin profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateSuperAdminProfileDto,
  ) {
    const data = await this.profileService.updateProfile(user.userId, dto);
    return { success: true, message: 'Profile updated successfully', data };
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResult = await this.s3Service.uploadFile(file, 'admin-profiles');
    const data = await this.profileService.updateProfileImage(
      user.userId,
      imageResult.url,
    );
    return {
      success: true,
      message: 'Profile image uploaded successfully',
      data,
    };
  }
}
