CREATE TABLE
    IF NOT EXISTS benutzer (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwort_hash VARCHAR(255) NOT NULL,
        vorname VARCHAR(100),
        nachname VARCHAR(100),
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
        features JSONB DEFAULT '[]',
        haustiere_erlaubt BOOLEAN DEFAULT FALSE,
        -- Technische Daten
        kraftstoffverbrauch NUMERIC(4, 1), -- l/100km
        motorleistung INTEGER, -- kW
        antriebsart VARCHAR(20), -- 'front', 'rear', 'all'
        schadstoffklasse VARCHAR(20), -- z.B. 'Euro 6'
        anhaengerlast INTEGER, -- kg
        leergewicht INTEGER, -- kg
        gesamtgewicht INTEGER, -- kg
        erstellt_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW ()
    );

-- ZENTRALE BUCHUNGSTABELLE für alle Buchungen
CREATE TABLE
    IF NOT EXISTS buchungen (
        id SERIAL PRIMARY KEY,
        wohnmobil_id INTEGER NOT NULL REFERENCES wohnmobile (id) ON DELETE CASCADE,
        kunde_id INTEGER NOT NULL REFERENCES benutzer (id) ON DELETE CASCADE,
        start_datum DATE NOT NULL,
        end_datum DATE NOT NULL,
        -- Grundlegende Informationen
        anzahl_naechte INTEGER,
        gesamtpreis NUMERIC(10, 2) NOT NULL,
        -- Zusätzliche Informationen
        extras JSONB DEFAULT '[]',
        notizen TEXT,
        gebucht_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            geaendert_am TIMESTAMP
        WITH
            TIME ZONE DEFAULT NOW (),
            CONSTRAINT start_vor_ende CHECK (start_datum < end_datum)
    );

INSERT INTO
    benutzer (email, passwort_hash, vorname, nachname)
VALUES
    (
        'anbieter@test.de',
        'gehashtes_passwort_123',
        'Max',
        'Mustermann'
    ),
    (
        'kunde@test.de',
        'gehashtes_passwort_456',
        'Erika',
        'Musterfrau'
    );

INSERT INTO
    wohnmobile (
        name,
        modell,
        beschreibung,
        bettenzahl,
        fuehrerschein,
        ort,
        preis_pro_tag,
        hauptbild,
        galerie_bilder,
        features,
        haustiere_erlaubt,
        kraftstoffverbrauch,
        motorleistung,
        antriebsart,
        schadstoffklasse,
        anhaengerlast,
        leergewicht,
        gesamtgewicht
    )
