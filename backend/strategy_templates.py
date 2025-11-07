# ===============================================================
#  MT5 Strategy Analyzer - strategy_templates.py
# ===============================================================

def generate_code_and_explanation(strategy: str) -> dict:
    """
    Genera código en MQL4, MQL5 y Python para la estrategia detectada
    con explicaciones detalladas de cómo funciona
    """
    
    if "Grid" in strategy or "Scalping" in strategy:
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
    
    # Default fallback
    return {
        "mql4": "// Estrategia no identificada - personaliza este código según tus necesidades",
        "mql5": "// Estrategia no identificada - personaliza este código según tus necesidades",
        "python": "# Estrategia no identificada - personaliza este código según tus necesidades",
        "explanation": "Esta estrategia no tiene un template predefinido. Usa el análisis previo como guía para implementar tu propia lógica."
    }