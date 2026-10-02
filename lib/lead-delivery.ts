export type LeadCaptureResult = { accepted: boolean; sheetLogged: boolean };

export async function deliverConsultingLead(tasks: {
  sendOwnerAlert: () => Promise<boolean>;
  logSheet: () => Promise<boolean>;
  sendAutoreply?: () => Promise<void>;
}): Promise<LeadCaptureResult> {
  let ownerAlerted = false;
  try {
    ownerAlerted = await tasks.sendOwnerAlert();
  } catch {
    ownerAlerted = false;
  }
  if (!ownerAlerted) return { accepted: false, sheetLogged: false };

  let sheetLogged = false;
  try {
    sheetLogged = await tasks.logSheet();
  } catch {
    sheetLogged = false;
  }

  if (tasks.sendAutoreply) {
    try {
      await tasks.sendAutoreply();
    } catch {
      // The owner alert has already been accepted; visitor email is best-effort.
    }
  }
  return { accepted: true, sheetLogged };
}
