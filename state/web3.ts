import { BigNumber, BigNumberish, ethers, utils } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { metamaskErrorHandling } from "../helpers/web3"
import { showNotification } from "@mantine/notifications"
import { CHAIN_ID, RECOVERY, USDT, BLOCK_EXPLORER_URL } from "./consts"

export enum MetaMaskState {
    NotInstalled,
    NotLoggedIn,
    Active,
}

export enum web3Constants {
    ethereumChainId = 1,
    binanceChainId = 56,
    goerliChainId = 5,
    bscTestNetChainId = 97,
}

const deployments = {
    chainID: CHAIN_ID,
    recovery: RECOVERY,
    usdt: USDT,
    blockExplorerURL: BLOCK_EXPLORER_URL,
}

interface AddEthereumChainParameter {
    chainId: string // A 0x-prefixed hexadecimal string
    chainName: string
    nativeCurrency: {
        name: string
        symbol: string // 2-6 characters long
        decimals: 18
    }
    rpcUrls: string[]
    blockExplorerUrls?: string[]
    iconUrls?: string[] // Currently ignored.
}

export const Web3Container = createContainer(() => {
    const addError = (title: string, msg: string, mins: number) => {
        showNotification({
            title: title,
            message: msg,
            color: "red",
            autoClose: mins * 1000,
        })
    }
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
    const [currentChainId, setCurrentChainId] = useState<number>()
    const [account, setAccount] = useState<string>()
    const [showSuccessPledge, setShowSuccessPledge] = useState<string>()
    const [metaMaskState, setMetaMaskState] = useState<MetaMaskState>(MetaMaskState.NotInstalled)
    const [block, setBlock] = useState<number>(-1)
    const [usdtBalance, setUsdtBalance] = useState<ethers.BigNumberish>()
    const [usdtAllowance, setUsdtAllowance] = useState<ethers.BigNumberish>()
    const [currentRound, setCurrentRound] = useState<ethers.BigNumberish>()
    const [currentRoundSupply, setCurrentRoundSupply] = useState<ethers.BigNumberish>()
    const [TXWaiting, setTXWaiting] = useState(false)
    const handleChainChange = useCallback((chainId: string) => {
        setCurrentChainId(parseInt(chainId))
    }, [])

    useEffect(() => {
        // Run on every new block
        if (provider && provider.listeners("block").length === 0) {
            provider.on("block", function (result) {
                setBlock(result)
            })
        }
    }, [provider, account])

    const handleAccountChange = useCallback(
        (accounts: string[]) => {
            if (accounts[0]) {
                setAccount(accounts[0])
                setMetaMaskState(MetaMaskState.Active)
            } else {
                setAccount(undefined)
                setMetaMaskState(provider ? MetaMaskState.NotInstalled : MetaMaskState.NotLoggedIn)
            }
        },
        [provider],
    )

    const connect = useCallback(async (): Promise<string> => {
        if (provider) {
            try {
                await provider.send("eth_requestAccounts", [])
                const signer = provider.getSigner()
                const acc = await signer.getAddress()
                setAccount(acc)
                handleAccountChange([acc])
                return acc
            } catch (error: any) {
                if (error instanceof Error) console.error(error.message, "error")

                //getting MM error, but the "Please authenticate your wallet" might suffice as well
                if (error.code && error.message) {
                    console.error(error.message)
                } else console.error("Please authenticate your wallet.")
            }
        }
        return ""
    }, [provider, handleAccountChange])

    const ETHEREUM_NETWORK: AddEthereumChainParameter = useMemo(
        () => ({
            chainId: "0x01",
            chainName: "Ethereum Mainnet",
            nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
            },
            rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
            blockExplorerUrls: ["https://etherscan.io"],
        }),
        [],
    )

    const GOERLI_TEST_NETWORK: AddEthereumChainParameter = useMemo(
        () => ({
            chainId: "0x5",
            chainName: "Goerli Test Network",
            nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
            },
            rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
            blockExplorerUrls: ["https://goerli.etherscan.io"],
        }),
        [],
    )

    const changeChain = async (chain: number) => {
        if (!provider) return

        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${chain.toString(16)}` }])
        } catch (error) {
            let chainParams: AddEthereumChainParameter
            switch (chain) {
                case web3Constants.ethereumChainId:
                    chainParams = ETHEREUM_NETWORK
                    break
                case web3Constants.goerliChainId:
                    chainParams = GOERLI_TEST_NETWORK
                    break
                default:
                    addError("Bad chain selected.", "Please select Ethereum mainnet.", 3)
                    return
            }
            await provider.send("wallet_addEthereumChain", [chainParams])
        }
    }

    useEffect(() => {
        if (provider) return // metamask connected
        ;(async () => {
            if (typeof (window as any).ethereum !== "undefined" || typeof (window as any).web3 !== "undefined") {
                const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any")
                setProvider(provider)
                setMetaMaskState(MetaMaskState.Active)
                const accounts = await provider.listAccounts()

                if (accounts.length !== 0) {
                    const signer = provider.getSigner()
                    const acc = await signer.getAddress()

                    setAccount(acc)
                } else {
                    setMetaMaskState(MetaMaskState.NotLoggedIn)
                }

                if ((window as any).ethereum) {
                    ;(window as any).ethereum.on("accountsChanged", handleAccountChange)
                    ;(window as any).ethereum.on("chainChanged", handleChainChange)
                }

                const response = await provider.getNetwork()
                setCurrentChainId(response.chainId)
            }
        })()

        return () => {
            if ((window as any).ethereum) (window as any).ethereum.removeAllListeners()
        }
    }, [provider, handleAccountChange, handleChainChange])

    useEffect(() => {
        try {
            const recoveryReadABI = [
                "function currentRound() public view returns (uint256)",
                "function recoveryMode() public view returns (bool)",
                "function fiatDeposits(uint256 round) public returns (uint256)",
                "function totalSupply(uint256 id) public returns (uint256)",
            ]
            if (!provider || !account) {
                addError("Wallet is not connected.", "Please connect your wallet.", 1)
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.recovery, recoveryReadABI, signer)
            contract.currentRound().then((roundNumber: ethers.BigNumberish) => {
                setCurrentRound(roundNumber.toString())
            })
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        }
    }, [block, account])
    const usdtUnapprove = async () => {
        if (!provider) return
        const abi = [`function approve(address _spender, uint256 _value) public returns (bool success)`]
        const signer = provider.getSigner()
        let usdt = new ethers.Contract(deployments.usdt, abi, signer)
        try {
            setTXWaiting(true)
            const tx = await usdt.approve(deployments.recovery, 0)
            await tx.wait()
        } catch (e) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        } finally {
            setTXWaiting(false)
        }
    }
    const usdtApprove = async () => {
        if (!provider) return
        const abi = [`function approve(address _spender, uint256 _value) public returns (bool success)`]
        const signer = provider.getSigner()
        let usdt = new ethers.Contract(deployments.usdt, abi, signer)
        try {
            setTXWaiting(true)
            const tx = await usdt.approve(deployments.recovery, ethers.constants.MaxUint256)
            await tx.wait()
        } catch (e) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        } finally {
            setTXWaiting(false)
        }
    }

    useEffect(() => {
        if (!account) return
        try {
            const ERC20ABI = [
                `function approve(address _spender, uint256 _value) public returns (bool success)`,
                `function allowance(address _owner, address _spender) public view returns (uint256 remaining)`,
                `function balanceOf(address _owner) public view returns (uint256 balance)`,
            ]
            if (!provider || !account) {
                addError("Wallet is not connected.", "Please connect your wallet.", 1)
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.usdt, ERC20ABI, signer)
            contract.allowance(account, deployments.recovery).then((allowance: ethers.BigNumberish) => {
                setUsdtAllowance(allowance.toString())
            })
            contract.balanceOf(account).then((balance: ethers.BigNumberish) => {
                setUsdtBalance(balance.toString())
            })
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        }
    }, [block, account])

    useEffect(() => {
        try {
            const recoveryReadABI = ["function totalSupply(uint256 id) public view returns (uint256)"]
            if (!provider || !account) {
                addError("Wallet is not connected.", "Please connect your wallet.", 1)
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.recovery, recoveryReadABI, signer)
            contract.totalSupply(currentRound).then((result: ethers.BigNumberish) => {
                setCurrentRoundSupply(result)
            })
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        }
    }, [currentRound, block])

    const userDeposit = async (amount: number, message: string) => {
        if (!provider) return
        if (!currentRound) return
        try {
            const bigAmount = utils.parseUnits(amount.toString(), 6) // 6 decimals for USDT
            const recoveryWriteABI = ["function UserDeposit(uint256 round, uint256 amount, string memory message) public"]
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.recovery, recoveryWriteABI, signer)
            setTXWaiting(true)
            const tx = await contract.UserDeposit(currentRound, bigAmount, message)
            await tx.wait()
            setShowSuccessPledge(tx.hash)
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        } finally {
            setTXWaiting(false)
        }
    }

    const userRefund = async (refundRound: ethers.BigNumberish) => {
        if (!provider) return
        try {
            const recoveryWriteABI = ["function UserRefund(uint256 refundRound) public notRecoveryMode"]
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.recovery, recoveryWriteABI, signer)
            setTXWaiting(true)
            const tx = await contract.UserDeposit(refundRound)
            await tx.wait()
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            throw err
        } finally {
            setTXWaiting(false)
        }
    }

    return {
        deployments,
        TXWaiting,
        usdtUnapprove,
        userDeposit,
        usdtApprove,
        usdtBalance,
        usdtAllowance,
        provider,
        currentChainId,
        account,
        metaMaskState,
        block,
        connect,
        changeChain,
        userRefund,
        currentRound,
        currentRoundSupply,
        showSuccessPledge,
        setShowSuccessPledge,
    }
})

export const Web3Provider = Web3Container.Provider
export const useWeb3 = Web3Container.useContainer
