import { Controller, Post, Body} from '@nestjs/common';
import { FileRenameService } from './file-rename.service';
import { RenameFilesDto } from './dto/rename-files.dto';

@Controller('file-rename')
export class FileRenameController {
  constructor(private readonly fileRenameService: FileRenameService) {}

  @Post('rename')
  async renameFiles(@Body() renameFilesDto: RenameFilesDto) {
    // console.log('renameFiles',renameFilesDto)
    return this.fileRenameService.renameFiles(renameFilesDto)
  }
  @Post('batch-rename')
  async renameBatchSubfolders(@Body() renameFilesDto: RenameFilesDto) {
    // console.log('renameBatchSubfolders',renameFilesDto)
    return this.fileRenameService.renameBatchSubfolders(renameFilesDto)
  }
}
