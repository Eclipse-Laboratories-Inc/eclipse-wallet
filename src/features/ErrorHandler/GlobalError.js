import React from 'react';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';

class GlobalError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(errorInfo, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <GlobalLayout fullscreen>
          <GlobalText>Something went wrong.</GlobalText>
        </GlobalLayout>
      );
    }

    return this.props.children;
  }
}

export default GlobalError;
