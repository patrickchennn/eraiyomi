import jwt from 'jsonwebtoken'


/**
 * @desc Generate JWT
 */
const generateToken = (id: string) => {
  const JWT_SECRET = process.env.JWT_SECRET
  if(!JWT_SECRET) return console.error("process.env.JWT_SECRET is",JWT_SECRET)

  return jwt.sign(
    {id},
    JWT_SECRET,
    {
      expiresIn:'1h',
    }
  )
}

export default generateToken