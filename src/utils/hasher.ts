import bcrypt from 'bcrypt';

const hasher = async (str: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(str, salt);
}

export default hasher;