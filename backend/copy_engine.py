import MetaTrader5 as mt5

def copy_trade(source_trade, target_login, target_password, target_server):
    if not mt5.initialize(login=target_login, password=target_password, server=target_server):
        raise Exception("Error al conectar cuenta destino")

    order_type = mt5.ORDER_TYPE_BUY if source_trade["type"] == "BUY" else mt5.ORDER_TYPE_SELL
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": source_trade["symbol"],
        "volume": source_trade["volume"],
        "type": order_type,
        "price": mt5.symbol_info_tick(source_trade["symbol"]).ask if order_type==mt5.ORDER_TYPE_BUY else mt5.symbol_info_tick(source_trade["symbol"]).bid,
        "deviation": 10,
        "magic": 7777,
        "comment": f"copy_from_{source_trade['symbol']}"
    }
    result = mt5.order_send(request)
    return result