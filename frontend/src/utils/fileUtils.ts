// 文件工具函数

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 文件类型检查
export function getFileType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac'];
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
  if (imageTypes.includes(ext)) return 'image';
  if (videoTypes.includes(ext)) return 'video';
  if (audioTypes.includes(ext)) return 'audio';
  if (documentTypes.includes(ext)) return 'document';
  
  return 'file';
}

// 检查文件是否为图片
export function isImageFile(fileName: string): boolean {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return imageTypes.includes(ext);
}

// 检查文件是否为视频
export function isVideoFile(fileName: string): boolean {
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return videoTypes.includes(ext);
}

// 生成文件预览URL
export function generateFilePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

// 释放文件预览URL
export function releaseFilePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// 验证文件大小
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

// 验证文件类型
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const fileType = getFileType(file.name);
  return allowedTypes.includes(fileType);
}