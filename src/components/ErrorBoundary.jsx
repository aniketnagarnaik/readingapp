import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error: error.message || 'Something went wrong' };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'white', textAlign: 'center' }}>
          <h2>Oops!</h2>
          <p>{this.state.error}</p>
          <button
            onClick={function () { window.location.reload(); }}
            style={{ padding: '12px 24px', fontSize: '1.2rem', marginTop: 20 }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
