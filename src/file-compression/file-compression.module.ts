import { Module } from '@nestjs/common';
import { FileCompressionService } from './file-compression.service';
import { FileCompressionController } from './file-compression.controller';

@Module({
  controllers: [FileCompressionController],
  providers: [FileCompressionService],
})
export class FileCompressionModule {}
