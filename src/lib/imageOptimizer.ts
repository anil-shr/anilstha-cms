/**
 * Client-Side Image Optimizer
 * Resizes large photos, converts to WebP/JPEG, and dramatically reduces file size
 * to optimize loading performance across mobile and desktop.
 */

export interface OptimizedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  width: number;
  height: number;
  format: string;
}

export interface ImageOptimizationOptions {
  maxDimension?: number; // max width or height, default 1920
  quality?: number; // 0 to 1, default 0.82
  format?: 'image/webp' | 'image/jpeg';
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const { maxDimension = 1920, quality = 0.82, format = 'image/webp' } = options;

  // If already an SVG, SVGs are vector and shouldn't be raster converted
  if (file.type === 'image/svg+xml') {
    const dataUrl = await fileToDataUrl(file);
    return {
      file,
      dataUrl,
      originalSize: file.size,
      optimizedSize: file.size,
      savedPercent: 0,
      width: 0,
      height: 0,
      format: 'svg',
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scale factor
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Test webp support, fallback to jpeg
        let outputType = format;
        let optimizedDataUrl = canvas.toDataURL(outputType, quality);
        if (!optimizedDataUrl.startsWith('data:' + outputType)) {
          outputType = 'image/jpeg';
          optimizedDataUrl = canvas.toDataURL(outputType, quality);
        }

        // Convert base64 dataUrl back to a File
        const byteString = atob(optimizedDataUrl.split(',')[1]);
        const mimeString = optimizedDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // Generate clean filename
        const originalBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const extension = mimeString === 'image/webp' ? 'webp' : 'jpg';
        const newFileName = `${originalBaseName}_opt.${extension}`;

        const optimizedFile = new File([blob], newFileName, { type: mimeString });

        const originalSize = file.size;
        const optimizedSize = blob.size;

        // If for some rare reason compression resulted in larger file (e.g. tiny GIF), keep original
        if (optimizedSize > originalSize && width === img.naturalWidth && height === img.naturalHeight) {
          resolve({
            file,
            dataUrl: reader.result as string,
            originalSize,
            optimizedSize: originalSize,
            savedPercent: 0,
            width: img.naturalWidth,
            height: img.naturalHeight,
            format: file.type.split('/')[1] || 'img',
          });
          return;
        }

        const savedPercent =
          originalSize > 0
            ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))
            : 0;

        resolve({
          file: optimizedFile,
          dataUrl: optimizedDataUrl,
          originalSize,
          optimizedSize,
          savedPercent,
          width,
          height,
          format: extension,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
