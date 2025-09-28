import { Navbar, Footer } from '@/components';

export default function AnmeldenPage() {
    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            Anmelden
                        </h1>
                        
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-Mail
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="ihre@email.com"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Passwort
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Passwort eingeben"
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Angemeldet bleiben
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-green-600 hover:underline">
                                    Passwort vergessen?
                                </a>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
                            >
                                Anmelden
                            </button>
                            
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
                            
                            <p className="text-center text-gray-600">
                                Noch kein Konto?{' '}
                                <a href="/registrieren" className="text-green-600 hover:underline">
                                    Hier registrieren
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}