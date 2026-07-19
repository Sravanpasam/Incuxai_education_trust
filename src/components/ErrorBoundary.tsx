import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('IncuXAI Platform Runtime Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2.5rem',
          maxWidth: '700px',
          margin: '4rem auto',
          background: '#ffffff',
          border: '1px solid rgba(155, 122, 62, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(12, 22, 40, 0.1)',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#0c1628',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ⚠️
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0c1628' }}>System Diagnostics & Recovery</h2>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>IncuXAI Platform Resiliency Shield</span>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.2rem' }}>
            An unexpected error occurred during rendering. Your session progress has been safely preserved in local cache.
          </p>

          {this.state.error && (
            <div style={{ background: '#faf7f2', border: '1px solid rgba(155, 122, 62, 0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
              <strong style={{ fontSize: '0.82rem', color: '#9B7A3E', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Error Exception:</strong>
              <code style={{ fontSize: '0.85rem', color: '#dc2626', fontFamily: 'monospace' }}>
                {this.state.error.toString()}
              </code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleReset}
              style={{ background: 'linear-gradient(135deg, #9B7A3E, #7D6334)', border: 'none', color: '#ffffff', padding: '0.7rem 1.4rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer' }}
            >
              🔄 Refresh & Recover Workspace
            </button>
            <button
              onClick={this.handleClearStorage}
              style={{ background: '#faf7f2', border: '1px solid rgba(12, 22, 40, 0.15)', color: '#0c1628', padding: '0.7rem 1.4rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
            >
              🧹 Reset Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
