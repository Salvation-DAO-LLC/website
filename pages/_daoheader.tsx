import Head from "next/head"
import { Burger, Container, createStyles, Group, Header, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useState } from "react"
import Link from "next/link"

const HEADER_HEIGHT = 60
const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
    },

    links: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("xs")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },
}))

interface HeaderActionProps {
    links: { link: string; label: string; links: { link: string; label: string }[] }[]
}

export default function DAOHeader() {
    const [opened, { toggle }] = useDisclosure(false)
    const [active, setActive] = useState("")
    const { classes, cx } = useStyles()

    return (
        <>
            <Header height={60} mb={120}>
                <Container className={classes.header}>
                    <Title>Salvation DAO</Title>
                    <Group spacing={5} className={classes.links}>
                        <Link
                            key={"supremacy"}
                            href={"/supremacy"}
                            className={cx(classes.link, { [classes.linkActive]: active === "supremacy" })}
                            onClick={(event) => {
                                event.preventDefault()
                                setActive("supremacy")
                            }}
                        >
                            Supremacy
                        </Link>
                        <Link
                            key={"launch"}
                            href={"/launch"}
                            className={cx(classes.link, { [classes.linkActive]: active === "launch" })}
                            onClick={(event) => {
                                setActive("launch")
                            }}
                        >
                            Launch
                        </Link>
                    </Group>

                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
                </Container>
            </Header>
        </>
    )
}
