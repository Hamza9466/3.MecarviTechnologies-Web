"use client";

import { useMemo, useState } from "react";
import LineItemsTable, { LineItem } from "@/components/admin/estimate/LineItemsTable";
import SearchableSelect from "@/components/admin/estimate/SearchableSelect";
import TotalsPanel from "@/components/admin/estimate/TotalsPanel";

const companies = [
  "Mecarvi Prints",
  "Mecarvi Technologies",
  "Mecarvi Consulting",
  "Mecarvi Signs",
  "Mecarvi Construction",
  "Mecarvi Rents",
  "Printavii",
  "Mecarvi Financial",
  "Mecarvi Realty",
  "Mecarvi",
  "Mecarvi Holdings Corporation",
  "Mecarvi Cares Foundation",
  "PrintsRush",
  "Powabylt",
  "PrintsDash",
  "Mecarvi Creatives",
];

const clients = [
  "John Smith",
  "Sarah Johnson",
  "Ahmed Khan",
  "Emily Davis",
  "Michael Brown",
  "Ayesha Ali",
];

const makeDefaultRow = (): LineItem => ({
  id: crypto.randomUUID(),
  item: "",
  description: "",
  qty: 1,
  unitPrice: 0,
  taxType: "",
});

export default function CreateEstimatePage() {
  const [estimateNumber, setEstimateNumber] = useState("E-0026");
  const [company, setCompany] = useState("");
  const [client, setClient] = useState("");
  const [accountNumber] = useState("Account No");
  const [estimateDate, setEstimateDate] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState("");

  const [productCategory, setProductCategory] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  const [productItems, setProductItems] = useState<LineItem[]>([makeDefaultRow()]);
  const [serviceItems, setServiceItems] = useState<LineItem[]>([makeDefaultRow()]);

  const [termsOpen, setTermsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [taglineOpen, setTaglineOpen] = useState(false);

  const [delivery, setDelivery] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [additionalChargesDescription, setAdditionalChargesDescription] = useState("");
  const [discountType, setDiscountType] = useState("flat");
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subTotal = useMemo(() => {
    const sum = (items: LineItem[]) => items.reduce((acc, it) => acc + (it.qty || 0) * (it.unitPrice || 0), 0);
    return sum(productItems) + sum(serviceItems);
  }, [productItems, serviceItems]);

  const taxRate = 0;

  const grandTotal = useMemo(() => {
    return subTotal + (delivery || 0) + (additionalCharges || 0) - (discountAmount || 0);
  }, [subTotal, delivery, additionalCharges, discountAmount]);

  const addProductItem = () => setProductItems((prev) => [...prev, makeDefaultRow()]);
  const addServiceItem = () => setServiceItems((prev) => [...prev, makeDefaultRow()]);

  const handleSubmit = () => {
    console.log("Submit Estimate", {
      estimateNumber,
      company,
      client,
      estimateDate,
      paymentDueDate,
      productCategory,
      serviceCategory,
      productItems,
      serviceItems,
      delivery,
      additionalCharges,
      additionalChargesDescription,
      discountType,
      discount,
      discountAmount,
      subTotal,
      taxRate,
      grandTotal,
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xs font-semibold text-gray-700 tracking-wide">CREATE ESTIMATE</h1>
        </div>

        <div className="px-6 py-5">
          {/* Header form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estimate Number</label>
              <input
                value={estimateNumber}
                onChange={(e) => setEstimateNumber(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>

            <SearchableSelect
              label="Company"
              placeholder="Select Company..."
              value={company}
              options={companies}
              onChange={setCompany}
            />

            <SearchableSelect
              label="Client"
              placeholder="Select Client..."
              value={client}
              options={clients}
              onChange={setClient}
            />

            <div>
              <label className="block text-xs text-gray-500 mb-1">Account Number</label>
              <input
                disabled
                value={accountNumber}
                className="w-full h-10 px-3 border border-gray-200 bg-gray-100 rounded-md text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estimate Date</label>
              <input
                type="date"
                value={estimateDate}
                onChange={(e) => setEstimateDate(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Payment Due Date</label>
              <input
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="my-6 border-t border-gray-200" />

          {/* Products categories */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-1">Products Categories</label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full md:w-80 h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
            >
              <option value="">Product Categories</option>
              <option value="prints">Prints</option>
              <option value="signs">Signs</option>
            </select>

            <div className="mt-3">
              {productItems.map((row) => (
                <div key={row.id} className="mb-3">
                  <LineItemsTable
                    items={[row]}
                    onChange={(updated) => {
                      setProductItems((prev) => prev.map((p) => (p.id === row.id ? updated[0] : p)));
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addProductItem}
              className="mt-2 inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium px-3 py-2 rounded-md"
            >
              <span className="text-base leading-none">+</span>
              Add Item
            </button>
          </div>

          {/* Services categories */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Services Categories</label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="w-full md:w-80 h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
            >
              <option value="">Services Categories</option>
              <option value="installation">Installation</option>
              <option value="design">Design</option>
            </select>

            <div className="mt-3">
              {serviceItems.map((row) => (
                <div key={row.id} className="mb-3">
                  <LineItemsTable
                    items={[row]}
                    onChange={(updated) => {
                      setServiceItems((prev) => prev.map((p) => (p.id === row.id ? updated[0] : p)));
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addServiceItem}
              className="mt-2 inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium px-3 py-2 rounded-md"
            >
              <span className="text-base leading-none">+</span>
              Add Item
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setTermsOpen((p) => !p)}
                className="w-full h-10 px-4 border border-gray-200 rounded-md text-left text-sm text-gray-700 flex items-center gap-2"
              >
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full border border-gray-300 text-gray-600 text-xs">
                  {termsOpen ? "-" : "+"}
                </span>
                Add Terms & Conditions
              </button>
              <button
                type="button"
                onClick={() => setNotesOpen((p) => !p)}
                className="w-full h-10 px-4 border border-gray-200 rounded-md text-left text-sm text-gray-700 flex items-center gap-2"
              >
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full border border-gray-300 text-gray-600 text-xs">
                  {notesOpen ? "-" : "+"}
                </span>
                Add Notes
              </button>
              <button
                type="button"
                onClick={() => setTaglineOpen((p) => !p)}
                className="w-full h-10 px-4 border border-gray-200 rounded-md text-left text-sm text-gray-700 flex items-center gap-2"
              >
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full border border-gray-300 text-gray-600 text-xs">
                  {taglineOpen ? "-" : "+"}
                </span>
                Add Tagline
              </button>

              <div className="pt-10">
                <label className="block text-xs text-gray-500 mb-1">Upload Files</label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md bg-white file:mr-4 file:h-10 file:px-4 file:border-0 file:rounded-l-md file:bg-gray-100 file:text-gray-900 file:font-medium"
                />
              </div>
            </div>

            {/* Right totals */}
            <TotalsPanel
              subTotal={subTotal}
              delivery={delivery}
              additionalCharges={additionalCharges}
              additionalChargesDescription={additionalChargesDescription}
              discountType={discountType}
              discount={discount}
              discountAmount={discountAmount}
              taxRate={taxRate}
              grandTotal={grandTotal}
              onChange={(patch) => {
                if (patch.delivery !== undefined) setDelivery(patch.delivery);
                if (patch.additionalCharges !== undefined) setAdditionalCharges(patch.additionalCharges);
                if (patch.additionalChargesDescription !== undefined)
                  setAdditionalChargesDescription(patch.additionalChargesDescription);
                if (patch.discountType !== undefined) setDiscountType(patch.discountType);
                if (patch.discount !== undefined) setDiscount(patch.discount);
                if (patch.discountAmount !== undefined) setDiscountAmount(patch.discountAmount);
              }}
            />
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
