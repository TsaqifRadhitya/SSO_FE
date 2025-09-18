import { useEffect, useState } from "react";
import { ApplicationType } from "../types/Application";
import { ApplicationRepository } from "../repository/ApplicationRepository";
import { useRouter } from "next/router";

export const useApplication = (id?: string) => {
    const [application, setApplication] = useState<ApplicationType | undefined>()

    const [applications, setApplications] = useState<ApplicationType[] | undefined>()

    const [isLoading, setLoading] = useState<boolean>()

    const applicationRepository = new ApplicationRepository()

    const router = useRouter()

    useEffect(() => {
        const fetch = async () => {
            if (id) {
                try {
                    setLoading(true)
                    setApplication(await applicationRepository.Show(id))

                } catch {
                    router.replace("/404")
                } finally {
                    setLoading(false)
                    return
                }
            }
            try {
                setLoading(true)
                setApplications(await applicationRepository.Index())
            } finally {
                setLoading(false)
                return
            }
        }
        fetch()
    }, [id])

    const Delete = async (id: number): Promise<boolean> => {
        return false
    }

    const Update = async (application: ApplicationType): Promise<boolean> => {
        return true
    }

    const Create = async (): Promise<ApplicationType | undefined> => {
        return undefined
    }

    const DeleteCallback = async (application_id: number, callback_id: number): Promise<boolean> => {
        return true
    }

    const CreateCallback = async (application_id: number, callback: string): Promise<boolean> => {
        return true
    }

    const UpdateCallback = async (application: ApplicationType): Promise<boolean> => {
        return false
    }

    return {
        application,
        applications,
        isLoading,
        Delete,
        Update,
        Create,
        DeleteCallback,
        CreateCallback,
        UpdateCallback
    }
}