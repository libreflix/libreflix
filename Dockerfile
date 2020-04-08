############################################
# guilmour.org
# Libreflix.org
############################################

FROM debian
MAINTAINER me@guilmour.org

# Apt install some tools
RUN apt-get update && apt-get install -y \
    build-essential \
    unzip \
    wget \
    curl \
 && rm -rf /var/lib/apt/lists/*

 #Getting Node
 RUN wget https://deb.nodesource.com/setup_10.x
 RUN chmod +x setup_10.x
 RUN ./setup_10.x
 RUN apt-get install -y nodejs
 RUN apt-get install -y build-essential

# Define working directory.
WORKDIR /libreflix

COPY package.json .
RUN npm cache clean --force
RUN rm -rf node_modules
RUN npm install
RUN npm install express
RUN npm install i18n
RUN npm install cookie-parser
RUN npm install -g nodemon
RUN npm install elasticsearch --save

COPY . /libreflix/

# Define default command.
CMD ["/bin/bash"]
