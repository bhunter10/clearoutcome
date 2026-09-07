import { cookies } from "next/headers";
import { getAdminAuth, isFirebaseAdminConfigured } from "../firebase/admin";

export const SESSION_COOKIE_NAME = "clearoutcome_admin_session";

export async function verifyAdminSession() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) {
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}
