import { useEffect } from 'react'

import { useRequest } from 'ahooks'
import { DatabaseProvider, useAppDataSource } from './module/database-provider'

const Home = () => {
  const { createUser, readUsers, updateUser, deleteUser } = useAppDataSource()

  const {
    loading,
    data: characters,
    refresh,
  } = useRequest(readUsers, {
    manual: true,
  })

  useEffect(() => {
    refresh()
  }, [])
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <button
        onClick={async () => {
          await createUser()
          await refresh()
        }}>
        add
      </button>
      sdfsd
      {characters?.map((character) => {
        return (
          <div key={character.id}>
            <pre>{JSON.stringify(character, null, 2)}</pre>
            <button
              onClick={async () => {
                await updateUser(character.id)
                await refresh()
              }}>
              update
            </button>
            <button
              onClick={async () => {
                await deleteUser(character.id)
                await refresh()
              }}>
              delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

function App() {
  return (
    <DatabaseProvider>
      <div>
        Home <Home />
      </div>
    </DatabaseProvider>
  )
}

export default App
