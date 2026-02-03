"use client";

import React from "react";

type Props = {
  subTotal: number;
  delivery: number;
  additionalCharges: number;
  additionalChargesDescription: string;
  discountType: string;
  discount: number;
  discountAmount: number;
  taxRate: number;
  grandTotal: number;
  onChange: (patch: {
    delivery?: number;
    additionalCharges?: number;
    additionalChargesDescription?: string;
    discountType?: string;
    discount?: number;
    discountAmount?: number;
  }) => void;
};

export default function TotalsPanel({
  subTotal,
  delivery,
  additionalCharges,
  additionalChargesDescription,
  discountType,
  discount,
  discountAmount,
  taxRate,
  grandTotal,
  onChange,
}: Props) {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="grid grid-cols-2">
        <div className="p-3 border-b border-gray-200 text-xs text-gray-600">Sub Total</div>
        <div className="p-3 border-b border-gray-200 text-xs text-gray-900">{subTotal}</div>

        <div className="p-3 border-b border-gray-200 text-xs text-gray-600">Delivery</div>
        <div className="p-2 border-b border-gray-200">
          <input
            type="number"
            value={delivery}
            onChange={(e) => onChange({ delivery: Number(e.target.value) })}
            className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          />
        </div>

        <div className="p-3 border-b border-gray-200 text-xs text-gray-600">Additional Charges</div>
        <div className="p-2 border-b border-gray-200">
          <input
            type="number"
            value={additionalCharges}
            onChange={(e) => onChange({ additionalCharges: Number(e.target.value) })}
            className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          />
        </div>

        <div className="p-3 border-b border-gray-200 text-xs text-gray-600">Additional Charges Description</div>
        <div className="p-2 border-b border-gray-200">
          <input
            value={additionalChargesDescription}
            onChange={(e) => onChange({ additionalChargesDescription: e.target.value })}
            className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="grid grid-cols-3 text-xs">
          <div className="p-3 border-b border-gray-200 font-medium text-gray-700">Discount Type</div>
          <div className="p-3 border-b border-gray-200 font-medium text-gray-700">Discount</div>
          <div className="p-3 border-b border-gray-200 font-medium text-gray-700">Discount Amount</div>

          <div className="p-2 border-b border-gray-200">
            <select
              value={discountType}
              onChange={(e) => onChange({ discountType: e.target.value })}
              className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900 bg-white"
            >
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="p-2 border-b border-gray-200">
            <input
              type="number"
              value={discount}
              onChange={(e) => onChange({ discount: Number(e.target.value), discountAmount: Number(e.target.value) })}
              className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
            />
          </div>
          <div className="p-2 border-b border-gray-200">
            <input
              disabled
              value={discountAmount}
              className="w-full h-9 px-3 border border-gray-200 bg-gray-100 rounded-sm text-sm text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="p-3 border-b border-gray-200 text-xs text-gray-600">Tax Rate</div>
        <div className="p-3 border-b border-gray-200 text-xs text-gray-900">{taxRate}</div>

        <div className="p-3 text-xs font-semibold text-gray-700">Grand Total</div>
        <div className="p-3 text-xs text-gray-900">{grandTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
