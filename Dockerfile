# Base Image
FROM ubuntu 

# install curl to be able to install nodejs
RUN apt-get update
RUN apt install -y curl
#install nodejs on this image
RUN curl -sL https://deb.nodesource.com/setup_25.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install -y nodejs

# Copying source code to docker image
COPY package-lock.json /home/app/package-lock.json
COPY package.json /home/app/package.json
COPY src/ /home/app/src/

#move to /home/app and install packages

WORKDIR /home/app/
RUN npm install

# docker build -t <anynameforapp> <path>
# e.g. docker build -t myapp .