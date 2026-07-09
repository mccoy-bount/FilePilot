import { createScriptApp } from './script-config'

import { FileRenameService } from '../src/file-rename/file-rename.service'

async function runManualTask() {
  const app = await createScriptApp()
  const fileRenameService = app.get(FileRenameService)

  try {
    const directoryPath = ''
    // const dto = {
    //   directoryPath: '',
    //   dryRun: false,
    //   name: '',
    //   cookie: '',
    //   // pattern: 2,
    // }
    function renameFn(old) {
      return `「小池里奈」《${old}》`
    }

    const result = await fileRenameService.batchRenameFolders(directoryPath, renameFn, false)
    console.log(result)

    console.log(result)
  } catch (error) {
    console.error('❌ 执行失败:', error)
    process.exit(1)
  } finally {
    await app.close()
    console.log('🔚 应用已关闭')
  }

  // extract('D:/迅雷下载/CJMRX-ZPLDMR.7z', 'D:/迅雷下载/', 'xxzhiku.com')
}

runManualTask()
