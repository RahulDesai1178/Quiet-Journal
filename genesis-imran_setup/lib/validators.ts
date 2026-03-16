export type ActionState = {
  errors?: Record<string, string>;
  fields?: Record<string, string>;
  message?: string;
};

export const EMPTY_ACTION_STATE: ActionState = {};

const passwordMinLength = 8;
const titleMaxLength = 120;

export function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export function validateAuthFields(email: string, password: string): ActionState | null {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < passwordMinLength) {
    errors.password = `Password must be at least ${passwordMinLength} characters.`;
  }

  if (Object.keys(errors).length === 0) {
    return null;
  }

  return {
    errors,
    fields: {
      email,
    },
  };
}

export function validateJournalFields(title: string, content: string): ActionState | null {
  const errors: Record<string, string> = {};

  if (title.length > titleMaxLength) {
    errors.title = `Title must be ${titleMaxLength} characters or fewer.`;
  }

  if (!content.trim()) {
    errors.content = "Journal content cannot be empty.";
  }

  if (Object.keys(errors).length === 0) {
    return null;
  }

  return {
    errors,
    fields: {
      title,
      content,
    },
  };
}
