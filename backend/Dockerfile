# 1. Start-Image: Wir nutzen ein offizielles Node.js-Image
FROM node:18-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. Abhängigkeiten kopieren und installieren
# Wir kopieren erst nur package.json, um den Docker-Cache zu nutzen
COPY package*.json ./
RUN npm install

# 4. Den restlichen Code kopieren
COPY . .

# 5. Den Port freigeben, auf dem unsere App läuft
EXPOSE 3001

# 6. Der Befehl, um die Anwendung zu starten
CMD [ "node", "server.js" ]