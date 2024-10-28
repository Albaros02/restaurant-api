## Características clave

- **Arquitectura limpia (Clean Architecture)**: Facilita la separación de las responsabilidades dentro de la aplicación, lo que mejora la mantenibilidad y la escalabilidad a medida que el proyecto crece.
- **Patrón CQRS**: Separación de las operaciones de lectura y escritura, lo que optimiza el rendimiento y la claridad en la lógica de negocio.
- **Base de datos con PostgreSQL**: PostgreSQL es la base de datos elegida para este proyecto, donde almacenamos metadatos relacionados con los archivos y otros datos persistentes.

## Requisitos previos

Antes de ejecutar este proyecto, asegúrate de tener instalados los siguientes componentes:

1. **Docker** y **Docker Compose**: El proyecto utiliza contenedores Docker para gestionar los servicios de base de datos y caché.
2. **Node.js**: Para ejecutar el servidor NestJS.

## Configuración y ejecución del proyecto

### 1. Levantar los servicios de base de datos y caché

El primer paso es levantar los contenedores para **PostgreSQL** (la base de datos) y **Redis** (el servicio de caché) utilizando Docker. Desde la carpeta raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up
```

Este comando lanzará los servicios necesarios, incluyendo la base de datos y Redis.

### 2. Iniciar la aplicación NestJS

Una vez que los servicios están corriendo, puedes iniciar la aplicación NestJS con el siguiente comando:

```bash
nest start restaurant
```

Este comando iniciará el microservicio de subida de archivos, permitiéndote interactuar con los endpoints disponibles.

## Estructura del proyecto

El proyecto sigue el patrón de **Clean Architecture**, dividiendo las capas de la aplicación en:

- **Controladores**: Manejan las peticiones HTTP.
- **Servicios**: Implementan la lógica de negocio.
- **Repositorios**: Gestionan la persistencia y recuperación de datos desde la base de datos.
- **Módulos**: Agrupan diferentes partes de la aplicación y organizan la lógica en unidades reutilizables.

Además, el patrón **CQRS** divide la aplicación en:

- **Comandos**: Para operaciones que modifican el estado del sistema (como la subida de un archivo).
- **Consultas**: Para operaciones de lectura de datos (como obtener un archivo o su miniatura).

## Tecnologías utilizadas

- **NestJS**: Framework principal para la construcción del microservicio.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar los metadatos de los archivos.
- **Docker**: Para orquestar los servicios de Redis y PostgreSQL.
- **CQRS**: Patrones de segregación de comandos y consultas para mejorar el rendimiento y la escalabilidad.