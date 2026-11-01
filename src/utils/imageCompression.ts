/**
 * Client-Side Image Compression Utility
 * Compresses images directly on the user's device using HTML5 Canvas.
 * Guarantees output is strictly under 1 MB.
 */

export interface CompressionResult {
  dataUrl: string;
  fileSize: number;
  fileSizeFormatted: string;
  wasCompressed: boolean;
  originalSize: number;
  width: number;
  height: number;
}

const MAX_ALLOWED_BYTES = 1024 * 1024; // 1 MB (1,048,576 bytes)
const MAX_DIMENSION = 800; // Optimal for high-DPI profile avatars

/**
 * Format bytes into human-readable string (e.g. "342 KB", "1.2 MB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Estimate byte size of a base64 Data URL
 */
export function getDataUrlByteSize(dataUrl: string): number {
  const base64String = dataUrl.split(',')[1] || '';
  const padding = (base64String.match(/=+$/) || [''])[0].length;
  return Math.floor((base64String.length * 3) / 4) - padding;
}

/**
 * Compresses an image file on the user's device using HTML5 Canvas.
 * If the image is > 1MB, it iteratively adjusts dimensions and quality until under 1MB.
 */
export async function compressImage(
  file: File,
  maxBytes: number = MAX_ALLOWED_BYTES
): Promise<CompressionResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Image compression must be executed on the client device.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be a valid image (JPEG, PNG, WebP).');
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read selected image file.'));
    };

    reader.onload = (e) => {
      const initialDataUrl = e.target?.result as string;
      if (!initialDataUrl) {
        reject(new Error('Empty image data received.'));
        return;
      }

      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to load image for client-side processing.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down dimensions if larger than MAX_DIMENSION
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to initialize 2D canvas context.'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try JPEG with decreasing quality until size is under maxBytes
        let quality = 0.88;
        let finalDataUrl = canvas.toDataURL('image/jpeg', quality);
        let byteSize = getDataUrlByteSize(finalDataUrl);

        while (byteSize > maxBytes && quality > 0.2) {
          quality -= 0.12;
          finalDataUrl = canvas.toDataURL('image/jpeg', quality);
          byteSize = getDataUrlByteSize(finalDataUrl);
        }

        // If still over 1MB after quality reduction, scale down dimensions further
        if (byteSize > maxBytes) {
          canvas.width = Math.round(width * 0.6);
          canvas.height = Math.round(height * 0.6);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          finalDataUrl = canvas.toDataURL('image/jpeg', 0.65);
          byteSize = getDataUrlByteSize(finalDataUrl);
        }

        resolve({
          dataUrl: finalDataUrl,
          fileSize: byteSize,
          fileSizeFormatted: formatBytes(byteSize),
          wasCompressed: originalSize > maxBytes || originalSize > byteSize,
          originalSize,
          width: canvas.width,
          height: canvas.height,
        });
      };

      img.src = initialDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
