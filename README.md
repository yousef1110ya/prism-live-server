# prism - live server 

this project is mainly a live streaming service to add in your simple application 
##the technologies used : 
- node.js 
- mongo database docker image 
- [tiangolo/nginx-rtmp docker image](https://hub.docker.com/r/tiangolo/nginx-rtmp)


## usage 
there are a few endpoints for this application and all of them require jwt auth 
- start a live stream
    - http://localhost:4000/api/stream/start
- end a live stream
    - http://localhost:4000/api/stream/end/stream-key 
- get all active live streams
    - http://localhost:4000/api/stream

## installing 
1. clone this repo 
2. run npm install
3. Use `docker-compose up -d` to install all the docker images.
4. run the docker container from docker desktop (for simplicity)



## Authers 
- Yousef al shikh ali 
- Hamza Tarek Batta 

## License

MIT License