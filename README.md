# DeXMS Service

This project is related to the [DeXMS](https://gitlab.inria.fr/zefxis/DeXMS) and
[DexDeploy](https://gitlab.inria.fr/zefxis/dexdeploy) projects.

The DeXMS service embeds the DeXMS components involved in the generation of mediators in a war file ready to deploy 
on Tomcat and accessible thru a REST API call.

In order to easily deploy this service, a Dockerfile is provided to generate and start a Docker container running 
the DeXMS service in a Tomcat instance.

## Generate and launch the DeXMS service

A ``Dockerfle`` and a shell scrip ``launch_tomcat_bg.sh`` are provided. 

In order to build the Docker image and start the container, first clone the repository.

Then build the image with (change the image name and version number accordingly)

``docker build -t="dexms_service:1.0" .``

In order to start the container

``docker run -p 8080:8080 dexms_service:1.0``

By default, this will start the ``launch_tomcat_bg.sh`` script that launches Tomcat in the background and then wait 
(container will not exit).

In order to check that Tomcat is running, in a browser, open the url http://localhost:8080. Tomcat should respond. It 
is then possible to navigate to the Tomcat's manager application to check that the DeXMS service is running properly.

If debugging Tomcat is required, in another terminal, enter the container in interactive mode. First get the container 
ID for the DeXMS service container with ``docker ps``. Then:

``docker exec -it CONTAINER_ID bash``

Then in the container, check the log files with

``tail -f /usr/local/apache-tomcat-8.5.42/logs/catalina.out``


```
python3 mediator_service_request.py http://localhost:8080/dexms-service-1.0.0-SNAPSHOT/dexms/mediator \
    laxparking.gidl \
    mqtt \
    laxparking \
    generated_mediator.jar
```

The jar file can then be tested directly with the command

```java -jar generated_mediator.jar```

## DeXMS service API

In order to generate and test the mediator inside a Dockerfile, first go into the scripts folder, and then call 
the following command:

```sh mediator_dockerfile_generation.sh laxparking.gidl laxparking 1.0 443,80,8080```

Once the Dockerfile is generated, the Docker image is then automatically created. Once
the image generation is completed, 

```docker run -p 443:443 mediator_laxparking:1.0```

