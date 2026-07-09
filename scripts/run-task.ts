import { createScriptApp } from './script-config'
import { FileCompressionService } from '../src/file-compression/file-compression.service'


async function runManualTask() {
  const app = await createScriptApp()

  const fileCompressionService = app.get(FileCompressionService)
  try {
    const result = await fileCompressionService.bithDecompress('', 'xx')
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
