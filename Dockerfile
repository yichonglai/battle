FROM daocloud.io/node

RUN mkdir -p /home/services/test
COPY .  /home/services/test

WORKDIR /home/services/test

EXPOSE 3001

CMD [ "npm", "start" ]