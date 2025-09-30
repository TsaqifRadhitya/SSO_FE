import { create } from "zustand"
import { ConnectedApplicationType } from "../types/ConnectedApplication"
import { AccessLogType } from "../types/Loger"
import { useEffect } from "react"
import { UserRepository } from "../repository/UserRepository"
import { UnautencicatedException } from "../errors/UnautenticatedException"

interface useUserStateInterface {
    connectedApplication: ConnectedApplicationType[] | undefined
    accessLog: AccessLogType[] | undefined
    setLogger: (data: AccessLogType[]) => void
    setConnectedData: (data: ConnectedApplicationType[]) => void
    setInitiaData: (log: AccessLogType[], connectedApplication: ConnectedApplicationType[]) => void
}

const userRelatedData = create<useUserStateInterface>((state) => ({
    accessLog: undefined,
    connectedApplication: undefined,
    setConnectedData: (data) => state((prev) => ({ ...prev, connectedApplication: data })),
    setLogger: (data) => state((prev) => ({ ...prev, accessLog: data })),
    setInitiaData: (log, connectedApplication) => state({ accessLog: log, connectedApplication })
}))

export const useUser = () => {
    const { setInitiaData, accessLog, connectedApplication } = userRelatedData()
    const userRepository = new UserRepository()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const logger =  await userRepository.AccessLog()
                const connectedApplication = await userRepository.ConnectedApplication()
                setInitiaData(logger, connectedApplication)
            } catch (e: unknown) {
                if(e instanceof UnautencicatedException) return
                console.error(e)
            }
        }
        if (!accessLog && !connectedApplication) fetchData()
    }, [])

    return {
        accessLog,
        connectedApplication
    }
}