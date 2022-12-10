import { Timeline, Text } from "@mantine/core"
import { IconGitBranch, IconGitPullRequest, IconGitCommit, IconMessageDots } from "@tabler/icons"

const FundingTimeline = () => {
    return (
        <Timeline active={1} bulletSize={24} lineWidth={2} sx={{ maxWidth: "300px" }} p={20} m={"md"}>
            <Timeline.Item bullet={<IconGitBranch size={12} />} title="Project Salvation Launched">
                <Text color="dimmed" size="sm">
                    First Round: Save Supremacy
                </Text>
                <Text size="xs" mt={4}>
                    Started: 1st December, 2022
                </Text>
                <Text size="xs" mt={4}>
                    Ends: 8th December, 2022
                </Text>
            </Timeline.Item>
        </Timeline>
    )
}

export default FundingTimeline
