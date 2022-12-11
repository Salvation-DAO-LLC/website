import { Badge, Card, Flex, Group, SimpleGrid, Text, useMantineTheme } from "@mantine/core"
import React from "react"

const jobColors: Record<string, string> = {
    engineer: "blue",
    manager: "cyan",
    designer: "pink",
}

export default function CoreTeam() {
    const theme = useMantineTheme()

    const data = [
        {
            // name: "@Jamie.io",
            job: "Graphic Designer",
            rate: "30/hr",
            team: "design",
            amount: 1,
            description:
                "The graphic designer creates the visual elements of the project, including characters, environments, and user interfaces. They use specialized software to design and create 2D and 3D graphics and work with the game development team. They must have a strong understanding of composition, color theory, and character design.",
        },
        {
            // name: "@Lolivise",
            job: "Core Programmer",
            rate: "30/hr",
            team: "development",
            amount: 3,
            description:
                "The core programmer is responsible for creating and implementing the underlying systems and mechanics of the project. This includes developing the physics engine, AI, and gameplay mechanics. Their role is critical to the success of the project, as they help to bring it to life and create a fun experience for players.",
        },
        {
            // name: "@Lolivise",
            job: "System Operations Engineer",
            rate: "30/hr",
            team: "operations",
            amount: 1,
            description:
                "The System Operations Engineer is responsible for maintaining the technical infrastructure, including monitoring and maintaining servers and network systems, and working closely with the development team to troubleshoot and improve performance. This individual must have a strong understanding of network architecture, server management, and game development pipelines. They must also have excellent problem-solving and communication skills.",
        },
        {
            // name: "@jayli3n",
            job: "Frontend Programmer",
            rate: "30/hr",
            team: "development",
            amount: 1,
            description:
                "The frontend developer creates and maintains the user interface of the project, working closely with designers and artists to create a seamless experience for players. They troubleshoot and fix technical issues, and continually update and improve the UI.",
        },
        {
            // name: "@PandaBebz",
            job: "3D Artist",
            rate: "30/hr",
            team: "design",
            amount: 1,
            description:
                "The 3D artist creates 3D models, environments, and characters for the project. They work closely with the designers and developers to create engaging visuals and must have strong technical and teamwork skills.",
        },
        {
            // name: "@TKMAYOR",
            job: "3D Generalist",
            rate: "30/hr",
            team: "design",
            amount: 1,
            description:
                "The 3D generalist creates 3D assets and environments for the project. They have strong art and design skills and proficiency in various 3D modeling and animation software. They work with game designers to bring the project's vision to life.",
        },
        {
            // name: "@KezLegs",
            job: "Content and Grants Manager",
            rate: "30/hr",
            team: "communications",
            amount: 1,
            description:
                "The Grant and Content Manager is responsible for overseeing grant programs and developing high-quality content for the DAO and its games. This includes researching and applying for grants, managing the grant budget, marketing and public relations efforts.",
        },
    ]

    const teams: { [key: string]: string } = {
        development: "indigo",
        design: "violet",
        communications: "cyan",
        operations: "pink",
    }

    const jobs = data.map((item) => (
        <Card withBorder key={`${item.job}`} shadow="md" radius="md" sx={{ display: "flex" }}>
            <Flex direction={"column"} sx={{ flex: 1 }}>
                <Group position="apart">
                    <Text weight={800}>{item.job}</Text>
                    <Badge color={teams[item.team] || "blue"}>{item.team}</Badge>
                </Group>

                <Text size="sm" color="dimmed" mt={5} sx={{ flex: 1 }}>
                    {item.description}
                </Text>

                <Group position="apart" mt="md">
                    <Badge color={"red"}>${item.rate}</Badge>
                </Group>
            </Flex>
        </Card>
    ))

    return (
        <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ cols: 2 }]}>
            {jobs}
        </SimpleGrid>
    )
}
