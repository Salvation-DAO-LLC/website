import { ActionIcon, Avatar, Badge, Card, SimpleGrid, Group, Text, useMantineTheme, Title, Flex } from "@mantine/core"
import { IconUpload } from "@tabler/icons"
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
            // name: "@AlexDunmow",
            job: "Creative Director",
            rate: "28.85/hr",
            team: "development",
            description:
                "The creative director is responsible for overseeing the vision and direction of Supremacy and related projects, working closely with design and art teams, and representing the DAO to the media and gaming community.",
        },
        {
            // name: "@nii236",
            job: "Technical Director",
            rate: "28.85/hr",
            team: "development",
            description:
                "The Technical Director oversees the technical aspects of game development, ensuring the technical feasibility and efficiency of game features and systems. They provide technical guidance and support to the development team, collaborating with the lead programmer, Art Director, and Creative Director.",
        },
        {
            // name: "@Jamie.io",
            job: "Art Director",
            rate: "28.85/hr",
            team: "design",
            description:
                "The graphic designer creates the visual elements of a video game, including characters, environments, and user interfaces. They use specialized software to design and create 2D and 3D graphics and work with the game development team. They must have a strong understanding of composition, color theory, and character design.",
        },
        {
            // name: "@Torrunt",
            job: "Lead Programmer",
            rate: "28.85/hr",
            team: "development",
            description:
                "The video game engineer designs and implements the technical aspects of a game, including mechanics, algorithms, and integration of visual and audio elements. They also debug and troubleshoot technical issues. Strong programming skills and game design knowledge are required.",
        },
        {
            // name: "@Lolivise",
            job: "Programmer",
            rate: "28.85/hr",
            team: "development",
            description:
                "System engineers are responsible for designing, implementing, and maintaining the studio's technical infrastructure, including the network, servers, and development tools. You will troubleshoot and resolve technical issues, and work closely with development teams to support their needs. Strong technical skills and problem-solving abilities are required.",
        },
        {
            // name: "@Lolivise",
            job: "System Operations Engineer",
            rate: "28.85/hr",
            team: "operations",
            description:
                "The System Operations Engineer is responsible for maintaining the technical infrastructure, including monitoring and maintaining servers and network systems, and working closely with the development team to troubleshoot and improve performance. This individual must have a strong understanding of network architecture, server management, and game development pipelines. They must also have excellent problem-solving and communication skills.",
        },
        {
            // name: "@jayli3n",
            job: "Frontend Programmer",
            rate: "28.85/hr",
            team: "development",
            description:
                "The frontend developer creates and maintains the user interface of a game, working closely with designers and artists to create a seamless experience for players. They troubleshoot and fix technical issues, and continually update and improve the game's UI.",
        },
        {
            // name: "@PandaBebz",
            job: "3D Artist",
            rate: "28.85/hr",
            team: "design",
            description:
                "The 3D artist creates 3D models, environments, and characters for video games using specialized software. They work closely with game designers and developers to create engaging visuals and must have strong technical and teamwork skills.",
        },
        {
            // name: "@TKMAYOR",
            job: "3D Generalist",
            rate: "28.85/hr",
            team: "design",
            description:
                "The 3D generalist creates 3D assets and environments for video games. They have strong art and design skills and proficiency in various 3D modeling and animation software. They work with game designers to bring the game's vision to life.",
        },
        {
            // name: "@KezLegs",
            job: "Content and Grants Manager",
            rate: "28.85/hr",
            team: "communications",
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
        <Card withBorder key={item.job} shadow="md" radius="md" sx={{ display: "flex" }}>
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
