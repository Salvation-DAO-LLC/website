import { Box } from "@mantine/core"
import * as React from "react"
import Image from "next/image"

const AppHeader = () => {
    return (
        <>
            <Box sx={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image alt={"$SUPS"} src={"/suplogo.svg"} style={{ maxWidth: "200px" }} />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    img: { maxWidth: "100%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Image src={"/header_text.png"} style={{ maxWidth: "90vw", maxHeight: "300px", padding: "20px" }} alt={"Project Salvation"} />
            </Box>
        </>
    )
}

export default AppHeader
