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

## Monitoring Tomcat

If debugging Tomcat is required, in another terminal, enter the container in interactive mode. First get the container 
ID for the DeXMS service container with ``docker ps``. Then:

``docker exec -it CONTAINER_ID bash``

Then in the container, check the log files with

``tail -f /usr/local/apache-tomcat-8.5.42/logs/catalina.out``

