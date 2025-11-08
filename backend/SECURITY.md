# 🔒 Guía de Seguridad - MT5 Strategy Analyzer Backend

## ⚠️ IMPORTANTE - Protección de Credenciales

### ❌ NUNCA Subas a Git:
- Archivo `.env` (ya está en `.gitignore` ✅)
- Credenciales de MT5 (login, password, server)
- API Keys de OpenAI
- Conexiones de bases de datos con credenciales

### ✅ Configuración Segura

#### 1. **Copia el archivo de ejemplo:**
```bash
cp .env.example .env
```

#### 2. **Edita `.env` con tus credenciales reales:**
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/mt5db

# MetaTrader 5 Configuration
MT5_LOGIN=tu_login_real
MT5_PASSWORD=tu_password_real
MT5_SERVER=nombre_servidor_broker

# OpenAI Configuration
OPENAI_API_KEY=sk-tu-clave-real-aqui
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=2000

# API Configuration
API_HOST=0.0.0.0
API_PORT=8080

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### 3. **Verifica que `.env` esté en `.gitignore`:**
```bash
cat .gitignore | grep .env
```
Debería aparecer `.env` en la lista ✅

---

## 🔐 Variables de Entorno Requeridas

### **MT5_LOGIN** (Requerido)
- Número de cuenta de tu broker MT5
- Ejemplo: `18104701`
- Obtener de: Tu broker / Plataforma MT5

### **MT5_PASSWORD** (Requerido)
- Contraseña de tu cuenta MT5
- ⚠️ Mantener en secreto
- Obtener de: Tu broker

### **MT5_SERVER** (Requerido)
- Nombre del servidor de tu broker
- Ejemplo: `STARTRADERFinancial-Live`
- Obtener de: Configuración de MT5 → Tools → Options → Server

### **OPENAI_API_KEY** (Opcional - para IA)
- API Key de OpenAI para análisis con IA
- Obtener de: https://platform.openai.com/api-keys
- Formato: `sk-...`
- Si no se configura: El sistema funciona sin IA (análisis básico)

### **OPENAI_MODEL** (Opcional)
- Modelo de OpenAI a usar
- Default: `gpt-4-turbo`
- Alternativas: `gpt-4`, `gpt-3.5-turbo`

### **OPENAI_MAX_TOKENS** (Opcional)
- Máximo de tokens por respuesta
- Default: `2000`
- Ajustar según necesidad

### **MONGO_URI** (Opcional)
- Conexión a MongoDB (si usas MongoDB)
- Default: `mongodb://localhost:27017/mt5db`
- Nota: Actualmente el sistema usa SQLite

---

## 🛡️ Checklist de Seguridad

Antes de subir código a GitHub:

- [ ] ✅ `.env` está en `.gitignore`
- [ ] ✅ No hay credenciales hardcodeadas en código Python
- [ ] ✅ Todas las credenciales usan `os.getenv()`
- [ ] ✅ `.env.example` solo tiene valores placeholder
- [ ] ✅ README tiene instrucciones claras de configuración
- [ ] ✅ Verificar con: `git status` (`.env` NO debe aparecer)

---

## 🔍 Verificación de Seguridad

### Buscar credenciales expuestas:
```bash
# En backend/
grep -r "MT5_PASSWORD\|MT5_LOGIN\|sk-" --include="*.py" .
```

Si aparece algo que NO sea `os.getenv()`, ¡corregir inmediatamente! ⚠️

### Verificar .gitignore:
```bash
git check-ignore .env
```
Debería devolver: `.env` ✅

---

## 🚨 Si Expusiste Credenciales Accidentalmente

### 1. **Cambia TODAS las contraseñas inmediatamente:**
- ✅ Contraseña de MT5 en tu broker
- ✅ API Key de OpenAI (revocar y crear nueva)
- ✅ Cualquier otra credencial expuesta

### 2. **Elimina el commit del historial de Git:**
```bash
# SOLO si aún no has hecho push
git reset --soft HEAD~1
git commit -m "Remove sensitive data"

# Si ya hiciste push, usa BFG Repo-Cleaner o contacta GitHub Support
```

### 3. **Verifica con:**
```bash
git log --all --full-history -- .env
```

---

## 📚 Buenas Prácticas

### ✅ DO:
- Usar variables de entorno para TODO
- Mantener `.env` local y nunca subirlo
- Documentar variables en `.env.example`
- Rotar API keys regularmente
- Usar diferentes credenciales por entorno (dev/prod)

### ❌ DON'T:
- Hardcodear credenciales en código
- Subir `.env` a Git
- Compartir API keys por chat/email
- Usar las mismas credenciales en todos los proyectos
- Dejar credenciales en capturas de pantalla

---

## 🔗 Recursos Adicionales

- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/best-practices-for-preventing-data-leaks-in-your-organization)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)
- [Python-dotenv Documentation](https://pypi.org/project/python-dotenv/)

---

**Desarrollado por Deco31416** 🚀  
**Última actualización:** 7 de noviembre de 2025
