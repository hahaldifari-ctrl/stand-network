const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003").replace(/\/+$/, "");

export interface Need {
  id: string;
  title: string;
  description: string;
  location: string;
  community?: string | null;
  status: string;
  urgency: string;
  verified: boolean;
  organization: {
    id: string;
    name: string;
    description?: string | null;
    location?: string | null;
    website?: string | null;
  };
  _count: {
    prayers: number;
    responses: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface PrayerResponse {
  id: string;
  message?: string | null;
  userId: string;
  needId: string;
  createdAt: string;
}

export type ResponseType =
  | "PRAYER"
  | "VOLUNTEER"
  | "MATERIAL"
  | "FINANCIAL"
  | "PARTNERSHIP";

export interface NeedResponse {
  id: string;
  type: ResponseType;
  message?: string | null;
  status: string;
  userId: string;
  needId: string;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   INCIDENTS
   ========================================================= */

export interface PublicIncident {
  id: string;
  title: string;
  description: string;
  state: string;
  lga?: string | null;
  community?: string | null;
  region?: string | null;
  incidentDate?: string | null;
  incidentType: string;
  motivation: string;
  religiousContext: string;
  status: string;
  confidenceLevel: string;
  affectedPeopleCount?: number | null;
  peopleKilled?: number | null;
  peopleAbducted?: number | null;
  peopleInjured?: number | null;
  peopleDisplaced?: number | null;
  propertyDamage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicIncidentDetail extends PublicIncident {
  verificationSummary?: string | null;
}

export interface PublicEvidenceSource {
  name?: string | null;
  sourceType?: string | null;
  title?: string | null;
  url?: string | null;
  publisher?: string | null;
  author?: string | null;
  publishedAt?: string | null;
}

export interface PublicEvidence {
  id: string;
  type: string;
  title?: string | null;
  description?: string | null;
  caption?: string | null;
  credit: string;
  license: string;
  contentRating: string;
  url: string;
  mimeType?: string | null;
  capturedAt?: string | null;
  createdAt: string;
  source?: PublicEvidenceSource | null;
}
export async function getNeeds(): Promise<Need[]> {
  const response = await fetch(`${API_BASE_URL}/needs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch needs: ${response.status}`);
  }

  return response.json();
}

export async function getNeed(id: string): Promise<Need> {
  const response = await fetch(
    `${API_BASE_URL}/needs/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("NEED_NOT_FOUND");
    }

    throw new Error(`Failed to fetch need: ${response.status}`);
  }

  return response.json();
}

export async function getIncidents(): Promise<PublicIncident[]> {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch incidents: ${response.status}`,
    );
  }

  return response.json();
}

export async function getIncident(
  id: string,
): Promise<PublicIncidentDetail> {
  const response = await fetch(
    `${API_BASE_URL}/incidents/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("INCIDENT_NOT_FOUND");
    }

    throw new Error(
      `Failed to fetch incident: ${response.status}`,
    );
  }

  return response.json();
}

export async function getIncidentEvidence(
  incidentId: string,
): Promise<PublicEvidence[]> {
  const response = await fetch(
    `${API_BASE_URL}/incidents/${encodeURIComponent(incidentId)}/evidence`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("INCIDENT_EVIDENCE_NOT_FOUND");
    }

    throw new Error(
      `Failed to fetch incident evidence: ${response.status}`,
    );
  }

  return response.json();
}
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("INVALID_CREDENTIALS");
    }

    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
}

function getAccessToken(): string {
  if (typeof window === "undefined") {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  const token = localStorage.getItem("stand_access_token");

  if (!token) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  return token;
}

export async function pray(
  needId: string,
  message?: string,
): Promise<PrayerResponse> {
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/needs/${encodeURIComponent(needId)}/pray`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: message || undefined,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    throw new Error(`Prayer failed: ${response.status}`);
  }

  return response.json();
}

export async function respondToNeed(
  needId: string,
  type: ResponseType,
  message?: string,
): Promise<NeedResponse> {
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/needs/${encodeURIComponent(needId)}/respond`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        message: message || undefined,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    throw new Error(`Response failed: ${response.status}`);
  }

  return response.json();
}
