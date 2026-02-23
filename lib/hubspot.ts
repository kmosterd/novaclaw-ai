/**
 * HubSpot CRM v3 API client
 * Syncs blog subscribers and lead magnet downloads to HubSpot contacts.
 * Gracefully skips if HUBSPOT_ACCESS_TOKEN is not configured.
 */

const HUBSPOT_API_BASE = "https://api.hubapi.com";

function getAccessToken(): string | null {
  return process.env.HUBSPOT_ACCESS_TOKEN || null;
}

interface HubSpotContactProperties {
  email: string;
  firstname?: string;
  blog_subscriber?: string; // "true" / "false"
  lead_magnet_downloaded?: string; // e.g. "ai-agent-checklist"
  subscribe_source?: string; // "newsletter" | "lead_magnet" | "inline_cta"
  website?: string;
}

/**
 * Search for a HubSpot contact by email
 */
async function searchContactByEmail(
  email: string,
  token: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
          properties: ["email", "firstname"],
          limit: 1,
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.total > 0) {
      return data.results[0].id;
    }

    return null;
  } catch (error) {
    console.error("[HubSpot] Search error:", error);
    return null;
  }
}

/**
 * Create a new HubSpot contact
 */
async function createContact(
  properties: HubSpotContactProperties,
  token: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      console.error(
        "[HubSpot] Create error:",
        response.status,
        await response.text()
      );
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("[HubSpot] Create error:", error);
    return null;
  }
}

/**
 * Update an existing HubSpot contact
 */
async function updateContact(
  contactId: string,
  properties: Partial<HubSpotContactProperties>,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      }
    );

    if (!response.ok) {
      console.error(
        "[HubSpot] Update error:",
        response.status,
        await response.text()
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[HubSpot] Update error:", error);
    return false;
  }
}

/**
 * Sync a contact to HubSpot (fire-and-forget).
 * Searches for existing contact by email, creates or updates accordingly.
 * Gracefully skips if HUBSPOT_ACCESS_TOKEN is not set.
 */
export async function syncContactToHubSpot(
  email: string,
  properties: Omit<HubSpotContactProperties, "email"> = {}
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    console.log("[HubSpot] No access token configured — skipping sync");
    return;
  }

  try {
    const existingId = await searchContactByEmail(email, token);

    if (existingId) {
      // Update existing contact
      await updateContact(existingId, { ...properties, email }, token);
      console.log(`[HubSpot] Updated contact ${existingId} for ${email}`);
    } else {
      // Create new contact
      const newId = await createContact({ ...properties, email }, token);
      console.log(`[HubSpot] Created contact ${newId} for ${email}`);
    }
  } catch (error) {
    // Fire-and-forget: log but don't throw
    console.error("[HubSpot] Sync error:", error);
  }
}
