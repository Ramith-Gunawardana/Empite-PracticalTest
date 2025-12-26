import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import auth, { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Alert } from 'react-native';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authInstance = getAuth();

  useEffect(() => {
    // Firebase auth state listener using modular API
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      });
      
      console.log('Sign in with:', email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signInWithFacebook = async () => {
    // Temporary: Facebook login disabled
    Alert.alert(
      'Coming Soon',
      'Facebook login is temporarily unavailable. Please use email/password login.',
      [{ text: 'OK' }]
    );

    // try {
    //   const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    //   if (result.isCancelled) {
    //     throw new Error('User cancelled the login process');
    //   }

    //   const data = await AccessToken.getCurrentAccessToken();

    //   if (!data) {
    //     throw new Error('Something went wrong obtaining access token');
    //   }

    //   // Create Firebase credential with Facebook access token (using default import)
    //   const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
    //   // Sign in with the credential (using default import)
    //   const userCredential = await auth().signInWithCredential(facebookCredential);

    //   setUser({
    //     uid: userCredential.user.uid,
    //     email: userCredential.user.email,
    //     displayName: userCredential.user.displayName,
    //   });
      
    //   console.log('Facebook sign in: ', userCredential.user.email);
    // } catch (error: any) {
    //   throw new Error(error.message || 'Failed to sign in with Facebook');
    // }
  };

  const signOut = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithFacebook, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
