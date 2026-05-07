/**
 * InputSanitizer
 * 
 * Multi-layer input sanitization pipeline:
 * - Remove HTML tags
 * - Escape special characters
 * - Normalize whitespace
 * - Validate input length
 */

class InputSanitizer {
  /**
   * Sanitize input text
   */
  static sanitize(input) {
    if (!input) return '';

    // Step 1: Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Step 2: Escape special characters
    sanitized = this.escapeHtml(sanitized);

    // Step 3: Trim whitespace
    sanitized = sanitized.trim();

    // Step 4: Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
  }

  /**
   * Escape HTML special characters
   */
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Unescape HTML special characters
   */
  static unescapeHtml(text) {
    const map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
  }

  /**
   * Validate and sanitize input
   */
  static validate(input) {
    const sanitized = this.sanitize(input);

    if (sanitized.length === 0) {
      return { valid: false, error: 'Input is required', sanitized: '' };
    }

    if (sanitized.length < 3) {
      return { valid: false, error: 'Input too short (minimum 3 characters)', sanitized };
    }

    if (sanitized.length > 10000) {
      return { valid: false, error: 'Input too long (maximum 10,000 characters)', sanitized };
    }

    return { valid: true, sanitized };
  }

  /**
   * Remove special characters (keep alphanumeric and spaces)
   */
  static removeSpecialChars(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Sanitize for URL
   */
  static sanitizeForUrl(text) {
    return encodeURIComponent(text);
  }

  /**
   * Sanitize for filename
   */
  static sanitizeForFilename(text) {
    return text
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Check if input contains HTML
   */
  static containsHtml(text) {
    return /<[^>]*>/g.test(text);
  }

  /**
   * Check if input contains script tags
   */
  static containsScript(text) {
    return /<script[^>]*>.*?<\/script>/gi.test(text);
  }

  /**
   * Sanitize for display (preserve line breaks)
   */
  static sanitizeForDisplay(text) {
    const sanitized = this.sanitize(text);
    return sanitized.replace(/\n/g, '<br>');
  }
}

export default InputSanitizer;
