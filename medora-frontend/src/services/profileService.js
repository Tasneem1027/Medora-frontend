import { getAccounts, saveAccounts } from "./localStore.js";

export function getProfile(user) {
  const account = getAccounts().find((item) => item.email === user.email) ?? user;
  const { password: _password, ...profile } = account;
  return profile;
}

export function updateProfile(user, details) {
  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.email === user.email);
  if (index < 0) throw new Error("Could not find this local demo account.");
  const email = details.email.trim().toLowerCase();
  if (
    !/^\S+@\S+\.\S+$/.test(email) ||
    accounts.some((account, accountIndex) => accountIndex !== index && account.email === email)
  ) {
    throw new Error("Enter a valid email address that is not already in use.");
  }
  accounts[index] = { ...accounts[index], ...details, email, role: user.role, id: user.id };
  saveAccounts(accounts);
  const { password: _password, ...profile } = accounts[index];
  return profile;
}
