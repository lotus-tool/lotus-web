FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
ADD target/lotus-web-modelCheck-0.0.1-SNAPSHOT.jar lotus-web-modelcheck.jar
EXPOSE 8080
#ENTRYPOINT exec java $JAVA_OPTS -jar lotus-web-modelcheck.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar lotus-web-modelcheck.jar
