import email from "./email.validation";
import password from "./password.validation";
import user from "./user.validation";

const validator = { email, password, user } as const;
export default validator;