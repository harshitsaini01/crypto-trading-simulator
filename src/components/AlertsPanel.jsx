import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';

const AlertsPanel = ({ cryptos }) => {
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'BTC/USDT', condition: 'above', price: 70000, active: true },
    { id: 2, symbol: 'ETH/USDT', condition: 'below', price: 3000, active: true },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ symbol: '', condition: 'above', price: '' });
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);

  useEffect(() => {
    // Check alerts
    alerts.forEach((alert) => {
      if (!alert.active) return;

      const crypto = cryptos.find(c => c.symbol === alert.symbol);
      if (!crypto) return;

      const triggered = 
        (alert.condition === 'above' && crypto.price >= alert.price) ||
        (alert.condition === 'below' && crypto.price <= alert.price);

      if (triggered && !triggeredAlerts.includes(alert.id)) {
        setTriggeredAlerts([...triggeredAlerts, alert.id]);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Price Alert Triggered!', {
            body: `${alert.symbol} is ${alert.condition} $${alert.price}`,
            icon: '/crypto-icon.png',
          });
        }

        // Deactivate alert
        setAlerts(alerts.map(a => a.id === alert.id ? { ...a, active: false } : a));
      }
    });
  }, [cryptos, alerts, triggeredAlerts]);

  const addAlert = () => {
    if (newAlert.symbol && newAlert.price) {
      setAlerts([...alerts, {
        id: Date.now(),
        symbol: newAlert.symbol,
        condition: newAlert.condition,
        price: parseFloat(newAlert.price),
        active: true,
      }]);
      setNewAlert({ symbol: '', condition: 'above', price: '' });
      setShowAddForm(false);
    }
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
    setTriggeredAlerts(triggeredAlerts.filter(t => t !== id));
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Price Alerts</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={requestNotificationPermission}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            Enable Notifications
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition"
          >
            <Plus className="w-3 h-3" />
            <span>Add Alert</span>
          </button>
        </div>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-[#0f0f0f] rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={newAlert.symbol}
              onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">Select Coin</option>
              {cryptos.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>{crypto.symbol}</option>
              ))}
            </select>
            <select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newAlert.price}
              onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            onClick={addAlert}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm font-medium transition"
          >
            Create Alert
          </button>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No alerts set. Create one to get notified!
          </div>
        ) : (
          alerts.map((alert) => {
            const crypto = cryptos.find(c => c.symbol === alert.symbol);
            const isTriggered = triggeredAlerts.includes(alert.id);

            return (
              <div
                key={alert.id}
                className={`bg-[#0f0f0f] rounded-lg p-3 border-l-4 ${
                  isTriggered
                    ? 'border-yellow-500'
                    : alert.active
                    ? 'border-green-500'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        alert.active
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-600'
                      }`}
                    >
                      {alert.active && <Check className="w-3 h-3 text-white" />}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-sm">{alert.symbol}</span>
                        {isTriggered && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Alert when price goes {alert.condition} ${alert.price.toLocaleString()}
                      </div>
                      {crypto && (
                        <div className="text-xs text-gray-500 mt-1">
                          Current: ${crypto.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
