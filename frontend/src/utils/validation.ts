export function validateEmail(email: string): boolean {
  // HTML5 spec-compliant regex for email validation
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return pattern.test(email);
}

export function validatePassword(password: string): boolean {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return pattern.test(password);
}

export function validateName(name: string): boolean {
  const pattern = /^[가-힣a-zA-Z\s]{2,20}$/;
  return pattern.test(name);
}

export function validateNickname(nickname: string): boolean {
  const pattern = /^[가-힣a-zA-Z0-9]{3,15}$/;
  return pattern.test(nickname);
}

export function validatePhone(phone: string): boolean {
  const pattern = /^01[0-9]{8,9}$/;
  return pattern.test(phone.replace(/-/g, ''));
}
