'use client';

import { Navbar, Footer } from '@/components';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilPage() {
    const { user: authUser, token, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        vorname: '',
        nachname: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Formular mit Auth-User-Daten initialisieren
    useEffect(() => {
        if (authUser) {
            setFormData({
                vorname: authUser.vorname || '',
                nachname: authUser.nachname || '',
                email: authUser.email || ''
            });
        }
    }, [authUser]);

    // Formular-Änderungen verwalten
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Passwort-Formular-Änderungen verwalten
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Passwort ändern
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;

        // Validierung
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Neue Passwörter stimmen nicht überein');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Das neue Passwort muss mindestens 6 Zeichen lang sein');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:3001/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Fehler beim Ändern des Passworts');
            }

            setSuccess('Passwort erfolgreich geändert!');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            setError(err.message || 'Unbekannter Fehler beim Ändern des Passworts');
        } finally {
            setLoading(false);
        }
    };

    // Profil aktualisieren
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`http://localhost:3001/api/users/${authUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren des Profils');
            }

            const updatedUser = await response.json();
            setSuccess('Profil erfolgreich aktualisiert!');
            setIsEditing(false);

            // Formular mit aktualisierten Daten aktualisieren
            setFormData({
                vorname: updatedUser.vorname || '',
                nachname: updatedUser.nachname || '',
                email: updatedUser.email || ''
            });
        } catch (err: any) {
            setError('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler'));
        } finally {
            setLoading(false);
        }
    };

    // Auth Loading
    if (authLoading) {
        return (
            <>
                <Navbar />
                <section className="pt-24 pb-20 px-8 min-h-screen bg-gray-50">
                    <div className="container mx-auto flex justify-center items-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Profil wird geladen...</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    // Nicht angemeldet
    if (!authUser || !token) {
        return (
            <>
                <Navbar />
                <section className="pt-24 pb-20 px-8 min-h-screen bg-gray-50">
                    <div className="container mx-auto flex justify-center items-center">
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Nicht angemeldet</h1>
                            <p className="text-gray-600 mb-4">
                                Sie müssen sich anmelden, um auf Ihr Profil zuzugreifen.
                            </p>
                            <a
                                href="/auth"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            >
                                Zur Anmeldung
                            </a>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <section className="pt-24 pb-20 px-8 min-h-screen bg-gray-50">
                    <div className="container mx-auto flex justify-center items-center">
                        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-red-800 mb-4">Fehler</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <a
                                href="/auth"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Zur Anmeldung
                            </a>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="pt-24 pb-20 px-8 min-h-screen bg-gray-50">
                <div className="container mx-auto">
                    {/* Hero Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-bold mb-4 text-green-800">Mein Profil</h1>
                        <p className="mx-auto w-full px-4 text-xl font-medium text-black lg:w-8/12">
                            Verwalten Sie Ihre persönlichen Daten
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {authUser?.vorname} {authUser?.nachname}
                                </h2>
                                <p className="text-gray-600 text-lg mb-4">{authUser?.email}</p>
                                <div className="inline-flex items-center gap-2">
                                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                                        👤 Benutzer ID: {authUser?.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Persönliche Daten bearbeiten */}
                        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-semibold text-green-800">Persönliche Informationen</h3>
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            // Reset form data beim Abbrechen
                                            setFormData({
                                                vorname: authUser?.vorname || '',
                                                nachname: authUser?.nachname || '',
                                                email: authUser?.email || ''
                                            });
                                        }
                                        setIsEditing(!isEditing);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isEditing
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {isEditing ? '❌ Abbrechen' : '✏️ Bearbeiten'}
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vorname *
                                        </label>
                                        <input
                                            type="text"
                                            name="vorname"
                                            value={formData.vorname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            required
                                            className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                                isEditing
                                                    ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                                    : 'border border-gray-200 bg-gray-50 text-gray-600'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nachname *
                                        </label>
                                        <input
                                            type="text"
                                            name="nachname"
                                            value={formData.nachname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            required
                                            className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                                isEditing
                                                    ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                                    : 'border border-gray-200 bg-gray-50 text-gray-600'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-Mail Adresse *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                            isEditing
                                                ? 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                                : 'border border-gray-200 bg-gray-50 text-gray-600'
                                        }`}
                                    />
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Backend-Verbindung:</strong> Diese Daten werden direkt aus der Datenbank
                                        (Tabelle: benutzer) geladen und über die API-Route PUT /api/users/{authUser?.id}{' '}
                                        aktualisiert.
                                    </p>
                                </div>

                                {isEditing && (
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
                                        >
                                            💾 Änderungen speichern
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Passwort ändern */}
                        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-semibold text-green-800">Passwort ändern</h3>
                                <button
                                    onClick={() => {
                                        setIsChangingPassword(!isChangingPassword);
                                        if (isChangingPassword) {
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                        }
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isChangingPassword
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                                    }`}
                                >
                                    {isChangingPassword ? '❌ Abbrechen' : '🔑 Passwort ändern'}
                                </button>
                            </div>

                            {isChangingPassword && (
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Aktuelles Passwort *
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Ihr aktuelles Passwort eingeben"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Neues Passwort *
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Mindestens 6 Zeichen"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Neues Passwort bestätigen *
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Neues Passwort wiederholen"
                                        />
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-lg">
                                        <p className="text-sm text-amber-800">
                                            <strong>Sicherheitshinweis:</strong> Nach der Passwort-Änderung werden Sie
                                            automatisch abgemeldet und müssen sich mit dem neuen Passwort erneut
                                            anmelden.
                                        </p>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105 disabled:transform-none"
                                        >
                                            {loading ? '🔄 Wird geändert...' : '🔑 Passwort ändern'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!isChangingPassword && (
                                <div className="text-center py-4">
                                    <p className="text-gray-600">
                                        Klicken Sie auf "Passwort ändern" um Ihr Passwort zu aktualisieren.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Navigation zu anderen Bereichen */}
                        <div className="bg-white rounded-lg shadow-xl p-8">
                            <h3 className="text-2xl font-semibold text-green-800 mb-6 text-center">Weitere Aktionen</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <a
                                    href="/my-bookings"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center block"
                                >
                                    📋 Meine Buchungen verwalten
                                </a>
                                <a
                                    href="/wohnmobile"
                                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center block"
                                >
                                    🚐 Wohnmobile entdecken
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
