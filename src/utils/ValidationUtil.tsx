

export const validateEmail = (email : string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
  return regex.test(password);
};

export const validatePasswordEntry = (
  password: string,
  name: string,
  email: string
): { msg: string; result: boolean } => {
  if (!validatePassword(password)) {
    return {
      msg: 'Password must be 8–20 characters and include uppercase, lowercase, number, and special character',
      result: false,
    };
  }

  if (name && password.toLowerCase().includes(name.toLowerCase())) {
    return {
      msg: "Password must not contain the user's name",
      result: false,
    };
  }

  if (email && password.toLowerCase().includes(email.toLowerCase())) {
    return {
      msg: "Password must not contain the user's email",
      result: false,
    };
  }

  return {
    msg: 'Password passed all checks',
    result: true,
  };
};