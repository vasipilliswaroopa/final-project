# Stock Backend API - Deployment Guide

This backend service is built with Java 21, Spring Boot 3.5+, and Maven. It is optimized for containerized deployment on Render.

## Deploying to Render via Docker

Render supports deploying Spring Boot applications directly from a `Dockerfile`. Follow these steps to set up and deploy the backend:

1. **Create a New Web Service**:
   - Go to your Render Dashboard and click **New > Web Service**.
   - Connect your GitHub repository that contains this project.

2. **Configure Service Settings**:
   - **Name**: `stock-backend-api` (or any preferred name).
   - **Environment**: **Docker**.
   - **Docker Context**: `backend` (if you are deploying from a monorepo).
   - **Dockerfile Path**: `backend/Dockerfile` (if deploying from a monorepo) or just `Dockerfile` if in a standalone repo.
   - **Region**: Select a region close to your target users.

3. **Configure Environment Variables**:
   Add any database credentials or environment overrides in the Render dashboard:
   - `PORT`: `8080` (or leave unset to let Render set it dynamically; our application reads the port from `${PORT:8080}`).
   - `SPRING_DATASOURCE_URL`: Your production database URL.
   - `SPRING_DATASOURCE_USERNAME`: Your database username.
   - `SPRING_DATASOURCE_PASSWORD`: Your database password.

4. **Configure Health Check**:
   - Under **Advanced**, find the **Health Check Path** setting.
   - Set the **Health Check Path** to exactly `/health`.
   - Set the HTTP status check (Render expects a 200 OK response from this endpoint, which returns `"OK"`).

5. **Deploy**:
   - Click **Create Web Service**. Render will automatically build the multi-stage Docker image and deploy your Spring Boot service.

## Local Development

To run the backend locally:
```bash
mvn clean install
./mvnw spring-boot:run
```
Once started, the API is available at `http://localhost:8080`.
- Root API test: `http://localhost:8080/`
- Health check: `http://localhost:8080/health`
- Stocks feed: `http://localhost:8080/api/stocks`
