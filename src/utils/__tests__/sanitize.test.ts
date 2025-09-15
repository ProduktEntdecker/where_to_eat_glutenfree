import { sanitizeHTML, escapeText, sanitizeInput, sanitizeURL } from '../sanitize';

describe('Sanitization Utils', () => {
  describe('escapeText', () => {
    it('should escape HTML tags', () => {
      const input = '<script>alert("XSS")</script>';
      const result = escapeText(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should escape special characters', () => {
      const input = '< > & " \'';
      const result = escapeText(input);
      expect(result).toBe('&lt; &gt; &amp; " \'');
    });

    it('should handle normal text', () => {
      const input = 'Normal restaurant name';
      const result = escapeText(input);
      expect(result).toBe('Normal restaurant name');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = 'Search for <script>alert(1)</script> restaurants';
      const result = sanitizeInput(input);
      expect(result).toBe('Search for restaurants');
    });

    it('should remove javascript: protocols', () => {
      const input = 'javascript:alert(1)';
      const result = sanitizeInput(input);
      expect(result).toBe('alert(1)');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert(1) restaurant';
      const result = sanitizeInput(input);
      expect(result).toBe('alert(1) restaurant');
    });

    it('should normalize whitespace', () => {
      const input = '  multiple   spaces   ';
      const result = sanitizeInput(input);
      expect(result).toBe('multiple spaces');
    });
  });

  describe('sanitizeURL', () => {
    it('should allow http URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeURL(url)).toBe(url);
    });

    it('should allow https URLs', () => {
      const url = 'https://example.com';
      expect(sanitizeURL(url)).toBe(url);
    });

    it('should allow relative URLs', () => {
      const url = '/path/to/page';
      expect(sanitizeURL(url)).toBe(url);
    });

    it('should block javascript: URLs', () => {
      const url = 'javascript:alert(1)';
      expect(sanitizeURL(url)).toBe('#');
    });

    it('should block data: URLs', () => {
      const url = 'data:text/html,<script>alert(1)</script>';
      expect(sanitizeURL(url)).toBe('#');
    });
  });

  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<b>Bold</b> <i>Italic</i>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<b>Bold</b>');
      expect(result).toContain('<i>Italic</i>');
    });

    it('should remove dangerous tags', () => {
      const input = '<script>alert(1)</script><img src=x onerror=alert(1)>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('onerror');
    });

    it('should remove dangerous attributes', () => {
      const input = '<div onclick="alert(1)" class="safe">Test</div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
      expect(result).toContain('class="safe"');
    });
  });
});