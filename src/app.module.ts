import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { FileRenameModule } from './file-rename/file-rename.module'

@Module({
  imports: [FileRenameModule],
  controllers: [AppController],
})
export class AppModule {}
