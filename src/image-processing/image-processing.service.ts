// src/image-processing/image-processing.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'
import { CropImageDto, HorizontalCrop, VerticalCrop } from './dto/crop-image.dto'
import { ensureDirectoryExists } from '../utils/file-utils'

@Injectable()
export class ImageProcessingService {
  private outputPrefix = 'output'

  async cropImage(dto: CropImageDto): Promise<string> {
    // console.log(dto)
    const sourceDir = path.resolve(dto.filePath)
    const parentDir = path.dirname(sourceDir)
    const sourceFolderName = path.basename(sourceDir)

    const newPath = path.join(parentDir, this.outputPrefix)
    ensureDirectoryExists(newPath)

    const newFilePath = path.join(newPath, sourceFolderName)

    try {
      // 使用sharp进行图片裁剪
      // @ts-ignore
      const handler = sharp(dto.filePath)
      const metadata = await handler.metadata()
      const width = dto.width || metadata.width
      const height = dto.height || metadata.height

      const left = dto.horizontal === HorizontalCrop.RIGHT ? metadata.width - width : dto.startX
      const top = dto.vertical === VerticalCrop.BOTTOM ? metadata.height - height : dto.startY

      // console.log(left, top, width, height)
      await handler.extract({ left, top, width, height }).toFile(newFilePath)
      return newPath
    } catch (error) {
      throw new InternalServerErrorException('图片处理失败，请检查参数是否正确。')
    }
  }

  async batchCropImage(dto: CropImageDto): Promise<void> {
    const { filePath: directoryPath } = dto
    for (const file of fs.readdirSync(directoryPath)) {
      const newFilePath = path.join(directoryPath, file)
      const stats = fs.statSync(newFilePath)
      // console.log(stats.isDirectory())
      if (stats.isDirectory()) continue
      // console.log(stats.isDirectory)
      await this.cropImage({ ...dto, filePath: newFilePath })
    }
  }

  /**
   * 验证输入参数
   */
  // private async validateInput(dto: CropImageDto): Promise<void> {
  //   // 检查文件是否存在
  //   try {
  //     await fs.access(dto.filePath)
  //   } catch {
  //     throw new BadRequestException('指定的图片文件不存在。')
  //   }
  //
  //   // 检查坐标是否为非负整数
  //   if ([startX, startY, endX, endY].some(coord => !Number.isInteger(coord) || coord < 0)) {
  //     throw new BadRequestException('坐标必须为非负整数。')
  //   }
  //
  //   // 检查终点坐标是否大于起点坐标
  //   if (endX <= startX || endY <= startY) {
  //     throw new BadRequestException('终点坐标必须大于起点坐标。')
  //   }
  //
  //   // 可选：检查裁剪区域是否超出图片边界
  //   // 这需要获取图片元数据，根据实际需求决定是否添加
  // }
}
