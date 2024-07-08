export const generateDeviceId = () => {
  const navigator_info: Navigator = window.navigator;
  const screen_info: Screen = window.screen;
  let uid: string = String(navigator_info.mimeTypes.length);
  uid += navigator_info.userAgent.replace(/\D+/g, '');
  uid += String(navigator_info.plugins.length);
  uid += String(screen_info.height || '');
  uid += String(screen_info.width || '');
  uid += String(screen_info.pixelDepth || '');
  return uid;
};
