import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, ScrollArea, useMantineTheme } from "@mantine/core"
import { IconPencil, IconTrash } from "@tabler/icons"

const jobColors: Record<string, string> = {
    engineer: "blue",
    manager: "cyan",
    designer: "pink",
}

export function CoreTeam() {
    const theme = useMantineTheme()

    const data = [
        {
            // name: "@AlexDunmow",
            job: "Creative Director and Developer",
            rate: "28.85/hr",
            description:
                "The creative director is responsible for overseeing the vision and direction of Supremacy and related projects, working closely with design and art teams, and representing the DAO to the media and gaming community.",
        },
        {
            // name: "@nii236",
            job: "Technical Director and Developer",
            rate: "28.85/hr",
            description:
                "The Technical Director oversees the technical aspects of game development, ensuring the technical feasibility and efficiency of game features and systems. They provide technical guidance and support to the development team, collaborating with the lead programmer, Art Director, and Production Manager.",
        },
        {
            // name: "@Jamie.io",
            job: "Graphic Design",
            rate: "28.85/hr",
            description:
                "The graphic designer creates the visual elements of a video game, including characters, environments, and user interfaces. They use specialized software to design and create 2D and 3D graphics and work with the game development team. They must have a strong understanding of composition, color theory, and character design.",
        },
        {
            // name: "@Torrunt",
            job: "Game Development",
            rate: "28.85/hr",
            description:
                "The video game engineer designs and implements the technical aspects of a game, including mechanics, algorithms, and integration of visual and audio elements. They also debug and troubleshoot technical issues. Strong programming skills and game design knowledge are required.",
        },
        {
            // name: "@Lolivise",
            job: "Systems Engineer",
            rate: "28.85/hr",
            description:
                "System engineers are responsible for designing, implementing, and maintaining the studio's technical infrastructure, including the network, servers, and development tools. You will troubleshoot and resolve technical issues, and work closely with development teams to support their needs. Strong technical skills and problem-solving abilities are required.",
        },
        {
            // name: "@jayli3n",
            job: "Frontend Developer",
            rate: "28.85/hr",
            description:
                "The frontend developer creates and maintains the user interface of a game, working closely with designers and artists to create a seamless experience for players. They troubleshoot and fix technical issues, and continually update and improve the game's UI.",
        },
        {
            // name: "@PandaBebz",
            job: "3D Artist",
            rate: "28.85/hr",
            description:
                "The 3D artist creates 3D models, environments, and characters for video games using specialized software. They work closely with game designers and developers to create engaging visuals and must have strong technical and teamwork skills.",
        },
        {
            // name: "@TKMAYOR",
            job: "3D Generalist",
            rate: "28.85/hr",
            description:
                "The 3D generalist creates 3D assets and environments for video games. They have strong art and design skills and proficiency in various 3D modeling and animation software. They work with game designers to bring the game's vision to life.",
        },
        {
            // name: "@KezLegs",
            job: "Content and Grants Manager",
            rate: "28.85/hr",
            description:
                "The content manager oversees the development and production of game assets, coordinates with design and development teams, manages content creators, and communicates with vendors and partners.",
        },
    ]

    const rows = data.map((item) => (
        <tr key={item.name}>
            <td>
                <Group spacing="sm">
                    <Avatar size={30} src={item.avatar} radius={30} />
                    <Text size="sm" weight={500}>
                        {item.job}
                    </Text>
                </Group>
            </td>

            <td>
                <Badge color={jobColors[item.job.toLowerCase()]} variant={theme.colorScheme === "dark" ? "light" : "outline"}>
                    {item.job}
                </Badge>
            </td>
            <td>
                <Anchor<"a"> size="sm" href="#" onClick={(event) => event.preventDefault()}>
                    {item.rate}
                </Anchor>
            </td>
            <td>
                <Text size="sm" color="dimmed">
                    {item.phone}
                </Text>
            </td>
            <td>
                <Group spacing={0} position="right">
                    <ActionIcon>
                        <IconPencil size={16} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon color="red">
                        <IconTrash size={16} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </td>
        </tr>
    ))

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Job title</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    )
}
