export function emailValidation(email: string) {
  return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
}

export function nameValidation(name: string) {
  return name.match(/^[a-zA-Z]+/g);
}

export function passwordValidation(password: string) {
  return password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);
}
