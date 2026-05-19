import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/convert/route';
import { marked } from 'marked';
import sharp from 'sharp';

// Mock sharp
vi.mock('sharp', () => {
  return {
    default: vi.fn(() => ({
      metadata: vi.fn(() => Promise.resolve({ width: 100, height: 100 }))
    }))
  };
});

// Mock pdfkit
vi.mock('pdfkit', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('chunk'));
          }
          if (event === 'end') {
            process.nextTick(callback);
          }
        }),
        image: vi.fn(),
        end: vi.fn()
      };
    })
  };
});

// Mock marked
vi.mock('marked', () => {
  return {
    marked: {
      parse: vi.fn((text) => `<h1>${text}</h1>`)
    }
  };
});

describe('Conversion API', () => {
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      text: () => Promise.resolve('ok')
    });
    vi.clearAllMocks();
    process.env.GOTENBERG_URL = 'http://localhost:3020';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const createRequest = (format: string, size: number = 1000) => {
    const formData = new FormData();
    const file = new File([new ArrayBuffer(size)], `test${format}`, { type: 'application/octet-stream' });
    formData.append('file', file);
    formData.append('format', format);

    return new NextRequest('http://localhost/api/convert', {
      method: 'POST',
      body: formData
    });
  };

  it('routes .docx to libreoffice documents endpoint', async () => {
    const req = createRequest('.docx');
    await POST(req);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3020/forms/libreoffice/convert',
      expect.any(Object)
    );
  });

  it('routes .xlsx to libreoffice spreadsheets endpoint', async () => {
    const req = createRequest('.xlsx');
    await POST(req);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3020/forms/libreoffice/convert',
      expect.any(Object)
    );
  });

  it('routes .pptx to libreoffice presentations endpoint', async () => {
    const req = createRequest('.pptx');
    await POST(req);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3020/forms/libreoffice/convert',
      expect.any(Object)
    );
  });

  it('routes .md to chromium html endpoint after marked', async () => {
    const req = createRequest('.md');
    await POST(req);
    expect(marked.parse).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3020/forms/chromium/convert/html',
      expect.any(Object)
    );
  });

  it('uses sharp and pdfkit for .png and does not call Gotenberg', async () => {
    const req = createRequest('.png');
    await POST(req);
    expect(sharp).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 413 error if file is over 50MB', async () => {
    const size = 51 * 1024 * 1024; // 51MB
    const req = createRequest('.docx', size);
    const response = await POST(req);
    expect(response.status).toBe(413);
  });
});
