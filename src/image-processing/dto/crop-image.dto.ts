import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { RenamePattern } from '../../file-rename/dto/rename-files.dto'

export enum HorizontalCrop {
  'LEFT',
  'RIGHT',
}

export enum VerticalCrop {
  'TOP',
  'BOTTOM',
}

export class CropImageDto {
  @IsString()
  filePath: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startX?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startY?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number

  @IsOptional()
  @IsEnum(HorizontalCrop)
  @Type(() => Number)
  horizontal?: HorizontalCrop = HorizontalCrop.LEFT

  @IsOptional()
  @IsEnum(VerticalCrop)
  @Type(() => Number)
  vertical?: VerticalCrop = VerticalCrop.TOP
}
