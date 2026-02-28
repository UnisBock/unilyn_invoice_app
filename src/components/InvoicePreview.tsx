import React from 'react';
import { format } from 'date-fns';
import { InvoiceData } from '../types';
import { BUSINESS_INFO } from '../constants';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountAmount = (subtotal * data.discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * data.taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden sticky top-8 animate-in fade-in zoom-in-95 duration-700">
      {/* Header */}
      <div className="bg-stone-900 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                U
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{BUSINESS_INFO.name}</h1>
            </div>
            <div className="space-y-1 text-stone-400 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {BUSINESS_INFO.website}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {BUSINESS_INFO.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {BUSINESS_INFO.phones.join(' / ')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-amber-500 mb-4">INVOICE</h2>
            <div className="space-y-1 text-stone-400 text-sm">
              <p>Invoice #: <span className="text-white font-mono">{data.invoiceNumber}</span></p>
              <p>Date: <span className="text-white">{format(new Date(data.date), 'MMM dd, yyyy')}</span></p>
              <p>Due Date: <span className="text-white">{format(new Date(data.dueDate), 'MMM dd, yyyy')}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Bill To */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Bill To:</h3>
            <div className="space-y-1">
              <p className="font-bold text-stone-900">{data.client?.name || 'Client Name'}</p>
              <p className="text-stone-600 text-sm">{data.client?.address || 'Client Address'}</p>
              <p className="text-stone-600 text-sm">{data.client?.email || 'client@example.com'}</p>
              <p className="text-stone-600 text-sm">{data.client?.phone || 'Client Phone'}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-stone-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Price ({BUSINESS_INFO.currency})</th>
                <th className="px-4 py-3 text-right">Total ({BUSINESS_INFO.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.items.map((item) => (
                <tr key={item.id} className="text-sm text-stone-700">
                  <td className="px-4 py-4 font-medium">{item.description || 'New Item'}</td>
                  <td className="px-4 py-4 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-right">{BUSINESS_INFO.currency} {item.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-bold text-stone-900">
                    {BUSINESS_INFO.currency} {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            {data.notes && (
              <div>
                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Notes:</h3>
                <p className="text-sm text-stone-600 leading-relaxed italic">"{data.notes}"</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span>{BUSINESS_INFO.currency} {subtotal.toFixed(2)}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount ({data.discount}%)</span>
                <span>-{BUSINESS_INFO.currency} {discountAmount.toFixed(2)}</span>
              </div>
            )}
            {data.taxRate > 0 && (
              <div className="flex justify-between text-sm text-stone-600">
                <span>Tax ({data.taxRate}%)</span>
                <span>{BUSINESS_INFO.currency} {taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-stone-200">
              <span className="text-lg font-bold text-stone-900">Total</span>
              <span className="text-2xl font-black text-amber-600">{BUSINESS_INFO.currency} {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-stone-50 px-8 py-4 text-center border-t border-stone-100">
        <p className="text-[10px] text-stone-400 font-medium tracking-widest uppercase">
          Thank you for choosing Unilyn Media
        </p>
      </div>
    </div>
  );
};
