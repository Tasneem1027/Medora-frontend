import { createId, getAccounts, saveAccounts } from "./localStore.js";

export function login({ email, password }, expectedRole) {
  const account = getAccounts().find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!account || account.password !== password) {
    throw new Error("Email or password is incorrect.");
  }
  if (expectedRole && account.role !== expectedRole) {
    throw new Error(`This account is registered as a ${account.role.toLowerCase()}. Use the ${account.role.toLowerCase()} login instead.`);
  }
  const { password: _password, ...user } = account;
  return user;
}

export function register(details) {
  const accounts = getAccounts();
  const email = details.email.trim().toLowerCase();
  if (accounts.some((account) => account.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }
  const account = {
    ...details,
    id: createId(details.role === "DOCTOR" ? "doctor" : "patient"),
    name: details.name.trim(),
    email,
    phone: details.phone.trim(),
    role: details.role,
  };
  accounts.push(account);
  saveAccounts(accounts);
  const { password: _password, ...user } = account;
  return user;
}
