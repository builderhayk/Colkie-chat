##Setting up envs

- create .production.env file from .env.example in configs folder
- create .development.env file from .env.example in configs folder
- set up the needed variables
- 
## Running the app for production 

```bash
# development
$ docker build -t my-app .

# watch mode
$ docker-compose up --build
```


## Running the app for development

- if you are running the application for first time you need to run the docker build app command
```bash
# development
$ docker build -t my-app .
$ NODE_ENV=development docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- next times you just need to run
```bash
# development
$ npm run start:development
```

This is the link for Postman Api's collection
With some automation to set up the variables for testing api's
you need to just copy the collection to local machine and add environment variable BASE_URL
The port for nest application is 3000
example "BASE_URL=http://127.0.0.1:3000"
`https://www.postman.com/galactic-firefly-8476/workspace/colkie/overview`


After registering users and creating rooms,
you can connect socket client and test it again with the same port
From Front end you need to add authorization headers when connecting to socket gateway
{"authorization": "${BEARER_TOKEN}"}

Back end is subscribing to Messages 
- joinRoom {"roomId": "${roomId}"}
- sendMessageToRoom {"message": "${message}", "roomId": "${roomId}"}
- addMemberToRoom { roomId: "${roomId}"; userId: "${userId}" }

Also Back end is sending messages that front end need to subscribe
- newMessage
- newUserAdded
- hasBeenAddedToRoom


##Notes

Of course this is a test application,
A lot of things may be written in a better way,
for example doing requests to database from repositories or
having additional security checking layer for REFRESH_TOKEN or maybe 
separated service for Sockets Messages Handlers or 
for example storing the connected users instances and rooms in Redis or etc.

if you will have issues running the application or you will have questions you can contact me via telegram
`@dreamchaser1998`
