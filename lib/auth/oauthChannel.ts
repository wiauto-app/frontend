export const OAUTH_CHANNEL_NAME = "wiauto_oauth_channel";

export type OAuthChannelMessage = { type: string; message?: string };

export const subscribeOAuthChannel = (
  callback: (message: OAuthChannelMessage) => void,
): (() => void) => {
  if (typeof BroadcastChannel === "undefined") {
    return () => {};
  }

  const channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);

  const handleMessage = (event: MessageEvent<OAuthChannelMessage>) => {
    if (event.data?.type) {
      callback(event.data);
    }
  };

  channel.addEventListener("message", handleMessage);

  return () => {
    channel.removeEventListener("message", handleMessage);
    channel.close();
  };
};

export const publishOAuthChannel = (payload: OAuthChannelMessage): void => {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }

  const channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);
  channel.postMessage(payload);
  channel.close();
};
