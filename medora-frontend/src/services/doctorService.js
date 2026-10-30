import { getDemoDoctors } from "./localStore.js";

export function getDoctors() {
  return getDemoDoctors();
}

export function getDoctorById(id) {
  return getDemoDoctors().find((doctor) => String(doctor.id ?? doctor.doctorId) === String(id)) ?? null;
}
