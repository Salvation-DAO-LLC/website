import { Box, Title, Button, Card, LoadingOverlay, NumberInput, Text, TextInput } from "@mantine/core"
import { ethers, utils } from "ethers"
import * as React from "react"
import { useWeb3 } from "../state/web3"
import { useCallback, useEffect, useRef, useState } from "react"
import { Modal } from "@mantine/core"

interface Props {
    pledgeAmount: number
    setPledgeAmount: (amount: number) => void
}

const PledgeCard = ({ pledgeAmount, setPledgeAmount }: Props) => {
    const [isPinned, setIsPinned] = useState<boolean>(false)
    const nodeRef = useRef<HTMLDivElement | undefined>(undefined)
    const {
        setShowSuccessPledge,
        showSuccessPledge,
        currentChainId,
        deployments,
        TXWaiting,
        userPledge,
        usdtApprove,
        usdtAllowance,
        usdtBalance,
        account,
        connect,
    } = useWeb3()
    const wrongNetwork = currentChainId !== deployments.chainID
    const showConnect = !wrongNetwork && !account && connect
    const showApprove = !wrongNetwork && !showConnect && usdtAllowance && usdtAllowance < utils.formatUnits(pledgeAmount, 6)
    const showContribute = !wrongNetwork && !showApprove && !showConnect
    const showWaiting = TXWaiting
    let disablePledgeButton = false
    let max = usdtBalance ? +utils.formatUnits(usdtBalance.toString(), 6) : undefined
    let min = 10
    if (usdtBalance) {
        disablePledgeButton = pledgeAmount > +utils.formatUnits(usdtBalance, 6)
    }
    if (pledgeAmount < min) {
        disablePledgeButton = true
    }
    const nodeCb = useCallback((node: HTMLDivElement) => {
        nodeRef.current = node
        function onScroll(event: Event) {
            if (!nodeRef.current) return
            const top = nodeRef.current.getClientRects()[0].top
            if (top < 11) {
                setIsPinned(true)
            } else {
                setIsPinned(false)
            }
        }
        if (nodeRef.current) {
            addEventListener("scroll", onScroll)
        } else {
            removeEventListener("scroll", onScroll)
        }
    }, [])

    return (
        <Card
            id={"pledge-card"}
            radius="md"
            mb={isPinned ? 0 : "lg"}
            sx={{ position: "sticky", top: "10px", zIndex: 5, boxShadow: "3px 5px 16px 2px rgba(0,0,0,0.52)" }}
            ref={nodeCb}
        >
            <LoadingOverlay visible={showWaiting} />
            <Modal
                centered
                transition="fade"
                opened={!!showSuccessPledge}
                transitionDuration={600}
                transitionTimingFunction="ease"
                title={<Title>Thankyou.</Title>}
                onClose={() => {
                    setShowSuccessPledge(undefined)
                }}
            >
                <Text>The Supremacy team appreciates your support.</Text>

                {showSuccessPledge && (
                    <a target="_blank" rel="noreferrer" href={`${deployments.blockExplorerURL}tx/${showSuccessPledge}`}>
                        View on Etherscan
                    </a>
                )}
            </Modal>
            <Card.Section p={isPinned ? "xs" : "lg"} pb={"sm"}>
                <>
                    {account && (
                        <NumberInput
                            max={max}
                            size={isPinned ? "sm" : "xl"}
                            radius="md"
                            defaultValue={pledgeAmount}
                            value={pledgeAmount}
                            onChange={(value: number) => {
                                if (value > 5000000) {
                                    setPledgeAmount(5000000)
                                    return
                                }
                                if (!value) {
                                    setPledgeAmount(0)
                                    return
                                }
                                setPledgeAmount(value)
                            }}
                            placeholder="Pledge amount"
                            label={!isPinned ? "Your Pledge Amount (USDT)" : undefined}
                            step={25}
                            min={min}
                            parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            formatter={(value: string | undefined) =>
                                !Number.isNaN(parseFloat(value || "0")) ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "$ "
                            }
                        />
                    )}
                    {usdtBalance && (
                        <Text
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                setPledgeAmount(+utils.formatUnits(usdtBalance, 6))
                            }}
                            align="right"
                        >
                            USDT: ${(+utils.formatUnits(usdtBalance, 6)).toLocaleString()}
                        </Text>
                    )}

                    {isPinned && showConnect && (
                        <Button
                            fullWidth
                            variant="gradient"
                            size={isPinned ? "sm" : "xl"}
                            radius="md"
                            gradient={{ from: "orange", to: "red" }}
                            mt={"1rem"}
                            onClick={() => connect()}
                        >
                            Connect Wallet
                        </Button>
                    )}
                    {showApprove && isPinned && (
                        <Button
                            disabled={pledgeAmount <= 0}
                            variant="gradient"
                            size={isPinned ? "sm" : "xl"}
                            gradient={{ from: "orange", to: "red" }}
                            fullWidth
                            onClick={() => usdtApprove()}
                        >
                            Approve USDT
                        </Button>
                    )}
                    {showContribute && isPinned && (
                        <Button
                            mt={"0.5rem"}
                            variant="gradient"
                            size={isPinned ? "sm" : "xl"}
                            gradient={{ from: "orange", to: "red" }}
                            fullWidth
                            onClick={() => {
                                userPledge(pledgeAmount)
                            }}
                            disabled={disablePledgeButton}
                        >
                            Make Pledge
                        </Button>
                    )}
                </>
            </Card.Section>
            <Card.Section pb={"sm"} pt={0} m={0}>
                <Text weight={400}>You will receive {pledgeAmount.toLocaleString()} Salvation DAO tokens.</Text>
            </Card.Section>

            {!isPinned && (
                <Card.Section pb={"sm"} pt={0} m={0}>
                    <>
                        {showApprove && (
                            <Button
                                disabled={pledgeAmount <= 0}
                                variant="gradient"
                                size={"xl"}
                                gradient={{ from: "orange", to: "red" }}
                                fullWidth
                                onClick={() => usdtApprove()}
                            >
                                Approve USDT
                            </Button>
                        )}
                        {showContribute && (
                            <Button
                                placeholder="Pledge message"
                                variant="gradient"
                                size={isPinned ? "sm" : "xl"}
                                gradient={{ from: "orange", to: "red" }}
                                fullWidth
                                disabled={disablePledgeButton}
                                onClick={async () => {
                                    try {
                                        userPledge(pledgeAmount)
                                    } catch (err) {
                                        console.error(err)
                                    }
                                }}
                            >
                                Make Pledge
                            </Button>
                        )}
                    </>
                </Card.Section>
            )}
            {/* <Web3Stuff pledgeAmount={pledgeAmount} message={""} /> */}
        </Card>
    )
}
const Web3Stuff = (props: { pledgeAmount: number; message: string }) => {
    const { TXWaiting, usdtUnapprove, userPledge, usdtApprove, usdtAllowance, usdtBalance, account, connect } = useWeb3()
    const showConnect = !account && connect
    const showApprove = !showConnect && usdtAllowance && usdtAllowance < utils.formatUnits(props.pledgeAmount, 6)
    const showContribute = !showApprove && !showConnect
    return (
        <div>
            <>
                <p>Web 3 tools for cut and paste:</p>
                <p>USDT Allowance: {usdtAllowance && usdtAllowance > 0 ? "Maximum" : "N/A"}</p>
                <p>USDT Contribution: {props.pledgeAmount}</p>
                <p>USDT Balance: {usdtBalance ? utils.formatUnits(usdtBalance.toString(), 6) : "N/A"}</p>
                {showConnect && (
                    <Button variant="gradient" size={"xl"} gradient={{ from: "orange", to: "red" }} fullWidth onClick={() => connect()}>
                        Connect
                    </Button>
                )}
                {showApprove && (
                    <Button variant="gradient" size={"xl"} gradient={{ from: "orange", to: "red" }} fullWidth onClick={() => usdtApprove()}>
                        Approve USDT
                    </Button>
                )}
                {showContribute && (
                    <Button
                        variant="gradient"
                        size={"xl"}
                        gradient={{ from: "orange", to: "red" }}
                        fullWidth
                        onClick={() => {
                            userPledge(props.pledgeAmount)
                        }}
                    >
                        Contribute
                    </Button>
                )}
                {!showApprove && (
                    <Button variant="gradient" size={"xl"} gradient={{ from: "orange", to: "red" }} fullWidth onClick={() => usdtUnapprove()}>
                        Unapprove USDT
                    </Button>
                )}
                {TXWaiting && "Loading..."}
            </>
        </div>
    )
}
export default PledgeCard
