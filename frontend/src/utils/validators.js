function validateField(value, rules, setError) {
  for (const rule of rules) {
    const { condition, message } = rule;
    if (!condition(value)) {
      setError(message);
      return null;
    }
  }
  setError(null);
  return value;
}

export function notNullValidator(entry, setError) {
  return validateField(entry, [
    {
      condition: (value) => !!value,
      message: "Este campo é obrigatório!",
    },
  ], setError);
}

export function usernameValidator(username, setError) {
  return validateField(username, [
    {
      condition: (value) => value && value.length >= 4 && value.length <= 16,
      message: "Nome de usuário deve ter entre 4 e 16 caracteres!",
    },
  ], setError);
}

export function passwordValidator(password, setError) {
  return validateField(password, [
    {
      condition: (value) => value && value.length >= 8,
      message: "Senha deve ter no mínimo 8 caracteres!",
    },
  ], setError);
}

export function checkPasswordValidator(checkPassword, password, setError) {
  return validateField(checkPassword, [
    {
      condition: (value) => value && value === password,
      message: "Senhas incompatíveis!",
    },
  ], setError);
}

export function nameValidator(name, setError) {
  return validateField(name, [
    {
      condition: (value) => value && value.length <= 100,
      message: "Nome deve ter no máximo 100 caracteres!",
    },
  ], setError);
}

export function emailValidator(email, setError) {
  return validateField(email, [
    {
      condition: (value) => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Email inválido!",
    },
  ], setError);
}
