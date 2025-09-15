/**
 * Error Boundary implementation for vanilla JavaScript
 * Catches and handles errors to prevent app crashes
 */

export class ErrorBoundary {
  private static originalContent: string = '';
  private static errorCount = 0;
  private static readonly MAX_ERRORS = 5; // Prevent infinite error loops

  /**
   * Initialize error boundary
   */
  static init(): void {
    // Save original content for recovery
    const app = document.getElementById('app');
    if (app) {
      this.originalContent = app.innerHTML;
    }

    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Runtime Error');
      event.preventDefault();
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Async Error');
      event.preventDefault();
    });
  }

  /**
   * Handle caught errors
   */
  static handleError(error: Error | unknown, type: string = 'Error'): void {
    this.errorCount++;

    // Prevent error spam
    if (this.errorCount > this.MAX_ERRORS) {
      console.error('Too many errors, stopping error handling');
      return;
    }

    // Log error for debugging
    console.error(`[${type}]`, error);

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error);
    }

    // Show user-friendly error message
    this.showErrorUI(error, type);
  }

  /**
   * Display error UI to user
   */
  private static showErrorUI(error: Error | unknown, type: string): void {
    const app = document.getElementById('app');
    if (!app) return;

    // Create error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    app.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900">Oops! Something went wrong</h2>
          </div>

          <p class="text-gray-600 mb-4">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>

          ${process.env.NODE_ENV !== 'production' ? `
            <details class="mb-4">
              <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical details
              </summary>
              <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
${this.escapeHtml(errorMessage)}
Type: ${type}
              </pre>
            </details>
          ` : ''}

          <div class="flex gap-3">
            <button
              onclick="ErrorBoundary.recover()"
              class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Try Again
            </button>
            <button
              onclick="location.reload()"
              class="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attempt to recover from error
   */
  static recover(): void {
    const app = document.getElementById('app');
    if (app && this.originalContent) {
      app.innerHTML = this.originalContent;
      this.errorCount = 0; // Reset error count

      // Re-initialize app
      const event = new CustomEvent('app:reinit');
      window.dispatchEvent(event);
    } else {
      location.reload();
    }
  }

  /**
   * Report error to tracking service
   */
  private static reportError(error: Error | unknown): void {
    // In production, send to error tracking service like Sentry
    // For now, just log to console
    const errorData = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Example: Send to your error tracking endpoint
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) })
    console.log('Error report:', errorData);
  }

  /**
   * Escape HTML to prevent XSS in error display
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Wrap async functions with error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, 'Async Operation');
      return fallback;
    }
  }

  /**
   * Wrap sync functions with error handling
   */
  static wrap<T>(
    fn: () => T,
    fallback?: T
  ): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.handleError(error, 'Sync Operation');
      return fallback;
    }
  }
}

// Make ErrorBoundary available globally for onclick handlers
(window as any).ErrorBoundary = ErrorBoundary;