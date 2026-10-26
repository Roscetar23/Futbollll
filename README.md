# ⚽ Cancha

Aprende a jugar fútbol con lecciones cortas, ejercicios con balón y progreso por habilidades. Inspirado en el aprendizaje por pequeñas metas: una sola aplicación en **TypeScript, React Native, Expo SDK 58 y Expo Router** para **Android, iOS y web**.

## Empezar

Requisitos: Node.js 24 y npm. Desde la raíz del proyecto:

```bash
npm ci
npm run web
```

Para móvil:

```bash
npm start
npm run android
npm run ios
```

`npm start` muestra el QR para abrir el proyecto en una versión de Expo Go compatible con SDK 58. Android requiere emulador o dispositivo; `npm run ios` requiere macOS y el simulador de Xcode. Si Expo Go no soporta la versión o necesitas módulos nativos propios, crea un development build con `npx expo run:android` o `npx expo run:ios`; estos comandos requieren las herramientas nativas correspondientes. No se necesitan variables de entorno ni cuentas para ejecutar la primera versión.

## Arquitectura Screaming

La estructura principal expresa **qué hace el producto**. Las carpetas hablan de entrenamiento y progreso; las tecnologías se mantienen dentro de cada módulo.

```text
src/
├── entrenamiento/
│   ├── domain/           # Lecciones, respuestas y reglas de desbloqueo
│   └── presentation/     # Ruta de aprendizaje y experiencia de la lección
├── progreso/
│   ├── domain/           # XP, racha, validación y finalización de lecciones
│   ├── application/      # Contrato de persistencia de progreso
│   ├── infrastructure/   # Adaptador de almacenamiento local
│   └── presentation/     # Estado de interfaz y pantalla de progreso
├── app/                  # Rutas de Expo Router y composición de dependencias
└── shared/
    └── presentation/     # Estilos, botones y encabezado compartidos
tests/                    # Pruebas de reglas de aprendizaje
```

El dominio usa TypeScript puro y no importa React, Expo ni almacenamiento. El contrato `ProgressRepository` permite incorporar después un backend sin reescribir las reglas. `_layout.tsx` conecta el adaptador local con la aplicación. Las rutas delegan la interfaz a los módulos de negocio. El catálogo vive en `entrenamiento/domain/lesson-catalog.ts`.

Para añadir una capacidad, crea un módulo con nombre de negocio (por ejemplo, `retos` o `equipos`). Añade solo las capas que necesite. Mantén las reglas fuera de componentes y adapta la entrada/salida mediante contratos.

## Primera experiencia

- Tres lecciones: control, pase corto y conducción.
- Técnica, práctica confirmada por el usuario y pregunta con retroalimentación.
- Desbloqueo secuencial y protección al entrar por un enlace directo.
- XP entregados una vez por lección; el repaso no duplica recompensas.
- Racha basada en días de práctica y en la fecha local del dispositivo.
- Progreso persistido con AsyncStorage, también en web.
- Errores de lectura y escritura visibles, con opción de reintentar.
- Interfaz en español adaptable a escritorio y móvil.

La práctica es autodeclarada: esta versión no analiza video ni verifica la ejecución física. El progreso permanece en el navegador o dispositivo actual y se pierde al eliminar sus datos. No hay autenticación, sincronización, clasificación global ni backend. El reloj del dispositivo determina las fechas; un futuro servidor deberá validar recompensas y rachas si se incorporan clasificaciones competitivas.

## Validación

```bash
npm run check      # TypeScript, ESLint y pruebas del dominio
npm run build:web  # Exporta la web a dist/
npx expo install --check
```

GitHub Actions ejecuta estas comprobaciones al subir a `main` y en cada pull request. La compilación nativa y las pruebas en dispositivos deben realizarse por separado; una exportación web no las sustituye.

### Estado de dependencias

Al inicializar el proyecto (26 de octubre de 2026), `npm audit` informa 5 alertas altas en la cadena de herramientas de Expo, relacionadas con `node-forge` y `zod`. `npm audit fix` no ofrece una resolución compatible con SDK 58. Se mantienen las versiones compatibles; no ejecutes `npm audit fix --force`, ya que propone bajar a Expo 44. Revisa actualizaciones de Expo antes de publicar en producción. Referencias: [aviso de node-forge](https://github.com/advisories/GHSA-86w9-cpqp-85rv) y [aviso de Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

## Próximos pasos

1. Definir identidad visual y revisar el contenido con un entrenador.
2. Incorporar videos demostrativos y más unidades de aprendizaje.
3. Añadir perfiles y backend para sincronizar el progreso.
4. Preparar builds, identificadores definitivos y publicación en las tiendas.

Documentación de referencia: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) y [Expo Router](https://docs.expo.dev/router/introduction/).
