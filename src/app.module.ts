import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { FileRenameModule } from './file-rename/file-rename.module'
import { ImageProcessingModule } from './image-processing/image-processing.module'

@Module({
  imports: [FileRenameModule, ImageProcessingModule],
  controllers: [AppController],
})
export class AppModule {}
