export const BUSINESS_INFO = {
  name: "Unilyn Media",
  phones: ["+232 80069906", "+232 73 875656"],
  email: "info@unilynmedia.com",
  website: "www.unilynmedia.com",
  address: "Freetown, Sierra Leone",
  logoColor: "#B45309",
  currency: "SLE",
};

export const DEFAULT_INVOICE_DATA = {
  invoiceNumber: `INV-${new Date().getFullYear()}-001`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  client: {
    name: "",
    email: "",
    address: "",
    phone: "",
  },
  items: [
    { id: '1', description: "Media Production Services", quantity: 1, price: 0 },
  ],
  taxRate: 0,
  discount: 0,
  notes: "Thank you for your business!",
};
