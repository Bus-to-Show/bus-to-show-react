const special = /[!@#$%^&*(),.?":{}|<>]/;
const upper = /[A-Z]/;
const lower = /[a-z]/;
const number = /\d/;

export const validatePasswordComplexity = (value) => {
  return value
    && value.length >= 8
    && lower.test(value)
    && upper.test(value)
    && number.test(value)
    && special.test(value);
};
