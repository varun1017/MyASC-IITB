const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(5, "Username too short")
    .max(5, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
});

module.exports = { formSchema };