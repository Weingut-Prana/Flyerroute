# FlyerRoute

Kleine, mobiloptimierte Web-App zur Flyer-Verteilung mit Leaflet, OpenStreetMap und Overpass API. Die Routenabdeckung verwendet einen eigenständig entwickelten, heuristischen Chinese-Postman-Ansatz (Greedy-Paarung ungerader Knoten und Euler-Tour) und berücksichtigt notwendige Rückwege an Sackgassen. Keine Datenbank, kein Benutzerkonto und kein Build-Schritt.

## Netlify-Deployment

1. In Netlify **Add new project → Import an existing project** auswählen.
2. GitHub Repository `Weingut-Prana/Flyerroute` wählen.
3. Build command: **leer lassen**. Publish directory: **.**
4. Deploy starten. Die erzeugte HTTPS-Adresse auf dem iPhone in Safari öffnen und **Teilen → Zum Home-Bildschirm** wählen.

## Bedienung

1. **Gebiet auswählen** wählen; zwei gegenüberliegende Ecken auf der Karte antippen.
2. **Route planen** lädt öffentlich zugängliche Straßen aus OpenStreetMap. Lieber mehrere kleinere Bereiche nacheinander planen.
3. **GPS starten** während der Verteilung. Besichtigte Streckenteile werden anhand mehrerer GPS-Punkte markiert; einzelne Abschnitte können auch durch Antippen manuell abgehakt werden.
4. Die App speichert fortlaufend auf **diesem Browser/diesem Gerät** mit localStorage. **Sicherung exportieren** vor Safari-Datenlöschung oder Gerätewechsel.

## Grenzen

- GPS-Tracking funktioniert **nicht zuverlässig im Hintergrund oder bei gesperrtem iPhone**.
- Es handelt sich um einen heuristischen Routenplaner für Straßenabschnitte, nicht um eine mathematisch optimale Postbotenroute, Hauszustellung oder Haustürdatenbank. Nicht verbundene Straßennetze werden getrennt behandelt; die Laufwege zwischen ihnen sind nicht eingerechnet.
- Offene Wege werden aus OSM gelesen, aber die Zugangsdaten können unvollständig sein; vor Ort stets Beschilderung beachten.
- Laufende Standortaufzeichnung kann Straßen als besucht markieren, nicht belegen, dass Flyer verteilt wurden.
- Die App benötigt Internet für Kartentiles und die Routenberechnung.
- Daten werden lokal gehalten, keine Firebase-Verbindung und kein Upload des GPS-Verlaufs.

## Herkunft

Keine Codeübernahme aus STR1DE: dessen öffentliches Repository `slink/stride` weist derzeit keine ausdrückliche Wiederverwendungslizenz aus. Die Routenberechnung in `planner.js` wurde unabhängig implementiert.
