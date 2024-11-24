FROM amazoncorretto:8-alpine3.19-jre AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build *.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]