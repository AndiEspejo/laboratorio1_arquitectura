# Laboratorio 1 - Arquitectura Software

[![CI/CD Pipeline](https://github.com/AndiEspejo/laboratorio1_arquitectura/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/AndiEspejo/laboratorio1_arquitectura/blob/main/.github/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=alert_status&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=coverage&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=vulnerabilities&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AndiEspejo_laboratorio1_arquitectura&metric=code_smells&branch=main&token=4e5ac4f1d39b4e7df29bac1294fc56521335d78d)](https://sonarcloud.io/dashboard?id=AndiEspejo_laboratorio1_arquitectura&branch=main)
[![Snyk](https://img.shields.io/badge/Snyk-monitored-8A2BE2?logo=snyk&logoColor=white)](https://app.snyk.io/org/andiespejo/project/7ded8268-becc-4b37-bef6-e63e336e7299)

Repositorio del laboratorio con dos frentes principales:

- `bancoudea` → backend Spring Boot con Maven
- `frontend` → interfaz web del proyecto

La automatización CI/CD del laboratorio está enfocada hoy en el backend `bancoudea`.

## Docker, Render y Azure

- `docker-compose.yml` levanta **backend + MySQL** juntos para desarrollo/demo local con `docker compose up --build`
- `render.yaml` sigue disponible como alternativa manual para Render con backend + MySQL separados
- el **despliegue automático actual del pipeline** apunta a **Azure App Service**

Para no gastar de más en un laboratorio académico, el deploy de Azure usa un **perfil `azure` con H2 en memoria**. Eso evita pagar una base administrada solo para que el profe pruebe el backend una o dos veces.

## Estructura del repositorio

- `bancoudea/` → backend Java/Spring Boot
- `frontend/` → frontend
- `.github/workflows/build.yml` → pipeline CI/CD del backend
- `docker-compose.yml` → stack local con backend + MySQL
- `render.yaml` → blueprint alternativo para Render

## Backend (`bancoudea`)

### Stack

- Java 17
- Spring Boot 3.3.10
- Maven Wrapper
- Spring Data JPA
- MySQL en desarrollo
- H2 para tests/CI y demo económica en Azure

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

## Azure App Service (recomendado para la entrega)

1. Crear un **Web App** en Azure App Service con **Java 17 / Java SE**. Si querés usar el plan **Free/F1**, normalmente te conviene **Windows**.
2. En **Configuration > Application settings**, agregar: `SPRING_PROFILES_ACTIVE=azure`.
3. Si al descargar el publish profile te aparece `Basic authentication is disabled`, habilitá **SCM Basic Auth Publishing Credentials** en el Web App y volvé a intentar.
4. Descargar el **publish profile** desde el portal.
5. Guardar estos secrets en GitHub Actions:
   - `AZURE_WEBAPP_NAME`
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
6. Hacer push a `main` para que el pipeline despliegue el JAR automáticamente.

## Required GitHub secrets

Para activar el flujo completo del laboratorio en GitHub:

- `SONAR_TOKEN`
- `SNYK_TOKEN`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `AZURE_WEBAPP_NAME`
- `AZURE_WEBAPP_PUBLISH_PROFILE`

## Pipeline stages

1. **Unit tests** → corre tests Maven del backend
2. **SonarCloud analysis** → publica análisis cuando existe `SONAR_TOKEN`
3. **Build JAR** → genera y publica el artefacto del backend
4. **Snyk scan** → analiza vulnerabilidades cuando existe `SNYK_TOKEN`
5. **Docker image** → construye/publica `DOCKER_USERNAME/bancoudea:latest` cuando existen credenciales Docker
6. **Deploy to Azure App Service** → publica el JAR en Azure cuando existen `AZURE_WEBAPP_NAME` y `AZURE_WEBAPP_PUBLISH_PROFILE`

## Notas

- El workflow está configurado para dispararse cuando cambian archivos del backend o del workflow.
- Si faltan secrets, los jobs externos quedan en **skip** en vez de romper el pipeline.
- Para detalles específicos del backend, ver [`bancoudea/README.md`](./bancoudea/README.md).
