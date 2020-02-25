const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default canUseDOM && /iphone|ipad|ipod/i.test(window.navigator.userAgent);