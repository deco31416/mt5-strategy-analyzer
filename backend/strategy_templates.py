# ===============================================================
#  MT5 Strategy Analyzer - strategy_templates.py
# ===============================================================

def generate_code_and_explanation(strategy: str) -> dict:
    """
    Genera código en MQL4, MQL5 y Python para la estrategia detectada
    con explicaciones detalladas de cómo funciona
    """
    
    strategy_lower = strategy.lower()
    
    # Grid/Scalping Strategy
    if "grid" in strategy_lower or "scalping" in strategy_lower:
        return {
            "mql5": """//+------------------------------------------------------------------+
//|                                           Grid_Scalping_EA.mq5 |
//|                                  MT5 Strategy Analyzer          |
//+------------------------------------------------------------------+
#property copyright "MT5 Strategy Analyzer"
#property version   "1.00"

input double GridStep = 50;        // Distancia entre órdenes del grid (puntos)
input double LotSize = 0.01;       // Tamaño del lote
input int MaxOrders = 20;          // Máximo de órdenes simultáneas
input double TakeProfit = 30;     // Take Profit en puntos
input double StopLoss = 100;       // Stop Loss en puntos

double lastPrice = 0;
int orderCount = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   lastPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
void OnTick()
{
   double currentPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   orderCount = PositionsTotal();
   
   // Si no hay órdenes, abrir la primera
   if(orderCount == 0)
   {
      OpenGridOrder(ORDER_TYPE_BUY);
      lastPrice = currentPrice;
      return;
   }
   
   // Si el precio se movió suficiente, abrir nueva orden
   if(orderCount < MaxOrders)
   {
      if(MathAbs(currentPrice - lastPrice) >= GridStep * _Point)
      {
         if(currentPrice > lastPrice)
            OpenGridOrder(ORDER_TYPE_BUY);
         else
            OpenGridOrder(ORDER_TYPE_SELL);
         
         lastPrice = currentPrice;
      }
   }
}

//+------------------------------------------------------------------+
void OpenGridOrder(ENUM_ORDER_TYPE type)
{
   MqlTradeRequest request = {};
   MqlTradeResult result = {};
   
   double price = (type == ORDER_TYPE_BUY) ? 
                  SymbolInfoDouble(_Symbol, SYMBOL_ASK) : 
                  SymbolInfoDouble(_Symbol, SYMBOL_BID);
   
   request.action = TRADE_ACTION_DEAL;
   request.symbol = _Symbol;
   request.volume = LotSize;
   request.type = type;
   request.price = price;
   request.sl = (type == ORDER_TYPE_BUY) ? price - StopLoss * _Point : price + StopLoss * _Point;
   request.tp = (type == ORDER_TYPE_BUY) ? price + TakeProfit * _Point : price - TakeProfit * _Point;
   request.deviation = 10;
   request.magic = 123456;
   
   OrderSend(request, result);
}
//+------------------------------------------------------------------+
""",
            "mql4": """//+------------------------------------------------------------------+
//|                                           Grid_Scalping_EA.mq4 |
//|                                  MT5 Strategy Analyzer          |
//+------------------------------------------------------------------+
#property copyright "MT5 Strategy Analyzer"
#property version   "1.00"

extern double GridStep = 50;        // Distancia entre órdenes del grid (puntos)
extern double LotSize = 0.01;       // Tamaño del lote
extern int MaxOrders = 20;          // Máximo de órdenes simultáneas
extern double TakeProfit = 30;     // Take Profit en puntos
extern double StopLoss = 100;       // Stop Loss en puntos

double lastPrice = 0;

//+------------------------------------------------------------------+
int start()
{
   if(lastPrice == 0)
      lastPrice = Bid;
   
   int orderCount = OrdersTotal();
   double currentPrice = Bid;
   
   // Si no hay órdenes, abrir la primera
   if(orderCount == 0)
   {
      OpenGridOrder(OP_BUY);
      lastPrice = currentPrice;
      return(0);
   }
   
   // Si el precio se movió suficiente, abrir nueva orden
   if(orderCount < MaxOrders)
   {
      if(MathAbs(currentPrice - lastPrice) >= GridStep * Point)
      {
         if(currentPrice > lastPrice)
            OpenGridOrder(OP_BUY);
         else
            OpenGridOrder(OP_SELL);
         
         lastPrice = currentPrice;
      }
   }
   
   return(0);
}

//+------------------------------------------------------------------+
void OpenGridOrder(int type)
{
   double price = (type == OP_BUY) ? Ask : Bid;
   double sl = (type == OP_BUY) ? price - StopLoss * Point : price + StopLoss * Point;
   double tp = (type == OP_BUY) ? price + TakeProfit * Point : price - TakeProfit * Point;
   
   OrderSend(Symbol(), type, LotSize, price, 10, sl, tp, "Grid EA", 123456, 0, clrNONE);
}
//+------------------------------------------------------------------+
""",
            "python": """# Grid/Scalping Strategy - Python Implementation
# Requiere: MetaTrader5, pandas

import MetaTrader5 as mt5
import time
from datetime import datetime

class GridScalpingBot:
    def __init__(self, symbol="BTCUSD", grid_step=50, lot_size=0.01, max_orders=20):
        self.symbol = symbol
        self.grid_step = grid_step
        self.lot_size = lot_size
        self.max_orders = max_orders
        self.last_price = 0
        self.take_profit = 30
        self.stop_loss = 100
        
    def initialize(self):
        if not mt5.initialize():
            print("Error al inicializar MT5")
            return False
        
        # Obtener precio inicial
        tick = mt5.symbol_info_tick(self.symbol)
        self.last_price = tick.bid
        return True
    
    def get_open_positions(self):
        positions = mt5.positions_get(symbol=self.symbol)
        return len(positions) if positions else 0
    
    def open_order(self, order_type):
        tick = mt5.symbol_info_tick(self.symbol)
        
        if order_type == mt5.ORDER_TYPE_BUY:
            price = tick.ask
            sl = price - self.stop_loss * mt5.symbol_info(self.symbol).point
            tp = price + self.take_profit * mt5.symbol_info(self.symbol).point
        else:
            price = tick.bid
            sl = price + self.stop_loss * mt5.symbol_info(self.symbol).point
            tp = price - self.take_profit * mt5.symbol_info(self.symbol).point
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": self.symbol,
            "volume": self.lot_size,
            "type": order_type,
            "price": price,
            "sl": sl,
            "tp": tp,
            "deviation": 10,
            "magic": 123456,
            "comment": "Grid EA",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(request)
        return result
    
    def run(self):
        print(f"Iniciando Grid/Scalping Bot en {self.symbol}...")
        
        while True:
            tick = mt5.symbol_info_tick(self.symbol)
            current_price = tick.bid
            order_count = self.get_open_positions()
            
            # Abrir primera orden
            if order_count == 0:
                self.open_order(mt5.ORDER_TYPE_BUY)
                self.last_price = current_price
                print(f"Primera orden abierta en {current_price}")
            
            # Abrir nuevas órdenes según el grid
            elif order_count < self.max_orders:
                price_diff = abs(current_price - self.last_price)
                point = mt5.symbol_info(self.symbol).point
                
                if price_diff >= self.grid_step * point:
                    order_type = mt5.ORDER_TYPE_BUY if current_price > self.last_price else mt5.ORDER_TYPE_SELL
                    result = self.open_order(order_type)
                    
                    if result.retcode == mt5.TRADE_RETCODE_DONE:
                        self.last_price = current_price
                        print(f"Nueva orden {'BUY' if order_type == mt5.ORDER_TYPE_BUY else 'SELL'} en {current_price}")
            
            time.sleep(1)  # Esperar 1 segundo antes de revisar nuevamente

# Uso
if __name__ == "__main__":
    bot = GridScalpingBot(symbol="BTCUSD", grid_step=50, lot_size=0.01, max_orders=20)
    
    if bot.initialize():
        try:
            bot.run()
        except KeyboardInterrupt:
            print("\\nBot detenido por el usuario")
            mt5.shutdown()
    else:
        print("Error al inicializar el bot")
""",
            "explanation": """🤖 EXPLICACIÓN DE LA ESTRATEGIA GRID/SCALPING

📋 CONCEPTO:
Esta estrategia coloca múltiples órdenes en diferentes niveles de precio (como una rejilla o "grid"). 
Cada vez que el precio se mueve una distancia específica (GridStep), se abre una nueva posición.

🎯 CÓMO FUNCIONA:
1. Se abre la primera orden al precio actual
2. Si el precio sube o baja más de GridStep puntos, se abre una nueva orden
3. Cada orden tiene su propio Take Profit y Stop Loss
4. Se limita el número máximo de órdenes simultáneas (MaxOrders)

⚙️ PARÁMETROS CLAVE:
- GridStep: Distancia en puntos entre cada orden (ej: 50 puntos)
- LotSize: Tamaño de cada posición (ej: 0.01 lotes)
- MaxOrders: Máximo de posiciones abiertas simultáneamente
- TakeProfit: Ganancia objetivo para cada orden
- StopLoss: Pérdida máxima aceptable

💡 VENTAJAS:
✓ Aprovecha movimientos laterales del mercado
✓ No requiere predicción de dirección
✓ Múltiples oportunidades de profit

⚠️ RIESGOS:
✗ Puede acumular pérdidas en tendencias fuertes
✗ Requiere buen capital para manejar drawdowns
✗ Alto uso de margin con muchas órdenes

🔧 PERSONALIZACIÓN:
Ajusta GridStep según la volatilidad del par que operas.
Para pares más volátiles (ej: BTCUSD), usa GridStep mayor (100-200).
Para pares estables (ej: EURUSD), usa GridStep menor (20-50).
"""
        }
    
    # Trend Following (Long Bias) Strategy
    elif "trend following" in strategy_lower and ("long" in strategy_lower or "buy" in strategy_lower):
        return {
            "mql5": """//+------------------------------------------------------------------+
//|                                    Trend_Following_Long_EA.mq5  |
//|                                  MT5 Strategy Analyzer          |
//+------------------------------------------------------------------+
#property copyright "MT5 Strategy Analyzer"
#property version   "1.00"

input int MA_Fast = 50;              // Fast Moving Average period
input int MA_Slow = 200;             // Slow Moving Average period
input double LotSize = 0.01;         // Tamaño del lote
input double TakeProfit = 200;       // Take Profit en puntos
input double StopLoss = 100;         // Stop Loss en puntos
input int RSI_Period = 14;           // RSI Period
input int RSI_Oversold = 30;         // RSI Oversold level

//+------------------------------------------------------------------+
void OnTick()
{
   double ma_fast[], ma_slow[], rsi[];
   ArraySetAsSeries(ma_fast, true);
   ArraySetAsSeries(ma_slow, true);
   ArraySetAsSeries(rsi, true);
   
   int ma_fast_handle = iMA(_Symbol, PERIOD_CURRENT, MA_Fast, 0, MODE_SMA, PRICE_CLOSE);
   int ma_slow_handle = iMA(_Symbol, PERIOD_CURRENT, MA_Slow, 0, MODE_SMA, PRICE_CLOSE);
   int rsi_handle = iRSI(_Symbol, PERIOD_CURRENT, RSI_Period, PRICE_CLOSE);
   
   CopyBuffer(ma_fast_handle, 0, 0, 3, ma_fast);
   CopyBuffer(ma_slow_handle, 0, 0, 3, ma_slow);
   CopyBuffer(rsi_handle, 0, 0, 3, rsi);
   
   // Señal de compra: MA rápida cruza por encima de MA lenta y RSI < 70
   if(ma_fast[1] > ma_slow[1] && ma_fast[2] <= ma_slow[2] && rsi[0] < 70)
   {
      if(PositionsTotal() == 0)
      {
         double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
         double sl = ask - StopLoss * _Point;
         double tp = ask + TakeProfit * _Point;
         
         MqlTradeRequest request = {};
         MqlTradeResult result = {};
         
         request.action = TRADE_ACTION_DEAL;
         request.symbol = _Symbol;
         request.volume = LotSize;
         request.type = ORDER_TYPE_BUY;
         request.price = ask;
         request.sl = sl;
         request.tp = tp;
         request.deviation = 10;
         request.magic = 123457;
         
         OrderSend(request, result);
      }
   }
}
//+------------------------------------------------------------------+
""",
            "mql4": "// MQL4 code similar to MQL5...",
            "python": """# Trend Following Long Strategy
import MetaTrader5 as mt5

class TrendFollowingLong:
    def __init__(self, symbol="BTCUSD", ma_fast=50, ma_slow=200):
        self.symbol = symbol
        self.ma_fast = ma_fast
        self.ma_slow = ma_slow
        self.lot_size = 0.01
    
    def check_signal(self):
        # Obtener datos de precios
        rates = mt5.copy_rates_from_pos(self.symbol, mt5.TIMEFRAME_H1, 0, 300)
        df = pd.DataFrame(rates)
        
        # Calcular MAs
        df['ma_fast'] = df['close'].rolling(self.ma_fast).mean()
        df['ma_slow'] = df['close'].rolling(self.ma_slow).mean()
        
        # Señal de compra
        if df['ma_fast'].iloc[-1] > df['ma_slow'].iloc[-1]:
            return "BUY"
        return None
""",
            "explanation": """🤖 ESTRATEGIA TREND FOLLOWING (LONG BIAS)

Sigue tendencias alcistas usando cruces de medias móviles y confirmación con RSI.
"""
        }
    
    # Hedge Strategy
    elif "hedge" in strategy_lower:
        return {
            "mql5": """//+------------------------------------------------------------------+
//|                                         Hedge_Strategy_EA.mq5   |
//|                                  MT5 Strategy Analyzer          |
//+------------------------------------------------------------------+
#property copyright "MT5 Strategy Analyzer"
#property version   "1.00"

input double LotSize = 0.01;         // Tamaño del lote
input double Distance = 50;          // Distancia entre órdenes (puntos)
input double TakeProfit = 30;        // Take Profit en puntos

//+------------------------------------------------------------------+
void OnTick()
{
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   
   // Si no hay posiciones, abrir hedge (BUY + SELL)
   if(PositionsTotal() == 0)
   {
      OpenHedgeOrders(ask, bid);
   }
}

//+------------------------------------------------------------------+
void OpenHedgeOrders(double ask, double bid)
{
   MqlTradeRequest request = {};
   MqlTradeResult result = {};
   
   // Abrir BUY
   request.action = TRADE_ACTION_DEAL;
   request.symbol = _Symbol;
   request.volume = LotSize;
   request.type = ORDER_TYPE_BUY;
   request.price = ask;
   request.tp = ask + TakeProfit * _Point;
   request.deviation = 10;
   request.magic = 123458;
   OrderSend(request, result);
   
   // Abrir SELL
   request.type = ORDER_TYPE_SELL;
   request.price = bid;
   request.tp = bid - TakeProfit * _Point;
   OrderSend(request, result);
}
//+------------------------------------------------------------------+
""",
            "mql4": "// MQL4 Hedge Strategy...",
            "python": "# Python Hedge Strategy...",
            "explanation": """🤖 ESTRATEGIA HEDGE (COBERTURA)

Abre posiciones BUY y SELL simultáneamente para reducir riesgo direccional.
"""
        }
    
    # Martingale Strategy
    elif "martingale" in strategy_lower or "averaging" in strategy_lower:
        return {
            "mql5": """//+------------------------------------------------------------------+
//|                                      Martingale_Strategy_EA.mq5 |
//|                                  MT5 Strategy Analyzer          |
//+------------------------------------------------------------------+
#property copyright "MT5 Strategy Analyzer"
#property version   "1.00"

input double InitialLot = 0.01;      // Lote inicial
input double Multiplier = 2.0;       // Multiplicador de lote después de pérdida
input int MaxLevels = 5;             // Máximo de niveles de martingala
input double TakeProfit = 50;        // Take Profit en puntos

double current_lot = InitialLot;
int level = 0;

//+------------------------------------------------------------------+
void OnTick()
{
   // Verificar si hay pérdidas
   if(CheckForLoss())
   {
      level++;
      if(level <= MaxLevels)
      {
         current_lot = current_lot * Multiplier;
         OpenOrder();
      }
   }
   else if(PositionsTotal() == 0)
   {
      current_lot = InitialLot;
      level = 0;
      OpenOrder();
   }
}

//+------------------------------------------------------------------+
bool CheckForLoss()
{
   // Implementar lógica para detectar pérdidas
   return false;
}

void OpenOrder()
{
   // Implementar apertura de orden
}
//+------------------------------------------------------------------+
""",
            "mql4": "// MQL4 Martingale...",
            "python": "# Python Martingale...",
            "explanation": """⚠️ ESTRATEGIA MARTINGALE

Duplica el tamaño de posición después de cada pérdida para recuperar.
ALTO RIESGO - Puede agotar la cuenta rápidamente.
"""
        }
    
    # Default fallback
    return {
        "mql4": "// Estrategia no identificada - personaliza este código según tus necesidades",
        "mql5": "// Estrategia no identificada - personaliza este código según tus necesidades",
        "python": "# Estrategia no identificada - personaliza este código según tus necesidades",
        "explanation": "Esta estrategia no tiene un template predefinido. Usa el análisis previo como guía para implementar tu propia lógica."
    }