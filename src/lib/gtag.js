export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "";

// Log page views
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag && GOOGLE_ADS_ID) {
    window.gtag("config", GOOGLE_ADS_ID, {
      page_path: url,
    });
  }
};

// Log generic events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Log Google Ads Lead Conversion event
export const trackLeadConversion = () => {
  if (typeof window !== "undefined" && window.gtag && GOOGLE_ADS_ID) {
    const conversionSendTo = GOOGLE_ADS_CONVERSION_LABEL 
      ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
      : GOOGLE_ADS_ID;
      
    window.gtag("event", "conversion", {
      send_to: conversionSendTo,
    });
    console.log("Google Ads Lead conversion event tracked:", conversionSendTo);
  }
};
