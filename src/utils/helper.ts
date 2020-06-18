import axios from "axios";
import { decodeSsUrl } from "./url";
import { v4 as uuid } from "uuid";
import { ipcRenderer } from "electron-better-ipc";

const UPDATE_SUBSCRIPTIONS_TIMEOUT_MS = 5000;

export const updateSubscription = async (url: string) => {
  const nodesBase64 = await axios(url, {
    timeout: UPDATE_SUBSCRIPTIONS_TIMEOUT_MS,
  });
  const nodes = Buffer.from(nodesBase64.data, "base64").toString();
  const shadowsockses = decodeSsUrl(nodes);

  return shadowsockses.map((shadowsocks) => ({
    ...shadowsocks,
    regionCode: "Auto",
    id: uuid(),
  }));
};

export const getRegionCodeFromGeoIp = async (host: string) => {
  try {
    return await ipcRenderer.callMain("getRegionCode", host);
  } catch {
    return undefined;
  }
};
