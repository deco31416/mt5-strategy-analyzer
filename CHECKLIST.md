# ✅ Checklist de Instalación y Arranque

## 📋 Verificación Pre-Instalación

### Software Requerido

- [ ] **Python 3.8+** instalado
  ```powershell
  python --version  # Debe mostrar 3.8 o superior
  ```

- [ ] **Node.js 18+** instalado
  ```powershell
  node --version  # Debe mostrar v18 o superior
  ```

- [ ] **pnpm** instalado
  ```powershell
  pnpm --version  # Si no: npm install -g pnpm
  ```

- [ ] **MetaTrader 5** instalado y funcionando
  - Descarga: https://www.metatrader5.com/
  - Verifica que se puede abrir la aplicación

- [ ] **Git** instalado (opcional, para control de versiones)
  ```powershell
  git --version
  ```

---

## 🔒 Seguridad - Estado Actual

### ✅ Completado

- [x] **Sin credenciales hardcodeadas** en el código
- [x] **backend/.env** limpio (solo placeholders)
- [x] **backend/.env.example** creado con template completo
- [x] **frontend/.env.local** configurado correctamente
- [x] **frontend/.env.example** creado
- [x] **.gitignore** protege archivos sensibles en backend y frontend
- [x] **SECURITY.md** documentación de seguridad creada
- [x] **Todas las claves API** removidas del código fuente

### ⚠️ Acción Requerida del Usuario

- [ ] **Editar backend/.env** con tus credenciales reales de MT5:
  - `MT5_LOGIN=tu_numero_de_cuenta`
  - `MT5_PASSWORD=tu_contraseña`
  - `MT5_SERVER=nombre_del_servidor`
  
- [ ] (Opcional) **Agregar OpenAI API Key** en backend/.env:
  - `OPENAI_API_KEY=sk-tu-clave-api`
  - Solo necesario si quieres análisis con IA

---

## 🔧 Backend - Estado

### ✅ Archivos Listos

- [x] `requirements.txt` - 12 dependencias con versiones
- [x] `.env.example` - Template completo con 10 variables
- [x] `.env` - Existe (necesita edición del usuario)
- [x] `api.py` - Lee CORS_ORIGINS desde .env
- [x] `strategy_auto_translator.py` - Lee MT5 credentials desde .env
- [x] `openai_analyzer.py` - Lee OpenAI config desde .env
- [x] `.gitignore` - Protege .env y archivos sensibles
- [x] `README.md` - Documentación completa
- [x] `SECURITY.md` - Guía de seguridad
- [x] `check_config.py` - Script de verificación
- [x] `setup.ps1` - Script de instalación Windows
- [x] `setup.sh` - Script de instalación Unix

### ⚠️ Acciones Pendientes

