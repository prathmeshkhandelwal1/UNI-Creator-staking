import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ConnectWallet from "../components/connectWallet";
import styles from "../styles/Home.module.css";
import NavBar from "../components/Navbar";
import Form from "../components/form";

const Home: NextPage = () => {
  return (
    <div>
      <div style={{ width: "80%", margin: "0 auto" }}>
        <NavBar />
        <Form />
      </div>
    </div>
  );
};

export default Home;

// creator token: 0x45ad7FD6Fd6D56Cf815B97E5dB09879d7e4Dd656
// uni token: 0x25F4671F0b4C11a870fDcfB69600A01056077CBF
// staking contract: 0x66B9E60699869E403b27A7a1DD942Fe582730F36
