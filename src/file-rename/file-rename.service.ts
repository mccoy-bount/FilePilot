import { BadRequestException, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { RenameFilesDto, RenamePattern } from './dto/rename-files.dto'
import { createOutputDirectory, isImageFile, sortByNumbersInName } from '../utils/file-utils'

@Injectable()
export class FileRenameService {
  // 支持的图片格式
  private executedFilesCount: number = 0

  private outputPrefix = 'output'

  /**
   * 批量重命名图片文件
   */
  async renameFiles(dto: RenameFilesDto): Promise<void> {
    const { directoryPath, dryRun, isImageType, pattern } = dto
    // console.log('pattern', pattern)
    // console.log(directoryPath, dryRun, isImageType)
    // return
    // 验证目录是否存在
    if (!fs.existsSync(directoryPath)) {
      console.log(`目录不存在: ${directoryPath}`)
      return
    }

    // 获取目录下的所有图片文件
    const files = this.getFiles(directoryPath, isImageType)
    // console.log(files)
    // return

    if (files.length === 0) return

    this.executedFilesCount = 0
    console.log('='.repeat(50))
    console.log(`\n📁 在目录 "${directoryPath}" 中找到 ${files.length} 个文件\n`)
    console.log('='.repeat(50))

    // 执行重命名操作
    await this.performRenameOperations({
      files,
      directoryPath,
      dryRun,
      pattern,
    })
    console.log('='.repeat(50))
    console.log(`\n📁 在目录 "${directoryPath}" 中${dryRun ? '模拟' : '执行'}成功 ${this.executedFilesCount} 个文件\n`)
    console.log('='.repeat(50))
  }

  /**
   * 获取目录下的所有图片文件
   */
  private getFiles(directoryPath: string, isImageType: boolean): string[] {
    try {
      const files = fs.readdirSync(directoryPath)
      return files
        .filter(file => {
          if (isImageType) {
            return isImageFile(file)
          } else {
            return file
          }
        })
        .sort(sortByNumbersInName) // 按文件名排序以保证一致性
    } catch (error) {
      throw new BadRequestException(`无法读取目录: ${error.message}`)
    }
  }

  /**
   * 执行重命名操作
   */
  private async performRenameOperations({
    files,
    directoryPath,
    dryRun,
    pattern,
  }: {
    files: string[]
    directoryPath: string
    dryRun: boolean
    pattern: RenamePattern
  }): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const oldFileName = files[i]
      const fileExtension = path.extname(oldFileName)
      const newFileName = this.generateNewFileName({
        index: i,
        totalFiles: files.length,
        extension: fileExtension,
        pattern,
        directoryPath,
        oldFileName,
      })

      const oldPath = path.join(directoryPath, oldFileName)
      const outputDir = createOutputDirectory(directoryPath, this.outputPrefix)
      // console.log(outputDir)
      // return
      const newPath = path.join(outputDir, newFileName)

      try {
        if (!dryRun) {
          // 实际执行重命名
          fs.renameSync(oldPath, newPath)
        }
        // 试运行模式，只打印
        console.log(`🔹 重命名: "${oldFileName}" -----→ "${newFileName}"`)
        // console.log(`🔹 重命名: "${oldPath}" -----→ "${newPath}"`)
        this.executedFilesCount++
      } catch (error) {
        console.log(`❌ 错误: 无法重命名 "${oldFileName}" - ${error.message}`)
      }
    }
  }

  /**
   * 生成新的文件名
   */
  private generateNewFileName({
    index,
    totalFiles,
    extension,
    pattern,
    directoryPath,
    oldFileName,
  }: {
    index: number
    totalFiles: number
    extension: string
    pattern: RenamePattern
    directoryPath: string
    oldFileName: string
    // prefix: string,
    // customPattern: string
  }): string {
    // console.log('pattern', pattern)
    switch (pattern) {
      case RenamePattern.parentDir:
        const parentDirName = path.basename(directoryPath)
        console.log(parentDirName)
        return `${parentDirName}-${oldFileName}`
      case RenamePattern.tang:
        console.log(oldFileName)
        return oldFileName.replace('www.98T.la@', '')
      default:
      case RenamePattern.number:
        const paddedIndex = (index + 1).toString().padStart(totalFiles.toString().length, '0')
        return `${paddedIndex}${extension}`
    }
  }

  /**
   * 入口2: 批量处理父文件夹下的所有子文件夹
   */
  async renameBatchSubfolders(dto: RenameFilesDto): Promise<void> {
    this.executedFilesCount = 0

    const { directoryPath, isImageType, dryRun, pattern } = dto

    console.log(`📁 执行父目录: ${directoryPath}`)

    // 获取所有子文件夹
    const subfolders = this.getSubfolders(directoryPath)

    if (subfolders.length === 0) {
      console.log('❌ 在目录中未找到任何子文件夹')
      return
    }

    // 逐个处理子文件夹
    for (const folder of subfolders) {
      const folderPath = path.join(directoryPath, folder)

      // 直接调用单个文件夹的处理方法
      await this.renameFiles({
        directoryPath: folderPath,
        isImageType,
        dryRun,
        pattern,
      })
    }
  }

  private getSubfolders(parentPath: string): string[] {
    try {
      const items = fs.readdirSync(parentPath)
      return items
        .filter(item => {
          const itemPath = path.join(parentPath, item)
          const stats = fs.statSync(itemPath)
          return stats.isDirectory()
        })
        .sort()
    } catch (error) {
      console.log(`❌ 读取目录失败: ${error.message}`)
      return []
    }
  }

  /**
   *  给文件夹改名
   */
  async renameFolder(
    folderPath: string,
    renameFn: (currentName: string) => string,
    dryRun: boolean = true
  ): Promise<void> {
    // 1. 验证路径是否存在
    if (!fs.existsSync(folderPath)) {
      throw new Error(`文件夹不存在: ${folderPath}`)
    }
    // 2. 验证是否为文件夹
    const stats = fs.statSync(folderPath)
    if (!stats.isDirectory()) {
      throw new Error(`路径不是文件夹: ${folderPath}`)
    }
    // 3. 获取当前文件夹名称和父目录
    const parentDir = path.dirname(folderPath)
    const currentName = path.basename(folderPath)

    // 4. 调用用户自定义函数生成新名称
    const newName = renameFn(currentName)

    // 5. 验证新名称不能为空
    if (!newName || newName.trim() === '') {
      throw new Error('新文件夹名称不能为空')
    }

    // 6. 验证新名称不能包含非法字符（Windows和Unix）
    const invalidChars = /[<>:"/\\|?*]/g
    if (invalidChars.test(newName)) {
      throw new Error(`新文件夹名称包含非法字符: ${newName}`)
    }

    // 7. 构建新路径
    const newPath = path.join(parentDir, newName)

    // 8. 如果新路径和旧路径相同，直接返回
    if (newPath === folderPath) {
      console.log('文件夹名称未发生变化')
      return
    }

    // // 9. 检查目标路径是否已存在
    // if (fs.existsSync(newPath)) {
    //   if (!dryRun) {
    //     // 删除已存在的文件夹
    //     fs.rmSync(newPath, { recursive: true, force: true })
    //   }
    // }

    // 10. 如果是预览模式，只返回新名称不执行
    if (dryRun) {
      console.log(`[预览] ${currentName} -> ${newName}`)
      return
    }

    try {
      fs.renameSync(folderPath, newPath)
      console.log(`✅ 重命名成功: ${currentName} -> ${newName}`)
    } catch (error) {
      throw new Error(`重命名失败: ${error}`)
    }
  }

  async batchRenameFolders(
    directoryPath: string,
    renameFn: (currentName: string) => string,
    dryRun: boolean = true
  ): Promise<void> {
    this.executedFilesCount = 0

    console.log(`📁 执行父目录: ${directoryPath}`)

    // 获取所有子文件夹
    const subfolders = this.getSubfolders(directoryPath)

    if (subfolders.length === 0) {
      console.log('❌ 在目录中未找到任何子文件夹')
      return
    }

    // 逐个处理子文件夹
    for (const folder of subfolders) {
      const folderPath = path.join(directoryPath, folder)
      // 直接调用单个文件夹的处理方法
      await this.renameFolder(folderPath, renameFn, dryRun)
    }
  }
}
