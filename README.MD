# 🚀 Docker Application Deployment

Repositorio para administrar el despliegue de aplicaciones Docker usando
**Portainer**, **nginx-proxy**, **Let's Encrypt Companion** y **GitHub Actions**.

La infraestructura está separada en dos capas:

* 🏗️ **Base Infrastructure**: servicios fundamentales necesarios
  para ejecutar la plataforma.
* 🚀 **Applications**: servicios desplegados mediante CI/CD.

---

## 📂 Project Structure

```text
.
├── .github
│   └── workflows
│       └── deploy-api.yml
│
├── infrastructure
│   ├── api
│   │   └── compose.yaml
│   │
│   └── base
│       └── compose.yaml
│
├── services
│   ├── api
│   │   ├── app.js
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── frontend
│
└── LICENSE
```

---

## 🏗️ Base Infrastructure

La carpeta `infrastructure/base` contiene los servicios necesarios para que la
plataforma funcione.

Incluye:

* 🔀 Reverse Proxy
* 📦 Portainer
* 🔐 Automatic SSL certificates

Estos servicios deben desplegarse primero.

La dependencia es:

```text
1️⃣ Docker Host
        |
        ▼
2️⃣ Base Infrastructure
        |
        ▼
3️⃣ Application Services
```

---

## ⚙️ Requirements

Antes de iniciar necesitas:

* 🐳 Docker instalado
* 🐙 Docker Compose instalado
* 🌐 Dominio configurado

---

## 1️⃣ Create Docker Network

Crear la red compartida utilizada por los servicios:

```bash
docker network create proxy
```

Esta red permite la comunicación entre:

* Reverse Proxy
* Portainer
* Applications

---

## 2️⃣ Deploy Base Infrastructure

Entrar al directorio:

```bash
cd infrastructure/base
```

Ejecutar:

```bash
docker compose up -d
```

Esto iniciará:

```text
🔀 Reverse Proxy
📦 Portainer
🔐 Certificate Management
```

Validar servicios:

```bash
docker ps
```

---

## 3️⃣ Access Portainer

Una vez desplegada la infraestructura base, Portainer estará disponible mediante
el dominio configurado.

Desde Portainer podrás:

* Crear stacks adicionales.
* Administrar contenedores.
* Revisar logs.
* Gestionar imágenes.

---

## 🚀 Application Deployment

Las aplicaciones se encuentran dentro de:

```text
services/
```

Cada aplicación contiene su propio código y Dockerfile.

Ejemplo:

```text
services/api

├── app.js
├── Dockerfile
├── package.json
└── package-lock.json
```

---

## 🐳 Docker Image Build

Las imágenes son construidas automáticamente mediante GitHub Actions.

Flujo:

```text
Developer
    |
    ▼
git push
    |
    ▼
GitHub Actions
    |
    ▼
Docker Build
    |
    ▼
Push Image Registry
    |
    ▼
Deploy Stack
    |
    ▼
Portainer
```

---

## 🔄 Continuous Deployment

El workflow:

```text
.github/workflows/deploy-api.yml
```

se ejecuta cuando existen cambios en:

```text
services/api/**
```

El proceso realiza:

1. 📥 Checkout del código.
2. 🐳 Construcción de imagen Docker.
3. 📦 Publicación de imagen.
4. 🚀 Actualización del stack en Portainer.

---

## 🔐 GitHub Secrets

Configurar los siguientes secretos:

### Portainer URL

```text
PORTAINER_URL
```

Ejemplo:

```text
https://portainer.example.com
```

---

### Portainer Token

```text
PORTAINER_TOKEN
```

Generado desde:

```text
Portainer
 └── My Account
      └── Access Tokens
```

---

## 📦 Application Compose

Cada aplicación tiene su propio archivo:

```text
infrastructure/<application>/compose.yaml
```

Ejemplo:

```text
infrastructure/api/compose.yaml
```

Este archivo define cómo será desplegada la aplicación.

Ejemplo:

```yaml
services:

  api:
    image: ghcr.io/<owner>/api:latest
    restart: unless-stopped

    environment:
      VIRTUAL_HOST: api.example.com
      VIRTUAL_PORT: 3000

      LETSENCRYPT_HOST: api.example.com
      LETSENCRYPT_EMAIL: admin@example.com

    networks:
      - proxy


networks:
  proxy:
    external: true
```

---

## 🔄 Updating an Application

Para desplegar nuevos cambios:

```bash
git add .
git commit -m "Update API"
git push
```

GitHub Actions realizará automáticamente:

```text
Build
  |
  ▼
Push Image
  |
  ▼
Deploy Stack
  |
  ▼
Restart Container
```

---

## 🛠️ Troubleshooting

### Application does not update

Verificar que la imagen fue actualizada:

```bash
docker images
```

Si es necesario:

```bash
docker pull ghcr.io/<owner>/<image>:latest
```

---

## Check Application Logs

Desde Portainer:

```text
Stacks
 └── Application
      └── Logs
```

o mediante Docker:

```bash
docker logs <container>
```

---

## Certificate Issues

Revisar logs:

```bash
docker logs <certificate-container>
```

Debe aparecer:

```text
Creating/renewal <domain> certificates...
```

---

## 📝 Notes

* La carpeta `base` debe desplegarse primero.
* Las aplicaciones no deben administrar la infraestructura base.
* Los archivos `compose.yaml` permanecen estáticos.
* Las imágenes Docker se actualizan mediante CI/CD.
* Portainer es utilizado como punto central de administración.

---

## 📌 Future Improvements

* 🔖 Versionado de imágenes Docker.
* 📊 Monitoring stack.
* 📝 Centralized logging.
* 🔒 Security hardening.
