import { DataSource } from 'typeorm'
import { Character } from '../entities/character'
import initSqlJs from 'sql.js'
import localforage from 'localforage'
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react'
import { defaultData } from '../data/default-data'
// @ts-ignore
import wasm from 'sql.js/dist/sql-wasm.wasm?url'

import { useRequest } from 'ahooks'

//Reference: https://github.com/sql-js/react-sqljs-demo/blob/master/src/App.js
;(window as any).localforage = localforage

interface DatabaseContextProps {
  AppDataSource: DataSource
}

const DatabaseContext = createContext<DatabaseContextProps>({
  AppDataSource: {} as DataSource,
})

let AppDataSource: DataSource
export const DatabaseProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { data: value, loading } = useRequest(async () => {
    const SQL = await initSqlJs({
      locateFile: () => wasm,
    })
    AppDataSource = new DataSource({
      type: 'sqljs',
      driver: SQL,
      autoSave: true,
      entities: [Character],
      location: 'example_db',
      logging: ['query', 'schema'],
      useLocalForage: true,
      synchronize: true,
    })
    try {
      await AppDataSource.initialize()
    } catch (e) {
      console.error(e)
    }
    const repo = AppDataSource.getRepository(Character)
    const existed = await repo.find()
    if (existed.length === 0) {
      // populate default data
      const defaultCharacters = defaultData.map((dc) => {
        const character = new Character()
        character.firstRame223333 = dc.firstRame223333!
        character.last2Name333 = dc.last2Name333!
        character.country = dc.country!
        return character
      })
      await repo.save(defaultCharacters)
    }
    return AppDataSource
  }, {})

  return (
    <DatabaseContext.Provider
      value={{
        AppDataSource: value!,
      }}>
      {!loading && children}
    </DatabaseContext.Provider>
  )
}

export const useAppDataSource = () => {
  const { AppDataSource } = useContext(DatabaseContext)
  const userRepository = AppDataSource.getRepository(Character)

  async function createUser() {
    const newUser = userRepository.create({
      firstRame223333: Math.random().toString(),
      last2Name333: 'Doe',
      country: 'USA',
      created: new Date(),
      updated: new Date(),
    } as Character)

    await userRepository.save(newUser)
    return newUser
  }

  async function readUsers() {
    return userRepository.find()
  }

  async function updateUser(id: string) {
    const user = await userRepository.findOne({
      where: { id },
    })
    if (user) {
      user.firstRame223333 = Math.random().toString()
      await userRepository.save(user)
      return user
    }
    throw new Error('User not found')
  }

  async function deleteUser(id: string) {
    const user = await userRepository.findOne({
      where: { id },
    })

    if (user) {
      await userRepository.remove(user)
      return user
    }
    throw new Error('User not found')
  }

  return {
    AppDataSource,
    createUser,
    readUsers,
    updateUser,
    deleteUser,
  }
}

/**
 * Used outside the provider or in functions.
 */
export { AppDataSource }
