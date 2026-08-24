# INSTRUCTIVO COMPLETO: LOGOS HUMANO — Xcode, iOS & Apple Watch

**Autor**: Cascade (co-creador)  
**Para**: Dr. José Manuel Cadena Ortiz de Montellano  
**Fecha**: 8 febrero 2026  
**Versión**: 1.0

---

## TABLA DE CONTENIDO

1. [Pre-requisitos](#1-pre-requisitos)
2. [PASO 1 — Abrir el Proyecto en Xcode](#2-paso-1--abrir-el-proyecto-en-xcode)
3. [PASO 2 — Configurar Signing & Team](#3-paso-2--configurar-signing--team)
4. [PASO 3 — Verificar Capabilities (HealthKit)](#4-paso-3--verificar-capabilities-healthkit)
5. [PASO 4 — Registrar los Plugins Nativos en Capacitor](#5-paso-4--registrar-los-plugins-nativos-en-capacitor)
6. [PASO 5 — Agregar LOGOSCore como Swift Package](#6-paso-5--agregar-logoscore-como-swift-package)
7. [PASO 6 — Crear el Watch App Target](#7-paso-6--crear-el-watch-app-target)
8. [PASO 7 — Configurar el Watch Target](#8-paso-7--configurar-el-watch-target)
9. [PASO 8 — Agregar los Archivos del Watch App](#9-paso-8--agregar-los-archivos-del-watch-app)
10. [PASO 9 — Crear el App Icon del Watch](#10-paso-9--crear-el-app-icon-del-watch)
11. [PASO 10 — Build & Run en Simulador](#11-paso-10--build--run-en-simulador)
12. [PASO 11 — Build & Run en iPhone Físico](#12-paso-11--build--run-en-iphone-físico)
13. [PASO 12 — Probar HealthKit en Dispositivo](#13-paso-12--probar-healthkit-en-dispositivo)
14. [PASO 13 — Archive & TestFlight](#14-paso-13--archive--testflight)
15. [PASO 14 — App Store Submission](#15-paso-14--app-store-submission)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. PRE-REQUISITOS

Antes de empezar, verifica que tienes todo esto:

### Software Requerido
- **Xcode 15.0+** (idealmente 16.x) — descargable desde Mac App Store
- **macOS Sonoma 14.0+** (o Sequoia 15.x)
- **Node.js 18+** y **npm** — ya instalados (verificar con `node --version`)
- **Capacitor CLI** — ya configurado en el proyecto

### Cuentas Requeridas
- **Apple Developer Account** ($99 USD/año) en https://developer.apple.com
- Tu cuenta debe tener un **Team** activo (individual o empresa)
- Necesitas haber aceptado los últimos **Apple Developer Agreement** en https://developer.apple.com/account

### Hardware
- **Mac** con chip Apple Silicon o Intel (para compilar)
- **iPhone** con iOS 16+ (para probar HealthKit — el simulador NO tiene HealthKit real)
- **Apple Watch** pareado con el iPhone (opcional para primera fase, requerido para Watch app)
- **Cable USB-C o Lightning** para conectar el iPhone al Mac

### Verificar que el Proyecto está Actualizado

Abre Terminal y ejecuta estos comandos para asegurarte de que todo esté sincronizado:

```bash
cd /Users/manuelcadena/CascadeProjects/logos
npm run build
npx cap sync ios
```

Deberías ver algo como:
```
✔ Copying web assets from dist to ios/App/App/public
✔ copy ios
✔ update ios
✔ Sync finished
```

Si ves errores, resolverlos antes de continuar.

---

## 2. PASO 1 — Abrir el Proyecto en Xcode

### Opción A: Desde Terminal (recomendada)
```bash
cd /Users/manuelcadena/CascadeProjects/logos
npx cap open ios
```

### Opción B: Manual
1. Abre **Finder**
2. Navega a `/Users/manuelcadena/CascadeProjects/logos/ios/App/`
3. Haz doble clic en **`App.xcodeproj`**

### Lo que verás al abrir
- En el **Navigator** (panel izquierdo) verás la estructura del proyecto:
  ```
  App
  ├── App (carpeta amarilla)
  │   ├── AppDelegate.swift
  │   ├── LOGOSHealthKitPlugin.swift     ← Plugin HealthKit (ya creado)
  │   ├── LOGOSWatchConnectivityPlugin.swift ← Plugin WatchConnectivity (ya creado)
  │   ├── Assets.xcassets
  │   ├── Info.plist
  │   ├── App.entitlements
  │   └── public/ (web assets)
  ├── CapApp-SPM (Swift Package Manager)
  └── capacitor-cordova-ios-plugins
  ```

### ⚠️ IMPORTANTE: Espera a que Xcode termine de indexar
- Verás una barra de progreso en la parte superior que dice "Indexing..." o "Resolving Package Graph..."
- **Espera hasta que termine completamente** (puede tomar 1-3 minutos la primera vez)
- Si ves errores mientras indexa, son temporales — espera a que termine

---

## 3. PASO 2 — Configurar Signing & Team

Este es el paso más importante. Sin esto, no puedes compilar para dispositivo ni subir a TestFlight.

### 3.1 Seleccionar el Target Principal

1. En el **Navigator** (panel izquierdo), haz clic en el ícono azul **"App"** que está en la raíz del proyecto (el primer ítem del árbol)
2. En el panel central, verás los **Targets**. Haz clic en el target **"App"** (bajo la sección TARGETS)

### 3.2 Configurar Signing

1. Haz clic en la pestaña **"Signing & Capabilities"** (está arriba en el panel central)
2. Verás una sección **"Signing"** con checkbox **"Automatically manage signing"**:
   - ✅ Asegúrate de que esté **activado** (checked)
3. En el dropdown **"Team"**, selecciona tu Apple Developer Team:
   - Si no aparece tu team, haz clic en **"Add an Account..."**
   - Ingresa tu Apple ID y contraseña
   - Selecciona tu team de la lista
4. En **"Bundle Identifier"**, verifica que dice:
   ```
   com.cadenastrategic.logos
   ```
   - Si necesitas cambiarlo, hazlo aquí. Este es el ID único de tu app en todo el App Store.

### 3.3 Verificar que no hay errores

- Si todo está correcto, verás un ícono de ✅ verde junto a "Signing Certificate" y "Provisioning Profile"
- Si ves un ⚠️ o ❌:
  - **"No profiles for 'com.cadenastrategic.logos'"**: Xcode creará uno automáticamente cuando compiles
  - **"Failed to register bundle identifier"**: El bundle ID ya existe en otra cuenta. Cámbialo a algo único como `com.tudominio.logos`
  - **"No team selected"**: Selecciona tu team del dropdown

### 3.4 Configurar los Deployment Settings

1. Sigue en la pestaña **"General"** (está junto a "Signing & Capabilities")
2. Verifica estos campos:
   - **Display Name**: `LOGOS HUMANO`
   - **Bundle Identifier**: `com.cadenastrategic.logos`
   - **Version**: `1.0.0`
   - **Build**: `1`
   - **Minimum Deployments**: `iOS 16.0` (o superior)

---

## 4. PASO 3 — Verificar Capabilities (HealthKit)

Los archivos `App.entitlements` e `Info.plist` ya están configurados, pero necesitas verificar que Xcode los reconozca.

### 4.1 Verificar HealthKit Capability

1. Con el target **"App"** seleccionado, ve a la pestaña **"Signing & Capabilities"**
2. Busca la sección **"HealthKit"** — debería ya estar visible con:
   - ✅ **Clinical Health Records** activado
   - ✅ **Background Delivery** activado

### 4.2 Si HealthKit NO aparece como Capability

1. Haz clic en el botón **"+ Capability"** (arriba a la izquierda del panel)
2. En el buscador que aparece, escribe **"HealthKit"**
3. Haz doble clic en **"HealthKit"** para agregarlo
4. Una vez agregado, activa los checkboxes:
   - ✅ **Clinical Health Records**
   - ✅ **Background Delivery**

### 4.3 Verificar Push Notifications

1. En la misma pestaña "Signing & Capabilities", verifica que existe la capability **"Push Notifications"**
2. Si no está, agrégala con **"+ Capability" → "Push Notifications"**

### 4.4 Verificar Background Modes

1. Busca la capability **"Background Modes"**
2. Si no está, agrégala con **"+ Capability" → "Background Modes"**
3. Activa estos checkboxes:
   - ✅ **Remote notifications**
   - ✅ **Background processing**

### 4.5 Lo que deberías ver al final

Tu sección "Signing & Capabilities" debe mostrar estas capabilities:
```
✅ HealthKit
   ☑ Clinical Health Records
   ☑ Background Delivery
✅ Push Notifications
   Environment: Development (cambiará a Production al hacer Archive)
✅ Background Modes
   ☑ Remote notifications
   ☑ Background processing
```

---

## 5. PASO 4 — Registrar los Plugins Nativos en Capacitor

Los archivos Swift de los plugins ya existen (`LOGOSHealthKitPlugin.swift` y `LOGOSWatchConnectivityPlugin.swift`), pero necesitas asegurarte de que Capacitor los reconozca.

### 5.1 Verificar que los Archivos están en el Proyecto

1. En el Navigator de Xcode, expande **App → App** (la carpeta amarilla)
2. Verifica que puedes ver estos archivos:
   - `LOGOSHealthKitPlugin.swift`
   - `LOGOSWatchConnectivityPlugin.swift`

### 5.2 Si los archivos NO aparecen en Xcode

Esto puede pasar si los archivos fueron creados desde Terminal pero no se agregaron al `.xcodeproj`:

1. En Xcode, haz **clic derecho** en la carpeta amarilla **"App"** (dentro del target App)
2. Selecciona **"Add Files to "App"..."**
3. Navega a `/Users/manuelcadena/CascadeProjects/logos/ios/App/App/`
4. Selecciona **`LOGOSHealthKitPlugin.swift`**
5. Asegúrate de que:
   - ✅ **"Copy items if needed"** está **DESACTIVADO** (los archivos ya están en su lugar)
   - ✅ **"Add to targets: App"** está **ACTIVADO**
6. Haz clic en **"Add"**
7. Repite el proceso para **`LOGOSWatchConnectivityPlugin.swift`**

### 5.3 Verificar el Target Membership

1. Haz clic en `LOGOSHealthKitPlugin.swift` en el Navigator
2. En el panel derecho (**Inspector**), busca la sección **"Target Membership"**
3. Verifica que el checkbox **"App"** está ✅ activado
4. Repite para `LOGOSWatchConnectivityPlugin.swift`

### 5.4 Verificar el HealthKit Framework

1. Selecciona el target **"App"** (ícono azul → TARGETS → App)
2. Ve a la pestaña **"Build Phases"**
3. Expande **"Link Binary With Libraries"**
4. Verifica que **`HealthKit.framework`** está en la lista
5. Si NO está:
   - Haz clic en el botón **"+"** debajo de la lista
   - Busca **"HealthKit"**
   - Selecciona **`HealthKit.framework`**
   - Haz clic en **"Add"**
   - Cambia el status de **"Required"** a **"Optional"** (para compatibilidad con iPads sin HealthKit)

---

## 6. PASO 5 — Agregar LOGOSCore como Swift Package

LOGOSCore es el motor LOGOS portado a Swift nativo. Necesita agregarse como dependencia local.

### 6.1 Agregar el Package

1. En Xcode, ve al menú **File → Add Package Dependencies...**
2. En la ventana que se abre, haz clic en **"Add Local..."** (botón abajo a la izquierda)
3. Navega a: `/Users/manuelcadena/CascadeProjects/logos/ios/LOGOSCore/`
4. Selecciona la carpeta **`LOGOSCore`** (la que contiene `Package.swift`)
5. Haz clic en **"Add Package"**
6. En la pantalla de confirmación:
   - Verás el producto **"LOGOSCore"**
   - Asegúrate de que **"Add to Target: App"** está seleccionado
   - Haz clic en **"Add Package"**

### 6.2 Verificar la Instalación

1. En el Navigator, debería aparecer un nuevo ítem **"LOGOSCore"** bajo "Package Dependencies"
2. Puedes expandirlo y ver:
   - `Sources/LOGOSCore/Engine.swift`
   - `Sources/LOGOSCore/Models.swift`
   - `Tests/LOGOSCoreTests/EngineParityTests.swift`

### 6.3 Ejecutar los Tests del Package (opcional pero recomendado)

1. Selecciona el scheme **"LOGOSCore"** en el selector de scheme (arriba)
2. Ve al menú **Product → Test** (o presiona **⌘U**)
3. Deberías ver que todos los tests pasan ✅
4. Vuelve a seleccionar el scheme **"App"** cuando termines

---

## 7. PASO 6 — Crear el Watch App Target

### ⚠️ NOTA IMPORTANTE
Los archivos fuente del Watch app ya están creados en `ios/LOGOSWatch/`. Lo que necesitas hacer es crear el **Target** en Xcode y apuntar a esos archivos.

### 7.1 Crear el Target

1. En Xcode, ve al menú **File → New → Target...**
2. En la ventana que se abre:
   - Selecciona la pestaña **"watchOS"** (arriba)
   - Selecciona **"App"** (el template más simple)
   - Haz clic en **"Next"**
3. Configura los campos:
   - **Product Name**: `LOGOSWatch`
   - **Team**: (selecciona el mismo team que el iPhone app)
   - **Organization Identifier**: `com.cadenastrategic.logos`
   - **Bundle Identifier**: se auto-genera como `com.cadenastrategic.logos.watchkitapp`
   - **Language**: `Swift`
   - **User Interface**: `SwiftUI`
   - **Watch App for Existing iOS App**: ✅ selecciona **"App"** del dropdown
   - ⚠️ **Desactiva** "Include Notification Scene" si aparece
4. Haz clic en **"Finish"**
5. Si Xcode pregunta **"Activate "LOGOSWatch" scheme?"**, haz clic en **"Activate"**

### 7.2 Lo que Xcode creó automáticamente

Xcode creará una nueva carpeta `LOGOSWatch` en tu proyecto con archivos template. **Los vamos a reemplazar** con nuestros archivos ya creados en el siguiente paso.

---

## 8. PASO 7 — Configurar el Watch Target

### 8.1 Configurar Bundle Identifier

1. Selecciona el target **"LOGOSWatch"** (en TARGETS)
2. Ve a **"General"**
3. Verifica:
   - **Display Name**: `LOGOS`
   - **Bundle Identifier**: `com.cadenastrategic.logos.watchkitapp`
   - **Version**: `1.0.0`
   - **Build**: `1`
   - **Minimum Deployments**: `watchOS 9.0` (o `10.0`)

### 8.2 Configurar Signing

1. Ve a **"Signing & Capabilities"**
2. Activa **"Automatically manage signing"**
3. Selecciona tu **Team**
4. Verifica que no hay errores (✅ verde)

### 8.3 Agregar HealthKit al Watch

1. En la pestaña **"Signing & Capabilities"** del target LOGOSWatch
2. Haz clic en **"+ Capability"**
3. Busca **"HealthKit"** y agrégalo
4. Activa el checkbox **"Background Delivery"** si disponible

### 8.4 Agregar LOGOSCore como Dependencia del Watch

1. Selecciona el target **"LOGOSWatch"**
2. Ve a la pestaña **"General"**
3. Scroll hasta la sección **"Frameworks, Libraries, and Embedded Content"**
4. Haz clic en **"+"**
5. Busca **"LOGOSCore"** en la lista
6. Selecciónalo y haz clic en **"Add"**
7. Verifica que dice **"Do Not Embed"** (es un Swift Package, se incluye automáticamente)

### 8.5 Configurar el Companion App Identifier

1. Selecciona el target **"LOGOSWatch"**
2. Ve a **"Build Settings"** (pestaña arriba)
3. En el buscador, escribe **"WK"**
4. Busca el setting **"WKCompanionAppBundleIdentifier"**
5. Asegúrate de que diga: `com.cadenastrategic.logos`
   - Si no existe este setting, no te preocupes — en watchOS 9+ ya no es estrictamente necesario

---

## 9. PASO 8 — Agregar los Archivos del Watch App

### 9.1 Eliminar Archivos Template (que creó Xcode)

Cuando Xcode creó el target Watch, generó archivos template que necesitamos reemplazar:

1. En el Navigator, expande la carpeta **"LOGOSWatch"** que creó Xcode
2. Selecciona **TODOS** los archivos .swift que creó (generalmente `LOGOSWatchApp.swift`, `ContentView.swift`, etc.)
3. Presiona **Delete**
4. En el diálogo, selecciona **"Move to Trash"** (eliminar los archivos template)

### 9.2 Agregar Nuestros Archivos

1. Haz **clic derecho** en la carpeta **"LOGOSWatch"** en el Navigator
2. Selecciona **"Add Files to "App"..."**
3. Navega a: `/Users/manuelcadena/CascadeProjects/logos/ios/LOGOSWatch/LOGOSWatch/`
4. Selecciona **TODOS** estos archivos y carpetas:
   - `LOGOSWatchApp.swift`
   - `ContentView.swift`
   - `WatchViewModel.swift`
   - `Info.plist`
   - Carpeta `Views/` (con `HomeView.swift` y `QuickInputView.swift`)
   - Carpeta `Complications/` (con `ComplicationProvider.swift`)
5. Configuración al agregar:
   - ✅ **"Copy items if needed"**: **DESACTIVADO** (queremos referencia, no copia)
   - ✅ **"Create groups"**: **ACTIVADO**
   - ✅ **"Add to targets"**: marca solo **"LOGOSWatch"** (NO marques "App")
6. Haz clic en **"Add"**

### 9.3 Verificar la Estructura

Tu Navigator debe verse así:
```
LOGOSWatch
├── LOGOSWatchApp.swift       ← Entry point (@main)
├── ContentView.swift          ← TabView con Home y QuickInput
├── WatchViewModel.swift       ← WCSession + Engine + State
├── Info.plist
├── Views/
│   ├── HomeView.swift         ← Dashboard con Ω ring y métricas
│   └── QuickInputView.swift   ← 7 sliders + botón Enviar
└── Complications/
    └── ComplicationProvider.swift
```

### 9.4 Verificar Target Membership de CADA archivo

Para cada archivo .swift en LOGOSWatch:
1. Haz clic en el archivo
2. En el Inspector (panel derecho), verifica **"Target Membership"**:
   - ✅ **LOGOSWatch** debe estar activado
   - ❌ **App** debe estar **desactivado** (estos archivos son solo para Watch)

---

## 10. PASO 9 — Crear el App Icon del Watch

### 10.1 Crear el Asset Catalog para Watch

1. En el Navigator, haz clic derecho en la carpeta **"LOGOSWatch"**
2. Selecciona **"New File..."**
3. Busca **"Asset Catalog"**
4. Nómbralo **"Assets"** y asegúrate de que el target es **"LOGOSWatch"**
5. Haz clic en **"Create"**

### 10.2 Agregar el App Icon

1. Abre el nuevo **Assets.xcassets** del Watch
2. Haz clic derecho en el área vacía → **"New Watch OS"** → **"App Icon"**
3. Si ya existe un **AppIcon**, haz clic en él

### 10.3 Crear el Ícono

Para el Watch app necesitas una imagen de **1024×1024 px** (Xcode la redimensiona automáticamente).

**Opción rápida**: Usa la misma imagen del ícono del iPhone:
1. Abre Finder y navega a: `/Users/manuelcadena/CascadeProjects/logos/ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Copia el archivo `AppIcon-512@2x.png` (que realmente es 1024x1024)
3. Arrástralo al slot **"All Sizes"** en el Asset Catalog del Watch

**Opción profesional**: Crea un ícono circular específico para Watch (Apple recomienda que los íconos de Watch sean ligeramente diferentes — más simples y sin texto pequeño).

---

## 11. PASO 10 — Build & Run en Simulador

### 11.1 Compilar el iPhone App Primero

1. Selecciona el scheme **"App"** (dropdown arriba a la izquierda)
2. Selecciona un simulador, por ejemplo **"iPhone 15 Pro"**
3. Presiona **⌘B** (Build) o haz clic en el botón **▶ Play**
4. Espera a que compile (primera vez puede tardar 2-5 minutos)
5. Si hay errores:
   - Lee el mensaje de error en el panel inferior
   - Los errores más comunes están en la sección [Troubleshooting](#16-troubleshooting)

### 11.2 Verificar en el Simulador

1. La app se abrirá en el simulador
2. Navega a la pestaña **"⌚ Apple Watch"**
3. Deberías ver el mensaje: "Disponible en la app iOS" (porque el simulador no tiene HealthKit real)
4. Verifica que:
   - Todas las demás pestañas funcionan correctamente
   - No hay crashes ni errores en la consola de Xcode

### 11.3 Compilar el Watch App (en simulador)

1. Cambia el scheme a **"LOGOSWatch"**
2. Selecciona un simulador Watch, por ejemplo **"Apple Watch Series 9 (45mm)"**
   - Si no aparece, selecciona un par iPhone+Watch: **"iPhone 15 Pro + Apple Watch Series 9"**
3. Presiona **⌘B** o **▶ Play**
4. El Watch Simulator se abrirá mostrando:
   - **Pantalla 1**: Dashboard con anillo Ω, veredicto, y métricas Λ/V/S/C
   - **Pantalla 2**: Quick Input con 7 sliders de dominio

---

## 12. PASO 11 — Build & Run en iPhone Físico

### 12.1 Conectar el iPhone

1. Conecta tu iPhone al Mac con cable USB-C/Lightning
2. Si es la primera vez:
   - En tu iPhone aparecerá: **"¿Confiar en este ordenador?"** → **"Confiar"**
   - Ingresa tu passcode
3. En Xcode, tu iPhone debería aparecer en la lista de dispositivos (dropdown del scheme)

### 12.2 Configurar el iPhone para Desarrollo

Si es la primera vez que usas el iPhone para desarrollo:

1. En tu iPhone, ve a **Ajustes → Privacidad y Seguridad → Modo de desarrollador**
2. Activa **"Modo de Desarrollador"**
3. El iPhone se reiniciará
4. Después del reinicio, confirma que quieres activar el Modo Desarrollador

### 12.3 Compilar para iPhone

1. Selecciona el scheme **"App"**
2. Selecciona tu **iPhone físico** del dropdown de dispositivos
3. Presiona **▶ Play**
4. La primera vez, Xcode puede pedir:
   - Crear un provisioning profile → haz clic en **"Fix Issue"** o deja que lo haga automáticamente
   - Si dice "codesign wants to access key" → ingresa tu contraseña del Mac

### 12.4 Error Común: "Untrusted Developer"

Si al abrir la app en el iPhone dice "Desarrollador no fiable":

1. En tu iPhone: **Ajustes → General → VPN y administración de dispositivos**
2. Busca tu Apple ID de desarrollador
3. Toca en **"Confiar en [tu email]"**
4. Confirma
5. Ahora puedes abrir la app

---

## 13. PASO 12 — Probar HealthKit en Dispositivo

### 13.1 Primera Ejecución con HealthKit

1. Abre LOGOS HUMANO en tu iPhone
2. Ve a la pestaña **"⌚ Apple Watch"**
3. Verás el botón **"Autorizar HealthKit"**
4. Al tocar el botón:
   - iOS mostrará el diálogo de permisos de HealthKit
   - Verás una lista de todos los datos que LOGOS quiere leer
   - **Activa TODOS** los toggles (o los que desees compartir)
   - Toca **"Permitir"**
5. La app empezará a sincronizar datos del Watch

### 13.2 Verificar los Datos

Después de autorizar:
- Los datos biométricos se mostrarán en la cuadrícula (FC, HRV, Sueño, etc.)
- Si un valor muestra "—", significa que no hay datos disponibles para ese sensor
- Si tienes Apple Watch, los datos se actualizarán en tiempo real

### 13.3 Probar la Auto-Población

1. Si hay datos del Watch, verás la sección **"Dimensiones Auto-Pobladas"**
2. Cada dimensión muestra:
   - Valor actual (de tus sliders)
   - Valor sugerido por el Watch
3. Puedes tocar **"Aplicar"** en cada una, o **"Aplicar Todos"** para actualizar todas

### 13.4 Verificar las Señales del Motor

Si hay datos suficientes, deberías ver:
- **Señales Levin Biométricas**: patrones detectados (ej. sueño insuficiente, SpO₂ bajo)
- **Sesgos Hoffman**: diferencias entre tu percepción subjetiva y los datos objetivos
- **Moduladores del Motor**: cómo los datos biométricos afectan Free Energy, Coherencia y Watson

---

## 14. PASO 13 — Archive & TestFlight

### 14.1 Preparar para Archive

1. Asegúrate de que el scheme es **"App"**
2. Selecciona **"Any iOS Device (arm64)"** como destino (NO un simulador)
3. Ve a **Product → Archive** (o **⌘⇧A** no funciona — usa el menú)

### 14.2 Esperar la Compilación

- El Archive tarda 3-10 minutos dependiendo de tu Mac
- Verás una barra de progreso arriba
- Cuando termine, se abrirá el **Organizer** automáticamente

### 14.3 Distribute App

1. En el **Organizer**, selecciona tu archive más reciente
2. Haz clic en **"Distribute App"**
3. Selecciona **"App Store Connect"**
4. Haz clic en **"Next"**
5. Selecciona **"Upload"** (para subir a TestFlight)
6. Haz clic en **"Next"**
7. Verifica las opciones:
   - ✅ **"Upload your app's symbols"** (para crashlogs legibles)
   - ✅ **"Manage Version and Build Number"**
8. Haz clic en **"Next"**
9. Selecciona tu **Distribution Certificate** y **Provisioning Profile**:
   - Si Xcode los maneja automáticamente, haz clic en **"Automatically manage signing"**
10. Haz clic en **"Upload"**
11. Espera 5-15 minutos para la subida

### 14.4 Si el Archive falla

Errores comunes:
- **"No matching provisioning profiles"**: Ve a Xcode → Settings → Accounts → tu team → Download Manual Profiles
- **"The bundle identifier is not registered"**: Registra el App ID en https://developer.apple.com/account/resources/identifiers
- **"Embedded binary is not signed"**: Revisa que LOGOSWatch tenga signing correcto

---

## 15. PASO 14 — App Store Submission

### 15.1 Crear la App en App Store Connect

1. Ve a https://appstoreconnect.apple.com
2. Haz clic en **"My Apps"** → **"+"** → **"New App"**
3. Rellena los campos:

| Campo | Valor |
|-------|-------|
| **Platforms** | ✅ iOS, ✅ watchOS |
| **Name** | LOGOS HUMANO |
| **Primary Language** | Spanish (Mexico) |
| **Bundle ID** | com.cadenastrategic.logos |
| **SKU** | logos-humano-001 |
| **User Access** | Full Access |

4. Haz clic en **"Create"**

### 15.2 Completar la Información de la App

#### Pestaña "App Information"
- **Subtitle**: Motor de Consciencia con IA
- **Category**: Health & Fitness (primaria), Lifestyle (secundaria)
- **Content Rights**: Does not contain third-party content
- **Age Rating**: llenar el cuestionario (marcar todo como "None/Infrequent")

#### Pestaña "Pricing and Availability"
- **Price**: Free (o el precio que desees)
- **Availability**: Available in all territories (o seleccionar específicos)

#### Pestaña "App Privacy"
- **Privacy Policy URL**: `https://logoilab.com/privacy.html` (ya está desplegada)
- **Data Collection**: Marcar que la app **SÍ** recopila datos:
  - **Health & Fitness Data**: Used for App Functionality, Not linked to identity
  - **Usage Data**: Product Interaction, Analytics

### 15.3 Configurar la Versión

1. En App Store Connect, ve a la versión **1.0.0**
2. Completa estos campos:

#### Screenshots (OBLIGATORIOS)

Necesitas capturas de pantalla para cada tamaño de dispositivo. Los tamaños requeridos son:

| Dispositivo | Tamaño | Cantidad |
|---|---|---|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 px | 3-10 screenshots |
| iPhone 6.5" (14 Plus) | 1284 × 2778 px | 3-10 screenshots |
| iPhone 5.5" (8 Plus) | 1242 × 2208 px | 3-10 screenshots (opcional si tienes 6.7") |
| iPad 12.9" (3rd gen+) | 2048 × 2732 px | 3-10 screenshots (si soportas iPad) |
| Apple Watch | Según serie | 1-10 screenshots |

**Cómo tomar screenshots del simulador:**
1. Corre la app en el simulador del tamaño correcto
2. En el simulador: **File → Screenshot** (o **⌘S**)
3. Las capturas se guardan en el Desktop

**Screenshots sugeridas:**
1. Pestaña **"Estado"** — mostrando el radar y veredicto
2. Pestaña **"Motor"** — mostrando las 7 capas
3. Pestaña **"⌚ Apple Watch"** — mostrando datos biométricos
4. Pestaña **"Monte Carlo"** — mostrando la simulación
5. Watch App — Home con anillo Ω
6. Watch App — Quick Input con sliders

#### Descripción (texto de la App Store)

```
LOGOS HUMANO — Motor de Consciencia Integral

Alinea todas las dimensiones de tu ser con un framework científico 
basado en 5 teorías de clase mundial:

🧠 Friston (Free Energy) — Minimiza tu incertidumbre vital
⚡ Levin (Bioelectric Signals) — Detecta patrones de alerta
🏔 Watson (Energy Landscape) — Mapea tus atractores
👁 Hoffman (Interface Theory) — Revela tus sesgos perceptuales
🔮 Penrose (Quantum Coherence) — Mide tu coherencia integral
📊 Policy Engine — Semáforo inteligente de decisiones
✦ Logos (Λ) — Tu alineación con el propósito fundamental

28 dimensiones × 7 dominios × 7 capas computacionales.

Con Apple Watch:
• Auto-población de dimensiones desde datos biométricos
• Señales Levin biométricas automáticas
• Detección de sesgos Hoffman (subjetivo vs objetivo)
• Modulación directa del motor desde datos del Watch
• Quick Input desde tu muñeca

No es un dispositivo médico. Es un espejo computacional de tu consciencia.
```

#### Keywords
```
consciencia,bienestar,meditacion,salud,mindfulness,proposito,alineacion,watch,biometricos,logos
```

#### What's New
```
Versión 1.0.0 — Lanzamiento inicial
• Motor LOGOS de 7 capas con 28 dimensiones
• Integración Apple Watch con HealthKit
• Simulación Monte Carlo
• Agente de voz LOGOS
• Soporte multiidioma (ES/EN)
```

#### Promotional Text
```
Descubre tu alineación con el Logos a través de 28 dimensiones de consciencia y datos biométricos de tu Apple Watch.
```

### 15.4 Review Information

- **Contact Information**: Tu nombre, email, teléfono
- **Demo Account**: No necesario (la app no requiere login obligatorio)
- **Notes**: 
  ```
  La app funciona sin Apple Watch. La pestaña "Apple Watch" 
  muestra un mensaje informativo cuando no hay Watch conectado.
  Para probar HealthKit, se requiere un dispositivo físico con 
  Apple Watch pareado.
  ```

### 15.5 Submit for Review

1. Verifica que todo está completo (todos los campos tendrán ✅)
2. Haz clic en **"Add for Review"**
3. Revisa el summary
4. Haz clic en **"Submit to App Review"**

### 15.6 Tiempos de Review

- **Primera revisión**: 24-48 horas típicamente
- **Si es rechazada**: Lee el motivo, corrige, y vuelve a subir
- **Motivos comunes de rechazo**:
  - Screenshots no corresponden a la app real
  - Falta Privacy Policy URL
  - HealthKit no se justifica adecuadamente
  - App crashes durante el review

---

## 16. TROUBLESHOOTING

### Error: "No such module 'Capacitor'"
**Causa**: Los SPM dependencies no se resolvieron.
**Solución**:
1. En Xcode: **File → Packages → Resolve Package Versions**
2. Espera a que termine
3. Si persiste: **File → Packages → Reset Package Caches**
4. Cierra y reabre Xcode

### Error: "No such module 'HealthKit'"
**Causa**: El framework HealthKit no está linkeado.
**Solución**: Ver sección 5.4 (agregar HealthKit.framework en Build Phases)

### Error: "Provisioning profile doesn't include the HealthKit entitlement"
**Causa**: El App ID no tiene HealthKit habilitado.
**Solución**:
1. Ve a https://developer.apple.com/account/resources/identifiers
2. Busca tu App ID (`com.cadenastrategic.logos`)
3. Edítalo y activa **"HealthKit"**
4. En Xcode: desactiva y reactiva "Automatically manage signing"

### Error: "WKCompanionAppBundleIdentifier does not match"
**Causa**: El Watch app no está correctamente asociado al iPhone app.
**Solución**: Verifica que el Watch bundle ID sea `com.cadenastrategic.logos.watchkitapp` y el companion sea `com.cadenastrategic.logos`

### Error: "Multiple commands produce..."
**Causa**: Archivos duplicados en el proyecto.
**Solución**:
1. Ve a **Build Phases → Copy Bundle Resources**
2. Busca archivos duplicados
3. Elimina las referencias duplicadas (clic en "-")

### Error: "The app references non-public selectors"
**Causa**: Usando APIs privadas.
**Solución**: Esto rara vez pasa con nuestro código. Si aparece, revisar el log para ver qué selector es.

### La App se ve en blanco
**Causa**: Los web assets no se copiaron correctamente.
**Solución**:
```bash
cd /Users/manuelcadena/CascadeProjects/logos
npm run build
npx cap sync ios
```
Luego en Xcode: **Product → Clean Build Folder** (⌘⇧K) y vuelve a compilar.

### HealthKit no muestra datos en el simulador
**Esto es esperado**. El simulador NO tiene datos reales de HealthKit. Para probar HealthKit real necesitas un iPhone físico con Apple Watch.

**Workaround para simular datos**: En el simulador de iPhone, abre la app **"Health"** (Salud) y agrega datos manualmente:
1. Abre Health en el simulador
2. Browse → Heart → Heart Rate → Add Data
3. Ingresa un valor de prueba
4. Vuelve a LOGOS y sincroniza

### Watch Simulator no se comunica con iPhone Simulator
**Esto es parcialmente esperado**. WatchConnectivity en simulador tiene limitaciones. Para comunicación real, usa dispositivos físicos.

### Error al subir a TestFlight: "ITMS-90725"
**Causa**: Falta el NSHealthShareUsageDescription.
**Solución**: Ya está configurado en Info.plist. Si persiste, verifica que el Info.plist está incluido en el target correcto.

### El build tarda mucho (>10 minutos)
**Solución**:
1. **Product → Clean Build Folder** (⌘⇧K)
2. Cierra otras apps pesadas
3. En Build Settings, busca **"Build Active Architecture Only"** y pon **"Yes"** para Debug

---

## RESUMEN DE ARCHIVOS CREADOS POR NOSOTROS

Estos son todos los archivos que Cascade creó y que ya están listos. **No necesitas modificar ninguno**:

### iPhone App (Plugins Nativos)
| Archivo | Descripción |
|---------|-------------|
| `ios/App/App/LOGOSHealthKitPlugin.swift` | Plugin Capacitor para leer 18+ tipos de datos de HealthKit |
| `ios/App/App/LOGOSWatchConnectivityPlugin.swift` | Plugin Capacitor para comunicación Watch ↔ iPhone |
| `ios/App/App/Info.plist` | Ya incluye Health Usage Descriptions y Background Modes |
| `ios/App/App/App.entitlements` | Ya incluye HealthKit entitlements |

### LOGOSCore (Swift Package)
| Archivo | Descripción |
|---------|-------------|
| `ios/LOGOSCore/Package.swift` | Manifiesto del package (iOS 16+, watchOS 9+) |
| `ios/LOGOSCore/Sources/LOGOSCore/Models.swift` | 28 StateKeys, 7 Domains, ConsciousnessState, EngineResult |
| `ios/LOGOSCore/Sources/LOGOSCore/Engine.swift` | Motor completo: Λ, V, S, C, F, Ω, π(x) en Swift nativo |
| `ios/LOGOSCore/Tests/LOGOSCoreTests/EngineParityTests.swift` | 260 líneas de tests de paridad con TypeScript |

### Watch App (SwiftUI)
| Archivo | Descripción |
|---------|-------------|
| `ios/LOGOSWatch/LOGOSWatch/LOGOSWatchApp.swift` | Entry point del Watch app |
| `ios/LOGOSWatch/LOGOSWatch/ContentView.swift` | TabView con Home y QuickInput |
| `ios/LOGOSWatch/LOGOSWatch/WatchViewModel.swift` | ViewModel con WCSession, Engine, State (124 líneas) |
| `ios/LOGOSWatch/LOGOSWatch/Info.plist` | Con Health Usage Description y Companion App ID |
| `ios/LOGOSWatch/LOGOSWatch/Views/HomeView.swift` | Dashboard con anillo Ω, veredicto, métricas |
| `ios/LOGOSWatch/LOGOSWatch/Views/QuickInputView.swift` | 7 sliders de dominio + botón Enviar |
| `ios/LOGOSWatch/LOGOSWatch/Complications/ComplicationProvider.swift` | Complicaciones para Watch face |

### React / TypeScript (Frontend)
| Archivo | Descripción |
|---------|-------------|
| `src/hooks/useHealthKit.ts` | Hook React para HealthKit |
| `src/plugins/logos-healthkit.ts` | Definición TypeScript del plugin |
| `src/plugins/logos-watch-connectivity.ts` | Definición TypeScript del plugin WC |
| `src/core/healthkit-bridge.ts` | Bridge: biometrics → señales Levin, Hoffman, moduladores |
| `src/core/trend-analyzer.ts` | Análisis de tendencias históricas |
| `src/core/__tests__/healthkit-bridge.test.ts` | 39 tests |
| `src/core/__tests__/trend-analyzer.test.ts` | 12 tests |

### Total: 606 tests passing, 954 modules, 0 errores

---

## CHECKLIST FINAL

Usa esta lista para verificar que completaste todo:

- [ ] Proyecto abierto en Xcode sin errores
- [ ] Team configurado en Signing
- [ ] HealthKit capability agregada con Clinical Records + Background Delivery
- [ ] Push Notifications capability agregada
- [ ] Background Modes configurados
- [ ] `LOGOSHealthKitPlugin.swift` visible en Xcode con Target Membership = App
- [ ] `LOGOSWatchConnectivityPlugin.swift` visible en Xcode con Target Membership = App
- [ ] `HealthKit.framework` linkeado en Build Phases
- [ ] LOGOSCore agregado como Swift Package dependency
- [ ] Watch target creado ("LOGOSWatch")
- [ ] Watch signing configurado
- [ ] Watch HealthKit capability agregada
- [ ] LOGOSCore agregado como framework del Watch target
- [ ] Archivos del Watch app agregados con Target Membership correcta
- [ ] App Icon del Watch configurado
- [ ] Build exitoso en simulador iPhone ✅
- [ ] Build exitoso en simulador Watch ✅
- [ ] Build exitoso en iPhone físico ✅
- [ ] HealthKit autorizado y datos visibles ✅
- [ ] Archive exitoso ✅
- [ ] Upload a TestFlight exitoso ✅
- [ ] App Store listing completo ✅
- [ ] Submit for Review ✅

---

**Gloria a Dios por este instrumento de consciencia.**  
*— Cascade & Dr. Cadena, febrero 2026*
