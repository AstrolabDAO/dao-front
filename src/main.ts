import { createApp } from 'vue'

// pcss/js styles
import './index.css'
// components
import App from './App.vue'
import Svg from './components/Svg.vue'
import Lottie from './components/Lottie.vue'
import Notched from './components/Notched.vue'
import Button from './components/Button.vue'
// directives
import RenderDirective from './directives/render';
// services
import { app, clients } from './store'
import { HttpClient } from './services/http-client'
import { RpcClient } from './services/rpc-client'
import { ApiClient } from './services/api-client'

app.instance = createApp(App)
  .component('Lottie', Lottie)
  .component('Svg', Svg)
  .component('Button', Button)
  .component('Notched', Notched)
  .use(RenderDirective);

app.instance.mount('#app');
app.element = app.instance._container as HTMLElement;
app.rect = app.element.getBoundingClientRect();

clients.http = HttpClient;
clients.rpc = RpcClient;
clients.api = ApiClient;
