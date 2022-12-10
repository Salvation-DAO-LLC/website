import { Button, Text, Progress, Card } from "@mantine/core"
import { ethers } from "ethers"

export const ConnectCard = () => {
    return (
        <Card
            withBorder
            radius="md"
            p="xl"
            mt={0}
            mb={20}
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
            })}
        >
            <Button variant="gradient" size={"xl"} gradient={{ from: "orange", to: "red" }} fullWidth>
                Connect Wallet
            </Button>
        </Card>
    )
}
