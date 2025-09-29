'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    vorname: string;
    nachname: string;
    rolle: 'kunde' | 'anbieter' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

interface RegisterData {
    email: string;
    passwort: string;
    vorname: string;
    nachname: string;
    rolle: 'kunde' | 'anbieter';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Token aus localStorage beim Start laden
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            setToken(savedToken);
            verifyToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Token in localStorage speichern/entfernen
    useEffect(() => {
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }, [token]);

    const verifyToken = async (tokenToVerify: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/verify', {
                headers: {
                    Authorization: `Bearer ${tokenToVerify}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token ist ungültig
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Token Verification Error:', error);
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    passwort: password,
                    rememberMe
                })
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                return true;
            } else {
                console.error('Login failed:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (userData: RegisterData): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                return true;
            } else {
                console.error('Registration failed:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
