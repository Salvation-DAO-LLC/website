import { createContainer } from "unstated-next"
import { useEffect, useState } from "react"
import { useLocalStorage } from "@mantine/hooks"

export interface AppState {
    currentAmount: number
    currentTotalExpected: number
    totalAmountRaised: number
    currentRound: number
    pledgeAmount: number
}

interface IApp extends AppState {
    currentPercentage: number
    setPledgeAmount: (amount: number) => void
}

function useAppState(
    initialState: AppState = { currentAmount: -1, totalAmountRaised: -1, currentTotalExpected: 300000, currentRound: 0, pledgeAmount: 100 },
): IApp {
    const [currentAmount, setCurrentAmount] = useState(initialState.currentAmount)
    const [totalAmountRaised, setTotalAmount] = useState(initialState.totalAmountRaised)
    const [currentTotalExpected, setCurrentTotalExpected] = useState(initialState.currentTotalExpected)
    const [currentRound, setCurrentRound] = useState(initialState.currentRound)
    const [pledgeAmount, setPledgeAmount] = useLocalStorage({ key: "pledgeAmount", defaultValue: `${initialState.pledgeAmount}` })
    useEffect(() => {
        if (isNaN(pledgeAmount as any)) {
            setPledgeAmount(initialState.pledgeAmount.toString())
        }
    }, [pledgeAmount])
    const [state, setState] = useState(initialState)
    return {
        ...state,
        currentPercentage: (100 * state.currentAmount) / state.currentTotalExpected,
        setPledgeAmount: (amount: number) => {
            setPledgeAmount(`${amount}`)
        },
        pledgeAmount: parseInt(pledgeAmount, 10),
    }
}

const AppContainer = createContainer(useAppState)
export const AppProvider = AppContainer.Provider
export const useApp = AppContainer.useContainer
