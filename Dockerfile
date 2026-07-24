# Base Image
FROM node:24.18.0-alpine3.24

#move to /home/app
WORKDIR /home/app/

#copy package files

COPY package*.json .
# COPY package-lock.json package-lock.json
# COPY package.json package.json

#install packages
RUN npm install

# Copying src folder to docker image
COPY src/ /home/app/src/

# Expose ports
EXPOSE 3000 4000 7000
#expose range of ports
EXPOSE 8000-8010 

#create a new user
RUN addgroup --system --gid 1001 nodejsgroup
RUN adduser --system -uid 1001 nodejsuser

# and run this as this new user not rootuser
USER nodejsuser

# automatically runs npm run dev command at end
CMD [ "npm","run","dev" ]

#to build image
# docker build -t <anynameforapp> <path>
# e.g. docker build -t myapp .   
# docker build -t saqibwani273/project_management_with_nodejs .

# add tag to image
# docker tag myapp saqibwani273/project_management_with_nodejs

# to run image via cmd line
# e.g. docker run -it myapp   //without port mapping
# with port mapping
# docker run -it -p <host-port>:<container-port> myapp 
# e.g. docker run -it -p 8000:3000 myapp   

# docker run -it -P myapp // to listen to the exposed ports

# docker run -it --rm myapp  //to remove container after

# -itd to run in detached mode so that terminal is not stuck & conatiner run in bg
# docker run -itd --rm myapp  

# docker run -it -p 8000:3000 --env-file .env myapp
