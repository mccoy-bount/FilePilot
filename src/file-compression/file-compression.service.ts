import { Injectable } from '@nestjs/common'
import { extract } from '../utils/decompression'
import * as fs from 'fs'
import * as path from 'path'

interface compressionResutl {
  success: boolean
  filename: string
}

@Injectable()
export class FileCompressionService {
  private defaultExtensions = ['.7z', '.01', '.001']

  async decompress(archivePath: string, targetPath: string, password?: string): Promise<compressionResutl> {
    const result: compressionResutl = { filename: archivePath, success: false }
    await extract(archivePath, targetPath, password)
      .then(() => {
        result.success = true
      })
      .catch(err => {
        console.log(err)
      })
    return result
  }

  async bithDecompress(folderPath: string, password?: string, extensions?: string[]) {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`文件夹不存在: ${folderPath}`)
    }
    const stat = fs.statSync(folderPath)
    if (!stat.isDirectory()) {
      throw new Error(`路径不是文件夹: ${folderPath}`)
    }

    const archiveFiles = this.scanArchives(folderPath, extensions || this.defaultExtensions)

    if (archiveFiles.length === 0) {
      return {
        success: [],
        failed: [],
        summary: {
          total: 0,
          successCount: 0,
          failedCount: 0,
        },
      }
    }
    const resutls = {
      success: [],
      failed: [],
    }
    for (const filPath of archiveFiles) {
      const result = await this.decompress(filPath, folderPath, password)
      if (result.success) {
        resutls.success.push(result)
      } else {
        resutls.failed.push(result)
      }
    }
    return resutls
  }

  /**
   * 递归扫描文件夹（包括子文件夹）
   */
  private scanArchives(folderPath: string, extensions: string[]): string[] {
    const archives: string[] = []

    const items = fs.readdirSync(folderPath)

    for (const item of items) {
      const fullPath = path.join(folderPath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase()
        if (extensions.includes(ext)) {
          archives.push(fullPath.replace(/\\/g, '/'))
        }
      }
    }

    return archives
  }
}
