import { Card, Image, Text, Badge, Button, Group, ThemeIcon, createStyles, Box } from "@mantine/core"

interface PackageProps extends IPackage {
    backers: number
    isReceiving: boolean
    setPledgeAmount: (amount: number) => void
}

import { List } from "@mantine/core"
import { IconCircleDashed } from "@tabler/icons"
import { IPackage } from "../state/packages"

const useStyles = createStyles((theme, _params: any) => ({
    card: {
        backgroundColor: _params.isReceiving ? theme.colors.violet : theme.white,
        cursor: "pointer",
        color: _params.isReceiving ? theme.white : "black",
        backgroundImage: _params.isReceiving ? `url(${_params.imgURL})` : "unset",
        backgroundPosition: _params.isReceiving ? "top" : "center",
        backgroundSize: "cover",
        borderWidth: "1px",
        borderStyle: "soliu",
        borderColor: _params.isReceiving ? theme.colors.green[6] : "1px solid rgba(255,255,255,0.5)",
    },

    image: {
        display: _params.isReceiving ? "none" : "block",
        backgroundImage: `url(${_params.imgURL})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        height: "200px",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    main: {
        backgroundColor: _params.isReceiving ? "rgba(0,0,0,0.8)" : "unset",
    },

    get: {
        color: theme.colors.green[6],
    },

    label: {
        textTransform: "uppercase",
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}))

function PackageCard({ name, description, contains, badge, badgeColor, minAmount, imgURL, isReceiving, setPledgeAmount }: PackageProps) {
    const { classes, theme } = useStyles({ isReceiving, imgURL })

    return (
        <Card
            shadow="sm"
            p={0}
            radius="md"
            m={"sm"}
            className={classes.card}
            withBorder
            onClick={() => {
                setPledgeAmount(minAmount)
            }}
        >
            <Card.Section className={classes.image} />
            <Card.Section className={classes.main} p={"sm"}>
                <Group position="apart" mt={isReceiving ? 0 : "md"} mb={isReceiving ? 0 : "xs"}>
                    <Text weight={500} m={0}>
                        {name}
                    </Text>
                    <Text weight={300} m={0}>
                        ${minAmount.toLocaleString()}
                    </Text>
                    {badge && (
                        <Badge color={badgeColor || "pink"} variant="light">
                            {badge}
                        </Badge>
                    )}
                </Group>
                {contains && contains.length > 9 && (
                    <List
                        spacing="xs"
                        size="sm"
                        center
                        icon={
                            <ThemeIcon color="blue" size={24} radius="xl">
                                <IconCircleDashed size={16} />
                            </ThemeIcon>
                        }
                    >
                        {contains.map((item, i) => (
                            <List.Item key={`${item}-${i}`}>{item}</List.Item>
                        ))}
                    </List>
                )}

                <Text size="sm" color="dimmed">
                    {description}
                </Text>
                {isReceiving && (
                    <Box p={0} m={0}>
                        <Text size={12} align={"right"} className={classes.get}>
                            You'll get this
                        </Text>
                    </Box>
                )}
            </Card.Section>
        </Card>
    )
}

export default PackageCard