VALUES
    (
        'Knaus Sky Traveller',
        'Teilintegriert',
        'Der Knaus Sky Traveller ist das perfekte Wohnmobil für Familien und Paare, die Komfort mit Wendigkeit verbinden möchten. Mit seinem durchdachten Grundriss bietet es Platz für 4 Personen und verfügt über eine vollausgestattete Küche, ein komfortables Bad und eine gemütliche Sitzgruppe. Die große Markise sorgt für zusätzlichen Außenbereich.',
        4,
        'B',
        'München',
        110.00,
        '/image/vehicles/knaus-sky-traveller/main.png',
        '["/image/vehicles/knaus-sky-traveller/gallery1.png", "/image/vehicles/knaus-sky-traveller/gallery2.png", "/image/vehicles/knaus-sky-traveller/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Heizung", "Markise", "Kühlschrank", "Außensteckdose"]',
        TRUE,
        8.5, -- kraftstoffverbrauch
        110, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1500, -- anhaengerlast
        2800, -- leergewicht
        3500 -- gesamtgewicht
    ),
    (
        'Bürstner Lyseo',
        'Alkoven',
        'Der Bürstner Lyseo ist ein geräumiges Alkoven-Wohnmobil, ideal für Großfamilien oder Gruppen bis zu 5 Personen. Das charakteristische Alkoven-Bett bietet zusätzlichen Schlafplatz, während der großzügige Stauraum und der praktische Fahrradträger perfekt für längere Reisen sind. Die moderne Ausstattung mit Rückfahrkamera sorgt für sicheres Fahren.',
        5,
        'C1',
        'Berlin',
        135.50,
        '/image/vehicles/buerstner-lyseo/main.png',
        '["/image/vehicles/buerstner-lyseo/gallery1.png", "/image/vehicles/buerstner-lyseo/gallery2.png", "/image/vehicles/buerstner-lyseo/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Großer Stauraum", "Heizung", "Fahrradträger", "Kühlschrank", "Rückfahrkamera"]',
        TRUE,
        9.8, -- kraftstoffverbrauch
        140, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        2000, -- anhaengerlast
        3200, -- leergewicht
        4200 -- gesamtgewicht
    ),
    (
        'Hymer B-Klasse SL',
        'Vollintegriert',
        'Der Hymer B-Klasse SL verkörpert Luxus auf Rädern. Dieses vollintegrierte Premium-Wohnmobil bietet 4 Personen höchsten Komfort mit Klimaanlage, Sat-TV und Mikrowelle. Die luxuriöse Ausstattung und das elegante Design machen jede Reise zu einem besonderen Erlebnis. Perfekt für anspruchsvolle Reisende.',
        4,
        'C1',
        'Hamburg',
        145.00,
        '/image/vehicles/hymer-b-klasse-sl/main.png',
        '["/image/vehicles/hymer-b-klasse-sl/gallery1.png", "/image/vehicles/hymer-b-klasse-sl/gallery2.png", "/image/vehicles/hymer-b-klasse-sl/gallery3.png", "/image/vehicles/hymer-b-klasse-sl/gallery4.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Klimaanlage", "Luxus-Ausstattung", "Heizung", "Sat-TV", "Kühlschrank", "Mikrowelle"]',
        FALSE,
        10.2, -- kraftstoffverbrauch
        170, -- motorleistung
        'rear', -- antriebsart
        'Euro 6', -- schadstoffklasse
        2500, -- anhaengerlast
        3800, -- leergewicht
        4500 -- gesamtgewicht
    ),
    (
        'Weinsberg CaraCore',
        'Kastenwagen',
        'Der Weinsberg CaraCore ist der ideale Begleiter für spontane Abenteuer und Stadtausflüge. Als kompakter Kastenwagen für 2 Personen überzeugt er durch seine Wendigkeit und Stadtfahrtauglichkeit. Trotz seiner kompakten Größe bietet er alles Nötige für einen komfortablen Urlaub zu zweit.',
        2,
        'B',
        'Köln',
        85.00,
        '/image/vehicles/weinsberg-caracore/main.png',
        '["/image/vehicles/weinsberg-caracore/gallery1.png", "/image/vehicles/weinsberg-caracore/gallery2.png", "/image/vehicles/weinsberg-caracore/gallery3.png"]',
        '["Küche", "Bett", "Kompakt", "Stadtfahrtauglich", "Heizung", "Kühlschrank"]',
        FALSE,
        7.2, -- kraftstoffverbrauch
        96, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1200, -- anhaengerlast
        2200, -- leergewicht
        3200 -- gesamtgewicht
    ),
    (
        'Dethleffs Trend',
        'Teilintegriert',
        'Der Dethleffs Trend ist das perfekte Familien-Wohnmobil für bis zu 6 Personen. Mit seinem durchdachten Raumkonzept, WLAN-Ausstattung und praktischem Fahrradträger bietet er alles für den perfekten Familienurlaub. Die große Markise schafft zusätzlichen Lebensraum im Freien.',
        6,
        'C1',
        'Frankfurt',
        125.00,
        '/image/vehicles/dethleffs-trend/main.png',
        '["/image/vehicles/dethleffs-trend/gallery1.png", "/image/vehicles/dethleffs-trend/gallery2.png", "/image/vehicles/dethleffs-trend/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Heizung", "Markise", "Fahrradträger", "Kühlschrank", "WLAN"]',
        TRUE,
        9.1, -- kraftstoffverbrauch
        130, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1800, -- anhaengerlast
        3100, -- leergewicht
        4000 -- gesamtgewicht
    ),
    (
        'Adria Coral Axess',
        'Vollintegriert',
        'Das Adria Coral Axess ist ein luxuriöses vollintegriertes Wohnmobil mit erstklassiger Ausstattung. Die Solaranlage ermöglicht autarkes Reisen, während Klimaanlage und Geschirrspüler für höchsten Komfort sorgen. Perfekt für bis zu 5 Personen, die Wert auf Luxus und Nachhaltigkeit legen.',
        5,
        'C1',
        'Stuttgart',
        155.00,
        '/image/vehicles/adria-coral-axess/main.png',
        '["/image/vehicles/adria-coral-axess/gallery1.png", "/image/vehicles/adria-coral-axess/gallery2.png", "/image/vehicles/adria-coral-axess/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Klimaanlage", "Luxus-Ausstattung", "Solaranlage", "Kühlschrank", "Geschirrspüler"]',
        TRUE,
        11.5, -- kraftstoffverbrauch
        160, -- motorleistung
        'all', -- antriebsart
        'Euro 6', -- schadstoffklasse
        3000, -- anhaengerlast
        4100, -- leergewicht
        5000 -- gesamtgewicht
    ),
    (
        'Pössl Roadcamp',
        'Kastenwagen',
        'Der Pössl Roadcamp verbindet Umweltbewusstsein mit Reisefreiheit. Dieser kompakte Kastenwagen für 2 Personen ist mit einer Solaranlage ausgestattet und ermöglicht nachhaltiges Reisen. Die stadtfahrtauglichen Abmessungen machen ihn zum perfekten Begleiter für Städtetrips und Naturerlebnisse.',
        2,
        'B',
        'Dresden',
        95.00,
        '/image/vehicles/poessl-roadcamp/main.png',
        '["/image/vehicles/poessl-roadcamp/gallery1.png", "/image/vehicles/poessl-roadcamp/gallery2.png", "/image/vehicles/poessl-roadcamp/gallery3.png"]',
        '["Küche", "Bett", "Kompakt", "Stadtfahrtauglich", "Heizung", "Solaranlage", "Kühlschrank"]',
        TRUE,
        6.8, -- kraftstoffverbrauch
        88, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1000, -- anhaengerlast
        2100, -- leergewicht
        3000 -- gesamtgewicht
    ),
    (
        'Carthago Chic S-Plus',
        'Vollintegriert',
        'Das Carthago Chic S-Plus steht für absoluten Luxus und Premium-Qualität. Dieses vollintegrierte Wohnmobil bietet 4 Personen erstklassigen Komfort mit Sat-TV, Mikrowelle und Geschirrspüler. Die hochwertige Ausstattung und das elegante Design machen es zur ersten Wahl für anspruchsvolle Reisende.',
        4,
        'C1',
        'Düsseldorf',
        165.00,
        '/image/vehicles/carthago-chic-s-plus/main.png',
        '["/image/vehicles/carthago-chic-s-plus/gallery1.png", "/image/vehicles/carthago-chic-s-plus/gallery2.png", "/image/vehicles/carthago-chic-s-plus/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Klimaanlage", "Luxus-Ausstattung", "Sat-TV", "Kühlschrank", "Mikrowelle", "Geschirrspüler"]',
        FALSE,
        12.1, -- kraftstoffverbrauch
        180, -- motorleistung
        'rear', -- antriebsart
        'Euro 6', -- schadstoffklasse
        3500, -- anhaengerlast
        4500, -- leergewicht
        5500 -- gesamtgewicht
    ),
    (
        'Laika Ecovip',
        'Teilintegriert',
        'Der Laika Ecovip ist das perfekte Wohnmobil für umweltbewusste Reisende. Mit seiner Solaranlage ermöglicht er nachhaltiges und autarkes Camping für bis zu 3 Personen. Das durchdachte Raumkonzept und die hochwertige Ausstattung sorgen für Komfort bei gleichzeitig geringem ökologischem Fußabdruck.',
        3,
        'B',
        'Leipzig',
        115.00,
        '/image/vehicles/laika-ecovip/main.png',
        '["/image/vehicles/laika-ecovip/gallery1.png", "/image/vehicles/laika-ecovip/gallery2.png", "/image/vehicles/laika-ecovip/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Solaranlage", "Heizung", "Kühlschrank"]',
        TRUE,
        8.0, -- kraftstoffverbrauch
        115, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1600, -- anhaengerlast
        2900, -- leergewicht
        3700 -- gesamtgewicht
    ),
    (
        'Hobby Optima Deluxe',
        'Alkoven',
        'Das Hobby Optima Deluxe ist das ideale Familien-Wohnmobil für große Gruppen bis zu 6 Personen. Das geräumige Alkoven-Design bietet viel Platz und großen Stauraum für längere Reisen. Mit WLAN-Ausstattung und praktischem Fahrradträger ist es perfekt für moderne Familien ausgestattet.',
        6,
        'C1',
        'Nürnberg',
        140.00,
        '/image/vehicles/hobby-optima-deluxe/main.png',
        '["/image/vehicles/hobby-optima-deluxe/gallery1.png", "/image/vehicles/hobby-optima-deluxe/gallery2.png", "/image/vehicles/hobby-optima-deluxe/gallery3.png", "/image/vehicles/hobby-optima-deluxe/gallery4.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Großer Stauraum", "Fahrradträger", "Heizung", "Kühlschrank", "WLAN"]',
        TRUE,
        10.5, -- kraftstoffverbrauch
        150, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        2200, -- anhaengerlast
        3600, -- leergewicht
        4400 -- gesamtgewicht
    ),
    (
        'Malibu Van Charming',
        'Kastenwagen',
        'Der Malibu Van Charming überzeugt durch sein charmantes Design und seine praktische Ausstattung. Dieser kompakte Kastenwagen für 2 Personen ist ideal für romantische Ausflüge und spontane Abenteuer. Seine Stadtfahrtauglichkeit macht ihn zum perfekten Begleiter für vielfältige Reiseziele.',
        2,
        'B',
        'Bremen',
        88.00,
        '/image/vehicles/malibu-van-charming/main.png',
        '["/image/vehicles/malibu-van-charming/gallery1.png", "/image/vehicles/malibu-van-charming/gallery2.png", "/image/vehicles/malibu-van-charming/gallery3.png"]',
        '["Küche", "Bett", "Kompakt", "Stadtfahrtauglich", "Heizung", "Kühlschrank"]',
        FALSE,
        7.5, -- kraftstoffverbrauch
        90, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1100, -- anhaengerlast
        2000, -- leergewicht
        2900 -- gesamtgewicht
    ),
    (
        'Roller Team Zefiro',
        'Teilintegriert',
        'Der Roller Team Zefiro bietet das optimale Verhältnis von Komfort und Preis für 4 Personen. Dieses teilintegrierte Wohnmobil überzeugt durch seinen durchdachten Grundriss, die praktische Markise und die solide Ausstattung. Perfekt für Familien, die Wert auf Qualität zu einem fairen Preis legen.',
        4,
        'C1',
        'Hannover',
        120.00,
        '/image/vehicles/roller-team-zefiro/main.png',
        '["/image/vehicles/roller-team-zefiro/gallery1.png", "/image/vehicles/roller-team-zefiro/gallery2.png", "/image/vehicles/roller-team-zefiro/gallery3.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Heizung", "Markise", "Kühlschrank"]',
        FALSE,
        8.8, -- kraftstoffverbrauch
        120, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        1700, -- anhaengerlast
        2850, -- leergewicht
        3600 -- gesamtgewicht
    ),
    (
        'Sunlight Cliff Adventure',
        'Alkoven',
        'Das Sunlight Cliff Adventure ist das ultimative Abenteuer-Wohnmobil für große Gruppen bis zu 7 Personen. Mit seiner robusten Ausstattung, WLAN, Rückfahrkamera und großem Stauraum ist es perfekt für ausgedehnte Reisen und Abenteuer in der Natur. Die Kombination aus Komfort und Funktionalität macht es zur idealen Wahl für Großfamilien.',
        7,
        'C1',
        'Dortmund',
        150.00,
        '/image/vehicles/sunlight-cliff-adventure/main.png',
        '["/image/vehicles/sunlight-cliff-adventure/gallery1.png", "/image/vehicles/sunlight-cliff-adventure/gallery2.png", "/image/vehicles/sunlight-cliff-adventure/gallery3.png", "/image/vehicles/sunlight-cliff-adventure/gallery4.png"]',
        '["Küche", "Bett", "Dusche", "WC", "Sitzgruppe", "Großer Stauraum", "Fahrradträger", "Heizung", "Rückfahrkamera", "Kühlschrank", "WLAN"]',
        TRUE,
        11.8, -- kraftstoffverbrauch
        165, -- motorleistung
        'front', -- antriebsart
        'Euro 6', -- schadstoffklasse
        2300, -- anhaengerlast
        3900, -- leergewicht
        4700 -- gesamtgewicht
    );

