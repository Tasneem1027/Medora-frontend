import { createId, getPrescriptions as readPrescriptions, savePrescriptions } from "./localStore.js";

export function getPrescriptions() {
  return readPrescriptions();
}

export function createPrescription(details) {
  const prescriptions = readPrescriptions();
  const prescription = { ...details, id: createId("prescription") };
  prescriptions.unshift(prescription);
  savePrescriptions(prescriptions);
  return prescription;
}
