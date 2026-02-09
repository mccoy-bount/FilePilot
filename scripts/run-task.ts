import { createScriptApp } from './script-config'
import { FileRenameService } from '../src/file-rename/file-rename.service'

async function runManualTask() {
  const app = await createScriptApp()
  const fileRenameService = app.get(FileRenameService)

  try {
    const dto = {
      directoryPath: 'D:\\迅雷下载\\www.98T.la@天羽希純写真21套 - 副本',
      dryRun: false,
      name: '',
      cookie: '',
    }

    const result = await fileRenameService.renameBatchSubfolders(dto)
    console.log(result)
  } catch (error) {
    console.error('❌ 执行失败:', error)
    process.exit(1)
  } finally {
    await app.close()
    console.log('🔚 应用已关闭')
  }
}

runManualTask()