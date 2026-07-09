import { Controller } from '@nestjs/common';
import { FileCompressionService } from './file-compression.service';

@Controller('file-compression')
export class FileCompressionController {
  constructor(private readonly fileCompressionService: FileCompressionService) {}
}
