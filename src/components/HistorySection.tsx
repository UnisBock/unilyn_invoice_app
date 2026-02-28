import React from 'react';
import { History as HistoryIcon, FileText, Calendar, User, ArrowRight, Truck } from 'lucide-react';
import { InvoiceData } from '../types';
import { format } from 'date-fns';
import { BUSINESS_INFO } from '../constants';
import { motion } from 'motion/react';
import { generateDeliveryNote } from '../utils/pdfGenerator';

interface HistorySectionProps {
  invoices: InvoiceData[];
  onView: (invoice: InvoiceData) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ invoices, onView }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-amber-600" />
          Invoice History
        </h2>
        <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold uppercase tracking-widest">
          {invoices.length} Total
        </span>
      </div>

      <div className="grid gap-4">
        {invoices.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200 border-dashed text-center space-y-3">
            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto text-stone-300">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-stone-500 font-medium">No invoices generated yet.</p>
          </div>
        ) : (
          invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4" onClick={() => onView(invoice)}>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 flex items-center gap-2">
                      {invoice.invoiceNumber}
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded uppercase tracking-widest">
                        {BUSINESS_INFO.currency} {invoice.total?.toFixed(2)}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(invoice.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {invoice.client?.name || 'Unknown Client'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateDeliveryNote(invoice);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-50 text-stone-600 rounded-xl text-sm font-bold hover:bg-amber-50 hover:text-amber-700 transition-all"
                  >
                    <Truck className="w-4 h-4" />
                    Delivery Note
                  </button>
                  <button 
                    onClick={() => onView(invoice)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-50 text-stone-600 rounded-xl text-sm font-bold group-hover:bg-amber-50 group-hover:text-amber-700 transition-all"
                  >
                    Edit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
