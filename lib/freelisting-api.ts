import { getUtmAttributionHeader } from "@/lib/utm-tracking";
import { getPublicApiBaseUrl } from "@/lib/api-env";

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

  const response = await fetch(`${getPublicApiBaseUrl()}/listing/submit`, {
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
