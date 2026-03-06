import { useEffect, useState } from 'react'
import { db } from './db'

export function useDb() {
  const [isClient, setIsClient] = useState(false)
  const [dbInstance, setDbInstance] = useState(null)

  useEffect(() => {
    setIsClient(true)
    setDbInstance(db)
  }, [])

  return {
    db: isClient ? dbInstance : null,
    isClient,
    isReady: isClient && dbInstance !== null
  }
}
