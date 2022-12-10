import { AppProps } from "next/app"
import Head from "next/head"
import { Alert, MantineProvider, Modal } from "@mantine/core"
import { AppProvider, useApp } from "../state"
import { useWeb3, Web3Provider } from "../state/web3"
import React, { useEffect, useState } from "react"
import DAOHeader from "./_daoheader"
import { ErrorsProvider } from "../state/errors"

export default function App(props: AppProps) {
    return (
        <ErrorsProvider>
            <Web3Provider>
                <AppProvider>
                    <AppBody {...props} />
                </AppProvider>
            </Web3Provider>
        </ErrorsProvider>
    )
}

function AppBody({ Component, pageProps }: AppProps) {
    const { currentTotalExpected, currentPercentage, pledgeAmount, setPledgeAmount } = useApp()
    const { deployments, currentChainId, account } = useWeb3()
    const wrongNetwork = currentChainId !== deployments.chainID

    const [success, setSuccess] = useState<string | undefined | null>(undefined)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const success = urlParams.get("success")
        setSuccess(success)
    }, [])

    const [openModal, setOpenModal] = useState(!!success)

    return (
        <>
            <Head>
                <title>Salvation DAO</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <DAOHeader />
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: "light",
                }}
            >
                <Modal opened={openModal} onClose={() => setOpenModal(false)}>
                    <Alert title={"Payment Success"} color="green">
                        Thank you for your support!
                    </Alert>
                </Modal>
                <Component {...pageProps} />
            </MantineProvider>
        </>
    )
}
