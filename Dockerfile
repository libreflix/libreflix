############################################
# guilmour.org
# Libreflix.org
############################################

FROM node:13.2.0
LABEL maintainer="me@guilmour.org"

# Define working directory.
WORKDIR /libreflix

COPY . /libreflix/

RUN npm install
RUN npm install --save-dev @babel/core @babel/node

CMD ["/bin/bash"]