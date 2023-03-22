import jwt from "jsonwebtoken";

class JwtService {
  encypt(data) {
    try {
      return jwt.sign(data, process.env.JWT_SECRET);
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async decrypt(token) {
    return (await jwt.verify(token, "secret")) || {};
  }
}

export default JwtService;
