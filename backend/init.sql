CREATE TABLE IF NOT EXISTS benutzer (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwort_hash VARCHAR(255) NOT NULL,
    vorname VARCHAR(100),
    nachname VARCHAR(100),
    rolle VARCHAR(20) NOT NULL CHECK (rolle IN ('kunde', 'anbieter', 'admin')),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS wohnmobile (
    id SERIAL PRIMARY KEY,
    benutzer_id INTEGER NOT NULL REFERENCES benutzer(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    modell VARCHAR(100),
    beschreibung TEXT,
    bettenzahl INTEGER NOT NULL,
    fuehrerschein VARCHAR(10) NOT NULL,
    preis_pro_tag NUMERIC(8, 2) NOT NULL,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS buchungen (
    id SERIAL PRIMARY KEY,
    wohnmobil_id INTEGER NOT NULL REFERENCES wohnmobile(id) ON DELETE CASCADE,
    kunde_id INTEGER NOT NULL REFERENCES benutzer(id) ON DELETE CASCADE,
    start_datum DATE NOT NULL,
    end_datum DATE NOT NULL,
    gesamtpreis NUMERIC(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'angefragt' CHECK (status IN ('angefragt', 'bestätigt', 'storniert')),
    gebucht_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT start_vor_ende CHECK (start_datum < end_datum)
);

INSERT INTO benutzer (email, passwort_hash, vorname, nachname, rolle) VALUES
('anbieter@test.de', 'gehashtes_passwort_123', 'Max', 'Mustermann', 'anbieter'),
('kunde@test.de', 'gehashtes_passwort_456', 'Erika', 'Musterfrau', 'kunde');

INSERT INTO wohnmobile (benutzer_id, name, modell, bettenzahl, fuehrerschein, preis_pro_tag) VALUES
(1, 'Knaus Sky Traveller', 'Teilintegriert', 4, 'B', 110.00),
(1, 'Bürstner Lyseo', 'Alkoven', 5, 'C1', 135.50);