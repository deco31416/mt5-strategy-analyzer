"""
MT5 Strategy Auto Translator
Autor: Deco ⚡
Analiza una cuenta MT5, detecta la estrategia y genera código MQL5, Python y TypeScript.
"""

import MetaTrader5 as mt5
import pandas as pd
import os
from datetime import datetime
from dotenv import load_dotenv
from strategy_templates import generate_code_and_explanation
from colorama import init, Fore, Back, Style

# Inicializar colorama
init(autoreset=True)

# Cargar variables de entorno
load_dotenv()

MT5_LOGIN = int(os.getenv("MT5_LOGIN", 0))
MT5_PASSWORD = os.getenv("MT5_PASSWORD", "")
MT5_SERVER = os.getenv("MT5_SERVER", "")

def get_trades():
    print(f"{Fore.CYAN}🔗 Conectando a MT5...{Style.RESET_ALL}")
    if not mt5.initialize(login=MT5_LOGIN, password=MT5_PASSWORD, server=MT5_SERVER):
        error = mt5.last_error()
        print(f"{Fore.RED}❌ Error conectando a MT5: {error}{Style.RESET_ALL}")
        raise Exception(f"Error conectando a MT5: {error}")
    trades = mt5.positions_get()
    if not trades:
        print(f"{Fore.YELLOW}⚠️  No hay operaciones activas.{Style.RESET_ALL}")
        return pd.DataFrame()
    df = pd.DataFrame([t._asdict() for t in trades])
    df["type"] = df["type"].map({0:"BUY", 1:"SELL"})
    df["time"] = pd.to_datetime(df["time"], unit="s")
    print(f"{Fore.GREEN}✅ Conexión exitosa. {len(df)} operaciones encontradas.{Style.RESET_ALL}")
    return df

def detect_strategy(df):
    if df.empty:
        return "No Trades"
    symbols = df["symbol"].unique()
    buy_ratio = (df["type"] == "BUY").mean()
    sell_ratio = (df["type"] == "SELL").mean()
    duplicated = df.duplicated(subset=["symbol", "price_open"]).sum()

    print(f"{Fore.BLUE}🔍 Analizando patrón de trading...{Style.RESET_ALL}")
    print(f"   📊 Símbolos: {', '.join(symbols)}")
    print(f"   📈 Ratio BUY: {buy_ratio:.1%}")
    print(f"   📉 Ratio SELL: {sell_ratio:.1%}")
    print(f"   🔄 Operaciones duplicadas: {duplicated}")

    if duplicated > 1 and len(symbols)==1:
        strategy = "Grid/Scalping"
    elif buy_ratio>0.9:
        strategy = "Trend Following (Long Bias)"
    elif sell_ratio>0.9:
        strategy = "Trend Following (Short Bias)"
    elif len(symbols)==1 and df["type"].nunique()==2:
        strategy = "Hedge Strategy"
    elif df["profit"].std()>5 and df["volume"].mean()>0.2:
        strategy = "Martingale / Averaging"
    else:
        strategy = "Mixed / Adaptive"

    print(f"{Fore.GREEN}🎯 Estrategia detectada: {Style.BRIGHT}{strategy}{Style.RESET_ALL}")
    return strategy

def main():
    print(f"{Fore.MAGENTA}{Style.BRIGHT}{'='*60}{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}{Style.BRIGHT}🚀 MT5 Strategy Analyzer - Auto Translator{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}{Style.BRIGHT}{'='*60}{Style.RESET_ALL}")
    print()

    try:
        df = get_trades()
        strategy = detect_strategy(df)
        print()
        print(f"{Fore.YELLOW}🧠 Descripción de la estrategia:{Style.RESET_ALL}")
        tpl = generate_code_and_explanation(strategy)
        print(f"{tpl['description']}")
        print()

        for lang in ["mql5", "python", "typescript"]:
            print(f"{Fore.CYAN}{Style.BRIGHT}--- {lang.upper()} ---{Style.RESET_ALL}")
            print(f"{Fore.WHITE}{tpl[lang]}{Style.RESET_ALL}")
            print()

        print(f"{Fore.GREEN}✅ Análisis completado exitosamente!{Style.RESET_ALL}")

    except Exception as e:
        print(f"{Fore.RED}❌ Error durante el análisis: {str(e)}{Style.RESET_ALL}")

if __name__ == "__main__":
    main()