export type Severity = "Low" | "Medium" | "High";
export type Classification = "Phishing" | "Malware" | "Social Engineering" | "Safe";
 
export interface AnalysisResult {
  id: string;
  timestamp: number;
  inputType: "Email" | "URL" | "Message";
  preview: string;
  classification: Classification;
  severity: Severity;
  reason: string;
  recommendations: string[];
  pointsEarned: number;
}
 
export async function analyzeInput(
  input: string,
  inputType: "Email" | "URL" | "Message"
): Promise<AnalysisResult> {
  let classification: Classification = "Safe";
  let severity: Severity = "Low";
  let reason = "No suspicious patterns detected. Content appears safe.";
  let recommendations = [
    "Continue practicing safe browsing habits.",
    "Keep your software and antivirus up to date.",
    "Always double-check senders before responding.",
  ];
 
  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input, type: inputType }),
    });
 
    if (response.ok) {
      const data = await response.json();
      const classMap: Record<string, Classification> = {
        PHISHING: "Phishing",
        MALWARE: "Malware",
        SOCIAL_ENGINEERING: "Social Engineering",
        SAFE: "Safe",
      };
      const sevMap: Record<string, Severity> = {
        HIGH: "High",
        MEDIUM: "Medium",
        LOW: "Low",
      };
      classification = classMap[data.classification] ?? "Safe";
      severity = sevMap[data.severity] ?? "Low";
      reason = data.explanation ?? reason;
      recommendations = data.recommendations ?? recommendations;
    }
  } catch (e) {
    console.error("Backend error, using fallback", e);
    // Fallback to keyword detection if backend is down
    const lower = input.toLowerCase().trim();
    const PHISHING_KEYWORDS = ["password", "urgent", "click here", "verify account", "verify your account", "wire transfer", "gift card", "suspended", "act now", "confirm identity"];
    const SOCIAL_KEYWORDS = ["ceo", "boss", "favor", "secret", "between us"];
    const hasPhishing = PHISHING_KEYWORDS.some((k) => lower.includes(k));
    const hasSocial = SOCIAL_KEYWORDS.some((k) => lower.includes(k));
    const hasInsecureUrl = /http:\/\//.test(lower) && !/https:\/\//.test(lower);
    const hasSuspiciousDomain = /(bit\.ly|tinyurl|free-|login-|verify-|account-)/.test(lower);
 
    if (hasPhishing) {
      classification = "Phishing"; severity = "High";
      reason = "This message contains classic phishing markers: urgency language, requests for credentials, or links asking you to verify an account.";
      recommendations = ["Do NOT click any links or download attachments.", "Report the message to your IT/security team and delete it.", "If unsure, contact the sender through a verified channel."];
    } else if (hasInsecureUrl || hasSuspiciousDomain) {
      classification = "Malware"; severity = "Medium";
      reason = "The URL uses an insecure connection or matches a known suspicious pattern. These are commonly used to deliver malware.";
      recommendations = ["Do not visit the link from your work device.", "Hover to inspect the real destination before clicking.", "Use a URL scanner (e.g., VirusTotal) to verify safety."];
    } else if (hasSocial) {
      classification = "Social Engineering"; severity = "Medium";
      reason = "The content uses social-engineering cues such as impersonation of authority or secrecy requests.";
      recommendations = ["Verify the request via a separate, trusted channel.", "Never act on financial requests without dual approval.", "Report suspicious messages to security."];
    }
  }
 
  const pointsEarned = classification === "Safe" ? 10 : 15;
 
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    inputType,
    preview: input.slice(0, 120),
    classification,
    severity,
    reason,
    recommendations,
    pointsEarned,
  };
}
 
const STORAGE_KEY = "cybersense:state:v1";
 
export interface AppState {
  awarenessScore: number;
  history: AnalysisResult[];
  phishingSimsCompleted: number;
}
 
const defaultState: AppState = {
  awarenessScore: 42,
  history: seedHistory(),
  phishingSimsCompleted: 1,
};
 
function seedHistory(): AnalysisResult[] {
  const seeds: Array<Partial<AnalysisResult> & { hours: number }> = [
    { hours: 2, inputType: "Email", preview: "URGENT: Verify your account password immediately", classification: "Phishing", severity: "High" },
    { hours: 6, inputType: "URL", preview: "http://login-secure-update.com/auth", classification: "Malware", severity: "Medium" },
    { hours: 14, inputType: "Message", preview: "Hey, can you confirm tomorrow's meeting time?", classification: "Safe", severity: "Low" },
    { hours: 26, inputType: "Email", preview: "CEO request: please buy gift cards, keep this between us", classification: "Social Engineering", severity: "Medium" },
    { hours: 40, inputType: "URL", preview: "https://github.com/your-org/repo", classification: "Safe", severity: "Low" },
  ];
  return seeds.map((s) => ({
    id: crypto.randomUUID(),
    timestamp: Date.now() - s.hours * 3600_000,
    inputType: s.inputType!,
    preview: s.preview!,
    classification: s.classification!,
    severity: s.severity!,
    reason: "",
    recommendations: [],
    pointsEarned: s.classification === "Safe" ? 10 : 15,
  }));
}
 
export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}
 
export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
 
export function severityColor(s: Severity): string {
  return s === "High" ? "var(--cyber-red)" : s === "Medium" ? "var(--cyber-amber)" : "var(--cyber-green)";
}
 
export function classificationColor(c: Classification): string {
  switch (c) {
    case "Phishing": return "var(--cyber-red)";
    case "Malware": return "var(--cyber-violet)";
    case "Social Engineering": return "var(--cyber-amber)";
    case "Safe": return "var(--cyber-green)";
  }
}