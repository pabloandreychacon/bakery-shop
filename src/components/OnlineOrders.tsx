import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import breadImage from '../assets/bread.png';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export function OnlineOrders() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Sourdough Bread", price: "$6.99", quantity: 2 },
    { id: 2, name: "Croissant", price: "$4.50", quantity: 1 }
  ]);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    orderType: 'pickup' as 'pickup' | 'delivery',
    specialInstructions: ''
  });

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order submitted successfully! We will contact you shortly.');
    // Here you would typically send the order to your backend
  };

  return (
    <section id="online-orders" className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed w-screen left-0 right-0" style={{ backgroundImage: `url(${breadImage})` }}>
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.88) 100%)' }}></div>
      <div className="relative z-20 px-[5%] py-20 max-w-none flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 className="font-bold mb-4 text-gray-800" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{t('onlineOrders.title')}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('onlineOrders.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <ShoppingCart className="w-6 h-6" />
                {t('onlineOrders.cart.title')}
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t('onlineOrders.cart.empty')}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-500">{item.price}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded bg-transparent hover:bg-gray-200 transition-colors duration-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded bg-transparent hover:bg-gray-200 transition-colors duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 bg-transparent hover:bg-red-50 rounded transition-colors duration-300 ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-xl font-semibold text-gray-800">
                      <span>{t('onlineOrders.cart.total')}:</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">{t('onlineOrders.orderForm.title')}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('onlineOrders.orderForm.name')} *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('onlineOrders.orderForm.email')} *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('onlineOrders.orderForm.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('onlineOrders.orderForm.address')} *</label>
                  <select
                    value={customerInfo.orderType}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, orderType: e.target.value as 'pickup' | 'delivery' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300"
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>

              {customerInfo.orderType === 'delivery' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Delivery Address *</label>
                  <input
                    type="text"
                    required={customerInfo.orderType === 'delivery'}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Special Instructions</label>
                <textarea
                  value={customerInfo.specialInstructions}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors duration-300 resize-y"
                  placeholder="Any special requests or dietary restrictions..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 text-base font-semibold"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h3>

              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-gray-800">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-xl font-semibold text-gray-800">
                    <span>Total:</span>
                    <span>
                      ${(
                        parseFloat(getTotalPrice()) +
                        (parseFloat(getTotalPrice()) * 0.08) +
                        (customerInfo.orderType === 'delivery' ? 5 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>Pickup Time:</strong> 24-48 hours</p>
                <p className="mb-2"><strong>Delivery Time:</strong> 48-72 hours</p>
                <p><strong>Hours:</strong> Mon-Sat 7AM-7PM, Sun 8AM-5PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
