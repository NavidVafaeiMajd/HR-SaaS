import NProgress from "nprogress";

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 150,
    minimum: 0.1,
});

export default NProgress;