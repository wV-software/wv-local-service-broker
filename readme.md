![](https://raw.githubusercontent.com/wV-software/icons/main/Wv/Product%20Icon/wv_128x128.png) wv-local-service-bus
# Purpose
To provide a service broker for local services.
# Package Dependencies
- http
- socket.io.

# Technical Dependencies
Each service that will be exposed using the service broker **LocalServiceBroker** which by nature runs in another process, must use **LocalService** from wv-local-service package, for registering in the broker. Please find how to implement it in the readme.md of wv-local-service package.

# How to Use
`import { LocalServiceBroker } from 'wv-local-service-broker'`__
`LocalServiceBroker.start(/*your arbitrary port number e.g. 777*/);`



> You may find a commented out sample code in `/src/index.ts` file.
You could uncommnet it and run the following command in the terminal to get your hands in quickly.

`tsc && node ./dist/index`


> Please find the readme.md of wv-localhost-service package for more info on the service side.