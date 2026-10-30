import { demoAccounts, sampleAppointments, sampleDoctors, samplePrescriptions } from "../data/sampleData.js";

export const STORAGE_KEYS = {
  accounts: "medora.demo.accounts",
  appointments: "medora.demo.appointments",
  prescriptions: "medora.demo.prescriptions",
  currentUser: "medora.demo.currentUser",
};

function read(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored === null) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    const value = JSON.parse(stored);
    return value;
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

export function getAccounts() {
  return read(STORAGE_KEYS.accounts, demoAccounts);
}

export function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
  announceChange(STORAGE_KEYS.accounts);
}

export function getAppointments() {
  return read(STORAGE_KEYS.appointments, sampleAppointments);
}

export function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  announceChange(STORAGE_KEYS.appointments);
}

export function getPrescriptions() {
  return read(STORAGE_KEYS.prescriptions, samplePrescriptions);
}

export function savePrescriptions(prescriptions) {
  localStorage.setItem(STORAGE_KEYS.prescriptions, JSON.stringify(prescriptions));
  announceChange(STORAGE_KEYS.prescriptions);
}

export function createId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

export function announceChange(key) {
  window.dispatchEvent(new CustomEvent("medora:data-updated", { detail: { key } }));
}

export function getDemoDoctors() {
  const accounts = getAccounts().filter((account) => account.role === "DOCTOR");
  const doctorProfiles = accounts.map((account) => {
    const sample = sampleDoctors.find((doctor) => doctor.id === account.id);
    const { password: _password, ...publicAccount } = account;
    return {
      ...(sample ?? {}),
      ...publicAccount,
      specialization: account.specialization ?? sample?.specialization ?? "General Medicine",
      initials: sample?.initials ?? account.name.split(" ").slice(-2).map((part) => part[0]).join(""),
      color: sample?.color ?? "blue",
    };
  });
  return doctorProfiles;
}
