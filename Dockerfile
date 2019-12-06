############################################
# guilmour.org
# Libreflix.org
############################################

FROM node:13.2.0
LABEL maintainer="me@guilmour.org"

# Define working director, which is mapped by docker-compose volume as ./
WORKDIR /libreflix

# Copy the contents in case we are not using volume-mount
COPY ./ ./

RUN npm ci
# RUN npm install --save-dev @babel/core @babel/node

CMD ["/bin/bash"]