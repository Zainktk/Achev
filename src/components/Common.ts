export interface EventDetails {
  id: number;
  global_id: string;
  global_id_lineage: string[];
  author: string;
  status: string;
  date: string;
  date_utc: string;
  modified: string;
  modified_utc: string;
  url: string;
  rest_url: string;
  title: string;
  description: string;
  excerpt: string;
  slug: string;
  image: ImageDetails;
  all_day: boolean;
  start_date: string;
  start_date_details: DateDetails;
  end_date: string;
  end_date_details: DateDetails;
  utc_start_date: string;
  utc_start_date_details: DateDetails;
  utc_end_date: string;
  utc_end_date_details: DateDetails;
  timezone: string;
  timezone_abbr: string;
  cost: string;
  cost_details: CostDetails;
  website: string;
  show_map: boolean;
  show_map_link: boolean;
  hide_from_listings: boolean;
  sticky: boolean;
  featured: boolean;
  categories: any[];
  tags: any[];
  venue: VenueDetails;
  organizer: any[];
  json_ld: JsonLd;
}

export interface ImageDetails {
  url: string;
  id: number;
  extension: string;
  width: number;
  height: number;
  filesize: number;
  sizes: ImageSizes;
}

export interface ImageSizes {
  medium: ImageSizeDetails;
  large: ImageSizeDetails;
  thumbnail: ImageSizeDetails;
  medium_large: ImageSizeDetails;
  "1536x1536": ImageSizeDetails;
  event_data: ImageSizeDetails;
  photo_team: ImageSizeDetails;
  cmplz_banner_image: ImageSizeDetails;
}

export interface ImageSizeDetails {
  width: number;
  height: number;
  "mime-type": string;
  filesize: number;
  url: string;
}

export interface DateDetails {
  year: string;
  month: string;
  day: string;
  hour: string;
  minutes: string;
  seconds: string;
}

export interface CostDetails {
  currency_symbol: string;
  currency_code: string;
  currency_position: string;
  values: any[];
}

export interface VenueDetails {
  id: number;
  author: string;
  status: string;
  date: string;
  date_utc: string;
  modified: string;
  modified_utc: string;
  url: string;
  venue: string;
  slug: string;
  json_ld: JsonLdVenue;
  show_map: boolean;
  show_map_link: boolean;
  global_id: string;
  global_id_lineage: string[];
}

export interface JsonLd {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string;
  url: string;
  eventAttendanceMode: string;
  eventStatus: string;
  startDate: string;
  endDate: string;
  location: JsonLdVenue;
  performer: string;
}

export interface JsonLdVenue {
  "@type": string;
  name: string;
  description: string;
  url: string;
  address: {
    "@type": string;
  };
  telephone: string;
  sameAs: string;
}
