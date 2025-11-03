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

export function sortByNumbersInName(a, b) {
  // 提取文件名中所有数字（返回数字数组，无数字则为空数组）
  const extractNumbers = filename => {
    const matches = filename.match(/\d+/g) // 匹配所有连续数字
    return matches ? matches.map(Number) : [] // 转换为数字数组
  }

  const numsA = extractNumbers(a)
  const numsB = extractNumbers(b)

  // 无数字文件的处理：都无数字则按默认字符串排序，一方无则排在后面
  const hasNumsA = numsA.length > 0
  const hasNumsB = numsB.length > 0

  if (!hasNumsA && !hasNumsB) {
    return a.localeCompare(b) // 都无数字：按字符串默认排序
  }
  if (!hasNumsA) return 1 // A无数字：A排后面
  if (!hasNumsB) return -1 // B无数字：B排后面

  // 有数字的情况：最多比较前3个数字，依次比对
  const maxCompareCount = 3
  for (let i = 0; i < maxCompareCount; i++) {
    // 当前位置的数字（超出数组长度则用-1表示“无此数字”，排在有数字之前）
    const numA = i < numsA.length ? numsA[i] : -1
    const numB = i < numsB.length ? numsB[i] : -1

    if (numA !== numB) {
      return numA - numB // 数字不同则直接返回结果
    }
    // 数字相同则继续比较下一个
  }

  // 前3个数字都相同：按原始文件名排序
  return a.localeCompare(b)
}
