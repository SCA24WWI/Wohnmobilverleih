# Fahrzeugbilder Struktur

Diese Ordnerstruktur organisiert die Bilder für jedes Wohnmobil:

## Ordnerstruktur

```
/public/image/vehicles/
├── [fahrzeugname]/
│   ├── main.jpg          (Hauptbild - wird in Listen und als erstes Bild angezeigt)
│   ├── gallery1.jpg      (Galerie-Bild 1)
│   ├── gallery2.jpg      (Galerie-Bild 2)
│   ├── gallery3.jpg      (Galerie-Bild 3)
│   └── ...               (weitere Galerie-Bilder nach Bedarf)
```

## Benötigte Ordner (basierend auf aktuellen Fahrzeugen):

-   knaus-sky-traveller/
-   buerstner-lyseo/
-   hymer-b-klasse-sl/
-   weinsberg-caracore/
-   dethleffs-trend/
-   adria-coral-axess/
-   poessl-roadcamp/
-   carthago-chic-s-plus/
-   laika-ecovip/
-   hobby-optima-deluxe/
-   malibu-van-charming/
-   roller-team-zefiro/
-   sunlight-cliff-adventure/

## Datenbank-Schema

```sql
-- Neue Spalten in der wohnmobile Tabelle:
hauptbild VARCHAR(500)           -- Pfad zum Hauptbild
galerie_bilder JSONB DEFAULT '[]' -- Array mit Pfaden zu Galerie-Bildern
```

## Verwendung im Frontend

-   **Hauptbild**: Wird in Listen und als erstes Bild in der Detailansicht verwendet
-   **Galerie-Bilder**: Werden in der Detailansicht als scrollbare Galerie angezeigt
