import { getUtmAttributionHeader } from "@/lib/utm-tracking";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.bookby247.com/api";

export interface ListingPayload {
  mobile: string;
  name: string;
  designation: string;
  businessName: string;
  numberOfBranches: number;
  city: string;
  outletType: string;
  hearAboutUs?: string;
}

export const submitListing = async (data: ListingPayload) => {
  const attributionHeader = getUtmAttributionHeader();

  const response = await fetch(`${NEXT_PUBLIC_API_URL}/listing/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(attributionHeader ? { "X-UTM-Attribution": attributionHeader } : {}),
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw { response: { data: errorData } };
  }
  
  return response.json();
};