-- Beispiel-Buchungen für Oktober 2025
INSERT INTO
    buchungen (
        wohnmobil_id,
        kunde_id,
        start_datum,
        end_datum,
        gesamtpreis,
        extras,
        notizen
    )
VALUES
    -- Knaus Sky Traveller (ID: 1) - 5 Tage
    (
        1,
        2,
        '2025-10-05',
        '2025-10-10',
        550.00,
        '["Fahrradträger", "Zusatzkissen"]',
        'Familienurlaub in Bayern'
    ),
    -- Bürstner Lyseo (ID: 2) - 7 Tage
    (
        2,
        2,
        '2025-10-12',
        '2025-10-19',
        948.50,
        '["Campingstühle", "Grill"]',
        'Herbstferien mit der Familie'
    ),
    -- Hymer B-Klasse SL (ID: 3) - 4 Tage
    (
        3,
        2,
        '2025-10-22',
        '2025-10-26',
        580.00,
        '["Navigationssystem"]',
        'Wochenendtrip nach Norddeutschland'
    ),
    -- Weinsberg CaraCore (ID: 4) - 6 Tage
    (
        4,
        2,
        '2025-10-08',
        '2025-10-14',
        510.00,
        '["Campingtisch", "Auffahrkeile"]',
        'Städtetrip Rheinland'
    ),
    -- Dethleffs Trend (ID: 5) - 8 Tage
    (
        5,
        2,
        '2025-10-15',
        '2025-10-23',
        1000.00,
        '["Außendusche", "Sonnenschutz"]',
        'Herbsturlaub mit Großfamilie'
    ),
    -- Adria Coral Axess (ID: 6) - 3 Tage
    (
        6,
        2,
        '2025-10-27',
        '2025-10-30',
        465.00,
        '["Satellitenschüssel"]',
        'Kurztrip Baden-Württemberg'
    ),
    -- Pössl Roadcamp (ID: 7) - 9 Tage
    (
        7,
        2,
        '2025-10-03',
        '2025-10-12',
        855.00,
        '["Solarpanel", "Zusatzbatterie"]',
        'Autarke Reise durch Sachsen'
    ),
    -- Carthago Chic S-Plus (ID: 8) - 5 Tage
    (
        8,
        2,
        '2025-10-18',
        '2025-10-23',
        825.00,
        '["Premium-Ausstattung", "Concierge-Service"]',
        'Luxusreise NRW'
    ),
    -- Laika Ecovip (ID: 9) - 6 Tage
    (
        9,
        2,
        '2025-10-09',
        '2025-10-15',
        690.00,
        '["Umweltpaket", "Recycling-Set"]',
        'Nachhaltiger Urlaub'
    ),
    -- Hobby Optima Deluxe (ID: 10) - 10 Tage
    (
        10,
        2,
        '2025-10-01',
        '2025-10-11',
        1400.00,
        '["Familien-Komplettpaket", "Kindersitze", "Spielzeug"]',
        'Herbstferien Großfamilie'
    ),
    -- Malibu Van Charming (ID: 11) - 4 Tage
    (
        11,
        2,
        '2025-10-24',
        '2025-10-28',
        352.00,
        '["Surfboard-Halterung"]',
        'Nordsee-Trip'
    ),
    -- Roller Team Zefiro (ID: 12) - 7 Tage
    (
        12,
        2,
        '2025-10-06',
        '2025-10-13',
        840.00,
        '["Markise", "Campingmöbel"]',
        'Herbstferien Niedersachsen'
    ),
    -- Sunlight Cliff Adventure (ID: 13) - 8 Tage
    (
        13,
        2,
        '2025-10-14',
        '2025-10-22',
        1200.00,
        '["Abenteuer-Paket", "Wanderausrüstung"]',
        'Familienreise ins Sauerland'
    );

-- Automatische Berechnung der Anzahl Nächte bei neuen Buchungen
UPDATE buchungen
SET
    anzahl_naechte = end_datum - start_datum
WHERE
    anzahl_naechte IS NULL;