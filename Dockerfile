# Dockerfile for the DeXMS service image/container
# provides the service on port 8080 thru Tomcat.

# To build: docker build -t="dexms:1.0" .
# to start: docker run -d dexms:1.0

FROM ubuntu:16.04

SHELL ["/bin/bash", "-c"]

RUN mkdir /app
WORKDIR /app/

# update ubuntu and install default packages
# Do the operations in single run so that it installs the
# latest packages and does not reuse an existing layer
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y git \
        tofrodos \
        unzip \
        vim \
        wget


# install java
RUN apt-get install -y default-jdk
# set jdk path (use 2 lines, -n to avoid CRLF
RUN echo -n "JAVA_HOME=" >> /etc/environment
RUN update-alternatives --config java | head -n 1 | sed -n -e 's/^.*: //p'  >> /etc/environment


# install maven
RUN wget http://apache.mirrors.benatherton.com/maven/maven-3/3.6.1/binaries/apache-maven-3.6.1-bin.tar.gz
RUN gunzip apache-maven-3.6.1-bin.tar.gz
RUN tar xvf apache-maven-3.6.1-bin.tar
RUN cp -rf apache-maven-3.6.1 /usr/local/
RUN rm -rf apache-maven-3.6.1-bin.tar apache-maven-3.6.1
# add maven bin to path
RUN echo "PATH=\"/usr/local/apache-maven-3.6.1/bin:$PATH\"" >>  /etc/environment
# change MAVEN_OPTS to support compilation on docker, avoid GC exception
# RUN echo 'export MAVEN_OPTS="-Xmx1024m -Xms512m -XX:MaxPermSize=256m"' >> /etc/environment
RUN echo 'export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=256m"' >> /etc/environment

# install tomcat
RUN wget https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.42/bin/apache-tomcat-8.5.42.zip
RUN unzip apache-tomcat-8.5.42.zip
RUN cp -rf apache-tomcat-8.5.42 /usr/local/
RUN rm -rf apache-tomcat-8.5.42  apache-tomcat-8.5.42.zip
# set CATALINA_HOME and add to path
RUN echo 'CATALINA_HOME="/usr/local/apache-tomcat-8.5.42"' >> /etc/environment
RUN echo 'PATH="$CATALINA_HOME/bin:$PATH"' >>  /etc/environment
# set scripts as executable
RUN chmod u+x /usr/local/apache-tomcat-8.5.42/bin/*.sh
# add users/role for accessing manager app
RUN sed -i '$ i\  <role rolename="tomcat"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <role rolename="role1"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <role rolename="manager-gui"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <role rolename="manager-script"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <user username="tomcat" password="inriased" roles="tomcat,manager-gui,manager-script"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <user username="both" password="inriased" roles="tomcat,role1"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
RUN sed -i '$ i\  <user username="role1" password="inriased" roles="role1"/>' /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml

# delete the Valve line in manager/host manager that prevents accessing manager outside of the host - needed for docker
RUN sed --in-place '/^.*Valve.*$/d' /usr/local/apache-tomcat-8.5.42/webapps/manager/META-INF/context.xml
RUN sed --in-place '/^.*allow.*$/d' /usr/local/apache-tomcat-8.5.42/webapps/manager/META-INF/context.xml
RUN sed --in-place '/^.*Valve.*$/d' /usr/local/apache-tomcat-8.5.42/webapps/host-manager/META-INF/context.xml
RUN sed --in-place '/^.*allow.*$/d' /usr/local/apache-tomcat-8.5.42/webapps/host-manager/META-INF/context.xml
# make sure all lines are CRLF to avoid ^M character at end of line when usign vim
RUN todos /usr/local/apache-tomcat-8.5.42/conf/tomcat-users.xml
# change war upload limit from 50mb to around 150mb (mediator is 54mb)
RUN sed -i 's/52428800/152428800/g' /usr/local/apache-tomcat-8.5.42/webapps/manager/WEB-INF/web.xml
# starts tomcat
RUN /usr/local/apache-tomcat-8.5.42/bin/startup.sh

# clone DexMS code
RUN git clone https://gitlab.inria.fr/zefxis/DeXMS-Service.git #

# clean and install DeXMS
WORKDIR /app/DeXMS-Service
RUN git pull
RUN source /etc/environment && mvn clean verify
RUN source /etc/environment && mvn install

# deploy generated war in the tomcat webapp forlder
# TODO: here the dexms service version number should be removed from the war filename
# so that it does not break API call in other scripts when we update the service
RUN cp target/dexms-service-1.0.0-SNAPSHOT.war /usr/local/apache-tomcat-8.5.42/webapps/

# expose port for tomcat
EXPOSE 8080

# created a file with tail command so that scripts does not exit
# otherwise the container will exit also
WORKDIR /app
COPY launch_tomcat_bg.sh .
RUN chmod u+x launch_tomcat_bg.sh

# TODO
# initial command, but it returns so the container exits/stops
# so launch a bash afterwards to avoid the container exiting
# this is however not the proper way of using containers. Tomcat should be launched
# in foreground instead, and if the container dies (meaning tomcat died), then it
# can be restarted by another tool (kubernetes for example). this is the proper way
# of doing microservices
CMD bash -C './launch_tomcat_bg.sh';'bash'
