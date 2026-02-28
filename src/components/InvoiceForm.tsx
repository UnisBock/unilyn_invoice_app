import React from 'react';
import { Plus, Trash2, User, Mail, MapPin, Phone, Calendar, Hash, FileText, Percent } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types';
import { cn } from '../utils/cn';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const handleClientChange = (field: keyof typeof data.client, value: string) => {
    onChange({
      ...data,
      client: { ...(data.client || {}), [field]: value } as any
    });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      price: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (data.items.length > 1) {
      onChange({ ...data, items: data.items.filter(item => item.id !== id) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Invoice Details */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
          <Hash className="w-5 h-5 text-amber-600" />
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Invoice Number</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Due Date</label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-600" />
          Bill To
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Client Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={data.client?.name || ''}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={data.client?.email || ''}
              onChange={(e) => handleClientChange('email', e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Address</label>
            <input
              type="text"
              placeholder="Street, City, Country"
              value={data.client?.address || ''}
              onChange={(e) => handleClientChange('address', e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              placeholder="+232 ..."
              value={data.client?.phone || ''}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Invoice Items
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Description</label>
                <input
                  type="text"
                  placeholder="Service or product description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">SLE</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-1 flex justify-center pb-1">
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length === 1}
                  className="p-2 text-stone-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Percent className="w-5 h-5 text-amber-600" />
            Taxes & Discounts
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                value={data.taxRate}
                onChange={(e) => onChange({ ...data, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Discount (%)</label>
              <input
                type="number"
                min="0"
                value={data.discount}
                onChange={(e) => onChange({ ...data, discount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Additional Notes
          </h3>
          <textarea
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            placeholder="Add any additional information or payment terms..."
            className="w-full h-24 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
          />
        </section>
      </div>
    </div>
  );
};
