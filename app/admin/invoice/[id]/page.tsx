"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type InvoiceItem = {
  item: string;
  description: string;
  qty: number;
  price: number;
};

type Invoice = {
  invoiceNo: string;
  invoiceDate: string;
  invoiceDueDate: string;
  paymentTerms: string;
  status: "PAID" | "UNPAID";
  company: {
    name: string;
    addressLines: string[];
    phones: string[];
    emails: string[];
  };
  invoiceTo: {
    companyName: string;
    contactName: string;
    addressLines: string[];
    email: string;
  };
  items: InvoiceItem[];
  delivery: number;
  discount: number;
  taxRate: number;
  termsAndConditions: string;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const getMockInvoice = (id: string): Invoice => {
  return {
    invoiceNo: `IN-${id.toString().padStart(5, "0")}`,
    invoiceDate: "Jun 13 2024",
    invoiceDueDate: "Jul 13 2024",
    paymentTerms: "NET 30 DAYS",
    status: "PAID",
    company: {
      name: "MECARVI SIGNS",
      addressLines: ["335 Upper Riverdale Road", "Jonesboro GA 30236"],
      phones: ["877-854-5232", "404-495-4710"],
      emails: ["billing@mecarvisigns.com", "contact@mecarvisigns.com"],
    },
    invoiceTo: {
      companyName: "Hartsfield-Jackson Atlanta International Airport",
      contactName: "Chris Hodnicak",
      addressLines: ["6000 North Terminal Pkwy", "Atrium Suite 4000", "Atlanta GA 30320"],
      email: "chris.hodnicak@atl.com",
    },
    items: [
      {
        item: "PVC Board Signs",
        description: "Double Sided Printed 11x14 Engineering Grade PVC Board with Protective Film",
        qty: 14,
        price: 46.99,
      },
    ],
    delivery: 25,
    discount: 0,
    taxRate: 0,
    termsAndConditions:
      "15% late charge will apply after invoice payment due date. All custom signs are non-returnable and non-refundable. If signs issues are due to our error we will replace signs.",
  };
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "1";

  const invoice = useMemo(() => getMockInvoice(id), [id]);

  const rows = useMemo(() => {
    return invoice.items.map((it) => ({
      ...it,
      total: it.qty * it.price,
    }));
  }, [invoice.items]);

  const subTotal = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);
  const taxAmount = useMemo(() => (subTotal * invoice.taxRate) / 100, [invoice.taxRate, subTotal]);
  const grandTotal = useMemo(
    () => subTotal + invoice.delivery - invoice.discount + taxAmount,
    [invoice.delivery, invoice.discount, subTotal, taxAmount]
  );

  return (
    <div className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invoice</h1>
          <div className="mt-1 text-xs text-gray-500">Dashboard&nbsp;&nbsp;/&nbsp;&nbsp;Invoice</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/invoice"
            className="h-8 px-3 inline-flex items-center rounded-md bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium"
          >
            Back
          </Link>
          <button
            type="button"
            className="h-8 px-3 inline-flex items-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium"
          >
            PDF
          </button>
          <button
            type="button"
            className="h-8 px-3 inline-flex items-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium"
          >
            Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative bg-sky-500 h-[110px]">
          <div className="absolute left-8 top-[28px] flex items-center gap-4">
            <div className="w-16 h-12 bg-white/10 border border-white/25 rounded flex items-center justify-center">
              <span className="text-white font-bold">MS</span>
            </div>
            <div className="text-white font-semibold leading-tight">
              <div className="text-lg">MECARVI</div>
              <div className="text-xs tracking-widest opacity-90">SIGNS</div>
            </div>
          </div>

          <div
            className="absolute left-0 right-0 bottom-0 bg-white h-[78px]"
            style={{ clipPath: "polygon(0 0, 340px 0, 300px 100%, 0 100%, 100% 100%, 100% 0)" }}
          />

          <div className="absolute left-[320px] right-0 bottom-0 h-[78px] flex items-center">
            <div className="w-full px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="text-center">
                  <div className="text-gray-800 font-semibold mb-1">Address</div>
                  <div className="text-gray-600 leading-relaxed">
                    {invoice.company.addressLines.map((l) => (
                      <div key={l}>{l}</div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-800 font-semibold mb-1">Phone</div>
                  <div className="text-gray-600 leading-relaxed">
                    {invoice.company.phones.map((p) => (
                      <div key={p}>{p}</div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-800 font-semibold mb-1">Email</div>
                  <div className="text-gray-600 leading-relaxed">
                    {invoice.company.emails.map((e) => (
                      <div key={e}>{e}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="text-xs font-semibold text-gray-700">Invoice To:</div>
                <div className="mt-2 text-xs text-gray-700">
                  <div className="font-semibold">{invoice.invoiceTo.companyName}</div>
                  <div className="font-medium">{invoice.invoiceTo.contactName}</div>
                  <div className="mt-2 text-gray-600 leading-relaxed">
                    {invoice.invoiceTo.addressLines.map((l) => (
                      <div key={l}>{l}</div>
                    ))}
                    <div>{invoice.invoiceTo.email}</div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="text-4xl font-bold tracking-widest text-gray-200 select-none">INVOICE</div>
                <div className="ml-4 px-3 py-1 border-2 border-red-600 text-red-600 font-extrabold rounded text-2xl leading-none">
                  {invoice.status}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-sky-500 rounded-md px-6 py-4 text-white text-xs grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="opacity-90">Invoice No:</div>
                  <div className="mt-1 font-semibold">{invoice.invoiceNo}</div>
                </div>
                <div>
                  <div className="opacity-90">Invoice Date:</div>
                  <div className="mt-1 font-semibold">{invoice.invoiceDate}</div>
                </div>
                <div>
                  <div className="opacity-90">Invoice Due Date:</div>
                  <div className="mt-1 font-semibold">{invoice.invoiceDueDate}</div>
                </div>
                <div>
                  <div className="opacity-90">Payment Terms</div>
                  <div className="mt-1 font-semibold">{invoice.paymentTerms}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 text-[11px] font-semibold text-gray-700">
              <div className="col-span-6 px-4 py-3">Item</div>
              <div className="col-span-2 px-4 py-3 text-center">Qty</div>
              <div className="col-span-2 px-4 py-3 text-right">Price</div>
              <div className="col-span-2 px-4 py-3 text-right">Total</div>
            </div>

            {rows.map((r, idx) => (
              <div key={idx} className="grid grid-cols-12 border-t border-gray-200 bg-gray-50/60">
                <div className="col-span-6 px-4 py-3">
                  <div className="text-xs font-semibold text-gray-800">{r.item}</div>
                  <div className="mt-1 text-[11px] text-gray-500">{r.description}</div>
                </div>
                <div className="col-span-2 px-4 py-3 text-xs text-gray-700 text-center">{r.qty}</div>
                <div className="col-span-2 px-4 py-3 text-xs text-gray-700 text-right">{formatCurrency(r.price)}</div>
                <div className="col-span-2 px-4 py-3 text-xs text-gray-700 text-right">{formatCurrency(r.total)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-[420px]">
              <div className="grid grid-cols-2 text-xs">
                <div className="px-4 py-2 text-gray-700 font-semibold">Sub-Total</div>
                <div className="px-4 py-2 text-right text-gray-700 font-semibold">{formatCurrency(subTotal)}</div>

                <div className="px-4 py-2 text-gray-600">Delivery</div>
                <div className="px-4 py-2 text-right text-gray-600">{formatCurrency(invoice.delivery)}</div>

                <div className="px-4 py-2 text-rose-600">Discount</div>
                <div className="px-4 py-2 text-right text-rose-600">-{formatCurrency(invoice.discount)}</div>

                <div className="px-4 py-2 text-gray-600">Tax {invoice.taxRate}%</div>
                <div className="px-4 py-2 text-right text-gray-600">{formatCurrency(taxAmount)}</div>

                <div className="col-span-2 mt-2 bg-sky-500 text-white px-4 py-3 rounded-md grid grid-cols-2">
                  <div className="font-semibold">Grand Total</div>
                  <div className="text-right font-semibold">{formatCurrency(grandTotal)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border border-gray-200 bg-gray-50 rounded-md p-4">
            <div className="text-xs font-semibold text-gray-800">Terms & Conditions:</div>
            <div className="mt-2 text-[11px] text-gray-600 leading-relaxed">{invoice.termsAndConditions}</div>
          </div>

          <div className="mt-6 text-xs font-semibold text-gray-700">Thank you for your Business!</div>
        </div>
      </div>
    </div>
  );
}
