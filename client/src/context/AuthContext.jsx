// import React, { createContext, useState, useEffect } from 'react';
// import api from '../service/axios.mjs'; // Adjust path if necessary

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); 
//   const [avatarNumber, setAvatarNumber] = useState(null);

//   // Check session on page load
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const { data } = await api.get('/session');
//         if (data.loggedIn) {
//           setUser(data.username);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error('Error checking session:', error);
//         setUser(null); // Ensure user is set to null on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkSession();
//   }, []);


//   const generateAvatarNumber = () => {
//     return Math.floor(Math.random() * 20) + 1;
//   };

//   // Login function
//   const login = async (username, password) => {
//     try {
//       const { data } = await api.post('/login', { username, password });
//       const avatarNumber = generateAvatarNumber();
//       setAvatarNumber(avatarNumber);
//       setUser(username);
//       return { success: true, message: data.message };
//     } catch (error) {
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

 
//   const logout = async (navigate) => {
//     try {
//       await api.post('/logout');
//       setUser(null);
//       setAvatarNumber(null);
//       localStorage.removeItem('userAvatarSrc');
//       if (typeof navigate === 'function') {
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   // AuthContext values
//   const value = {
//     user,
//     login,
//     logout,
//     setUser, // Optional: Keep for flexibility
//     loading,
//     avatarNumber, // Useful for showing a loading spinner
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children} {/* Render children only after session check */}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';
import api from '../service/axios.mjs'; // Adjust path if necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [avatarNumber, setAvatarNumber] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...'); // Log session check start
        const { data } = await api.get('/session', { withCredentials: true });
        console.log('Session check response:', data); // Log session response
        if (data.loggedIn) {
          setUser(data.user); // Set user object which now includes id
          console.log('User set:', data.user);
          setAvatarNumber(generateAvatarNumber()); // Optional avatar number logic
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    checkSession();
  }, []);

  const generateAvatarNumber = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  // Login function
  const login = async (username, password) => {
    try {
      // Send login request to the server
      const { data } = await api.post('/login', { username, password }, { withCredentials: true });
      
      // Generate an avatar number for the user
      const avatarNumber = generateAvatarNumber();
      setAvatarNumber(avatarNumber);
  
      // Log the entire response data for debugging
      console.log('Login response data:', data);
  
      // Set user state with username and id received from the response
      setUser({ username: data.user.username, id: data.user.id }); // Use destructuring to get username and id
  
      console.log('User logged in:', { username: data.user.username, id: data.user.id }); // Log user details
  
      return { success: true, message: data.message }; // Return success message
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }; // Handle error
    }
  };

  const logout = async (navigate) => {
    try {
      await api.post('/logout', {}, { withCredentials: true }); 
      setUser(null);
      setAvatarNumber(null);
      localStorage.removeItem('userAvatarSrc');
      if (typeof navigate === 'function') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // AuthContext values
  const value = {
    user,
    login,
    logout,
    loading,
    avatarNumber,
  };
  

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};