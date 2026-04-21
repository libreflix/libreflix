FROM node:24.13.0

RUN apt update && apt install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

RUN npm rebuild bcrypt --build-from-source

RUN npm install -g pm2

COPY . .

USER node

EXPOSE 3998
