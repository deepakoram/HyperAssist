import React, { ReactNode } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Log the error and additional info
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleRetry = (): void => {
    // Reset the error state to re-render the children
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Image
            style={{
              height: 150,
              width: 150,
              marginLeft: 3,
              resizeMode: 'contain', // Use resizeMode instead of objectFit
            }}
            source={require('../../assets/Something_Went_Wrong.png')}
          />
          <Text style={styles.errorText}>Oops... Something went wrong.</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry} >
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 15,
    fontWeight:'600',
    marginBottom: 16,
    textAlign: 'center',
  },
  button:{
   borderWidth:1,
   borderColor:'black',
   borderRadius:16,
   paddingHorizontal:25,
   paddingVertical:5
  }
});

export default ErrorBoundary;
