// src/image-processing/image-processing.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query
} from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';
import { CropImageDto } from './dto/crop-image.dto';

@Controller('image')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post('crop')
  async cropImage(@Body() cropParams: CropImageDto): Promise<void> {
   await this.imageProcessingService.cropImage(cropParams);

  }
  @Post('batch-crop')
  async batchCropImage(@Body() cropParams: CropImageDto): Promise<void> {
    await this.imageProcessingService.batchCropImage(cropParams);

  }


  // @Get('info')
  // async getImageInfo(@Query('filePath') filePath: string): Promise<{
  //   success: boolean;
  //   data: { width: number; height: number };
  // }> {
  //   const info = await this.imageProcessingService.getImageInfo(filePath);
  //
  //   return {
  //     success: true,
  //     data: info,
  //   };
  // }
}
