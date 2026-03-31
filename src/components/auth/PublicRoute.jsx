import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();

    if(loading){
        // You can add a loading spinner here if you want
        return <div>Loading...</div>;
    }

    if(isAuthenticated){
      return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute
