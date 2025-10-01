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
        hauptbild VARCHAR(500),
        galerie_bilder JSONB DEFAULT '[]',
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
        preis_pro_tag,
        hauptbild,
        galerie_bilder
    )
VALUES
    (
        'Knaus Sky Traveller',
        'Teilintegriert',
        4,
        'B',
        'München',
        110.00,
        '/image/vehicles/knaus-sky-traveller/main.png',
        '["/image/vehicles/knaus-sky-traveller/gallery1.png", "/image/vehicles/knaus-sky-traveller/gallery2.png", "/image/vehicles/knaus-sky-traveller/gallery3.png"]'
    ),
    (
        'Bürstner Lyseo',
        'Alkoven',
        5,
        'C1',
        'Berlin',
        135.50,
        '/image/vehicles/buerstner-lyseo/main.png',
        '["/image/vehicles/buerstner-lyseo/gallery1.png", "/image/vehicles/buerstner-lyseo/gallery2.png", "/image/vehicles/buerstner-lyseo/gallery3.png"]'
    ),
    (
        'Hymer B-Klasse SL',
        'Vollintegriert',
        4,
        'C1',
        'Hamburg',
        145.00,
        '/image/vehicles/hymer-b-klasse-sl/main.png',
        '["/image/vehicles/hymer-b-klasse-sl/gallery1.png", "/image/vehicles/hymer-b-klasse-sl/gallery2.png", "/image/vehicles/hymer-b-klasse-sl/gallery3.png", "/image/vehicles/hymer-b-klasse-sl/gallery4.png"]'
    ),
    (
        'Weinsberg CaraCore',
        'Kastenwagen',
        2,
        'B',
        'Köln',
        85.00,
        '/image/vehicles/weinsberg-caracore/main.png',
        '["/image/vehicles/weinsberg-caracore/gallery1.png", "/image/vehicles/weinsberg-caracore/gallery2.png", "/image/vehicles/weinsberg-caracore/gallery3.png"]'
    ),
    (
        'Dethleffs Trend',
        'Teilintegriert',
        6,
        'C1',
        'Frankfurt',
        125.00,
        '/image/vehicles/dethleffs-trend/main.png',
        '["/image/vehicles/dethleffs-trend/gallery1.png", "/image/vehicles/dethleffs-trend/gallery2.png", "/image/vehicles/dethleffs-trend/gallery3.png"]'
    ),
    (
        'Adria Coral Axess',
        'Vollintegriert',
        5,
        'C1',
        'Stuttgart',
        155.00,
        '/image/vehicles/adria-coral-axess/main.png',
        '["/image/vehicles/adria-coral-axess/gallery1.png", "/image/vehicles/adria-coral-axess/gallery2.png", "/image/vehicles/adria-coral-axess/gallery3.png"]'
    ),
    (
        'Pössl Roadcamp',
        'Kastenwagen',
        2,
        'B',
        'Dresden',
        95.00,
        '/image/vehicles/poessl-roadcamp/main.png',
        '["/image/vehicles/poessl-roadcamp/gallery1.png", "/image/vehicles/poessl-roadcamp/gallery2.png", "/image/vehicles/poessl-roadcamp/gallery3.png"]'
    ),
    (
        'Carthago Chic S-Plus',
        'Vollintegriert',
        4,
        'C1',
        'Düsseldorf',
        165.00,
        '/image/vehicles/carthago-chic-s-plus/main.png',
        '["/image/vehicles/carthago-chic-s-plus/gallery1.png", "/image/vehicles/carthago-chic-s-plus/gallery2.png", "/image/vehicles/carthago-chic-s-plus/gallery3.png"]'
    ),
    (
        'Laika Ecovip',
        'Teilintegriert',
        3,
        'B',
        'Leipzig',
        115.00,
        '/image/vehicles/laika-ecovip/main.png',
        '["/image/vehicles/laika-ecovip/gallery1.png", "/image/vehicles/laika-ecovip/gallery2.png", "/image/vehicles/laika-ecovip/gallery3.png"]'
    ),
    (
        'Hobby Optima Deluxe',
        'Alkoven',
        6,
        'C1',
        'Nürnberg',
        140.00,
        '/image/vehicles/hobby-optima-deluxe/main.png',
        '["/image/vehicles/hobby-optima-deluxe/gallery1.png", "/image/vehicles/hobby-optima-deluxe/gallery2.png", "/image/vehicles/hobby-optima-deluxe/gallery3.png", "/image/vehicles/hobby-optima-deluxe/gallery4.png"]'
    ),
    (
        'Malibu Van Charming',
        'Kastenwagen',
        2,
        'B',
        'Bremen',
        88.00,
        '/image/vehicles/malibu-van-charming/main.png',
        '["/image/vehicles/malibu-van-charming/gallery1.png", "/image/vehicles/malibu-van-charming/gallery2.png", "/image/vehicles/malibu-van-charming/gallery3.png"]'
    ),
    (
        'Roller Team Zefiro',
        'Teilintegriert',
        4,
        'C1',
        'Hannover',
        120.00,
        '/image/vehicles/roller-team-zefiro/main.png',
        '["/image/vehicles/roller-team-zefiro/gallery1.png", "/image/vehicles/roller-team-zefiro/gallery2.png", "/image/vehicles/roller-team-zefiro/gallery3.png"]'
    ),
    (
        'Sunlight Cliff Adventure',
        'Alkoven',
        7,
        'C1',
        'Dortmund',
        150.00,
        '/image/vehicles/sunlight-cliff-adventure/main.png',
        '["/image/vehicles/sunlight-cliff-adventure/gallery1.png", "/image/vehicles/sunlight-cliff-adventure/gallery2.png", "/image/vehicles/sunlight-cliff-adventure/gallery3.png", "/image/vehicles/sunlight-cliff-adventure/gallery4.png"]'
    );