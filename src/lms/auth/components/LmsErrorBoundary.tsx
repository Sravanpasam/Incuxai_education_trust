import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LmsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LMS Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f7f3',
          color: '#0c1628',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            background: '#ffffff',
            padding: '2.5rem 2rem',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(12,22,40,0.1)',
            border: '1px solid rgba(12,22,40,0.08)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 1.2rem',
              boxShadow: '0 6px 20px rgba(155,122,62,0.3)'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 8px' }}>
              Something Went Wrong
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              The Learning Hub encountered a temporary glitch. Please click refresh to recover your session.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px -4px rgba(155, 122, 62, 0.35)'
              }}
            >
              Reload Learning Hub
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
