import DOMPurify from 'dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe tags and attributes
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'a', 'div', 'p'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true
  });
}

/**
 * Escape text for safe display in HTML
 * Use this for dynamic text content that shouldn't contain HTML
 */
export function escapeText(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate and sanitize user input
 * Removes any potentially malicious content
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags
  const stripped = input.replace(/<[^>]*>/g, '');
  // Remove any script-like content
  const cleaned = stripped.replace(/javascript:|on\w+=/gi, '');
  // Trim and normalize whitespace
  return cleaned.trim().replace(/\s+/g, ' ');
}

/**
 * Validate URL to prevent javascript: and data: URLs
 */
export function sanitizeURL(url: string): string {
  // Only allow http, https, and relative URLs
  if (url.match(/^(https?:\/\/|\/)/)) {
    return url;
  }
  return '#'; // Safe fallback
}