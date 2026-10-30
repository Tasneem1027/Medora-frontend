import { createId, getAppointments as readAppointments, saveAppointments } from "./localStore.js";

export function getAppointments() {
  return readAppointments();
}

export function createAppointment(details) {
  const appointments = readAppointments();
  const appointment = { ...details, id: createId("appointment"), status: "PENDING" };
  appointments.unshift(appointment);
  saveAppointments(appointments);
  return appointment;
}

export function updateAppointmentStatus(id, status) {
  const appointments = readAppointments();
  const updated = appointments.map((appointment) =>
    String(appointment.id ?? appointment.appointmentId) === String(id)
      ? { ...appointment, status }
      : appointment,
  );
  saveAppointments(updated);
  return updated.find((appointment) => String(appointment.id ?? appointment.appointmentId) === String(id));
}
