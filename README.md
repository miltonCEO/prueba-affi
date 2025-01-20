# Pipeline CI/CD para Infraestructura en Azure

## Descripción
Este proyecto implementa una infraestructura básica en Azure utilizando Terraform y un pipeline CI/CD en Azure DevOps. El pipeline automatiza la creación de un grupo de recursos, una cuenta de almacenamiento, un contenedor de Blob Storage, y la carga de un archivo estático.

## Estructura del Proyecto

```
prueba-affi/
├── terraform/
│   ├── main.tf         # Define los recursos de Azure.
│   ├── variables.tf    # Contiene variables reutilizables.
│   ├── outputs.tf      # Exporta información importante como URLs.
├── index.html          # Archivo estático a subir al Blob Storage.
├── azure-pipelines.yml # Configuración del pipeline CI/CD.
├── README.md           # Documentación del proyecto.
```

---

## Requisitos
1. Tener configurado Azure CLI y un Service Principal en Azure.
2. Configurar un Service Connection en Azure DevOps.
3. Asegurarse de tener permisos para crear recursos en la suscripción de Azure.

## Instrucciones para Ejecutar
1. Clona el repositorio.
2. Modifica las variables en `variables.tf` y `azure-pipelines.yml` Este paso se realiza si se necesita implementar en otro proyecto.
3. Ejecuta el pipeline en Azure DevOps:
   - El pipeline se divide en tres etapas:
     1. **Validación de Terraform:** Inicializa y valida los archivos de Terraform.
     2. **Despliegue de Infraestructura:** Crea la infraestructura en Azure.
     3. **Empaquetado de Artefactos:** Empaqueta y sube el archivo `app.zip` al Blob Storage.

## Decisiones Técnicas
- **Terraform:** Se utiliza para la modularidad y reutilización de la infraestructura.

- **Azure Blob Storage:** Exclusivamente usado para almacenamiento remoto, alineado con las restricciones.

- **Pipeline Modular:** Dividido en etapas claras (Validación, Despliegue, Empaquetado) para facilitar la depuración y reutilización.

- **Infraestructura:** Desde la creación de la infraestructura hasta la carga de artefactos, todo se realiza sin intervención manual.

- **Escalabilidad:** El diseño modular del pipeline y de la infraestructura permite ampliar la solución fácilmente.

- **Trazabilidad:** Terraform y el pipeline YAML aseguran que todos los cambios queden registrados y sean reproducibles.

## Resultados Esperados

1. Infraestructura creada en Azure con los siguientes componentes:
   - Grupo de recursos.
   - Cuenta de almacenamiento.
   - Contenedor de Blob Storage.
2. Archivo estático (`index.html`) subido al contenedor.
3. Artefacto empaquetado (`app.zip`) disponible en el Blob Storage.

