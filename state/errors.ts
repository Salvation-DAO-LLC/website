import { createContainer } from "unstated-next"
import { useState } from "react"
import { useLocalStorage } from "@mantine/hooks"

export interface AppError {
    title: string
    msg: string
    endsAt: Date
}

export interface ErrorState {
    errors: AppError[]
    addError: (title: string, msg: string, mins: number) => void
}

function useErrorState(): ErrorState {
    const [errors, setErrors] = useState<AppError[]>([])
    const addError = (title: string, msg: string, mins: number) => {
        setErrors((err) => [
            ...errors,
            {
                title,
                msg,
                endsAt: new Date(new Date().getTime() + mins * 60000),
            },
        ])
    }
    return {
        errors,
        addError,
    }
}

const ErrorContainer = createContainer(useErrorState)
export const ErrorsProvider = ErrorContainer.Provider
export const useErrors = ErrorContainer.useContainer
