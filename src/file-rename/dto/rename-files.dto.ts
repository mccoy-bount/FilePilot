import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsEnum} from 'class-validator'
import {Transform, Type} from 'class-transformer'

export enum RenamePattern {
  'number',
  'parentDir',
  'tang',
}

export class RenameFilesDto {
  @IsNotEmpty()
  @IsString()
  directoryPath: string

  @IsBoolean()
  @Transform(({ value }) => {
    return value !== 'false'
  })
  dryRun: boolean = true

  @IsBoolean()
  @Transform(({ value }) => {
    return value !== 'false'
  })
  isImageType?: boolean = true



  @IsOptional()
  @IsEnum(RenamePattern)
  @Type(() => Number)
  pattern?: RenamePattern = RenamePattern.number
}
