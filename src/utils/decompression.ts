// seven-zip.service.ts
import * as Seven from 'node-7z-fix'
import * as SevenBin from '7zip-bin'
import * as fs from 'fs'

export async function extract(archivePath: string, targetPath: string, password?: string) {
  // 检查文件是否存在
  if (!fs.existsSync(archivePath)) {
    throw new Error(`文件不存在: ${archivePath}`)
  }

  // 创建目标目录
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  return new Promise((resolve, reject) => {
    // 配置 7z 选项
    const options: any = {
      $bin: SevenBin.path7za, // 使用内置 7z
      $progress: true,
    }

    if (password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      options.password = password
    }

    // 执行解压
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const stream = Seven.extractFull(archivePath, targetPath, options)

    const files: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    stream.on('data', data => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (data.status === 'extracted') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        files.push(data.file)
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    stream.on('end', () => {
      resolve({
        success: true,
        message: `解压成功，共 ${files.length} 个文件`,
        files,
      })
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    stream.on('error', err => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      reject(new Error(`解压失败: ${err.message}`))
    })
  })
}
