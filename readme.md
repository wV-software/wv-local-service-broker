![](https://raw.githubusercontent.com/wV-software/icons/main/Wv/Product%20Icon/wv_128x128.png) wv-local-service-bus
# Purpose
- It provides an easy way to code means for communication of dynamically created services within the localhost (127.0.0.1).
- The whole solution is devided between two packages `ws-local-service-broker` and `ws-local-service`.
# Package Dependencies
- http
- socket.io.

# Brief Documentation
- From package `ws-local-service-broker` you can start a broker by calling `LocalServiceBroker.start()`. 
- Only one `LocalServiceBroker.start()` invokation could be made in a process lifetime.
- `LocalServiceBroker` cannot be hosted in a web page, while `LocalService` could be hosted in a web page the same exact way as in a process with two way communication supported.
- The hosting machine could run only one `LocalServiceBroker` at a time on port `47979`.
- If a `LocalServiceBroker.start()` is invoked from one or more processes while there is an already running one, the newest one/ones keeps/keep standby and one of them compensates the running one in the case of the exit of the running one.
- Each service connects to and identifies itself to the service broker through invoking `LocalService.contributeAs()` from `wv-local-service` package. The serivce identity is provided through the first argument `serviceName`.
- `LocalService.contributeAs()` could be invoked only once in a process or a web page.
- If a new service contributed later using the same service name. It replaces the old one (by design).
- A process or a web page could host only one service.
- Remote procedure calls between processes are done by instantiating an `Envelop`'s subclass and calling `envelop.postAsync()` method.
- Envelop is an abstract class, so you typically inherit it to provide its own schema of request and response.
 
# How to Use
`import { LocalServiceBroker } from 'wv-local-service-broker'`<br/>
`LocalServiceBroker.start();`



> You may find a commented out sample code in `/src/index.ts` file.
You could uncommnet it and run the following command in the terminal to get your hands in quickly.

`tsc && node ./dist/index`


> Please find the readme.md of [wv-localhost-service package](https://github.com/wV-software/wv-local-service) for more info on the service side.