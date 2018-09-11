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
 RUN wget https://deb.nodesource.com/setup_8.x
 RUN chmod +x setup_8.x
 RUN ./setup_8.x
 RUN apt-get install -y nodejs
 RUN apt-get install -y build-essential

# Define working directory.
WORKDIR /libreflix

COPY . /libreflix/

RUN npm install --loglevel=error
RUN npm install -g nodemon --loglevel=error
RUN npm install express --loglevel=error

# Define default command.
CMD ["/bin/bash"]
