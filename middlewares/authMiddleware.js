import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ type: "error", message: "Нет токена" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ type: "error", message: "Неверный токен" })
  }
}
