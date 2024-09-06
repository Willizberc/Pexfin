// // src/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from '../services/firebase';

// interface AuthContextProps {
//   user: firebase.User | null;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

// export const AuthProvider: React.FC = ({ children }) => {
//   const [user, setUser] = useState<firebase.User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
