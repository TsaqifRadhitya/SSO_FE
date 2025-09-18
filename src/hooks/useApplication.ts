import { useEffect, useState } from "react";
import { ApplicationType } from "../types/Application";
import { ApplicationRepository } from "../repository/ApplicationRepository";

export const useApplication = (intialApplication?: ApplicationType) => {
    const [application, setApplication] = useState<ApplicationType | undefined>(intialApplication)

    const [isLoading, setLoading] = useState<boolean>()

    const applicationRepository = new ApplicationRepository()

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
        isLoading,
        Delete,
        Update,
        Create,
        DeleteCallback,
        CreateCallback,
        UpdateCallback
    }
}