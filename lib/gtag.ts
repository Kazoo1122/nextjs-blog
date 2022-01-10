const GA_TRACKING_ID = process.env.GA_TRACKING_ID as string;

type GaEventProps = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

const event = ({ action, category, label, value }: GaEventProps) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export { GA_TRACKING_ID, pageview, event };
