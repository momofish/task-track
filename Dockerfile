FROM hub.c.163.com/library/node:latest

# Create app directory
RUN mkdir -p /home/node-app
WORKDIR /home/node-app
COPY . /home/node-app

EXPOSE 4000
CMD [ "npm", "start" ]