############################################
# guilmour.org
# Libreflix.org
############################################

FROM node:13.2.0
LABEL maintainer="me@guilmour.org"

# Define working director, which is mapped by docker-compose volume as ./
WORKDIR /libreflix

# We neeed to copy package.json first because volume mapping
# happens on the docker-compose up and not on build pahse
COPY package*.json ./

RUN npm ci
# RUN npm install --save-dev @babel/core @babel/node

CMD ["/bin/bash"]