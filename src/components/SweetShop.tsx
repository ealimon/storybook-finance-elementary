import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Trash2, CheckCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { SweetShopItem } from '../types';

interface SweetShopProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const SWEET_ITEMS: SweetShopItem[] = [
  { id: 'cupcake', name: 'Strawberry Cupcake', price: 1.50, icon: '🧁', color: 'bg-rose-50 border-rose-200' },
  { id: 'lollipop', name: 'Swirly Lollipop', price: 0.60, icon: '🍭', color: 'bg-pink-50 border-pink-200' },
  { id: 'donut', name: 'Chocolate Donut', price: 1.20, icon: '🍩', color: 'bg-amber-50 border-amber-200' },
  { id: 'cookie', name: 'Choco-Chip Cookie', price: 0.80, icon: '🍪', color: 'bg-orange-50 border-orange-200' },
  { id: 'icecream', name: 'Double Scoop Cone', price: 2.00, icon: '🍦', color: 'bg-blue-50 border-blue-200' },
  { id: 'apple', name: 'Healthy Red Apple', price: 0.50, icon: '🍎', color: 'bg-red-50 border-red-200' },
];

export default function SweetShop({ onAddStars, onAddMoney, onNextModule }: SweetShopProps) {
  const [budget, setBudget] = useState(5.00);
  const [cart, setCart] = useState<{ item: SweetShopItem; quantity: number }[]>([]);
  const [checkedOut, setCheckedOut] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);
  const [checkoutChange, setCheckoutChange] = useState(0);

  const totalSpent = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const roundedSpent = Math.round(totalSpent * 100) / 100;
  const isOverBudget = roundedSpent > budget;

  const handleAddToCart = (item: SweetShopItem) => {
    if (checkedOut) return;
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    if (checkedOut) return;
    const existing = cart.find(c => c.item.id === itemId);
    if (!existing) return;

    if (existing.quantity > 1) {
      setCart(cart.map(c => c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c.item.id !== itemId));
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCheckedOut(false);
    setStarsAwarded(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0 || isOverBudget) return;
    const change = Math.round((budget - roundedSpent) * 100) / 100;
    setCheckoutChange(change);
    setCheckedOut(true);
  };

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(8);
      // Give the remaining change to the virtual wallet! Encourages kids to see that saving budget means more wallet money!
      onAddMoney(checkoutChange);
      setStarsAwarded(true);
      alert(`Fantastic! You spent $${roundedSpent.toFixed(2)} and got $${checkoutChange.toFixed(2)} in change back in your Wallet! +8 Stars! 💵🛍️`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
            Module 4: Smart Spending
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Sweet Shop Budgeting</h2>
          <p className="text-sm text-slate-600">You have a $5.00 bill. Spend it wisely without going over budget!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 8 Stars + Keep Change!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sweet Shelf shop items */}
        <div className="lg:col-span-7 bg-amber-50 rounded-3xl p-5 border-4 border-amber-200">
          <h3 className="font-display text-amber-950 font-bold text-lg mb-4 flex items-center gap-2">
            🏪 Sweet Shop Shelf:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SWEET_ITEMS.map((item) => (
              <button
                key={item.id}
                id={`btn-shop-add-${item.id}`}
                onClick={() => handleAddToCart(item)}
                disabled={checkedOut}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-b-4 hover:brightness-105 active:translate-y-0.5 transition-all bg-white ${item.color} border-slate-200 hover:border-amber-400`}
              >
                <span className="text-4xl filter drop-shadow-sm mb-1">{item.icon}</span>
                <span className="font-display font-bold text-xs text-slate-800 text-center line-clamp-1">{item.name}</span>
                <span className="font-mono font-bold text-sm text-amber-700 mt-1">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 bg-white border px-2 py-0.5 rounded-full font-bold">
                  Add ➕
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Receipt and Cart Checkout */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
              <h3 className="font-display text-slate-800 font-bold text-md flex items-center gap-1.5">
                <ShoppingBag size={18} className="text-slate-500" /> Shopping Bag
              </h3>
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold px-3 py-1 rounded-xl text-sm">
                Budget: ${budget.toFixed(2)}
              </div>
            </div>

            {/* Shopping List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto mb-4 pr-1">
              {cart.map((entry) => (
                <div
                  key={entry.item.id}
                  className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{entry.item.icon}</span>
                    <div>
                      <h4 className="font-display font-bold text-xs text-slate-700">{entry.item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold font-mono">
                        ${entry.item.price.toFixed(2)} x {entry.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      ${(entry.item.price * entry.quantity).toFixed(2)}
                    </span>
                    <button
                      id={`btn-shop-remove-${entry.item.id}`}
                      onClick={() => handleRemoveFromCart(entry.item.id)}
                      className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-xs text-slate-400 font-display italic text-center py-8">Bag is empty! Add sweet treats from the shelf.</p>
              )}
            </div>
          </div>

          <div>
            {/* Calculation details */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 mb-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-700">${roundedSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Your Budget Limit:</span>
                <span className="font-mono text-slate-700">${budget.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 my-1 pt-1 flex justify-between font-bold text-sm">
                <span>Total Spent:</span>
                <span className={`font-mono ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                  ${roundedSpent.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notifications and Checkout button */}
            {isOverBudget && (
              <div className="mb-3 flex items-center gap-1.5 bg-red-100 border border-red-200 p-2 px-3 rounded-xl text-xs font-bold text-red-800 animate-pulse">
                <AlertTriangle size={14} className="flex-shrink-0" />
                Over budget by ${(roundedSpent - budget).toFixed(2)}! Put some sweets back.
              </div>
            )}

            {checkedOut ? (
              <div className="bg-green-100 border-2 border-green-300 p-3 rounded-2xl shadow-sm text-center">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-1" />
                <h4 className="font-display font-bold text-sm text-green-800">Checkout Complete!</h4>
                <p className="text-xs text-green-600 font-bold font-mono mb-2">
                  Change Back: ${checkoutChange.toFixed(2)}
                </p>
                {starsAwarded ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                    <button
                      id="btn-sweetshop-playagain"
                      onClick={handleClearCart}
                      className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200"
                    >
                      <RefreshCw size={12} /> Buy New Sweets
                    </button>
                    {onNextModule && (
                      <button
                        id="btn-sweetshop-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce"
                      >
                        NEXT: Chore Board Builder <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                    <button
                      id="btn-sweetshop-claim-reward"
                      onClick={claimReward}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-md border-b-2 border-yellow-600 flex items-center gap-1"
                    >
                      Claim 8 Stars + Coins <ArrowRight size={14} />
                    </button>
                    {onNextModule && (
                      <button
                        id="btn-sweetshop-next-module-direct"
                        onClick={onNextModule}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md border-b-2 border-emerald-700 flex items-center gap-1"
                      >
                        NEXT <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  id="btn-sweetshop-clear"
                  onClick={handleClearCart}
                  className="flex items-center justify-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold px-3 py-2.5 rounded-xl text-xs"
                >
                  <RefreshCw size={14} /> Clear Bag
                </button>
                <button
                  id="btn-sweetshop-checkout"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isOverBudget}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-display font-bold p-2.5 rounded-xl text-sm border-b-4 border-emerald-700 shadow-md transition-all active:translate-y-0.5"
                >
                  Pay with $5.00 Bill 🪙
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