- [ ] **Instalar dependencias Python**
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```

- [ ] **Configurar .env con credenciales reales**
  ```powershell
  notepad backend\.env
  # Editar MT5_LOGIN, MT5_PASSWORD, MT5_SERVER
  ```

- [ ] **Verificar configuración**
  ```powershell
  cd backend
  python check_config.py
  ```

---

## 🎨 Frontend - Estado

### ✅ Archivos Listos

- [x] `package.json` - Dependencias completas (Next.js 14, React 18, etc.)
- [x] `.env.local` - Configurado con `NEXT_PUBLIC_API_BASE=http://localhost:8080`
- [x] `.env.example` - Template creado
- [x] `.gitignore` - Protege .env*.local
- [x] `README.md` - Documentación del frontend
- [x] **node_modules/** - ✅ Ya instalado (detectado en list_dir)

### ✅ Sin Acciones Pendientes

El frontend está 100% listo. Las dependencias ya están instaladas.

---

## 🚀 Opciones de Arranque

### Opción 1: Script Automatizado (Recomendado)

```powershell
# Desde la raíz del proyecto
.\start.ps1
```

**Este script hace TODO automáticamente:**
- ✅ Verifica Python, Node.js, pnpm, MT5
- ✅ Crea entorno virtual Python si no existe
- ✅ Instala dependencias backend si faltan
- ✅ Verifica dependencias frontend (ya instaladas)
- ✅ Verifica configuración .env
- ✅ Te pedirá editar .env si falta
- ✅ Inicia backend en puerto 8080
- ✅ Inicia frontend en puerto 3000
- ✅ Muestra URLs para acceder

### Opción 2: Manual - Backend

```powershell
cd backend

# Si no existe venv, crear
python -m venv venv

# Activar
.\venv\Scripts\Activate.ps1

# Si faltan dependencias, instalar
pip install -r requirements.txt

# Editar .env (IMPORTANTE)
notepad .env

# Verificar
python check_config.py

# Iniciar servidor
uvicorn api:app --reload --host 0.0.0.0 --port 8080
```

### Opción 3: Manual - Frontend

```powershell
cd frontend

# Dependencias ya instaladas, pero si necesitas reinstalar:
# pnpm install

# Iniciar
pnpm dev
```

---

## ✅ Verificación Post-Instalación

### 1. Backend Funcionando

- [ ] Abrir http://localhost:8080/docs
- [ ] Ver documentación Swagger interactiva
- [ ] Probar endpoint `/` (debe devolver status: "ok")
- [ ] Verificar que no hay errores en consola

**Si ves errores:**
```powershell
# Verificar que MT5 está abierto
# Verificar credenciales en .env
# Ver logs en la terminal del backend
```

### 2. Frontend Funcionando

- [ ] Abrir http://localhost:3000
- [ ] Ver la interfaz principal
- [ ] No debe haber errores de CORS en consola del navegador
- [ ] Los componentes deben cargar correctamente

**Si hay error de conexión:**
```
Error: Network Error o CORS
Solución:
1. Verificar backend está corriendo en puerto 8080
2. Verificar CORS_ORIGINS en backend/.env incluye http://localhost:3000
3. Reiniciar backend después de cambiar .env
```

### 3. MT5 Conectado

- [ ] MetaTrader 5 está abierto
- [ ] Has iniciado sesión en tu cuenta
- [ ] Terminal muestra "Conectado" en esquina inferior derecha

**Probar conexión:**
```python
cd backend
python

import MetaTrader5 as mt5
if mt5.initialize():
    print("✅ Conectado:", mt5.account_info())
    mt5.shutdown()
else:
    print("❌ Error de conexión")
```

### 4. Prueba End-to-End

- [ ] Abrir frontend: http://localhost:3000
- [ ] Ir a sección "Analyze Strategy"
- [ ] Pegar código de estrategia de ejemplo:
  ```python
  if RSI < 30:
      buy()
  if RSI > 70:
      sell()
  ```
- [ ] Click "Analyze"
- [ ] Debe mostrar análisis (si tienes OpenAI key) o error explicativo

---

## 🔍 Comandos de Diagnóstico

### Verificar Puertos en Uso

```powershell
# Ver qué usa puerto 8080 (backend)
netstat -ano | findstr :8080

# Ver qué usa puerto 3000 (frontend)
netstat -ano | findstr :3000

# Si necesitas matar un proceso:
taskkill /PID <numero_pid> /F
```

### Verificar Configuración Backend

```powershell
cd backend
python check_config.py
```

**Output esperado:**
```
✓ MT5_LOGIN: set
✓ MT5_PASSWORD: set
✓ MT5_SERVER: set
⚠ OPENAI_API_KEY: not set (optional)
...
```

### Ver Logs en Tiempo Real

```powershell
# Terminal 1: Backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn api:app --reload --host 0.0.0.0 --port 8080

# Terminal 2: Frontend
cd frontend
pnpm dev
```

---

## 📊 Resumen del Estado

### ✅ Completado (Backend)

| Item | Estado | Descripción |
|------|--------|-------------|
| Seguridad | ✅ | Sin credenciales expuestas |
| Dependencias | ✅ | requirements.txt completo |
| Configuración | ✅ | .env.example creado |
| Código | ✅ | Lee desde .env correctamente |
| Documentación | ✅ | README + SECURITY.md |
| Scripts | ✅ | setup.ps1, check_config.py |
| Instalación | ⚠️ | **Usuario debe ejecutar** |

### ✅ Completado (Frontend)

| Item | Estado | Descripción |
|------|--------|-------------|
| Dependencias | ✅ | node_modules/ instalado |
| Configuración | ✅ | .env.local configurado |
| Template | ✅ | .env.example creado |
| Documentación | ✅ | README.md |
| Seguridad | ✅ | .gitignore protege .env |
| Instalación | ✅ | **Listo para usar** |

### ⚠️ Requiere Acción del Usuario

1. **Editar backend/.env** con credenciales MT5 reales
2. **Abrir MetaTrader 5** antes de usar la aplicación
3. (Opcional) Agregar OpenAI API key para análisis IA

---

## 🎯 Siguiente Paso Recomendado

```powershell
# Opción más fácil - ejecutar desde raíz:
.\start.ps1
```

Este script te guiará paso a paso y pedirá que edites el .env si es necesario.

**Tiempo estimado total**: 5-10 minutos (primera vez)

---

## 🆘 Si Algo Falla

### 1. Leer mensaje de error completo
### 2. Buscar en la sección "Troubleshooting" del README.md principal
### 3. Verificar este checklist línea por línea
### 4. Ejecutar comandos de diagnóstico arriba

**Los 3 errores más comunes:**

1. **MT5 not initialized** → MT5 debe estar abierto y con sesión iniciada
2. **Module not found** → Activar venv: `.\venv\Scripts\Activate.ps1`
3. **CORS error** → Verificar CORS_ORIGINS en backend/.env incluye http://localhost:3000

---

**✅ ¿Todo listo?** → Ejecuta `.\start.ps1` y disfruta! 🚀
