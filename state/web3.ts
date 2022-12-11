import { ethers, utils } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { metamaskErrorHandling } from "../helpers/web3"
import { showNotification } from "@mantine/notifications"
import { CHAIN_ID, SDG_TOKEN, USDT, BLOCK_EXPLORER_URL } from "./consts"

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
    sdgToken: SDG_TOKEN,
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
    const [totalPledged, setTotalPledged] = useState<ethers.BigNumber>()
    const [supplyCap, setSupplyCap] = useState<ethers.BigNumber>()
    const [totalSupply, setTotalSupply] = useState<ethers.BigNumber>()
    const [usdtAllowance, setUsdtAllowance] = useState<ethers.BigNumberish>()
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
        if (provider) return // on metamask connected
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

    // USDT mutations
    const usdtUnapprove = async () => {
        if (!provider) return
        const abi = [`function approve(address _spender, uint256 _value) public returns (bool success)`]
        const signer = provider.getSigner()
        let usdt = new ethers.Contract(deployments.usdt, abi, signer)
        try {
            setTXWaiting(true)
            const tx = await usdt.approve(deployments.sdgToken, 0)
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
            const tx = await usdt.approve(deployments.sdgToken, ethers.constants.MaxUint256)
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

    // USDT views
    useEffect(() => {
        if (!account) return
        try {
            const ERC20ABI = [
                `function allowance(address _owner, address _spender) public view returns (uint256 remaining)`,
                `function balanceOf(address _owner) public view returns (uint256 balance)`,
            ]
            if (!provider || !account) {
                addError("Wallet is not connected.", "Please connect your wallet.", 1)
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.usdt, ERC20ABI, signer)
            contract.allowance(account, deployments.sdgToken).then((allowance: ethers.BigNumberish) => {
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

    // SDG views
    useEffect(() => {
        try {
            const recoveryReadABI = ["function supply_cap() public view returns (uint256)", "function totalSupply() public view returns (uint256)"]
            if (!provider || !account) {
                addError("Wallet is not connected.", "Please connect your wallet.", 1)
                return
            }
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.sdgToken, recoveryReadABI, signer)
            contract.supply_cap().then((supplyCap: ethers.BigNumber) => {
                setSupplyCap(supplyCap)
            })
            contract.totalSupply().then((totalSupply: ethers.BigNumber) => {
                setTotalSupply(totalSupply)
                setTotalPledged(totalSupply.div(2))
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

    // SDG Mutations
    const userPledge = async (amount: number) => {
        if (!provider) return
        try {
            const bigAmount = utils.parseUnits(amount.toString(), 6) // 6 decimals for USDT
            const recoveryWriteABI = ["function UserPledge(uint256 amount) public"]
            const signer = provider.getSigner()
            const contract = new ethers.Contract(deployments.sdgToken, recoveryWriteABI, signer)
            setTXWaiting(true)
            const tx = await contract.UserPledge(bigAmount)
            await tx.wait()
            setShowSuccessPledge(tx.hash)
        } catch (e: any) {
            const err = metamaskErrorHandling(e)
            if (err) {
                addError("Error from MetaMask", err, 3)
            } else {
                addError("Something strange happened.", "Please try hard refreshing your browser.", 3)
            }
            console.error(e)

            throw err
        } finally {
            setTXWaiting(false)
        }
    }

    return {
        totalPledged,
        supplyCap,
        totalSupply,
        deployments,
        TXWaiting,
        usdtUnapprove,
        userPledge,
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
        showSuccessPledge,
        setShowSuccessPledge,
    }
})

export const Web3Provider = Web3Container.Provider
export const useWeb3 = Web3Container.useContainer
