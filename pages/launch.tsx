import { Box, Card, Container, Flex, Tabs, Title } from "@mantine/core"
import { GoalCard } from "../components"
import AppHeader from "../components/AppHeader"
import FAQ from "../components/FAQ"
import Message from "../components/Message"
import PackageCard from "../components/PackageCard"
import PledgeCard from "../components/PledgeCard"
import { useApp } from "../state"
import { packages } from "../state/packages"
import { useWeb3 } from "../state/web3"

export default function App() {
    const { currentTotalExpected, currentPercentage, pledgeAmount, setPledgeAmount } = useApp()
    const { deployments, currentChainId, account } = useWeb3()
    const wrongNetwork = currentChainId !== deployments.chainID

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100%",
                    backgroundImage: "url(/background.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1,
                }}
            ></div>
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    background: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
                p="lg"
            >
                <Flex bg="rgba(0, 0, 0, .3)" gap="md" direction="row" wrap="wrap" sx={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }} pr={20} pl={20}>
                    <Container sx={{ flex: 1 }} p={"xl"}>
                        <Card p={"sm"}>
                            <Tabs defaultValue="salvation">
                                <Tabs.List>
                                    <Tabs.Tab color="blue" value="salvation">
                                        Project Salvation
                                    </Tabs.Tab>
                                    <Tabs.Tab color="teal" value="faq">
                                        FAQ
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="salvation" mb={"-10px"}>
                                    <Message />
                                </Tabs.Panel>

                                <Tabs.Panel value="faq" pt="xs">
                                    <Flex>
                                        <FAQ />
                                    </Flex>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>
                    </Container>
                    <Container p={"xl"} sx={{ flex: 1, maxWidth: "400px" }}>
                        <GoalCard currentTotalExpected={currentTotalExpected} currentPercentage={currentPercentage}></GoalCard>
                        {account && !wrongNetwork && <PledgeCard pledgeAmount={pledgeAmount} setPledgeAmount={setPledgeAmount} />}
                        <Box>
                            <Title color={"white"} order={3}>
                                Reward Packages
                            </Title>
                            {packages &&
                                packages.map((pkg) => (
                                    <PackageCard {...pkg} backers={1} isReceiving={pledgeAmount >= pkg.minAmount} setPledgeAmount={setPledgeAmount} />
                                ))}
                        </Box>
                    </Container>
                </Flex>
            </Box>
        </>
    )
}
