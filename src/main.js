import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	// #ifdef MP-WEIXIN
	if (!wx.cloud) {
		console.error('请使用 2.2.3 或以上的基础库以使用云能力')
	} else {
		wx.cloud.init({ env: 'cloud1-d3gn8k0ska7c121f5', traceUser: true })
	}
	// #endif
	const app = createSSRApp(App);
	return {
		app,
	};
}
