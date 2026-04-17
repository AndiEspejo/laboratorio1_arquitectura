# Laboratorio 1 - Arquitectura Software

[![CI/CD Pipeline](https://github.com/AndiEspejo/laboratorio1_arquitectura/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/AndiEspejo/laboratorio1_arquitectura/blob/main/.github/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=alert_status&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=coverage&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)

Repositorio del laboratorio con dos frentes principales:

- `bancoudea` → backend Spring Boot con Maven
- `frontend` → interfaz web del proyecto

La automatización CI/CD del laboratorio está enfocada hoy en el backend `bancoudea`.

## Estructura del repositorio

- `bancoudea/` → backend Java/Spring Boot
- `frontend/` → frontend
- `.github/workflows/build.yml` → pipeline CI/CD del backend

## Backend (`bancoudea`)

### Stack

- Java 17
- Spring Boot 3.3.10
- Maven Wrapper
- Spring Data JPA
- MySQL en desarrollo
- H2 para tests y CI

### Endpoints principales

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

### Ejecución local del backend

Entrá a la carpeta del backend:

```bash
cd bancoudea
```

Correr en desarrollo:

```bash
./mvnw spring-boot:run
```

Correr tests:

```bash
./mvnw test
```

Empaquetar:

```bash
./mvnw -B package -DskipTests --file pom.xml
```

> Los tests del backend usan H2 en memoria, así que no dependen de MySQL local para CI.

## Docker

Construcción local del backend:

```bash
cd bancoudea
docker build -t bancoudea:latest .
```

## Required GitHub secrets

Para activar el flujo completo del laboratorio en GitHub:

- `SONAR_TOKEN`
- `SNYK_TOKEN`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `RENDER_DEPLOY_HOOK_URL`

## Pipeline stages

1. **Unit tests** → corre tests Maven del backend
2. **SonarCloud analysis** → publica análisis cuando existe `SONAR_TOKEN`
3. **Build JAR** → genera y publica el artefacto del backend
4. **Snyk scan** → analiza vulnerabilidades cuando existe `SNYK_TOKEN`
5. **Docker image** → construye/publica `DOCKER_USERNAME/bancoudea:latest` cuando existen credenciales Docker
6. **Deploy to Render** → dispara el deploy hook cuando existe `RENDER_DEPLOY_HOOK_URL`

## Notas

- El workflow está configurado para dispararse cuando cambian archivos del backend o del workflow.
- Si faltan secrets, los jobs externos quedan en **skip** en vez de romper el pipeline.
- Para detalles específicos del backend, ver [`bancoudea/README.md`](./bancoudea/README.md).
