############################################
# guilmour.org
# Libreflix.org
############################################

FROM debian:buster-20191118
LABEL maintainer="me@guilmour.org"

# Apt install some tools
RUN apt-get update && apt-get install -y \
    build-essential=12.6 \
    unzip=6.0-23+deb10u1 \
    wget=1.20.1-1.1 \
    curl=7.64.0-4 \
    software-properties-common=0.96.20.2-2 \
 && rm -rf /var/lib/apt/lists/*

 #Getting Node
 RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
 RUN apt-get update
 RUN apt-get install -y nodejs=10.17.0-1nodesource1
 RUN apt-get install -y build-essential=12.6

# Define working directory.
WORKDIR /libreflix

COPY package*.json ./
RUN npm install .
RUN npm install express@4.13.4
RUN npm install -g nodemon@2.0.1
RUN npm audit fix --force
RUN npm install elasticsearch@16.5.0 --save

COPY . /libreflix/

# Define default command.
CMD ["/bin/bash"]
