############################################
# guilmour.org
# Libreflix.org
############################################

FROM debian
LABEL maintainer="me@guilmour.org"

# Apt install some tools
RUN apt-get update && apt-get install -y \
    build-essential \
    unzip \
    wget \
    curl \
    software-properties-common \
 && rm -rf /var/lib/apt/lists/*

 #Getting Node
 RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
 RUN apt-get update
 RUN apt-get install -y nodejs
 RUN apt-get install -y build-essential

# Define working directory.
WORKDIR /libreflix

COPY package*.json ./
RUN npm install .
RUN npm install express
RUN npm install -g nodemon
RUN npm audit fix --force
RUN npm install elasticsearch --save

COPY . /libreflix/

# Define default command.
CMD ["/bin/bash"]
