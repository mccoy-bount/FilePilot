import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'


export class RenameFilesDto {
  @IsNotEmpty()
  @IsString()
  directoryPath: string

  @IsBoolean()
  @Transform(({ value }) => {
    return value !== 'false'
  })
  dryRun: boolean = true
  // renameFn: Function
}
