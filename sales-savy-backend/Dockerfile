
FROM maven:3.8.6-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/sales-savy-1.0.0.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
