# Xtract HTML to Image (Serverless Microservice)

Microservicio Serverless ultraliviano para renderizar diapositivas de carruseles y piezas gráficas HTML a imágenes PNG de alta resolución (1080x1350px) utilizando Chromium y Puppeteer.

## Despliegue en Vercel (100% Gratis - 2 minutos)

### Opción 1: Con Vercel CLI (desde la terminal)
1. Abrí una terminal en esta carpeta: `cd services/html-to-image-service`
2. Ejecutá: `npx vercel`
3. Seguí las instrucciones (login con tu cuenta de Vercel) y listo. Te devolverá la URL pública (ej. `https://xtract-html-to-image.vercel.app`).

### Opción 2: Desde GitHub + Vercel Dashboard
1. Creá un repositorio en GitHub con el contenido de esta carpeta.
2. Andá a [vercel.com/new](https://vercel.com/new), seleccioná el repositorio y dale a **Deploy**.

---

## Endpoint API

**POST** `/api/render`

### Payload JSON:
```json
{
  "html": "<!DOCTYPE html><html>...</html>",
  "width": 1080,
  "height": 1350,
  "deviceScaleFactor": 2
}
```

### Respuesta:
Devuelve directamente el archivo binario de la imagen (`Content-Type: image/png`).
