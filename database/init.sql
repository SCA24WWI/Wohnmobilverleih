CREATE TABLE
    IF NOT EXISTS benutzer (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwort_hash VARCHAR(255) NOT NULL,
        vorname VARCHAR(100),
        nachname VARCHAR(100),
        rolle VARCHAR(20) NOT NULL CHECK (rolle IN ('kunde', 'anbieter', 'admin')),
        erstellt_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS wohnmobile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        modell VARCHAR(100),
        beschreibung TEXT,
        bettenzahl INTEGER NOT NULL,
        fuehrerschein VARCHAR(10) NOT NULL,
        ort VARCHAR(100),
        preis_pro_tag NUMERIC(8, 2) NOT NULL,
        erstellt_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS buchungen (
        id SERIAL PRIMARY KEY,
        wohnmobil_id INTEGER NOT NULL REFERENCES wohnmobile (id) ON DELETE CASCADE,
        kunde_id INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
        start_datum DATE NOT NULL,
        end_datum DATE NOT NULL,
        gesamtpreis NUMERIC(10, 2),
        status VARCHAR(20) NOT NULL DEFAULT 'angefragt' CHECK (status IN ('angefragt', 'bestätigt', 'storniert')),
        extras JSONB DEFAULT '[]',
        notizen TEXT,
        gebucht_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            CONSTRAINT start_vor_ende CHECK (start_datum < end_datum)
    );

INSERT INTO
    benutzer (email, passwort_hash, vorname, nachname, rolle)
VALUES
    (
        'anbieter@test.de',
        'gehashtes_passwort_123',
        'Max',
        'Mustermann',
        'anbieter'
    ),
    (
        'kunde@test.de',
        'gehashtes_passwort_456',
        'Erika',
        'Musterfrau',
        'kunde'
    );

INSERT INTO
    wohnmobile (
        name,
        modell,
        bettenzahl,
        fuehrerschein,
        ort,
        preis_pro_tag
    )
VALUES
    (
        'Knaus Sky Traveller',
        'Teilintegriert',
        4,
        'B',
        'München',
        110.00
    ),
    (
        'Bürstner Lyseo',
        'Alkoven',
        5,
        'C1',
        'Berlin',
        135.50
    ),
    (
        'Hymer B-Klasse SL',
        'Vollintegriert',
        4,
        'C1',
        'Hamburg',
        145.00
    ),
    (
        'Weinsberg CaraCore',
        'Kastenwagen',
        2,
        'B',
        'Köln',
        85.00
    ),
    (
        'Dethleffs Trend',
        'Teilintegriert',
        6,
        'C1',
        'Frankfurt',
        125.00
    ),
    (
        'Adria Coral Axess',
        'Vollintegriert',
        5,
        'C1',
        'Stuttgart',
        155.00
    ),
    (
        'Pössl Roadcamp',
        'Kastenwagen',
        2,
        'B',
        'Dresden',
        95.00
    ),
    (
        'Carthago Chic S-Plus',
        'Vollintegriert',
        4,
        'C1',
        'Düsseldorf',
        165.00
    ),
    (
        'Laika Ecovip',
        'Teilintegriert',
        3,
        'B',
        'Leipzig',
        115.00
    ),
    (
        'Hobby Optima Deluxe',
        'Alkoven',
        6,
        'C1',
        'Nürnberg',
        140.00
    ),
    (
        'Malibu Van Charming',
        'Kastenwagen',
        2,
        'B',
        'Bremen',
        88.00
    ),
    (
        'Roller Team Zefiro',
        'Teilintegriert',
        4,
        'C1',
        'Hannover',
        120.00
    ),
    (
        'Sunlight Cliff Adventure',
        'Alkoven',
        7,
        'C1',
        'Dortmund',
        150.00
    );