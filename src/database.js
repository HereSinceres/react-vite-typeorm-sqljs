import { createConnection, EntitySchema } from 'typeorm'
import localforage from 'localforage'

// 配置 LocalForage
const localForageInstance = localforage.createInstance({
  name: 'crud_database',
  storeName: 'user_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
})

// 定义用户实体
const User = new EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
  },
})

// 创建连接
async function setupConnection() {
  return createConnection({
    type: 'sqljs',
    autoSave: true,
    location: 'browser_crud_db',
    driver: localForageInstance,
    synchronize: true,
    entities: [User],
  })
}

export { User, setupConnection }
