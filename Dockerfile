# Use a Maven image to build the project
FROM maven:3.9.5-eclipse-temurin-17 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file and download project dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the entire project
COPY . .

# Package the application
RUN mvn package -DskipTests

# Use a lightweight JDK image for running the application
FROM eclipse-temurin:17-jre

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default port Spring Boot runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
