"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type EstimateItem = {
  item: string;
  description: string;
  qty: number;
  price: number;
};

type Estimate = {
  estimateNo: string;
  estimateDate: string;
  company: {
    name: string;
    addressLines: string[];
    phone: string;
    email: string;
    website: string;
  };
  client: {
    name: string;
    addressLines: string[];
    email: string;
  };
  items: EstimateItem[];
  delivery: number;
  tax: number;
  discount: number;
};

const formatCurrency = (n: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
};

const getMockEstimate = (id: string): Estimate => {
  return {
    estimateNo: `#E-${id.toString().padStart(4, "0")}`,
    estimateDate: "May 17 2024",
    company: {
      name: "MECARVI SIGNS",
      addressLines: ["335 Upper Riverdale Road", "Jonesboro, GA 30236"],
      phone: "877-854-5232",
      email: "billing@mecarvisigns.com",
      website: "www.mecarvisigns.com",
    },
    client: {
      name: "Jerome Williams",
      addressLines: ["4261 Southmeadow E Pkwy", "Atlanta, GA 30349"],
      email: "djwilliams@martin-brower.com",
    },
    items: [
      {
        item: "Post and Panel Sign",
        description: "Exterior Aluminum Post and Panel Sign - Double Sided",
        qty: 1,
        price: 3187.83,
      },
    ],
    delivery: 50,
    tax: 277.87,
    discount: 0,
  };
};

export default function ViewEstimatePage() {
  const params = useParams();
  const id = (params?.id as string) || "4";

  const estimate = useMemo(() => getMockEstimate(id), [id]);

  const subTotal = useMemo(() => {
    return estimate.items.reduce((acc, it) => acc + it.qty * it.price, 0);
  }, [estimate.items]);

  const grandTotal = useMemo(() => {
    return subTotal + estimate.delivery + estimate.tax - estimate.discount;
  }, [subTotal, estimate.delivery, estimate.tax, estimate.discount]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Estimate</h1>
          <div className="mt-1 text-xs text-gray-500">Dashboard&nbsp;&nbsp;/&nbsp;&nbsp;Estimate</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/estimate"
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

      <div className="rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
        <div className="relative bg-sky-500 h-40">
          <div className="absolute inset-0 flex items-center pl-10">
            <div className="text-white/15 font-bold tracking-widest text-6xl select-none">ESTIMATE</div>
          </div>

          <div className="absolute right-0 top-0 h-full w-[320px] bg-sky-500">
            <div className="h-full px-6 py-5 border-l border-white/30 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/15 border border-white/25" />
                <div className="text-white font-semibold leading-tight">
                  <div className="text-sm">MS</div>
                  <div className="text-xs tracking-wide">MECARVI</div>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-white/95 leading-relaxed">
                <div className="font-semibold">{estimate.company.name}</div>
                {estimate.company.addressLines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
                <div>Phone: {estimate.company.phone}</div>
                <div>Email: {estimate.company.email}</div>
                <div>Website: {estimate.company.website}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 w-[260px]">
              <div className="text-xs font-semibold text-gray-800">Estimate To:</div>
              <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                <div className="font-medium text-gray-800">{estimate.client.name}</div>
                {estimate.client.addressLines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
                <div>{estimate.client.email}</div>
              </div>
            </div>

            <div className="text-right text-xs text-gray-600 leading-relaxed">
              <div>
                <span className="text-gray-500">Estimate No: </span>
                <span className="text-gray-900 font-semibold">{estimate.estimateNo}</span>
              </div>
              <div>
                <span className="text-gray-500">Estimate Date: </span>
                <span className="text-gray-900 font-semibold">{estimate.estimateDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-sky-500 text-white text-xs font-semibold">
              <div className="col-span-3 px-4 py-3">Item</div>
              <div className="col-span-5 px-4 py-3">Description</div>
              <div className="col-span-1 px-4 py-3 text-center">Qty</div>
              <div className="col-span-1 px-4 py-3 text-right">Price</div>
              <div className="col-span-2 px-4 py-3 text-right">Total</div>
            </div>

            {estimate.items.map((it, idx) => {
              const total = it.qty * it.price;
              return (
                <div
                  key={`${it.item}-${idx}`}
                  className="grid grid-cols-12 text-xs text-gray-700 border-t border-gray-200 bg-gray-50"
                >
                  <div className="col-span-3 px-4 py-3">{it.item}</div>
                  <div className="col-span-5 px-4 py-3">{it.description}</div>
                  <div className="col-span-1 px-4 py-3 text-center">{it.qty}</div>
                  <div className="col-span-1 px-4 py-3 text-right">{formatCurrency(it.price)}</div>
                  <div className="col-span-2 px-4 py-3 text-right">{formatCurrency(total)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[420px] border border-gray-200 rounded-md overflow-hidden">
              <div className="grid grid-cols-2 text-xs">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">
                  Sub Total
                </div>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-right text-gray-800">
                  {formatCurrency(subTotal)}
                </div>

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">
                  Delivery
                </div>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-right text-gray-800">
                  {formatCurrency(estimate.delivery)}
                </div>

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">Tax</div>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-right text-gray-800">
                  {formatCurrency(estimate.tax)}
                </div>

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">
                  Discount
                </div>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-right text-gray-800">
                  {formatCurrency(estimate.discount)}
                </div>

                <div className="px-4 py-3 bg-sky-500 text-white font-semibold">Grand Total</div>
                <div className="px-4 py-3 bg-sky-500 text-white font-semibold text-right">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
