import Head from "next/head"
import React from "react"
import One from "../public/home/1.png"
import Two from "../public/home/2.png"
import Three from "../public/home/3.png"
import { MouseParallaxChild, MouseParallaxContainer } from "react-parallax-mouse"

export default function Home() {
    return (
        <>
            <Head>
                <title>Salvation DAO</title>
                <meta
                    name="description"
                    content="The Salvation DAO is a decentralized autonomous organization that controls the open source project Supremacy."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MouseParallaxContainer
                globalFactorX={0.1}
                globalFactorY={0.1}
                containerStyle={{ height: "100vh", width: "100vw", overflow: "hidden", position: "absolute", top: 0, left: 0, zIndex: -1 }}
            >
                <MouseParallaxChild factorX={0.3} factorY={0.5} style={{ position: "absolute" }}>
                    <div
                        style={{
                            position: "absolute",
                            transform: "translate(-20%, -20%)",
                            top: 0,
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url(${One.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "-400px top",
                            width: "140vw",
                            height: "140vh",
                        }}
                    />
                </MouseParallaxChild>
                <MouseParallaxChild factorX={0.2} factorY={0.8} style={{ position: "absolute" }}>
                    <div
                        style={{
                            position: "absolute",
                            transform: "translate(-20%, -20%)",
                            top: 0,
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url(${Two.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "left 400px",
                            width: "140vw",
                            height: "140vh",
                        }}
                    />
                </MouseParallaxChild>
                <MouseParallaxChild factorX={0.2} factorY={0.5} style={{ position: "absolute" }}>
                    <div
                        style={{
                            position: "absolute",
                            transform: "translate(-10%, -10%)",
                            top: 0,
                            backgroundColor: "transparent",
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url(${Three.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "-400px 300px",
                            width: "120vw",
                            height: "120vh",
                        }}
                    />
                </MouseParallaxChild>
            </MouseParallaxContainer>
        </>
    )
}
