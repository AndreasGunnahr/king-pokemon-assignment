import { Component, type ComponentType, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  FallbackComponent: ComponentType<{ error: Error }>;
}

interface State {
  error: Error | null;
}

/**
 * Minimal error boundary - catches render/lazy-load failures below it and swaps
 * in `FallbackComponent`
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children, FallbackComponent } = this.props;

    if (error) {
      return <FallbackComponent error={error} />;
    }

    return children;
  }
}
