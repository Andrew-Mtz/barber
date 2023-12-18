export default (req, res, next) => {
  const { email, name, last_name, password } = req.body;

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
  }

  if (req.path === "/register") {
    if (![email, name, last_name, password].every(Boolean)) return res.status(409).json("Missing Credentials")
    if (!validEmail(email)) return res.status(409).json("Invalid email")
  }
  if (req.path === "/login") {
    if (![email, password].every(Boolean)) return res.status(409).json("Missing Credentials")
    if (!validEmail(email)) return res.status(409).json("Invalid email")
  }

  next();
}