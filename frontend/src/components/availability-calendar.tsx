'use client';

import React, { useState, useEffect } from 'react';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { useToast } from './toast-provider';

interface AvailabilityCalendarProps {
    vehicleId: string;
    onDateSelect?: (startDate: string, endDate: string) => void;
    selectedStartDate?: string;
    selectedEndDate?: string;
}

interface BookedDate {
    start_date: string;
    end_date: string;
}

interface Booking {
    id: number;
    wohnmobil_id: number;
    kunde_id: number;
    start_datum: string;
    end_datum: string;
    gesamtpreis: number;
    status: string;
    extras?: string;
    erstellt_am: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
    vehicleId,
    onDateSelect,
    selectedStartDate = '',
    selectedEndDate = ''
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const [selectingRange, setSelectingRange] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError, showWarning } = useToast();

    // Gebuchte Termine aus der API laden
    useEffect(() => {
        const fetchBookedDates = async () => {
            if (!vehicleId) return;

            try {
                setLoading(true);
                setError(null);

                // API-Endpunkt für Buchungen eines spezifischen Wohnmobils
                const response = await fetch(
                    buildApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}/wohnmobil/${vehicleId}`)
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const bookings: Booking[] = await response.json();

                // Nur bestätigte und angefragte Buchungen berücksichtigen
                const confirmedBookings = bookings.filter(
                    (booking) => booking.status === 'bestätigt' || booking.status === 'angefragt'
                );

                // Buchungen in das erwartete Format konvertieren (mit korrekter Datumsbehandlung)
                const bookedDateRanges: BookedDate[] = confirmedBookings.map((booking) => {
                    // UTC-Timestamps zu lokalen Daten konvertieren
                    const startDate = new Date(booking.start_datum);
                    const endDate = new Date(booking.end_datum);

                    return {
                        start_date: formatDate(startDate),
                        end_date: formatDate(endDate)
                    };
                });

                setBookedDates(bookedDateRanges);
            } catch (err) {

                setError('Buchungen konnten nicht geladen werden');

                // Fallback auf Mockdaten bei Fehler
                const mockBookedDates: BookedDate[] = [
                    { start_date: '2025-10-15', end_date: '2025-10-18' },
                    { start_date: '2025-10-25', end_date: '2025-10-28' },
                    { start_date: '2025-11-05', end_date: '2025-11-08' },
                    { start_date: '2025-11-20', end_date: '2025-11-22' }
                ];
                setBookedDates(mockBookedDates);
            } finally {
                setLoading(false);
            }
        };

        fetchBookedDates();
    }, [vehicleId]);

    // Hilfsfunktionen für Datumberechnungen
    const getMonthStart = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getMonthEnd = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    const getCalendarDays = (date: Date) => {
        const monthStart = getMonthStart(date);
        const monthEnd = getMonthEnd(date);
        const startDate = new Date(monthStart);
        const endDate = new Date(monthEnd);

        // Beginne am Montag der Woche, in der der Monat beginnt
        startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

        // Ende am Sonntag der Woche, in der der Monat endet
        endDate.setDate(endDate.getDate() + ((7 - endDate.getDay()) % 7));

        const days = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const formatDate = (date: Date) => {
        // Verwende lokale Zeit statt UTC um Zeitzone-Probleme zu vermeiden
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isDateBooked = (date: string) => {
        return bookedDates.some((booking) => {
            // Neue Logik: Abreise-Tag wird auch als belegt angezeigt
            // Das Wohnmobil ist vom start_date bis zum end_date (inklusive) nicht verfügbar
            return date >= booking.start_date && date <= booking.end_date;
        });
    };

    const isDateInPast = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) < today;
    };

    const isDateSelected = (date: string) => {
        if (!selectedStartDate) return false;

        if (!selectedEndDate) {
            return date === selectedStartDate;
        }

        // String-Vergleich für konsistente Datumsbehandlung
        return date >= selectedStartDate && date <= selectedEndDate;
    };

    const isDateInHoverRange = (date: string) => {
        if (!tempStartDate || !hoveredDate) return false;

        const checkDate = new Date(date);
        const start = new Date(tempStartDate);
        const hovered = new Date(hoveredDate);

        const rangeStart = start <= hovered ? start : hovered;
        const rangeEnd = start <= hovered ? hovered : start;

        return checkDate >= rangeStart && checkDate <= rangeEnd;
    };

    // Verfügbarkeit prüfen (optional - für Echtzeit-Validierung)
    const checkAvailability = async (startDate: string, endDate: string): Promise<boolean> => {
        try {
            const response = await fetch(
                buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY, {
                    vehicle_id: vehicleId,
                    start_date: startDate,
                    end_date: endDate
                })
            );

            if (!response.ok) {

                return true; // Im Zweifelsfall als verfügbar annehmen
            }

            const result = await response.json();
            return result.available;
        } catch (err) {

            return true; // Im Zweifelsfall als verfügbar annehmen
        }
    };

    const handleDateClick = async (date: string) => {
        if (isDateBooked(date) || isDateInPast(date)) return;

        if (!selectingRange) {
            // Erste Datumsauswahl
            setTempStartDate(date);
            setSelectingRange(true);
            onDateSelect?.(date, '');
        } else {
            // Zweite Datumsauswahl
            const start = new Date(tempStartDate);
            const end = new Date(date);

            let finalStartDate = tempStartDate;
            let finalEndDate = date;

            if (end < start) {
                // Wenn Enddatum vor Startdatum liegt, tausche sie
                finalStartDate = date;
                finalEndDate = tempStartDate;
            }

            // Optional: Echtzeit-Verfügbarkeitsprüfung vor der Auswahl
            const isAvailable = await checkAvailability(finalStartDate, finalEndDate);

            if (!isAvailable) {
                showError(
                    'Zeitraum nicht verfügbar',
                    'Der gewählte Zeitraum ist bereits gebucht. Bitte wählen Sie andere Daten.'
                );
                return;
            }
            onDateSelect?.(finalStartDate, finalEndDate);
            setSelectingRange(false);
            setTempStartDate('');
            setHoveredDate(null);
        }
    };

    const getDayClassName = (date: string, isCurrentMonth: boolean) => {
        let baseClass =
            'w-10 h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 rounded-lg ';

        if (!isCurrentMonth) {
            baseClass += 'text-gray-300 ';
        } else if (isDateInPast(date)) {
            baseClass += 'text-gray-300 cursor-not-allowed ';
        } else if (isDateBooked(date)) {
            baseClass += 'bg-red-100 text-red-600 cursor-not-allowed line-through ';
        } else if (isDateSelected(date)) {
            baseClass += 'bg-blue-600 text-white font-semibold ';
        } else if (isDateInHoverRange(date) && selectingRange) {
            baseClass += 'bg-blue-200 text-blue-800 ';
        } else {
            baseClass += 'text-gray-700 hover:bg-blue-100 hover:text-blue-600 ';
        }

        return baseClass;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const resetSelection = () => {
        setSelectingRange(false);
        setTempStartDate('');
        setHoveredDate(null);
        onDateSelect?.('', '');
    };

    const calendarDays = getCalendarDays(currentMonth);
    const monthNames = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ];
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold">Verfügbarkeitskalender</h2>
                    {loading && (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>
                {(selectedStartDate || selectingRange) && (
                    <button onClick={resetSelection} className="text-sm text-gray-500 hover:text-red-600 underline">
                        Auswahl zurücksetzen
                    </button>
                )}
            </div>

            {/* Fehleranzeige */}
            {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-yellow-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.696-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <span className="text-sm text-yellow-800">{error} - Beispieldaten werden angezeigt</span>
                    </div>
                </div>
            )}

            {/* Kalender-Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h3 className="text-lg font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>

                <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Wochentage-Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Kalender-Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
                {calendarDays.map((day, index) => {
                    const dateString = formatDate(day);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                    return (
                        <div
                            key={index}
                            className={getDayClassName(dateString, isCurrentMonth)}
                            onClick={() => handleDateClick(dateString)}
                            onMouseEnter={() => selectingRange && setHoveredDate(dateString)}
                            onMouseLeave={() => selectingRange && setHoveredDate(null)}
                        >
                            {day.getDate()}
                        </div>
                    );
                })}
            </div>

            {/* Legende */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                        <span className="text-gray-600">Ausgewählt</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                        <span className="text-gray-600">Gebucht</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                        <span className="text-gray-600">Verfügbar</span>
                    </div>
                </div>

                {selectingRange && <p className="text-blue-600 font-medium">📅 Wählen Sie das Enddatum aus</p>}

                {selectedStartDate && selectedEndDate && (
                    <p className="text-green-600 font-medium">
                        ✅ {new Date(selectedStartDate).toLocaleDateString('de-DE')} -{' '}
                        {new Date(selectedEndDate).toLocaleDateString('de-DE')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
