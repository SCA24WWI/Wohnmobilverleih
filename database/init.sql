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
        fuehrerschein VARCHAR(50) NOT NULL,
        ort VARCHAR(100),
        preis_pro_tag NUMERIC(8, 2) NOT NULL,
        hauptbild VARCHAR(500),
        galerie_bilder JSONB DEFAULT '[]',
        features JSONB DEFAULT '[]',
        haustiere_erlaubt BOOLEAN DEFAULT FALSE,
        -- Technische Daten
        kraftstoffverbrauch NUMERIC(4, 1), -- l/100km
        motorleistung INTEGER, -- PS
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
        'Concorde Carver 840 L',
        'Vollintegriert',
        'Der Concorde Carver 840 L steht für absoluten Luxus und unvergleichlichen Reisekomfort. Dieses vollintegrierte Wohnmobil bietet eine großzügige Raumaufteilung, edle Materialien und modernste Technik. Es ist perfekt für anspruchsvolle Reisende, die auf nichts verzichten möchten, mit einem Master-Schlafzimmer, einer voll ausgestatteten Küche und einer weitläufigen Wohnlandschaft.',
        4,
        'C1',
        'Mannheim',
        295.00,
        'https://www.dropbox.com/scl/fi/l7k79kpru2pdxktee92zt/main.png?rlkey=7pf1loahd9ipxsyiysyt2pt0c&st=iu1oe5em&dl=1',
        '["https://www.dropbox.com/scl/fi/u4je1d4fff2fm6awktmfy/gallery1.png?rlkey=jd5wijzj5wruw7misrc12981x&st=hxle9fku&dl=1"]', -- Beispielpfade für Galeriebilder
        '["Gourmet-Küche", "Queensbett", "Separate Dusche", "Separate Toilette", "L-Sitzgruppe", "Alde Warmwasserheizung", "Klimaanlage", "Elektrische Markise", "Sat-Anlage mit zwei TVs", "Große Heckgarage mit Rollerträger", "Hubstützenanlage", "Lederpolster", "Zentralstaubsauger"]',
        FALSE,
        13.5, -- kraftstoffverbrauch in L/100km
        210, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6e', -- schadstoffklasse
        2500, -- anhaengerlast in kg
        5000, -- leergewicht in kg
        6500 -- gesamtgewicht in kg
    ),
    (
        'Phoenix Top Liner 8500 L',
        'Vollintegriert',
        'Der Phoenix Top Liner 8500 L repräsentiert die absolute Spitze der Luxus-Wohnmobile. Als vollintegriertes Meisterwerk bietet er unvergleichlichen Wohnkomfort, höchste Verarbeitungsqualität und eine Fülle an exklusiven Features. Perfekt für Reisende, die kompromisslosen Luxus, viel Platz und eine autarke Reiseerfahrung wünschen. Mit Kingsize-Bett, vollausgestatteter Designerküche und einem eleganten Wohnsalon.',
        4,
        'C1',
        'München',
        310.00,
        'https://www.dropbox.com/scl/fi/nlddz00bnr9kntmor17z9/main.png?rlkey=eqrw51eyr05igf6k70lnf0rnv&st=otsphai4&dl=1',
        '["https://www.dropbox.com/scl/fi/58jgqt1djgi3gptn3zwf8/gallery1.png?rlkey=8uvbk2fdf6z0w1gnqjualpde3&st=9vzkqft2&dl=1"]',
        '["Designerküche", "Kingsize-Bett", "Separate Dusche", "Separate Toilette", "L-Sitzgruppe", "Alde Warmwasserheizung", "Dachklimaanlage", "Elektrische Markise", "Sat-Anlage mit zwei TVs", "Große Heckgarage mit PKW-Abteil", "Hydraulische Hubstützen", "Lederpolster", "Soundsystem", "Waschmaschine"]',
        FALSE,
        14.0, -- kraftstoffverbrauch in L/100km
        220, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6d-TEMP', -- schadstoffklasse
        3000, -- anhaengerlast in kg
        5500, -- leergewicht in kg
        7000 -- gesamtgewicht in kg
    ),
    (
        'Kabe Royal I 880 LQB',
        'Vollintegriert',
        'Der Kabe Royal I 880 LQB ist ein skandinavisches Meisterwerk im Bereich der Luxus-Wohnmobile, das für ganzjährigen Einsatz und höchsten Komfort steht. Dieses vollintegrierte Modell überzeugt durch seine Premium-Isolierung, die exklusive Ausstattung und ein unvergleichliches Raumgefühl. Ideal für anspruchsvolle Reisende, die auch in kalten Regionen nicht auf Wohnlichkeit verzichten möchten, mit einem Queensbett, einer hochwertigen Küche und einer geräumigen Sitzlandschaft.',
        4,
        'C1',
        'Frankfurt am Main',
        270.00,
        'https://www.dropbox.com/scl/fi/ze925875s0tzfc6sr5uk4/main.png?rlkey=x08qi1wwc0yts0bhcs4zng7cf&st=0wczhg0x&dl=1',
        '["https://www.dropbox.com/scl/fi/ghvwbtjkfj3h83q4r5evt/gallery1.png?rlkey=3d6rud28x0zmn6phtmfq8w1ma&st=4j31c8nw&dl=1"]',
        '["Premium-Küche", "Queensbett", "Separate Dusche", "Separate Toilette", "L-Sitzgruppe", "Alde Warmwasserheizung", "Dachklimaanlage", "Elektrische Markise", "Sat-Anlage mit TV", "Große Heckgarage", "Fußbodenheizung", "Zentrale Wasserfilteranlage", "Lederpolster"]',
        FALSE,
        12.8, -- kraftstoffverbrauch in L/100km
        200, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        2200, -- anhaengerlast in kg
        4700, -- leergewicht in kg
        6000 -- gesamtgewicht in kg
    ),
    (
        'Eura Mobil Integra Line 720 EB',
        'Vollintegriert',
        'Der Eura Mobil Integra Line 720 EB ist ein elegantes vollintegriertes Wohnmobil, das Komfort und Funktionalität harmonisch verbindet. Mit seinem winterfesten Doppelboden und der hochwertigen Ausstattung ist er ideal für Reisen zu jeder Jahreszeit. Er bietet komfortable Einzelbetten im Heck, eine moderne Küche und eine gemütliche Sitzgruppe.',
        4,
        'B (alte Klasse 3)',
        'Freiburg im Breisgau',
        195.00,
        'https://www.dropbox.com/scl/fi/kf3kl6766qfcupbr4hh1l/main.png?rlkey=opc7agmrqvth1s83xereirk6x&st=xfhvkba2&dl=1',
        '["https://www.dropbox.com/scl/fi/9neax8ani9e60kg39r3ju/gallery1.png?rlkey=4oc2z7y2mvrjv5jsq4ggiy8go&st=7wwgy5rj&dl=1"]',
        '["Küche", "Einzelbetten (umbaubar zum Doppelbett)", "Hubbett", "Separate Dusche", "WC", "L-Sitzgruppe", "Alde Warmwasserheizung", "Kühlschrank mit Gefrierfach", "Markise", "Rückfahrkamera", "Doppelboden"]',
        TRUE,
        10.0, -- kraftstoffverbrauch in L/100km
        160, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        1800, -- anhaengerlast in kg
        3300, -- leergewicht in kg
        4400 -- gesamtgewicht in kg
    ),
    (
        'Knaus L!VE I 700 MEG',
        'Vollintegriert',
        'Der Knaus L!VE I 700 MEG überzeugt als dynamischer und stilvoller Begleiter für alle Reiseabenteuer. Dieser vollintegrierte Camper kombiniert italienisches Design mit deutscher Ingenieurskunst und bietet eine intelligente Raumaufteilung, die sowohl Gemütlichkeit als auch Funktionalität in den Vordergrund stellt. Mit seinen komfortablen Einzelbetten im Heck, einem geräumigen Bad und einer gut ausgestatteten Küche ist er perfekt für Paare oder kleine Familien, die das Besondere suchen.',
        4,
        'B',
        'Nürnberg',
        185.00,
        'https://www.dropbox.com/scl/fi/v1ow2g7udaihdqegx9u7c/main.png?rlkey=e4rwlo7fk610ti5jfzmpm92x4&st=far0qtot&dl=1',
        '["https://www.dropbox.com/scl/fi/1znpwgj30siqhzs9s0ma9/gallery1.png?rlkey=3yzp9l7mtfmfe83nxikwgujab&st=xmi6d1m0&dl=1"]',
        '["Küche", "Einzelbetten (umbaubar)", "Hubbett", "Bad mit Dusche/WC", "L-Sitzgruppe", "Truma Heizung", "Kühlschrank mit Eisfach", "Große Heckgarage", "Rückfahrkamera", "Markise"]',
        TRUE,
        9.5, -- kraftstoffverbrauch in L/100km
        160, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6e', -- schadstoffklasse
        1800, -- anhaengerlast in kg
        3200, -- leergewicht in kg
        4000 -- gesamtgewicht in kg
    ),
    (
        'Camper Alpha 1',
        'Vollintegriert',
        'Der Camper ALpha 1 überzeugt als dynamischer und stilvoller Begleiter für alle Reiseabenteuer. Dieser vollintegrierte Camper kombiniert italienisches Design mit deutscher Ingenieurskunst und bietet eine intelligente Raumaufteilung, die sowohl Gemütlichkeit als auch Funktionalität in den Vordergrund stellt. Mit seinen komfortablen Einzelbetten im Heck, einem geräumigen Bad und einer gut ausgestatteten Küche ist er perfekt für Paare oder kleine Familien, die das Besondere suchen.',
        4,
        'B',
        'Nürnberg',
        185.00,
        'https://www.dropbox.com/scl/fi/avujsjll57dgg8zp0t1ei/main.png?rlkey=2psop98546ln7f3nom340hc88&st=dtemj1cc&dl=1',
        '["https://www.dropbox.com/scl/fi/3w5egwk02wsjho7zz7qmz/gallery1.png?rlkey=xc2egs0xt07io3do42cktrqwt&st=w5p5syzk&dl=1"]',
        '["Küche", "Einzelbetten (umbaubar)", "Hubbett", "Bad mit Dusche/WC", "L-Sitzgruppe", "Truma Heizung", "Kühlschrank mit Eisfach", "Große Heckgarage", "Rückfahrkamera", "Markise"]',
        TRUE,
        9.5, -- kraftstoffverbrauch in L/100km
        160, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6e', -- schadstoffklasse
        1800, -- anhaengerlast in kg
        3200, -- leergewicht in kg
        4000 -- gesamtgewicht in kg
    ),
    (
        'Laika Kreos 5009',
        'Vollintegriert',
        'Der Laika Kreos 5009 ist ein eleganter und robuster Vollintegrierter mit mediterranem Flair, der für Komfort und höchste Ansprüche gebaut ist. Seine winterfeste Konstruktion und die hochwertige Isolierung prädestinieren ihn für ganzjährige Reisen. Mit luxuriösen Queensbetten, einem großzügigen Wohnbereich und einer edlen Küchenzeile bietet er eine perfekte Mischung aus Stil und Funktionalität für Paare oder Familien, die das Besondere lieben.',
        4,
        'B (alte Klasse 3)',
        'München',
        210.00,
        'https://www.dropbox.com/scl/fi/uh6rlnmgbze9o1j9pa8eh/main.png?rlkey=ts4zysc7wu6xie6wa0q22fxba&st=9nrgjxvr&dl=1',
        '["https://www.dropbox.com/scl/fi/9y8wp2jezzts5lsc5o9gf/gallery1.png?rlkey=hs4by50jkpgyx5ay1nv2njknf&st=z9c3iv61&dl=1"]',
        '["Gourmet-Küche", "Queensbett", "Hubbett", "Separate Dusche", "Separate Toilette", "L-Sitzgruppe", "Alde Warmwasserheizung", "Klimaanlage", "Elektrische Markise", "Sat-Anlage mit TV", "Große Heckgarage", "Doppelboden"]',
        FALSE,
        11.8, -- kraftstoffverbrauch in L/100km
        177, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d-TEMP', -- schadstoffklasse
        2000, -- anhaengerlast in kg
        3600, -- leergewicht in kg
        4500 -- gesamtgewicht in kg
    ),
    (
        'Carthago Chic C-Line I 4.9',
        'Vollintegriert',
        'Der Carthago Chic C-Line I 4.9 steht für die Premium-Klasse der vollintegrierten Reisemobile und überzeugt durch seine elegante Linienführung und höchste Verarbeitungsqualität. Dieser Liner ist das Ergebnis ausgereifter Ingenieurskunst und luxuriöser Ausstattung, ideal für Kenner, die Komfort und Autarkie schätzen. Er bietet ein großzügiges Queensbett, eine stilvolle Winkelküche und einen gemütlichen Wohnsalon mit hochwertigen Polstern.',
        4,
        'B (alte Klasse 3)',
        'Stuttgart',
        230.00,
        'https://www.dropbox.com/scl/fi/areyu4n7xda32gwcmrkuv/main.png?rlkey=l7ylddymgosviic8n57wy8x3s&st=gnhywccd&dl=1',
        '["https://www.dropbox.com/scl/fi/qspwipp63nxollqc42j4g/gallery1.png?rlkey=z8u2g8ej8jo5cg7a8cglmocn6&st=47s1byal&dl=1"]',
        '["Designerküche", "Queensbett", "Hubbett", "Raumbad mit separater Dusche", "Keramik-WC", "L-Sitzgruppe", "Alde Warmwasserheizung", "Dachklimaanlage", "Elektrische Markise", "Sat-Anlage mit TV", "Große Heckgarage", "Doppelboden", "Zentrale Wasserfilteranlage"]',
        FALSE,
        11.0, -- kraftstoffverbrauch in L/100km
        180, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        1900, -- anhaengerlast in kg
        3500, -- leergewicht in kg
        4500 -- gesamtgewicht in kg
    ),
    (
        'Morelo Empire Liner 88 LB',
        'Vollintegriert',
        'Der Morelo Empire Liner 88 LB ist der Inbegriff von Reisemobil-Luxus, ein rollendes Penthouse für anspruchsvolle Globetrotter. Dieser vollintegrierte Liner definiert Autarkie und Komfort neu, mit einer unerreichten Verarbeitungsqualität und exklusivsten Materialien. Er bietet ein luxuriöses Kingsize-Bett, eine voll ausgestattete Designerküche mit Insel und einen eleganten Wohnsalon mit elektrisch ausfahrbaren Elementen für maximalen Raum und Wohnlichkeit.',
        4,
        'C1',
        'München',
        350.00,
        'https://www.dropbox.com/scl/fi/r1btcw6t8m9tpmizyebpl/main.png?rlkey=ex8t1l5pfqcsshfiuo5v2m9wo&st=ezeu2lw5&dl=1',
        '["https://www.dropbox.com/scl/fi/ew4a1e2e3dnvarxyizzqb/gallery1.png?rlkey=cxu9cniakptlzh73u6j1u0sms&st=1kkzpbxj&dl=1"]',
        '["Designerküche mit Insel", "Kingsize-Bett", "Separate Luxus-Dusche", "Porzellan-WC mit Festtank", "Lounge-Sitzgruppe (elektr. ausfahrbar)", "Alde Warmwasserheizung", "Dachklimaanlage", "Elektrische Markise", "Autom. Sat-Anlage mit zwei TVs", "PKW-Garage", "Hydraulische Hubstützenanlage", "Lederpolster", "Soundsystem", "Waschmaschine/Trockner", "Solaranlage"]',
        FALSE,
        14.5, -- kraftstoffverbrauch in L/100km
        220, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        3000, -- anhaengerlast in kg
        5500, -- leergewicht in kg
        7500 -- gesamtgewicht in kg
    ),
    (
        'Concorde Centurion 990 ML',
        'Vollintegriert',
        'Der Concorde Centurion 990 ML ist die Krönung der Luxus-Reisemobile, ein mobiles Refugium, das keine Wünsche offenlässt. Dieses vollintegrierte Flaggschiff besticht durch seine opulente Ausstattung, seine erstklassige Verarbeitung und ein Raumgefühl, das dem eines Lofts gleicht. Konzipiert für den exklusiven Reisenden, bietet er ein Master-Schlafzimmer mit Kingsize-Bett, eine exquisite Gourmet-Küche mit allen Annehmlichkeiten und eine weitläufige Wohnlandschaft mit elektrisch verstellbaren Sitzen.',
        4,
        'C1',
        'Frankfurt am Main',
        370.00,
        'https://www.dropbox.com/scl/fi/q51xrgdf5yntlb6lwxoxy/main.png?rlkey=und45ydpj4ytpr3eqtcxxg76h&st=nf9j6d6m&dl=1',
        '["https://www.dropbox.com/scl/fi/u7vd72aiv0z3icwovjeeg/gallery1.png?rlkey=ifz4x52l472fau8riwdiq3czs&st=033xlzni&dl=1"]',
        '["Gourmet-Küche mit Geschirrspüler", "Kingsize-Bett", "Master-Schlafzimmer", "Luxus-Raumbad mit Dampfdusche", "Porzellan-WC mit Festtank", "Lounge-Sitzgruppe (elektr. verstellbar)", "Alde Warmwasserheizung", "Mehrzonen-Klimaanlage", "Elektrische Markise", "Autom. Sat-Anlage mit zwei Smart-TVs", "PKW-Garage mit elektr. Heckklappe", "Hydraulische Hubstützenanlage", "Volllederausstattung", "Bose Soundsystem", "Waschmaschine/Trockner", "Lithium-Batterie-Paket"]',
        FALSE,
        15.0, -- kraftstoffverbrauch in L/100km
        230, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6e', -- schadstoffklasse
        3500, -- anhaengerlast in kg
        6000, -- leergewicht in kg
        8000 -- gesamtgewicht in kg
    ),
    (
        'Morelo Loft 82 G',
        'Vollintegriert',
        'Der Morelo Loft 82 G ist ein erstklassiges vollintegriertes Luxus-Wohnmobil, das für Reisen mit höchstem Komfort und Stil konzipiert wurde. Mit seiner exklusiven Ausstattung, dem großzügigen Raumgefühl und der cleveren Raumaufteilung ist er ideal für anspruchsvolle Reisende. Er bietet ein bequemes Queensbett, eine moderne Küchenzeile und eine einladende Lounge-Sitzgruppe.',
        4,
        'C1',
        'Herzogen-Aurach',
        280.00,
        'https://www.dropbox.com/scl/fi/voulqpwv1aqd0kbhvvl9e/main.png?rlkey=6z4184ibogyfn5mgamauegqkh&st=8y6lh2hq&dl=1',
        '["https://www.dropbox.com/scl/fi/41vw1w6o9pjdfn8yd3xh0/gallery1.png?rlkey=i3matoqlsjrt4k6vlk7w01ye7&st=8dk169mj&dl=0", "https://www.dropbox.com/scl/fi/b9lqtlwq3j8fvfq405vzc/gallery2.png?rlkey=lpmy35u6mcc0z0zshxpt744b3&st=j7htjap0&dl=1" , "https://www.dropbox.com/scl/fi/sj5y92cxywks897yspsmz/gallery3.png?rlkey=eefo92rsehx0m91bcvqpgy9ld&st=qlyjjwbx&dl=1"]',
        '["Exklusive Küche", "Queensbett", "Separate Dusche", "Separate Toilette", "Lounge-Sitzgruppe", "Alde Warmwasserheizung", "Klimaanlage", "Elektrische Markise", "Autom. Sat-Anlage mit TV", "Große Heckgarage", "Hydraulische Hubstützen", "Lederpolster"]',
        FALSE,
        13.0, -- kraftstoffverbrauch in L/100km
        205, -- motorleistung in PS
        'hinterrad', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        2500, -- anhaengerlast in kg
        4800, -- leergewicht in kg
        6000 -- gesamtgewicht in kg
    ),
    (
        'Niesmann+Bischoff Arto 78 F',
        'Vollintegriert',
        'Der Niesmann+Bischoff Arto 78 F ist ein Premium-Wohnmobil, das Luxus und Fahrkomfort auf höchstem Niveau vereint. Sein markantes Design und der exquisite Innenraum mit hochwertigen Materialien schaffen eine einzigartige Reiseatmosphäre. Ausgestattet mit einem gemütlichen Queensbett, einer Designer-Küche und einem großzügigen Wohnbereich, ist er ideal für Paare mit hohen Ansprüchen.',
        4,
        'C1',
        'Stuttgart',
        265.00,
        'https://www.dropbox.com/scl/fi/s0u8ae6g1ylwapg8ifmj1/main.png?rlkey=2108rm1mwnrcp209qkaqxoic6&st=iwsviotm&dl=1',
        '["https://www.dropbox.com/scl/fi/mtipnof9r1ri9kvltutlc/gallery1.png?rlkey=m282k2cuzz6ch035gl9gi9u8d&st=x7mmwapn&dl=1", "https://www.dropbox.com/scl/fi/2rajilxib1cf6y1x2gmd3/gallery2.png?rlkey=k6wuyzyvon6h92ptvxa2sn2eb&st=jfn5qsh8&dl=1"]',
        '["Designer-Küche", "Queensbett", "Separate Dusche", "Separate Toilette", "L-Sitzgruppe", "Alde Warmwasserheizung", "Klimaanlage", "Elektrische Markise", "Multimedia-System", "Große Heckgarage", "Hubstützenanlage", "Panorama-Dachfenster"]',
        FALSE,
        12.5, -- kraftstoffverbrauch in L/100km
        190, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d-TEMP', -- schadstoffklasse
        2000, -- anhaengerlast in kg
        4500, -- leergewicht in kg
        5800 -- gesamtgewicht in kg
    ),
    (
        'Dethleffs Globebus I7',
        'Vollintegriert',
        'Ein luxuriöses vollintegriertes Wohnmobil, das sich durch seine kompakten Abmessungen und hohe Wendigkeit auszeichnet, ohne dabei auf Komfort zu verzichten. Ideal für Paare, die Wert auf Qualität, elegantes Design und eine agile Fahrweise legen. Der geräumige Innenraum bietet eine vollausgestattete Küche, ein komfortables Hubbett und eine gemütliche L-Sitzgruppe.',
        3,
        'B',
        'Konstanz',
        175.00,
        'https://www.dropbox.com/scl/fi/tbfu2ta0068y8w4n7coii/main.png?rlkey=kwyf9m3fenukqd4idoxz86lg3&st=nig6whhk&dl=1',
        '["https://www.dropbox.com/scl/fi/annfj2ts8fag08sp8xh0f/gallery1.png?rlkey=tsju54rxoz3xysmibo3p75ys0&st=4mbqe5mm&dl=1", "https://www.dropbox.com/scl/fi/0s94jp8dvva7ge7rouygh/gallery2.png?rlkey=aniexblom9j5q9sb9v7fnxblr&st=z7618tdx&dl=1"]',
        '["Küche", "Hubbett", "Bad mit Dusche/WC", "L-Sitzgruppe", "Heizung", "Kühlschrank", "Rückfahrkamera", "Navigationssystem", "Fahrradträger", "Markise"]',
        TRUE,
        10.2, -- kraftstoffverbrauch in L/100km
        160, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        1700, -- anhaengerlast in kg
        3100, -- leergewicht in kg
        3850 -- gesamtgewicht in kg
    ),
    (
        'Knaus Sky Traveller',
        'Teilintegriert',
        'Der Knaus Sky Traveller ist das perfekte Wohnmobil für Familien und Paare, die Komfort mit Wendigkeit verbinden möchten. Mit seinem durchdachten Grundriss bietet es Platz für 4 Personen und verfügt über eine vollausgestattete Küche, ein komfortables Bad und eine gemütliche Sitzgruppe. Die große Markise sorgt für zusätzlichen Außenbereich.',
        4,
        'B',
        'München',
        110.00,
        'https://www.dropbox.com/scl/fi/z59pco3otkdn1iox2ib2u/main.png?rlkey=xd0n5f5yj58s4bav55qc98q6k&st=62dx8pz9&dl=1',
        '["https://www.dropbox.com/scl/fi/e2bddymrgcrpzw46t69la/gallery1.png?rlkey=wbfwfxeb302hno2pm6p05evey&st=f84ycytu&dl=1", "/image/vehicles/knaus-sky-traveller/gallery3.png"]',
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
        'Hymer Tramp S 695',
        'Teilintegriert',
        'Der Hymer Tramp S 695 ist ein dynamisches und komfortables teilintegriertes Wohnmobil, das sich hervorragend für Paare oder kleine Familien eignet. Er bietet ein ausgewogenes Verhältnis von Raumangebot und Wendigkeit. Mit seinen komfortablen Einzelbetten im Heck, einer gut ausgestatteten Küche und einer gemütlichen L-Sitzgruppe ist er der ideale Begleiter für entspannte Reisen und spontane Abenteuer.',
        4,
        'B',
        'Ulm',
        145.00,
        'https://www.dropbox.com/scl/fi/7c4m0pe4pralr9wlbs14w/main.png?rlkey=r1qj7ktcyxvig2n4t96cl197m&st=zwzix8qm&dl=1',
        '["https://www.dropbox.com/scl/fi/57ilwxf2ojzxkz4debt1i/gallery2.png?rlkey=8328eajcbvjg9rk6z2hqr6407&st=59k0ot6u&dl=1", "https://www.dropbox.com/scl/fi/s5uv0klbdr8byofciu6py/gallery1.png?rlkey=19mqqrt7ly25u7uuzvd21uj9l&st=zs3kwi8m&dl=1"]',
        '["Küche", "Einzelbetten (umbaubar zum Doppelbett)", "Hubbett (optional)", "Bad mit Dusche/WC", "L-Sitzgruppe", "Truma Heizung", "Kühlschrank mit Gefrierfach", "Markise", "Fahrradträger", "Rückfahrkamera", "Tempomat"]',
        TRUE,
        9.2, -- kraftstoffverbrauch in L/100km
        170, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        1800, -- anhaengerlast in kg
        3100, -- leergewicht in kg
        4100 -- gesamtgewicht in kg
    ),
    (
        'Pössl Summit 600 Plus',
        'Kastenwagen',
        'Der Pössl Summit 600 Plus ist ein agiler und vielseitiger Kastenwagen, der die perfekte Balance zwischen Alltagstauglichkeit und Reisekomfort bietet. Mit seinen kompakten Maßen ist er ideal für Stadterkundungen und enge Bergstraßen, ohne dabei auf eine voll funktionale Ausstattung zu verzichten. Er verfügt über ein komfortables Heckbett, eine praktische Küchenzeile und eine gemütliche Dinette. Perfekt für Paare oder Alleinreisende, die Flexibilität lieben.',
        2,
        'B',
        'Augsburg',
        95.00,
        'https://www.dropbox.com/scl/fi/znztwcpnjaetfupsloa85/main.png?rlkey=hicgabc3jpk0p66l75ec3kpij&st=gi61e9dn&dl=1',
        '["https://www.dropbox.com/scl/fi/lmvs6t1dc46vfytjq05lv/gallery1.png?rlkey=vi4fbv758w0f9oznzyeae61cz&st=vzl6qdrd&dl=1"]',
        '["Küche", "Doppelbett im Heck", "Bad mit Dusche/WC", "Dinette", "Dieselheizung", "Kompressor-Kühlschrank", "Fliegenschutztür", "Rückfahrkamera (optional)", "Fahrradträger (optional)"]',
        TRUE,
        8.0, -- kraftstoffverbrauch in L/100km
        140, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d-TEMP', -- schadstoffklasse
        2500, -- anhaengerlast in kg
        2900, -- leergewicht in kg
        3500 -- gesamtgewicht in kg
    ),
    (
        'Globecar Campscout Revolution',
        'Kastenwagen',
        'Der Globecar Campscout Revolution ist ein innovativer Kastenwagen, der mit seinem variablen Raumkonzept und hochwertigen Details überzeugt. Er bietet eine einzigartige Kombination aus Schlaf- und Wohnbereich dank seines modularen Heckbetts, das sich hochklappen lässt. Ideal für aktive Reisende, die viel Stauraum für Sportgeräte benötigen, ohne auf Komfort zu verzichten. Mit kompakter Küche, Bad und gemütlicher Sitzgruppe.',
        3,
        'B',
        'Konstanz',
        105.00,
        'https://www.dropbox.com/scl/fi/jyf14obv47pkfw0wcljml/main.png?rlkey=ou8076d5x1tgaluru7phmfdtz&st=pkyix5sg&dl=1',
        '["https://www.dropbox.com/scl/fi/lmdrf3s6f9whb4fq2ol1w/gallery1.png?rlkey=t2jb2h8bdaas7syg5u07t946t&st=gq4vkk4m&dl=1"]',
        '["Küche", "Variabler Heckbettbereich", "Aufstelldach (optional)", "Bad mit Dusche/WC", "Dinette", "Truma Heizung", "Kühlschrank", "Fliegenschutztür", "Große Heckgarage (variabel)", "Tempomat"]',
        TRUE,
        8.2, -- kraftstoffverbrauch in L/100km
        160, -- motorleistung in PS
        'front', -- antriebsart
        'Euro 6d', -- schadstoffklasse
        2500, -- anhaengerlast in kg
        3000, -- leergewicht in kg
        3500 -- gesamtgewicht in kg
    ),
    (
        'Tischer Trail 260 S',
        'Pickup Camper', -- Modell-Feld angepasst
        'Der Tischer Trail 260 S ist eine robuste und komfortable Absetzkabine, die auf diverse Pickup-Modelle wie den Dodge Ram passt und maximale Flexibilität bietet. Ideal für Abenteurer, die abgelegene Orte erkunden und dabei nicht auf den Komfort eines Wohnmobils verzichten möchten. Nach dem Absetzen der Kabine steht der Pickup für den Alltag oder als Zugfahrzeug zur Verfügung. Er bietet ein gemütliches Alkovenbett, eine kleine Küche und eine kompakte Sitzgruppe.',
        3,
        'B',
        'Passau',
        85.00,
        'https://www.dropbox.com/scl/fi/k15zimettafphweehvyj5/main.png?rlkey=p2y2em89u2kk8jy5k4h5ofg7p&st=04cnfjom&dl=1',
        '["https://www.dropbox.com/scl/fi/vdo0ndfxdz53hkbohlrt7/gallery2.jpg?rlkey=kxwdkf7iepjtllghudaomr6t1&st=r4817gfd&dl=1", "https://www.dropbox.com/scl/fi/ejj2s46umaw7l7x0lolfn/gallery1.png?rlkey=dnxdjy1iun7p77o77fczewpuj&st=y4ri6kfy&dl=1"]',
        '["Kleine Küche", "Alkovenbett", "Sitzgruppe (umbaubar zum Bett)", "Kompressor-Kühlschrank", "Porta Potti WC (optional)", "Gaskochfeld", "Heizung", "Außenstauraum", "Aufstelldach (optional)"]',
        TRUE,
        10.5, -- kraftstoffverbrauch (des Pickups mit Kabine) in L/100km
        190, -- motorleistung (des Pickups, hier eine gängige Angabe) in PS
        'allrad', -- antriebsart (typisch für Pickups)
        'Euro 5', -- schadstoffklasse (Pickup-abhängig, ältere Modelle oft Euro 5)
        3500, -- anhaengerlast (Pickup-abhängig) in kg
        600, -- leergewicht (der Kabine) in kg
        3500 -- gesamtgewicht (Pickup + Kabine) in kg, hier als fahrzeugabhängiger Wert
    ),
    (
        'Fendt Bianco Selection 465 SFB',
        'Wohnwagen',
        'Der Fendt Bianco Selection 465 SFB ist ein hochwertiger und geräumiger Wohnwagen, der Komfort und Qualität für die ganze Familie bietet. Mit seinem ansprechenden Design und der durchdachten Raumaufteilung ist er der ideale Begleiter für längere Urlaube oder spontane Wochenendtrips. Er verfügt über ein gemütliches französisches Bett, eine praktische Rundsitzgruppe und eine gut ausgestattete Küche.',
        4,
        'Anhänger (B-Erweiterung empfohlen)',
        'Regensburg',
        75.00,
        'https://www.dropbox.com/scl/fi/l4507g6ae3j56jcxwzd71/main.png?rlkey=wxvhmq4l5x35xips354w8gk53&st=3tzx0nsb&dl=1',
        '["https://www.dropbox.com/scl/fi/7i2qkfmhhofyp4csrybet/gallery1.png?rlkey=munbmfec0ekdp6cbthq7rd1g6&st=kmy8atbe&dl=1"]',
        '["Küche", "Französisches Bett", "Rundsitzgruppe (umbaubar zum Bett)", "Bad mit WC und Waschbecken", "Truma Heizung", "Kühlschrank", "Fliegenschutztür", "Markise (optional)", "TV-Vorbereitung"]',
        TRUE,
        NULL, -- kraftstoffverbrauch nicht zutreffend für Anhänger
        NULL, -- motorleistung nicht zutreffend für Anhänger
        'kein Antrieb', -- antriebsart für Anhänger
        NULL, -- schadstoffklasse nicht zutreffend für Anhänger
        NULL, -- anhaengerlast nicht zutreffend für den Wohnwagen selbst
        1350, -- leergewicht in kg
        1700 -- gesamtgewicht in kg
    ),
    (
        'Hobby De Luxe 460 LU',
        'Wohnwagen',
        'Der Hobby De Luxe 460 LU ist ein beliebter und praktischer Wohnwagen, der sich ideal für Paare oder kleine Familien eignet. Er bietet ein hervorragendes Preis-Leistungs-Verhältnis und überzeugt durch seine funktionale Ausstattung und sein modernes Design. Mit zwei Einzelbetten im Bug, einer geräumigen Rundsitzgruppe und einer gut durchdachten Küche ist er perfekt für entspannte Urlaube auf dem Campingplatz.',
        4,
        'Anhänger (B-Erweiterung empfohlen)',
        'Ulm', -- Süddeutsche Großstadt
        68.00,
        'https://www.dropbox.com/scl/fi/6n79d77bmc1nlrpxfae7x/main.png?rlkey=wh86g0omf5w92q3zc37w0jwyo&st=bkjjsdd3&dl=1',
        '["https://www.dropbox.com/scl/fi/l3x0r7uohfml4hcoirsis/gallery1.png?rlkey=1akhx39modesng8t3603xa0dk&st=jka94fk8&dl=1"]',
        '["Küche", "Einzelbetten im Bug", "Rundsitzgruppe (umbaubar zum Bett)", "Kompaktbad mit WC und Waschbecken", "Truma Heizung", "Kühlschrank mit Gefrierfach", "Fliegenschutztür", "Warmwasserboiler", "Ambientebeleuchtung"]',
        TRUE,
        NULL, -- kraftstoffverbrauch nicht zutreffend für Anhänger
        NULL, -- motorleistung nicht zutreffend für Anhänger
        'kein Antrieb', -- antriebsart für Anhänger
        NULL, -- schadstoffklasse nicht zutreffend für Anhänger
        NULL, -- anhaengerlast nicht zutreffend für den Wohnwagen selbst
        1200, -- leergewicht in kg
        1500 -- gesamtgewicht in kg
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