import { Module } from '@nestjs/common';
import { FileRenameService } from './file-rename.service';
import { FileRenameController } from './file-rename.controller';

@Module({
  controllers: [FileRenameController],
  providers: [FileRenameService],
})
export class FileRenameModule {}
