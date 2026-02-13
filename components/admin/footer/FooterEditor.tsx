"use client";

import { useState, useEffect } from "react";
import { getFooterData, setFooterData, DEFAULT_FOOTER_DATA, type FooterData, type FooterLink, type PaymentMethodItem, type FooterSectionHeadings } from "@/lib/footer-data";
import { fetchFooterFromApi, saveFooterToApi } from "@/lib/footer-api";

export default function FooterEditor() {
  const [headings, setHeadings] = useState<FooterSectionHeadings>(DEFAULT_FOOTER_DATA.sectionHeadings);
  const [contactPhone, setContactPhone] = useState(DEFAULT_FOOTER_DATA.contact.phone);
  const [hoursMonFri, setHoursMonFri] = useState(DEFAULT_FOOTER_DATA.contact.hoursMonFri);
  const [hoursSat, setHoursSat] = useState(DEFAULT_FOOTER_DATA.contact.hoursSat);
  const [hoursSunHolidays, setHoursSunHolidays] = useState(DEFAULT_FOOTER_DATA.contact.hoursSunHolidays);
  const [contactEmail, setContactEmail] = useState(DEFAULT_FOOTER_DATA.contact.email);
  const [chatTitle, setChatTitle] = useState(DEFAULT_FOOTER_DATA.contact.chatTitle);
  const [chatSubtitle, setChatSubtitle] = useState(DEFAULT_FOOTER_DATA.contact.chatSubtitle);

  const [companyLinks, setCompanyLinks] = useState<FooterLink[]>(DEFAULT_FOOTER_DATA.companyLinks);
  const [policyLinks, setPolicyLinks] = useState<FooterLink[]>(DEFAULT_FOOTER_DATA.policyLinks);
  const [brandLinks, setBrandLinks] = useState<FooterLink[]>(DEFAULT_FOOTER_DATA.brandLinks);

  const [facebookUrl, setFacebookUrl] = useState(DEFAULT_FOOTER_DATA.social.facebook);
  const [twitterUrl, setTwitterUrl] = useState(DEFAULT_FOOTER_DATA.social.twitter);
  const [instagramUrl, setInstagramUrl] = useState(DEFAULT_FOOTER_DATA.social.instagram);
  const [linkedinUrl, setLinkedinUrl] = useState(DEFAULT_FOOTER_DATA.social.linkedin);
  const [tiktokUrl, setTiktokUrl] = useState(DEFAULT_FOOTER_DATA.social.tiktok);

  const [copyrightText, setCopyrightText] = useState(DEFAULT_FOOTER_DATA.copyrightText);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>(DEFAULT_FOOTER_DATA.paymentMethods);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyData = (data: FooterData) => {
    setHeadings(data.sectionHeadings);
    setContactPhone(data.contact.phone);
    setHoursMonFri(data.contact.hoursMonFri);
    setHoursSat(data.contact.hoursSat);
    setHoursSunHolidays(data.contact.hoursSunHolidays);
    setContactEmail(data.contact.email);
    setChatTitle(data.contact.chatTitle);
    setChatSubtitle(data.contact.chatSubtitle);
    setCompanyLinks(data.companyLinks);
    setPolicyLinks(data.policyLinks);
    setBrandLinks(data.brandLinks);
    setFacebookUrl(data.social.facebook);
    setTwitterUrl(data.social.twitter);
    setInstagramUrl(data.social.instagram);
    setLinkedinUrl(data.social.linkedin);
    setTiktokUrl(data.social.tiktok);
    setPaymentMethods(data.paymentMethods);
    setCopyrightText(data.copyrightText);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchFooterFromApi()
      .then((apiData) => {
        if (cancelled) return;
        const data = apiData ?? getFooterData();
        applyData(data);
      })
      .catch(() => {
        if (!cancelled) applyData(getFooterData());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    const data: FooterData = {
      sectionHeadings: headings,
      contact: {
        phone: contactPhone,
        hoursMonFri,
        hoursSat,
        hoursSunHolidays,
        email: contactEmail,
        chatTitle,
        chatSubtitle,
      },
      companyLinks,
      policyLinks,
      brandLinks,
      social: { facebook: facebookUrl, twitter: twitterUrl, instagram: instagramUrl, linkedin: linkedinUrl, tiktok: tiktokUrl },
      paymentMethods,
      copyrightText,
    };
    try {
      const updated = await saveFooterToApi(data);
      applyData(updated);
      setFooterData(updated);
      setSuccess("Footer saved successfully. The website will show the updated content.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save footer.");
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (links: FooterLink[], setLinks: (v: FooterLink[]) => void, index: number, field: "label" | "url", value: string) => {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    setLinks(next);
  };

  const addLink = (setLinks: (v: FooterLink[]) => void, links: FooterLink[]) => setLinks([...links, { label: "", url: "" }]);
  const removeLink = (setLinks: (v: FooterLink[]) => void, links: FooterLink[], index: number) => setLinks(links.filter((_, i) => i !== index));

  const setHeading = (key: keyof FooterSectionHeadings, value: string) => setHeadings((h) => ({ ...h, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading footer…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Footer Content</h2>

      {/* CONTACT INFO */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label className="block text-xs font-medium text-black mb-1">Section heading (shown on footer)</label>
          <input type="text" value={headings.contactInfo} onChange={(e) => setHeading("contactInfo", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="CONTACT INFO" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Phone</label>
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="(877) 853-3484" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="contact@mecarviprints.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Hours (Mon - Fri)</label>
            <input type="text" value={hoursMonFri} onChange={(e) => setHoursMonFri(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Mon - Fri: 8am - 8pm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Hours (Sat)</label>
            <input type="text" value={hoursSat} onChange={(e) => setHoursSat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Sat: 10am-6pm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Hours (Sun & Public Holidays)</label>
            <input type="text" value={hoursSunHolidays} onChange={(e) => setHoursSunHolidays(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Sun & Public Holidays: CLOSED" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Chat Title</label>
            <input type="text" value={chatTitle} onChange={(e) => setChatTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Chat With Us" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">Chat Subtitle</label>
            <input type="text" value={chatSubtitle} onChange={(e) => setChatSubtitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="24/7 Customer Support" />
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-black mb-1">Section heading</label>
            <input type="text" value={headings.company} onChange={(e) => setHeading("company", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="COMPANY" />
          </div>
          <button type="button" onClick={() => addLink(setCompanyLinks, companyLinks)} className="shrink-0 w-9 h-9 rounded-lg border-2 border-dashed border-gray-400 text-gray-500 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center font-bold text-xl" title="Add link">+</button>
        </div>
        <div className="space-y-3">
          {companyLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input type="text" value={link.label} onChange={(e) => updateLink(companyLinks, setCompanyLinks, i, "label", e.target.value)} className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Label" />
              <input type="text" value={link.url} onChange={(e) => updateLink(companyLinks, setCompanyLinks, i, "url", e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="URL" />
              <button type="button" onClick={() => removeLink(setCompanyLinks, companyLinks, i)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Remove">×</button>
            </div>
          ))}
        </div>
      </section>

      {/* POLICY CENTER */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-black mb-1">Section heading</label>
            <input type="text" value={headings.policyCenter} onChange={(e) => setHeading("policyCenter", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="POLICY CENTER" />
          </div>
          <button type="button" onClick={() => addLink(setPolicyLinks, policyLinks)} className="shrink-0 w-9 h-9 rounded-lg border-2 border-dashed border-gray-400 text-gray-500 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center font-bold text-xl" title="Add link">+</button>
        </div>
        <div className="space-y-3">
          {policyLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input type="text" value={link.label} onChange={(e) => updateLink(policyLinks, setPolicyLinks, i, "label", e.target.value)} className="w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Label" />
              <input type="text" value={link.url} onChange={(e) => updateLink(policyLinks, setPolicyLinks, i, "url", e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="URL" />
              <button type="button" onClick={() => removeLink(setPolicyLinks, policyLinks, i)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Remove">×</button>
            </div>
          ))}
        </div>
      </section>

      {/* OUR BRANDS */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-black mb-1">Section heading</label>
            <input type="text" value={headings.ourBrands} onChange={(e) => setHeading("ourBrands", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="OUR BRANDS" />
          </div>
          <button type="button" onClick={() => addLink(setBrandLinks, brandLinks)} className="shrink-0 w-9 h-9 rounded-lg border-2 border-dashed border-gray-400 text-gray-500 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center font-bold text-xl" title="Add link">+</button>
        </div>
        <div className="space-y-3">
          {brandLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input type="text" value={link.label} onChange={(e) => updateLink(brandLinks, setBrandLinks, i, "label", e.target.value)} className="w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Label" />
              <input type="text" value={link.url} onChange={(e) => updateLink(brandLinks, setBrandLinks, i, "url", e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="URL" />
              <button type="button" onClick={() => removeLink(setBrandLinks, brandLinks, i)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Remove">×</button>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label className="block text-xs font-medium text-black mb-1">Section heading</label>
          <input type="text" value={headings.socialLinks} onChange={(e) => setHeading("socialLinks", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="SOCIAL LINKS" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Facebook URL</label>
            <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Twitter / X URL</label>
            <input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="https://twitter.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Instagram URL</label>
            <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">LinkedIn URL</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="https://linkedin.com/..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">TikTok URL</label>
            <input type="url" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="https://tiktok.com/..." />
          </div>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label className="block text-xs font-medium text-black mb-1">Section heading</label>
          <input type="text" value={headings.paymentMethods} onChange={(e) => setHeading("paymentMethods", e.target.value)} className="text-lg font-semibold text-black uppercase w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="PAYMENT METHODS" />
        </div>
        <p className="text-sm text-black mb-4">Toggle which methods to show and set their order. Leave image URL empty to use the default icon.</p>
        <div className="space-y-3">
          {paymentMethods.map((pm, i) => (
            <div key={pm.id} className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <label className="flex items-center gap-2 shrink-0">
                <input
                  type="checkbox"
                  checked={pm.enabled}
                  onChange={(e) => {
                    const next = [...paymentMethods];
                    next[i] = { ...next[i], enabled: e.target.checked };
                    setPaymentMethods(next);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="font-medium text-black w-28">{pm.label}</span>
              </label>
              <input
                type="text"
                value={pm.label}
                onChange={(e) => {
                  const next = [...paymentMethods];
                  next[i] = { ...next[i], label: e.target.value };
                  setPaymentMethods(next);
                }}
                className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                placeholder="Display name"
              />
              <input
                type="url"
                value={pm.imageUrl ?? ""}
                onChange={(e) => {
                  const next = [...paymentMethods];
                  next[i] = { ...next[i], imageUrl: e.target.value.trim() || undefined };
                  setPaymentMethods(next);
                }}
                className="flex-1 min-w-[180px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                placeholder="Custom icon URL (optional)"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    if (i === 0) return;
                    const next = [...paymentMethods];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    setPaymentMethods(next);
                  }}
                  className="p-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === paymentMethods.length - 1}
                  onClick={() => {
                    if (i === paymentMethods.length - 1) return;
                    const next = [...paymentMethods];
                    [next[i], next[i + 1]] = [next[i + 1], next[i]];
                    setPaymentMethods(next);
                  }}
                  className="p-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COPYRIGHT */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Copyright Text</label>
          <input type="text" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black" placeholder="Copyright © 2015-2025 by Mecarvi Holdings Group. All Rights Reserved." />
        </div>
      </section>

      {(success || error) && (
        <p className={error ? "text-red-600 text-sm font-medium" : "text-green-600 text-sm font-medium"}>{error || success}</p>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
          {saving ? "Saving…" : "Save Footer"}
        </button>
      </div>
    </div>
  );
}
