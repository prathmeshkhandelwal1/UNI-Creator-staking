import React from "react";
import ConnectWallet from "./connectWallet";
import { Box, Stack, Stat } from "degen";

const NavBar = () => {
  return (
    <div>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Box
          fontSize="headingOne"
          fontFamily="sans"
          textTransform="uppercase"
          color="foreground"
          fontWeight="bold"
        >
          Staking Uniswap
        </Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ConnectWallet />
          <Box marginLeft="10">
            <Stat
              label="Current time"
              meta={Intl.DateTimeFormat().resolvedOptions().timeZone}
              size="medium"
              value={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </Box>
        </div>
      </Stack>
      <p>Use rinkeby network</p>
    </div>
  );
};

export default NavBar;
