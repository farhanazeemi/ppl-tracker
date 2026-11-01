import { describe, it, expect } from 'vitest';
import { formatBytes, getDataUrlByteSize } from '../src/utils/imageCompression';

describe('imageCompression utilities', () => {
  it('formats bytes into human readable format correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });

  it('calculates byte size of base64 data URLs accurately', () => {
    // 4 chars base64 = 3 bytes
    const sampleDataUrl = 'data:image/jpeg;base64,' + Buffer.from('Hello PPL Tracker!').toString('base64');
    const calculatedSize = getDataUrlByteSize(sampleDataUrl);
    expect(calculatedSize).toBe(Buffer.from('Hello PPL Tracker!').length);
  });

  it('verifies 1MB threshold limit (1048576 bytes)', () => {
    const oneMbBytes = 1024 * 1024;
    expect(oneMbBytes).toBe(1048576);
    expect(formatBytes(oneMbBytes)).toBe('1 MB');
  });
});
