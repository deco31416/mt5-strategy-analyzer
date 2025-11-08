#!/usr/bin/env python3
"""
Verificación de Configuración del Backend
Verifica que todas las variables de entorno estén configuradas correctamente
"""

import os
from dotenv import load_dotenv
from colorama import init, Fore, Style

# Inicializar colorama
init(autoreset=True)

# Cargar .env
load_dotenv()

def check_env_var(var_name, required=True, is_secret=False):
    """Verifica una variable de entorno"""
    value = os.getenv(var_name)
    
    if value is None or value == "" or value.startswith("your_") or value == "sk-your-openai-api-key-here":
        if required:
            print(f"  {Fore.RED}❌ {var_name}: NO CONFIGURADA (REQUERIDA){Style.RESET_ALL}")
            return False
        else:
            print(f"  {Fore.YELLOW}⚠️  {var_name}: No configurada (opcional){Style.RESET_ALL}")
            return True
    else:
        if is_secret:
            # Mostrar solo los primeros y últimos caracteres
            if len(value) > 8:
                masked = f"{value[:4]}...{value[-4:]}"
            else:
                masked = "***"
            print(f"  {Fore.GREEN}✅ {var_name}: {masked}{Style.RESET_ALL}")
        else:
            print(f"  {Fore.GREEN}✅ {var_name}: {value}{Style.RESET_ALL}")
        return True

def main():
    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}🔍 Verificación de Configuración - MT5 Strategy Analyzer{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")

    all_ok = True

    # Variables MT5 (REQUERIDAS)
    print(f"{Fore.YELLOW}📊 MetaTrader 5 Configuration:{Style.RESET_ALL}")
    all_ok &= check_env_var("MT5_LOGIN", required=True)
    all_ok &= check_env_var("MT5_PASSWORD", required=True, is_secret=True)
    all_ok &= check_env_var("MT5_SERVER", required=True)
    print()

    # Variables OpenAI (OPCIONALES)
    print(f"{Fore.YELLOW}🤖 OpenAI Configuration (opcional):{Style.RESET_ALL}")
    check_env_var("OPENAI_API_KEY", required=False, is_secret=True)
    check_env_var("OPENAI_MODEL", required=False)
    check_env_var("OPENAI_MAX_TOKENS", required=False)
    print()

    # Variables API
    print(f"{Fore.YELLOW}🌐 API Configuration:{Style.RESET_ALL}")
    check_env_var("API_HOST", required=False)
    check_env_var("API_PORT", required=False)
    print()

    # Variables CORS
    print(f"{Fore.YELLOW}🔐 CORS Configuration:{Style.RESET_ALL}")
    check_env_var("CORS_ORIGINS", required=False)
    print()

    # Variables MongoDB
    print(f"{Fore.YELLOW}🗄️  MongoDB Configuration:{Style.RESET_ALL}")
    check_env_var("MONGO_URI", required=False)
    print()

    # Resultado final
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    if all_ok:
        print(f"{Fore.GREEN}✅ CONFIGURACIÓN COMPLETA{Style.RESET_ALL}")
        print(f"{Fore.GREEN}   Todas las variables requeridas están configuradas.{Style.RESET_ALL}")
        print(f"{Fore.GREEN}   ¡El backend está listo para usar!{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}❌ CONFIGURACIÓN INCOMPLETA{Style.RESET_ALL}")
        print(f"{Fore.RED}   Faltan variables requeridas.{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}   Edita el archivo .env con tus credenciales reales.{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}   Comando: nano .env  o  notepad .env{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")

    # Instrucciones adicionales
    if not all_ok:
        print(f"{Fore.CYAN}📝 Para configurar:{Style.RESET_ALL}")
        print(f"   1. Abre el archivo .env")
        print(f"   2. Reemplaza 'your_mt5_login_number' con tu número de cuenta")
        print(f"   3. Reemplaza 'your_mt5_password' con tu contraseña")
        print(f"   4. Reemplaza 'your_mt5_server_name' con tu servidor")
        print(f"   5. (Opcional) Agrega tu OPENAI_API_KEY para análisis con IA")
        print()

    return 0 if all_ok else 1

if __name__ == "__main__":
    exit(main())
