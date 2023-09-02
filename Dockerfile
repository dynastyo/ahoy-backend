# Verwenden Sie ein offizielles Node-Laufzeitbild als Basisimage
FROM node:current as tk-ahoy

# Setzen Sie das Arbeitsverzeichnis in Container
WORKDIR /usr/src/app

# Installieren Sie Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopieren Sie den aktuellen Ordnerinhalt in den Container
COPY . .

# Port festlegen
EXPOSE 3000

# Starten der Anwendung
CMD ["npm", "start"]