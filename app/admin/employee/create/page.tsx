"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Option = { label: string; value: string };

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  required,
  buttonClassName,
}: {
  value: string;
  onChange: (next: string) => void;
  options: Option[];
  placeholder: string;
  required?: boolean;
  buttonClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label || "";
  }, [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = options.filter((o) => o.value !== "");
    if (!q) return list;
    return list.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={buttonClassName}
        aria-expanded={open}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-md border border-[#E7E7F4] bg-white shadow-lg">
          <div className="p-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 px-3 border border-blue-500 rounded-md text-sm outline-none"
              placeholder="Search..."
            />
          </div>
          <div className="max-h-64 overflow-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No results</div>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${o.value === value ? "text-blue-600" : "text-gray-700"}`}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {required && value === "" && (
        <div className="sr-only" aria-hidden="true">
          required
        </div>
      )}
    </div>
  );
}

export default function CreateEmployeePage() {
  const companies: Option[] = useMemo(
    () => [
      { label: "Select Company...", value: "" },
      { label: "Mecarvi Technologies", value: "mecarvi_tech" },
      { label: "Mecarvi Prints", value: "mecarvi_prints" },
      { label: "Printavji", value: "printavji" },
    ],
    []
  );

  const locations: Option[] = useMemo(
    () => [
      { label: "Select Location...", value: "" },
      { label: "Lahore", value: "lahore" },
      { label: "Karachi", value: "karachi" },
      { label: "Islamabad", value: "islamabad" },
    ],
    []
  );

  const departments: Option[] = useMemo(
    () => [
      { label: "Select Department...", value: "" },
      { label: "HR", value: "hr" },
      { label: "Marketing", value: "marketing" },
      { label: "Sales", value: "sales" },
      { label: "Production", value: "production" },
    ],
    []
  );

  const subDepartments: Option[] = useMemo(
    () => [
      { label: "Sub Department...", value: "" },
      { label: "Recruitment", value: "recruitment" },
      { label: "Content", value: "content" },
      { label: "Field Sales", value: "field_sales" },
    ],
    []
  );

  const designations: Option[] = useMemo(
    () => [
      { label: "Select Designation...", value: "" },
      { label: "Manager", value: "manager" },
      { label: "Team Lead", value: "team_lead" },
      { label: "Staff", value: "staff" },
    ],
    []
  );

  const officeShifts: Option[] = useMemo(
    () => [
      { label: "Select Office Shift...", value: "" },
      { label: "Day Shift", value: "day" },
      { label: "Night Shift", value: "night" },
    ],
    []
  );

  const genders: Option[] = useMemo(
    () => [
      { label: "Select Gender...", value: "" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    []
  );

  const maritalStatuses: Option[] = useMemo(
    () => [
      { label: "Select Marital Status...", value: "" },
      { label: "Single", value: "single" },
      { label: "Married", value: "married" },
    ],
    []
  );

  const roles: Option[] = useMemo(
    () => [
      { label: "Select Role...", value: "" },
      { label: "Admin", value: "admin" },
      { label: "Employee", value: "employee" },
      { label: "Manager", value: "manager" },
    ],
    []
  );

  const attendanceTypes: Option[] = useMemo(
    () => [
      { label: "Select Attendance Type...", value: "" },
      { label: "Office", value: "office" },
      { label: "Remote", value: "remote" },
      { label: "Hybrid", value: "hybrid" },
    ],
    []
  );

  const reportToOptions: Option[] = useMemo(
    () => [
      { label: "Reports To", value: "" },
      { label: "CEO", value: "ceo" },
      { label: "HR Manager", value: "hr_manager" },
      { label: "Operations Manager", value: "ops_manager" },
    ],
    []
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    company: "",
    location: "",
    department: "",
    subDepartment: "",
    designation: "",
    officeShift: "",
    username: "",
    role: "",
    password: "",
    confirmPassword: "",
    attendanceType: "",
    joiningDate: "",
    reportsTo: "",
    image: null as File | null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const labelCls = "block text-sm font-semibold text-[#8B8CB0] mb-2";
  const inputCls =
    "w-full h-11 px-4 border border-[#E7E7F4] rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const selectCls =
    "w-full h-11 px-4 pr-10 border border-[#E7E7F4] rounded-md bg-white text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex items-center justify-between";

  const requiredStar = <span className="text-red-500"> *</span>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const requiredKeys: Array<keyof typeof form> = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dob",
      "gender",
      "company",
      "location",
      "department",
      "designation",
      "officeShift",
      "username",
      "role",
      "password",
      "confirmPassword",
      "attendanceType",
      "joiningDate",
    ];

    const missing = requiredKeys.find((k) => {
      const v = form[k];
      if (typeof v !== "string") return false;
      return v.trim() === "";
    });

    if (missing) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="w-full">
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add Employee</h1>
          <div className="mt-1 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-gray-900">
              Admin
            </Link>
            <span className="mx-2">/</span>
            <Link href="/admin/employee" className="hover:text-gray-900">
              Employee
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Add</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
              Employee added (mock).
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  First Name{requiredStar}
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  className={inputCls}
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Last Name{requiredStar}
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  className={inputCls}
                  placeholder="Last Name"
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  Email{requiredStar}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={inputCls}
                  placeholder="example@example.com"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Phone{requiredStar}
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={inputCls}
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className={inputCls}
                  placeholder="Address"
                />
              </div>

              <div>
                <label className={labelCls}>
                  Date Of Birth{requiredStar}
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Gender{requiredStar}
                </label>
                <SearchableSelect
                  value={form.gender}
                  onChange={(next) => setForm((p) => ({ ...p, gender: next }))}
                  options={genders}
                  placeholder="Select Gender..."
                  required
                  buttonClassName={selectCls}
                />
              </div>
              <div>
                <label className={labelCls}>Marital Status</label>
                <SearchableSelect
                  value={form.maritalStatus}
                  onChange={(next) => setForm((p) => ({ ...p, maritalStatus: next }))}
                  options={maritalStatuses}
                  placeholder="Select Marital Status..."
                  buttonClassName={selectCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Company{requiredStar}
                </label>
                <SearchableSelect
                  value={form.company}
                  onChange={(next) => setForm((p) => ({ ...p, company: next }))}
                  options={companies}
                  placeholder="Select Company..."
                  required
                  buttonClassName={selectCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Location{requiredStar}
                </label>
                <SearchableSelect
                  value={form.location}
                  onChange={(next) => setForm((p) => ({ ...p, location: next }))}
                  options={locations}
                  placeholder="Select Location..."
                  required
                  buttonClassName={selectCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Department{requiredStar}
                </label>
                <SearchableSelect
                  value={form.department}
                  onChange={(next) => setForm((p) => ({ ...p, department: next }))}
                  options={departments}
                  placeholder="Select Department..."
                  required
                  buttonClassName={selectCls}
                />
              </div>
              <div>
                <label className={labelCls}>Sub Department</label>
                <SearchableSelect
                  value={form.subDepartment}
                  onChange={(next) => setForm((p) => ({ ...p, subDepartment: next }))}
                  options={subDepartments}
                  placeholder="Sub Department..."
                  buttonClassName={selectCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Designation{requiredStar}
                </label>
                <SearchableSelect
                  value={form.designation}
                  onChange={(next) => setForm((p) => ({ ...p, designation: next }))}
                  options={designations}
                  placeholder="Select Designation..."
                  required
                  buttonClassName={selectCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Office Shift{requiredStar}
                </label>
                <SearchableSelect
                  value={form.officeShift}
                  onChange={(next) => setForm((p) => ({ ...p, officeShift: next }))}
                  options={officeShifts}
                  placeholder="Select Office Shift..."
                  required
                  buttonClassName={selectCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Username{requiredStar}
                </label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className={inputCls}
                  placeholder="Unique Value"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Role{requiredStar}
                </label>
                <SearchableSelect
                  value={form.role}
                  onChange={(next) => setForm((p) => ({ ...p, role: next }))}
                  options={roles}
                  placeholder="Select Role..."
                  required
                  buttonClassName={selectCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Password{requiredStar}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className={inputCls}
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Confirm Password{requiredStar}
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className={inputCls}
                  placeholder="Re-type Password"
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  Attendance Type{requiredStar}
                </label>
                <SearchableSelect
                  value={form.attendanceType}
                  onChange={(next) => setForm((p) => ({ ...p, attendanceType: next }))}
                  options={attendanceTypes}
                  placeholder="Select Attendance Type..."
                  required
                  buttonClassName={selectCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Date Of Joining{requiredStar}
                </label>
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) => setForm((p) => ({ ...p, joiningDate: e.target.value }))}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Reports To</label>
                <SearchableSelect
                  value={form.reportsTo}
                  onChange={(next) => setForm((p) => ({ ...p, reportsTo: next }))}
                  options={reportToOptions}
                  placeholder="Reports To"
                  buttonClassName={selectCls}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-[#F8B701] hover:bg-[#E7A900] text-gray-900 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
