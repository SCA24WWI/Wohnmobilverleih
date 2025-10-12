'use client';

import { Navbar, Footer } from '@/components';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Token validieren beim Laden der Seite
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('Kein gültiger Reset-Token gefunden');
                setTokenValid(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/auth/validate-reset-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                });

                if (response.ok) {
                    setTokenValid(true);
                } else {
                    const data = await response.json();
                    setError(data.message || 'Token ist ungültig oder abgelaufen');
                    setTokenValid(false);
                }
            } catch (error) {
                setError('Fehler beim Validieren des Tokens');
                setTokenValid(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validierung
        if (password !== confirmPassword) {
            setError('Passwörter stimmen nicht überein');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Passwort muss mindestens 6 Zeichen lang sein');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newPassword: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Passwort erfolgreich zurückgesetzt! Sie werden zur Anmeldung weitergeleitet...');

                // Nach 3 Sekunden zur Login-Seite weiterleiten
                setTimeout(() => {
                    router.push('/auth');
                }, 3000);
            } else {
                setError(data.message || 'Fehler beim Zurücksetzen des Passworts');
            }
        } catch (error) {
            setError('Ein unerwarteter Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    if (tokenValid === null) {
        // Loading state während Token-Validierung
        return (
            <>
                <Navbar />
                <div className="pt-24 min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Token wird validiert...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (tokenValid === false) {
        // Token ist ungültig oder abgelaufen
        return (
            <>
                <Navbar />
                <div className="pt-24 min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ungültiger Link</h1>
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                {error}
                            </div>
                            <p className="text-gray-600 mb-6">
                                Der Reset-Link ist möglicherweise abgelaufen oder wurde bereits verwendet.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="/auth"
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Zur Anmeldung
                                </a>
                                <button
                                    onClick={() => {
                                        // Zu Passwort vergessen weiterleiten
                                        router.push('/auth');
                                    }}
                                    className="block w-full text-green-600 hover:text-green-700 px-6 py-3 rounded-lg font-medium border border-green-600 hover:border-green-700 transition-colors"
                                >
                                    Neuen Reset-Link anfordern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (success) {
        // Erfolgreiche Passwort-Änderung
        return (
            <>
                <Navbar />
                <div className="pt-24 min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                            <div className="text-green-500 text-6xl mb-4">✅</div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Passwort zurückgesetzt!</h1>
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                {success}
                            </div>
                            <div className="animate-pulse">
                                <div className="flex items-center justify-center text-gray-600">
                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Weiterleitung zur Anmeldung...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Hauptformular für Passwort-Reset
    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <div className="text-green-600 text-5xl mb-4">🔑</div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Neues Passwort setzen</h1>
                            <p className="text-gray-600">Geben Sie Ihr neues Passwort ein</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Neues Passwort *</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Mindestens 6 Zeichen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passwort bestätigen *
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Passwort wiederholen"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Hinweis:</strong> Nach der Passwort-Änderung können Sie sich mit dem neuen
                                    Passwort anmelden.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Wird gesetzt...
                                    </div>
                                ) : (
                                    '🔐 Passwort setzen'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a href="/auth" className="text-sm text-gray-600 hover:text-gray-800">
                                ← Zurück zur Anmeldung
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
