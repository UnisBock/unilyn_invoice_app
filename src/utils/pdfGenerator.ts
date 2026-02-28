import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { InvoiceData } from '../types';
import { BUSINESS_INFO } from '../constants';
import logo from '../assets/logo.png';

export const generatePDF = (data: InvoiceData) => {
  const doc = new jsPDF({
    compress: true
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = [180, 83, 9]; // Amber-700
  const secondaryColor = [75, 85, 99]; // Gray-600
  
  const img = new Image();
  img.src = logo;

  img.onload = () => {
    // Header - Logo and Company Info
    const imgWidth = 52.5; // Increased by 50% (from 35)
    const imgHeight = 52.5; // Increased by 50% (from 35)
    
    // Logo on the left
    doc.addImage(img, 'PNG', 20, 15, imgWidth, imgHeight, undefined, 'FAST');
    
    // Company Info on the right
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text(BUSINESS_INFO.name, pageWidth - 20, 25, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(BUSINESS_INFO.website, pageWidth - 20, 32, { align: 'right' });
    doc.text(BUSINESS_INFO.email, pageWidth - 20, 37, { align: 'right' });
    doc.text(BUSINESS_INFO.phones.join(' / '), pageWidth - 20, 42, { align: 'right' });
    
    // Invoice Title & Info
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', 20, 65);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - 20, 65, { align: 'right' });
    doc.text(`Date: ${format(new Date(data.date), 'MMM dd, yyyy')}`, pageWidth - 20, 70, { align: 'right' });
    doc.text(`Due Date: ${format(new Date(data.dueDate), 'MMM dd, yyyy')}`, pageWidth - 20, 75, { align: 'right' });
    
    // Horizontal Line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 80, pageWidth - 20, 80);
    
    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('BILL TO:', 20, 95);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(data.client.name || 'Client Name', 20, 102);
    doc.text(data.client.address || 'Client Address', 20, 107);
    doc.text(data.client.email || 'Client Email', 20, 112);
    doc.text(data.client.phone || 'Client Phone', 20, 117);
    
    // Table
    const tableData = data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${BUSINESS_INFO.currency} ${item.price.toFixed(2)}`,
      `${BUSINESS_INFO.currency} ${(item.quantity * item.price).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: 130,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      headStyles: { 
        fillColor: primaryColor as [number, number, number],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 170;
    
    // Totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discountAmount = (subtotal * data.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * data.taxRate) / 100;
    const total = subtotal - discountAmount + taxAmount;
    
    const totalsX = pageWidth - 20;
    let currentY = finalY + 15;
    
    doc.setFontSize(10);
    doc.text('Subtotal:', totalsX - 45, currentY, { align: 'right' });
    doc.text(`${BUSINESS_INFO.currency} ${subtotal.toFixed(2)}`, totalsX, currentY, { align: 'right' });
    
    if (data.discount > 0) {
      currentY += 7;
      doc.text(`Discount (${data.discount}%):`, totalsX - 45, currentY, { align: 'right' });
      doc.text(`-${BUSINESS_INFO.currency} ${discountAmount.toFixed(2)}`, totalsX, currentY, { align: 'right' });
    }
    
    if (data.taxRate > 0) {
      currentY += 7;
      doc.text(`Tax (${data.taxRate}%):`, totalsX - 45, currentY, { align: 'right' });
      doc.text(`${BUSINESS_INFO.currency} ${taxAmount.toFixed(2)}`, totalsX, currentY, { align: 'right' });
    }
    
    currentY += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Total Amount:', totalsX - 45, currentY, { align: 'right' });
    doc.text(`${BUSINESS_INFO.currency} ${total.toFixed(2)}`, totalsX, currentY, { align: 'right' });
    
    // Notes
    if (data.notes) {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Notes:', 20, finalY + 15);
      doc.text(data.notes, 20, finalY + 22, { maxWidth: 100 });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Unilyn Media. We appreciate your business!', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    
    doc.save(`Invoice_${data.invoiceNumber}.pdf`);
  };

  img.onerror = () => {
    console.error('Failed to load logo image');
  };
};

export const generateDeliveryNote = (data: InvoiceData) => {
  const doc = new jsPDF({
    compress: true
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const primaryColor = [180, 83, 9]; // Amber-700
  const secondaryColor = [75, 85, 99]; // Gray-600
  
  const img = new Image();
  img.src = logo;

  img.onload = () => {
    const imgWidth = 52.5;
    const imgHeight = 52.5;
    
    doc.addImage(img, 'PNG', 20, 15, imgWidth, imgHeight, undefined, 'FAST');
    
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text(BUSINESS_INFO.name, pageWidth - 20, 25, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(BUSINESS_INFO.website, pageWidth - 20, 32, { align: 'right' });
    doc.text(BUSINESS_INFO.email, pageWidth - 20, 37, { align: 'right' });
    doc.text(BUSINESS_INFO.phones.join(' / '), pageWidth - 20, 42, { align: 'right' });
    
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('DELIVERY NOTE', 20, 65);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Note #: DN-${data.invoiceNumber.replace('INV-', '')}`, pageWidth - 20, 65, { align: 'right' });
    doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, pageWidth - 20, 70, { align: 'right' });
    doc.text(`Ref Invoice: ${data.invoiceNumber}`, pageWidth - 20, 75, { align: 'right' });
    
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 80, pageWidth - 20, 80);
    
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('DELIVER TO:', 20, 95);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(data.client?.name || 'Client Name', 20, 102);
    doc.text(data.client?.address || 'Client Address', 20, 107);
    doc.text(data.client?.email || 'Client Email', 20, 112);
    doc.text(data.client?.phone || 'Client Phone', 20, 117);
    
    const tableData = data.items.map((item, index) => [
      (index + 1).toString(),
      item.description,
      item.quantity.toString(),
      '' // Space for receiver to check
    ]);
    
    autoTable(doc, {
      startY: 130,
      head: [['S/N', 'Description', 'Quantity', 'Received (Check)']],
      body: tableData,
      headStyles: { 
        fillColor: primaryColor as [number, number, number],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' }
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 170;
    
    // Signature area
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Received By:', 20, finalY + 30);
    doc.line(20, finalY + 45, 80, finalY + 45);
    doc.setFontSize(8);
    doc.text('Signature & Date', 20, finalY + 50);

    doc.setFontSize(10);
    doc.text('Delivered By:', pageWidth - 80, finalY + 30);
    doc.line(pageWidth - 80, finalY + 45, pageWidth - 20, finalY + 45);
    doc.setFontSize(8);
    doc.text('Signature & Date', pageWidth - 80, finalY + 50);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a delivery note for the items listed above.', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    
    doc.save(`DeliveryNote_${data.invoiceNumber}.pdf`);
  };

  img.onerror = () => {
    console.error('Failed to load logo image');
  };
};
