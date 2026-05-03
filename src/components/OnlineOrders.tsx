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
    <section id="online-orders" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${breadImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100vw',
      left: 0,
      right: 0
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.88) 100%)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '5rem 5%',
        maxWidth: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('onlineOrders.title')}</h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.6 }}>
            {t('onlineOrders.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Cart Section */}
          <div style={{ gridColumn: 'span 2' }} className="lg:col-span-2">
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937' }}>
                <ShoppingCart style={{ width: '1.5rem', height: '1.5rem' }} />
                {t('onlineOrders.cart.title')}
              </h3>

              {cartItems.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>{t('onlineOrders.cart.empty')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</h4>
                        <p style={{ color: '#6b7280' }}>{item.price}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '0.25rem', transition: 'background-color 0.3s ease' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Minus style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <span style={{ width: '2rem', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '0.25rem', transition: 'background-color 0.3s ease' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Plus style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ padding: '0.5rem', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '0.25rem', border: 'none', transition: 'background-color 0.3s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: '600' }}>
                      <span>{t('onlineOrders.cart.total')}:</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>{t('onlineOrders.orderForm.title')}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>{t('onlineOrders.orderForm.name')} *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>{t('onlineOrders.orderForm.email')} *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>{t('onlineOrders.orderForm.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>{t('onlineOrders.orderForm.address')} *</label>
                  <select
                    value={customerInfo.orderType}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, orderType: e.target.value as 'pickup' | 'delivery' })}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>

              {customerInfo.orderType === 'delivery' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Delivery Address *</label>
                  <input
                    type="text"
                    required={customerInfo.orderType === 'delivery'}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Special Instructions</label>
                <textarea
                  value={customerInfo.specialInstructions}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.3s ease', resize: 'vertical' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  placeholder="Any special requests or dietary restrictions..."
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', backgroundColor: 'black', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s ease', fontSize: '1rem', fontWeight: '600' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'black'}
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#4b5563' }}>{item.name} x{item.quantity}</span>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: '600' }}>
                    <span>Total:</span>
                    <span>${getTotalPrice()}</span>
                    <span>Total</span>
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
