############################################
# guilmour.org
# Libreflix.org
############################################

FROM debian:buster-20191118
LABEL maintainer="me@guilmour.org"

# Define working directory.
WORKDIR /libreflix

COPY package*.json ./
COPY Makefile ./
RUN apt-get update && apt-get install -y \
    build-essential=12.6 \
    unzip=6.0-23+deb10u1 \
    wget=1.20.1-1.1 \
    curl=7.64.0-4 \
    software-properties-common=0.96.20.2-2 \
    && make configure-nodejs
RUN make npm-build

COPY . /libreflix/

# Define default command.
CMD ["/bin/bash"]
