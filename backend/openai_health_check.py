"""
OpenAI Health Check Module
Valida la conectividad y disponibilidad del API de OpenAI antes de arrancar el backend
"""

import os
from openai import OpenAI
from dotenv import load_dotenv
import sys

load_dotenv()

def test_openai_connection() -> dict:
    """
    Realiza un ping/health check al API de OpenAI
    
    Returns:
        dict: {
            "available": bool,
            "status": "ok" | "error" | "not_configured",
            "message": str,
            "model": str,
            "api_key_prefix": str (primeros 8 chars)
        }
    """
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    # Caso 1: No configurado
    if not api_key:
        return {
            "available": False,
            "status": "not_configured",
            "message": "❌ OPENAI_API_KEY no encontrada en .env - Modo sin IA",
            "model": "N/A",
            "api_key_prefix": "N/A"
        }
    
    # Caso 2: Validar conexión
    try:
        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
        
        # Hacer una petición mínima para validar
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": "ping"}
            ],
            max_tokens=5,
            temperature=0
        )
        
        # Si llegamos aquí, la conexión es exitosa
        return {
            "available": True,
            "status": "ok",
            "message": f"✅ OpenAI API operativa ({model})",
            "model": model,
            "api_key_prefix": api_key[:12] + "..." if len(api_key) > 12 else "***"
        }
        
    except Exception as e:
        error_msg = str(e)
        
        # Detectar errores específicos
        if "authentication" in error_msg.lower() or "api_key" in error_msg.lower():
            status_msg = "❌ API Key inválida o expirada"
        elif "quota" in error_msg.lower() or "insufficient" in error_msg.lower():
            status_msg = "❌ Cuota agotada - Sin créditos disponibles"
        elif "rate" in error_msg.lower() or "limit" in error_msg.lower():
            status_msg = "⚠️ Límite de requests alcanzado - Reintenta en unos minutos"
        elif "timeout" in error_msg.lower() or "connection" in error_msg.lower():
            status_msg = "⚠️ Timeout de conexión - Verifica tu internet"
        else:
            status_msg = f"❌ Error: {error_msg[:100]}"
        
        return {
            "available": False,
            "status": "error",
            "message": status_msg,
            "model": model if 'model' in locals() else "N/A",
            "api_key_prefix": api_key[:12] + "..." if len(api_key) > 12 else "***",
            "error_details": error_msg
        }


def validate_openai_or_exit(allow_continue: bool = True) -> dict:
    """
    Valida OpenAI y decide si continuar o no
    
    Args:
        allow_continue: Si True, permite continuar sin OpenAI. Si False, sale del programa.
    
    Returns:
        dict: Resultado del health check
    """
    
    print("\n" + "="*60)
    print("🔍 VALIDANDO OPENAI API...")
    print("="*60)
    
    result = test_openai_connection()
    
    print(result["message"])
    
    if result["available"]:
        print(f"   Modelo: {result['model']}")
        print(f"   API Key: {result['api_key_prefix']}")
        print("✅ Análisis con IA: HABILITADO")
    else:
        if result["status"] == "not_configured":
            print("ℹ️ El sistema funcionará sin análisis de IA avanzado")
            print("   Para habilitar IA, agrega OPENAI_API_KEY a tu .env")
        elif result["status"] == "error":
            print(f"⚠️ Detalles: {result.get('error_details', 'N/A')[:200]}")
            print("   El sistema funcionará con análisis básico")
        
        if not allow_continue:
            print("\n❌ Se requiere OpenAI para continuar. Saliendo...")
            sys.exit(1)
        else:
            print("✅ Análisis básico: HABILITADO")
    
    print("="*60 + "\n")
    
    return result


# Para testing directo
if __name__ == "__main__":
    result = validate_openai_or_exit(allow_continue=True)
    print("\n📊 Resultado completo:")
    import json
    print(json.dumps(result, indent=2, ensure_ascii=False))
