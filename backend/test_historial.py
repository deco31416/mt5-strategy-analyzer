import MetaTrader5 as mt5
from datetime import datetime, timedelta
import pandas as pd

# Conectar a MT5
if not mt5.initialize():
    print("❌ Error: No se pudo conectar a MT5")
    exit()

print("✅ MT5 conectado correctamente\n")

# Información de cuenta
account = mt5.account_info()
if account:
    print("=" * 60)
    print("INFORMACIÓN DE CUENTA")
    print("=" * 60)
    print(f"Cuenta: {account.login}")
    print(f"Balance: ${account.balance:.2f}")
    print(f"Equity: ${account.equity:.2f}")
    print(f"Profit: ${account.profit:.2f}")
    print(f"Servidor: {account.server}")
    print()

# Obtener historial de últimos 90 días
from_date = datetime.now() - timedelta(days=90)
to_date = datetime.now()

print("=" * 60)
print("HISTORIAL DE TRADES (últimos 90 días)")
print("=" * 60)

deals = mt5.history_deals_get(from_date, to_date)

if deals and len(deals) > 0:
    print(f"✅ Total de deals encontrados: {len(deals)}\n")
    
    # Convertir a DataFrame
    df = pd.DataFrame([d._asdict() for d in deals])
    df["time"] = pd.to_datetime(df["time"], unit="s")
    
    # Filtrar solo trades cerrados (entry = 1)
    closed_trades = df[df["entry"] == 1].copy()
    
    print(f"Trades cerrados: {len(closed_trades)}")
    print(f"Rango de fechas: {df['time'].min()} a {df['time'].max()}\n")
    
    # Métricas básicas
    if len(closed_trades) > 0:
        total_profit = closed_trades["profit"].sum()
        wins = (closed_trades["profit"] > 0).sum()
        losses = (closed_trades["profit"] < 0).sum()
        win_rate = (wins / len(closed_trades) * 100) if len(closed_trades) > 0 else 0
        
        print("=" * 60)
        print("MÉTRICAS HISTÓRICAS")
        print("=" * 60)
        print(f"Total trades cerrados: {len(closed_trades)}")
        print(f"Trades ganadores: {wins}")
        print(f"Trades perdedores: {losses}")
        print(f"Win Rate: {win_rate:.2f}%")
        print(f"Profit total: ${total_profit:.2f}")
        print(f"Mejor trade: ${closed_trades['profit'].max():.2f}")
        print(f"Peor trade: ${closed_trades['profit'].min():.2f}")
        print()
        
        # Símbolos operados
        symbols = closed_trades["symbol"].value_counts()
        print("=" * 60)
        print("SÍMBOLOS MÁS OPERADOS")
        print("=" * 60)
        for symbol, count in symbols.head(10).items():
            symbol_profit = closed_trades[closed_trades["symbol"] == symbol]["profit"].sum()
            print(f"{symbol}: {count} trades (Profit: ${symbol_profit:.2f})")
        print()
        
        # Últimos 10 trades
        print("=" * 60)
        print("ÚLTIMOS 10 TRADES CERRADOS")
        print("=" * 60)
        last_10 = closed_trades.sort_values("time", ascending=False).head(10)
        for _, trade in last_10.iterrows():
            print(f"{trade['time'].strftime('%Y-%m-%d %H:%M')} | {trade['symbol']:8} | "
                  f"{'WIN' if trade['profit'] > 0 else 'LOSS':4} | ${trade['profit']:8.2f}")
    else:
        print("⚠️ No se encontraron trades cerrados en el historial")
else:
    print("❌ No se encontró historial de trades")

mt5.shutdown()
print("\n✅ Análisis completado")
