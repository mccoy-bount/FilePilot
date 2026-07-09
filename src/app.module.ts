import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { FileRenameModule } from './file-rename/file-rename.module'
import { ImageProcessingModule } from './image-processing/image-processing.module'
import { FileCompressionModule } from './file-compression/file-compression.module'

@Module({
  imports: [FileRenameModule, ImageProcessingModule, FileCompressionModule],
  controllers: [AppController],
})
export class AppModule {}
