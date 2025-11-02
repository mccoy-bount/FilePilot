/**
 * 文件工具类
 */
export const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg', '.heic']
/**
 * 获取文件名的后缀（包含点号）
 * @param filename 文件名或完整路径
 * @returns 文件后缀，包含点号，例如: ".jpg", ".png"
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return ''
  }

  // 使用 path.extname 方法获取包含点号的后缀
  const extension = filename.slice(Math.max(0, filename.lastIndexOf('.')), filename.length)

  return extension.toLowerCase()
}

/**
 * 获取文件名的后缀（不包含点号）
 * @param filename 文件名或完整路径
 * @returns 文件后缀，不包含点号，例如: "jpg", "png"
 */
export function getFileExtensionWithoutDot(filename: string): string {
  const extension = getFileExtension(filename)
  return extension ? extension.slice(1) : ''
}

/**
 * 获取文件名（不包含路径和后缀）
 * @param filename 文件名或完整路径
 * @returns 纯文件名，例如: "image" from "/path/to/image.jpg"
 */
export function getFileNameWithoutExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return ''
  }

  // 提取文件名（不包含路径）
  const baseName = filename.split(/[\\/]/).pop() || ''

  // 移除后缀
  const lastDotIndex = baseName.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return baseName
  }

  return baseName.slice(0, lastDotIndex)
}

/**
 * 检查文件是否为图片类型
 * @param filename 文件名或完整路径
 * @returns 是否为图片文件
 */
export function isImageFile(filename: string): boolean {
  const extension = getFileExtension(filename)
  return imageExtensions.includes(extension)
}
