import { setupConnection } from './database'

export async function createUser(username, email) {
  const connection = await setupConnection()
  const userRepository = connection.getRepository('User')
  const newUser = userRepository.create({ username, email })
  await userRepository.save(newUser)
  return newUser
}

export async function readUsers() {
  const connection = await setupConnection()
  const userRepository = connection.getRepository('User')
  return userRepository.find()
}

export async function updateUser(id, newUsername, newEmail) {
  const connection = await setupConnection()
  const userRepository = connection.getRepository('User')
  const user = await userRepository.findOne({ id })
  if (user) {
    user.username = newUsername
    user.email = newEmail
    await userRepository.save(user)
    return user
  }
  throw new Error('User not found')
}

export async function deleteUser(id) {
  const connection = await setupConnection()
  const userRepository = connection.getRepository('User')
  const user = await userRepository.findOne({ id })
  if (user) {
    await userRepository.remove(user)
    return user
  }
  throw new Error('User not found')
}
