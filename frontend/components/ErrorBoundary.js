import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h2 className="text-red-400 font-semibold">Something went wrong</h2>
          <p className="text-gray-400 mt-2">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 