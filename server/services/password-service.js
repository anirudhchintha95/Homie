import bcrypt from "bcrypt";

class PasswordService {
  constructor(password) {
    this.password = password;
  }

  async encrypt() {
    const encryptedPassword = await bcrypt.hash(this.password, 16);
    return encryptedPassword;
  }

  async verify(encryptedPassword) {
    const isVerified = await bcrypt.compare(this.password, encryptedPassword);
    return isVerified;
  }
}

export default PasswordService;
