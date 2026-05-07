/**
 * ErrorBoundary Component
 * 
 * Hierarchical error boundaries:
 * - Global error boundary (app level)
 * - Feature error boundary (feature level)
 */

import { Component } from 'react';
import ErrorHandlingService from '../services/ErrorHandlingService';

// Global Error Boundary
export class GlobalErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    ErrorHandlingService.logError({
      component: 'GlobalErrorBoundary',
      action: 'render',
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: Date.now(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="bg-dark-card border border-primary-pink rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Please reload the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Feature Error Boundary
export class FeatureErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    ErrorHandlingService.logError({
      component: this.props.feature || 'FeatureErrorBoundary',
      action: 'render',
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: Date.now(),
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-dark-card border border-primary-pink rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-white mb-4">
            Unable to load {this.props.feature || 'this feature'}
          </p>
          <button
            onClick={this.resetError}
            className="bg-primary-cyan text-dark-bg px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
