import React, { useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    useEffect(() => {
      // Check for token in localStorage
      const token = localStorage.getItem('token');

      // If token is not present, redirect or handle authentication logic
      if (!token) {
        // For example, you can redirect to the login page
        // Replace '/login' with your actual login route
        window.location.href = '/auth/login';
      }

      // Additional authentication logic can be added here, if needed

    }, []); // Empty dependency array ensures the effect runs only once

    // Render the wrapped component if authentication is successful
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
