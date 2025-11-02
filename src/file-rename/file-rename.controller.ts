import { Controller, Post, Body} from '@nestjs/common';
import { FileRenameService } from './file-rename.service';
import { RenameFilesDto } from './dto/rename-files.dto';

@Controller('file-rename')
export class FileRenameController {
  constructor(private readonly fileRenameService: FileRenameService) {}

  @Post('rename')
  async renameFiles(@Body() renameFilesDto: RenameFilesDto) {
    return this.fileRenameService.renameFiles(renameFilesDto)
  }
  @Post('batch-rename')
  async renameBatchSubfolders(@Body() renameFilesDto: RenameFilesDto) {
    return this.fileRenameService.renameBatchSubfolders(renameFilesDto)
  }
}
