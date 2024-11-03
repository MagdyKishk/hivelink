import user from "./model/user.validator";
import email from "./model/email.validator";
import password from "./model/password.validator";
import dream from "./model/dream.validator";

const validator = { user, email, password, dream };
export default validator;
