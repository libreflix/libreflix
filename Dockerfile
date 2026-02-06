############################################
# Libreflix.org
############################################

FROM ubuntu:16.04
MAINTAINER me@guilmour.org


RUN apt-get update && apt-get install -y \
    build-essential \
    unzip \
    wget \
    curl \
    # software-properties-common= \
 && rm -rf /var/lib/apt/lists/*

RUN wget https://deb.nodesource.com/setup_10.x
RUN chmod +x setup_10.x
RUN ./setup_10.x

RUN apt-get clean
RUN apt-get autoremove
RUN apt --fix-broken install

RUN apt-get install nodejs -y --allow-unauthenticated
RUN apt-get install -y build-essential 
RUN npm install -g n
RUN npm cache clean --force

WORKDIR /libreflix

COPY package*.json ./
RUN apt-get install -y python2.7
RUN npm config set python "/usr/bin/python2.7"


RUN n 10.0.0
RUN npm install sharp@0.20.1
RUN npm i @messageformat/core@3.0.0
RUN npm install fs-extra@5.0.0
RUN n 6.1.0

RUN npm install -g nodemon@1.11.1

RUN npm i

COPY . /libreflix/

CMD ["/bin/bash"]
