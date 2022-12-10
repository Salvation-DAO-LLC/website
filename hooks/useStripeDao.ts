import { useEffect, useState } from "react"
import { PROPERTY_SERVER } from "../state/consts"
import { useErrors } from "../state/errors"

interface DaoStripe {
    status: "PENDING" | "SUCCESS" | "CANCELLED"
    price_usd: number
}

export const useStripeDao = () => {
    const { addError } = useErrors()
    const [totalStripeAmount, setTotalStripeAmount] = useState(0)

    useEffect(() => {
        ;(async () => {
            try {
                const res = await fetch(`${PROPERTY_SERVER}/dao/list/success`)
                const data = (await res.clone().json()) as DaoStripe[]
                let total = 0
                data.forEach((t) => {
                    total += t.price_usd
                })
                setTotalStripeAmount(total)
            } catch (error) {
                console.error(error)
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
        })()
    }, [])

    return {
        totalStripeAmount,
    }
}
