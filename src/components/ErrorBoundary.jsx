import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '2rem', color: 'white' }} role="alert">
          Something went wrong while loading StadiumPulse.
        </div>
      );
    }

    return this.props.children;
  }
}