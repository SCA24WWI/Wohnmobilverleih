'use client';

import { Navbar, Footer } from '@/components';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        passwort: '',
        passwortBestaetigen: '',
        vorname: '',
        nachname: '',
        rolle: '',
        rememberMe: false,
        agbAccepted: false
    });

    const { login, register, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const backUrl = searchParams.get('backUrl');

    // Redirect bereits angemeldete Benutzer
    useEffect(() => {
        if (user) {
            const redirectUrl = backUrl || '/';
            router.push(redirectUrl);
        }
    }, [user, router, backUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Anmeldung
                const success = await login(formData.email, formData.passwort, formData.rememberMe);
                if (success) {
                    const redirectUrl = backUrl || '/';
                    router.push(redirectUrl);
                } else {
                    setError('Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben.');
                }
            } else {
                // Registrierung
                if (formData.passwort !== formData.passwortBestaetigen) {
                    setError('Passwörter stimmen nicht überein.');
                    return;
                }

                if (!formData.agbAccepted) {
                    setError('Bitte akzeptieren Sie die AGB und Datenschutzbestimmungen.');
                    return;
                }

                const success = await register({
                    email: formData.email,
                    passwort: formData.passwort,
                    vorname: formData.vorname,
                    nachname: formData.nachname,
                    rolle: formData.rolle as 'kunde' | 'anbieter'
                });

                if (success) {
                    const redirectUrl = backUrl || '/';
                    router.push(redirectUrl);
                } else {
                    setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
                }
            }
        } catch (error) {
            setError('Ein unerwarteter Fehler ist aufgetreten.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                        {/* Toggle Buttons */}
                        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    isLogin ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Anmelden
                            </button>
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setError('');
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    !isLogin ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Registrieren
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            {isLogin ? 'Anmelden' : 'Registrieren'}
                        </h1>

                        {backUrl && (
                            <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
                                <p className="text-sm">
                                    Um ein Wohnmobil zu buchen, müssen Sie sich zuerst anmelden. Nach der erfolgreichen
                                    Anmeldung können Sie Ihre Buchung fortsetzen.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Registrierung - Name Felder */}
                            {!isLogin && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
                                        <input
                                            type="text"
                                            name="vorname"
                                            value={formData.vorname}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Vorname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
                                        <input
                                            type="text"
                                            name="nachname"
                                            value={formData.nachname}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Nachname"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* E-Mail Feld */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="ihre@email.com"
                                />
                            </div>

                            {/* Passwort Feld */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
                                <input
                                    type="password"
                                    name="passwort"
                                    value={formData.passwort}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Passwort eingeben"
                                />
                            </div>

                            {/* Registrierung - Passwort bestätigen und Rolle */}
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Passwort bestätigen
                                        </label>
                                        <input
                                            type="password"
                                            name="passwortBestaetigen"
                                            value={formData.passwortBestaetigen}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Passwort wiederholen"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rolle</label>
                                        <select
                                            name="rolle"
                                            value={formData.rolle}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Rolle auswählen</option>
                                            <option value="kunde">Kunde</option>
                                            <option value="anbieter">Anbieter</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Anmelden - Angemeldet bleiben */}
                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-700">Angemeldet bleiben</label>
                                    </div>
                                    <a href="#" className="text-sm text-green-600 hover:underline">
                                        Passwort vergessen?
                                    </a>
                                </div>
                            )}

                            {/* Registrierung - AGB */}
                            {!isLogin && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="agbAccepted"
                                        checked={formData.agbAccepted}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Ich akzeptiere die{' '}
                                        <a href="#" className="text-green-600 hover:underline">
                                            AGB
                                        </a>{' '}
                                        und{' '}
                                        <a href="#" className="text-green-600 hover:underline">
                                            Datenschutzbestimmungen
                                        </a>
                                    </label>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
                            >
                                {loading ? 'Bitte warten...' : isLogin ? 'Anmelden' : 'Registrieren'}
                            </button>

                            {/* Social Media Buttons - nur bei Anmeldung */}
                            {isLogin && (
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">Oder anmelden mit</p>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                                        >
                                            Google
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md transition-colors duration-300"
                                        >
                                            GitHub
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
