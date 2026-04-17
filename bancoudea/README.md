# Bancoudea Backend

[![CI/CD Pipeline](https://github.com/AndiEspejo/laboratorio1_arquitectura/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/AndiEspejo/laboratorio1_arquitectura/blob/main/.github/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AndiEspejo_laboratorio1_arquitectura)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AndiEspejo_laboratorio1_arquitectura)

Backend Spring Boot del laboratorio de Arquitectura de Software.

## Stack

- Java 17
- Spring Boot 3.3.10
- Maven Wrapper
- Spring Data JPA
- MySQL en desarrollo
- H2 para tests/CI

## Endpoints principales

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `GET /api/transactions/account/{accountNumber}`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

## Ejecución local

### Desarrollo con MySQL local

El backend usa estas variables por defecto:

- `DB_URL=jdbc:mysql://localhost:3306/bancoudea?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `DB_USERNAME=root`
- `DB_PASSWORD=root`
- `JPA_DDL_AUTO=update`
- `PORT=8080`

Si tu MySQL local coincide con eso, podés correr:

```bash
./mvnw spring-boot:run
```

### Tests portables

Los tests usan H2 en memoria con el perfil `test`, así que no dependen de MySQL local:

```bash
./mvnw test
```

## Empaquetado

```bash
./mvnw -B package -DskipTests --file pom.xml
```

## Docker

Construcción local:

```bash
docker build -t bancoudea:latest .
```

Ejecución local:

```bash
docker run -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/bancoudea?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=root \
  bancoudea:latest
```

### Backend + MySQL juntos con Docker Compose

Desde la raíz del repo:

```bash
docker compose up --build
```

Eso levanta:

- `mysql` en `localhost:3306`
- `bancoudea` en `localhost:8080`

### Render

El repo incluye `render.yaml` para desplegar:

- un **Web Service** con este backend
- un **Private Service** MySQL 8 con disco persistente

Así evitás el anti-pattern de meter app + base de datos en una sola imagen.

## CI/CD

El workflow del repositorio corre sólo para el backend `bancoudea` y contempla:

1. tests con Maven
2. análisis de SonarCloud
3. build del JAR
4. escaneo de Snyk
5. build/push de imagen Docker
6. deploy opcional a Render

## Secrets esperados en GitHub

- `SONAR_TOKEN`
- `SNYK_TOKEN`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `RENDER_DEPLOY_HOOK_URL`
