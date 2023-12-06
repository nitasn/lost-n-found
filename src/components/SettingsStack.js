import * as React from "react";
import { Text, View } from "react-native";

import "core-js/stable/atob"; // polly-fill for jwt-decode
import { jwtDecode } from "jwt-decode";

const jwt = "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE3MDE4ODU0NTQsImlhdCI6MTcwMTc5OTA1NCwic3ViIjoiMDAxOTExLmE0MDVkMzdmMGQ3MjQzN2I5MTI2NDk1OGEwOThmOTI1LjE3NDgiLCJjX2hhc2giOiJRUmdxeE9LQXItQWNCbTlDQjMtQjlRIiwiZW1haWwiOiJwenZoc3oyOXFzQHByaXZhdGVyZWxheS5hcHBsZWlkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlzX3ByaXZhdGVfZW1haWwiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNzAxNzk5MDU0LCJub25jZV9zdXBwb3J0ZWQiOnRydWUsInJlYWxfdXNlcl9zdGF0dXMiOjJ9.hbNLaSWf5DZm9l4V4GhI3xkzE21-xDi8vUY-1rmsu5JfD0-xLIyT7urLzKhjdqq2PPI0Y9EW6A-DtPUndj-7c_EgP3xrUhaJQz_X65zlrEDvK_Zzxx9FBLKQ3Qw5piASypthi_syAtRvNTnNYIOClKPy6pDfzf6xoJ_uvMLwzhFT4Rcd_1t-vcfe0Ei3kjBwleRbE4thq-MjDropjXLkAeBGNUFRNB-WD6otStTkuf_NdoA4Q_eXsmstcZ71VhNG6QL1Z0p3OFC5I0vF-Z8PyO8tzczbX8mkm-Kb_ApIdet_6Qh2ddslMY8d8fCJn6glavh142Eyl0KYmzvae3nIow"

export default function SettingsStack() {
  // const { email, fullName }
  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }} >

    <Text>
      {JSON.stringify(jwtDecode(jwt), null, 2)}
    </Text>
  </View>;
}
